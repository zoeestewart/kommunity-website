<?php
declare(strict_types=1);

// Emails contact form enquiries straight to the venue, so visitors don't need
// an email app. Keep ENQUIRY_TO aligned with emails.bookings in src/siteConfig.js.
const ENQUIRY_TO = 'manager@kommunity.com.au';
// Must be an address on the site's own domain, or mail providers will treat the
// message as spoofed. Replies go to the visitor via Reply-To.
const ENQUIRY_FROM = 'website@kommunity.com.au';
const ENQUIRY_TYPES = ['VIP table', 'Private function', 'Call back', 'General enquiry', 'Other'];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

final class HttpException extends RuntimeException
{
    public function __construct(public readonly int $status, string $message)
    {
        parent::__construct($message);
    }
}

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function enforceRateLimit(string $action, int $limit, int $windowSeconds): void
{
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $filePath = sys_get_temp_dir() . '/kommunity-enquiry-' . hash('sha256', $action . ':' . $ipAddress);
    $file = fopen($filePath, 'c+');
    if ($file === false || !flock($file, LOCK_EX)) {
        if (is_resource($file)) {
            fclose($file);
        }
        throw new HttpException(503, 'Enquiries are temporarily unavailable. Please try again.');
    }

    try {
        rewind($file);
        $storedRequests = json_decode(stream_get_contents($file), true);
        $cutoff = time() - $windowSeconds;
        $recentRequests = is_array($storedRequests)
            ? array_values(array_filter($storedRequests, static fn ($timestamp) => is_int($timestamp) && $timestamp > $cutoff))
            : [];
        if (count($recentRequests) >= $limit) {
            throw new HttpException(429, 'Too many enquiries. Please wait a while and try again.');
        }
        $recentRequests[] = time();
        rewind($file);
        ftruncate($file, 0);
        fwrite($file, json_encode($recentRequests));
        fflush($file);
    } finally {
        flock($file, LOCK_UN);
        fclose($file);
    }
}

// Strips control characters so values can't inject extra mail headers.
function singleLine(mixed $value): string
{
    return is_string($value) ? trim(preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? '') : '';
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        header('Allow: POST');
        throw new HttpException(405, 'This request method is not supported.');
    }

    $body = file_get_contents('php://input');
    $request = is_string($body) && strlen($body) <= 20000 ? json_decode($body, true) : null;
    if (!is_array($request)) {
        throw new HttpException(400, 'Enter your enquiry details and try again.');
    }

    // Hidden field that only bots fill in. Pretend it worked so they move on.
    if (!empty($request['website'])) {
        respond(200, ['sent' => true]);
    }

    enforceRateLimit('enquiry', 5, 3600);

    $name = singleLine($request['name'] ?? '');
    $email = singleLine($request['email'] ?? '');
    $enquiryType = singleLine($request['enquiryType'] ?? '');
    $message = is_string($request['message'] ?? null)
        ? trim(str_replace("\0", '', $request['message']))
        : '';

    if ($name === '' || mb_strlen($name) > 200) {
        throw new HttpException(400, 'Enter your name.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
        throw new HttpException(400, 'Enter a valid email address.');
    }
    if (!in_array($enquiryType, ENQUIRY_TYPES, true)) {
        throw new HttpException(400, 'Choose an enquiry type.');
    }
    if ($message === '' || mb_strlen($message) > 5000) {
        throw new HttpException(400, 'Tell us what you need (up to 5000 characters).');
    }

    $subject = mb_encode_mimeheader("Kommunity {$enquiryType} enquiry from {$name}", 'UTF-8');
    $mailBody = implode("\r\n", [
        "Name: {$name}",
        "Email: {$email}",
        "Enquiry: {$enquiryType}",
        '',
        str_replace(["\r\n", "\r"], "\n", $message),
        '',
        '--',
        'Sent from the contact form at kommunity.com.au. Reply to this email to respond.',
    ]);
    $headers = implode("\r\n", [
        'From: ' . mb_encode_mimeheader('Kommunity Website', 'UTF-8') . ' <' . ENQUIRY_FROM . '>',
        'Reply-To: ' . mb_encode_mimeheader($name, 'UTF-8') . " <{$email}>",
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ]);

    if (!mail(ENQUIRY_TO, $subject, $mailBody, $headers, '-f' . ENQUIRY_FROM)) {
        error_log('Kommunity enquiry email could not be handed to the mail server.');
        throw new HttpException(502, 'Your enquiry could not be sent. Please email ' . ENQUIRY_TO . ' instead.');
    }

    respond(200, ['sent' => true]);
} catch (HttpException $error) {
    respond($error->status, ['error' => $error->getMessage()]);
} catch (Throwable $error) {
    error_log('Kommunity enquiry failed: ' . $error->getMessage());
    respond(500, ['error' => 'Your enquiry could not be sent. Please email ' . ENQUIRY_TO . ' instead.']);
}
