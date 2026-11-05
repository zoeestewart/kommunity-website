<?php
declare(strict_types=1);

const BOOKING_TIMEZONE = 'Australia/Brisbane';
const BOOKING_START_HOUR = 21;
const BOOKING_DURATION_HOURS = 3;
const BOOKING_CAPACITY = 2;
const MAX_BOOKING_DAYS_AHEAD = 90;

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

function configuration(): array
{
    $calendarId = getenv('GOOGLE_CALENDAR_ID');
    $serviceAccountJson = getenv('GOOGLE_SERVICE_ACCOUNT_JSON');
    $configPath = dirname(__DIR__, 2) . '/kommunity-calendar-config.php';

    if (is_file($configPath)) {
        $localConfig = require $configPath;
        if (!is_array($localConfig)) {
            throw new RuntimeException('The calendar configuration must return an array.');
        }
        $calendarId = $localConfig['calendarId'] ?? $calendarId;
        if (!empty($localConfig['serviceAccountFile'])) {
            $serviceAccountJson = file_get_contents($localConfig['serviceAccountFile']);
            if ($serviceAccountJson === false) {
                throw new RuntimeException('The Google service account file could not be read.');
            }
        } else {
            $serviceAccountJson = $localConfig['serviceAccountJson'] ?? $serviceAccountJson;
        }
    }

    if (!is_string($calendarId) || trim($calendarId) === '' ||
        !is_string($serviceAccountJson) || trim($serviceAccountJson) === '') {
        throw new HttpException(503, 'Online bookings are not configured yet. Please use the Google booking page.');
    }

    $account = json_decode($serviceAccountJson, true);
    if (!is_array($account) || empty($account['client_email']) || empty($account['private_key'])) {
        throw new RuntimeException('The Google service account configuration is invalid.');
    }

    return [
        'calendarId' => $calendarId,
        'clientEmail' => $account['client_email'],
        'privateKey' => $account['private_key'],
    ];
}

function base64UrlEncode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function getAccessToken(array $config): string
{
    $now = time();
    $claims = [
        'iss' => $config['clientEmail'],
        'scope' => 'https://www.googleapis.com/auth/calendar.events',
        'aud' => 'https://oauth2.googleapis.com/token',
        'iat' => $now,
        'exp' => $now + 3600,
    ];
    $unsignedToken = base64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']))
        . '.' . base64UrlEncode(json_encode($claims));
    if (!openssl_sign($unsignedToken, $signature, $config['privateKey'], OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('Could not sign the Google service account token.');
    }

    $curl = curl_init('https://oauth2.googleapis.com/token');
    if ($curl === false) {
        throw new HttpException(502, 'The calendar service is temporarily unavailable. Please try again.');
    }
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $unsignedToken . '.' . base64UrlEncode($signature),
        ]),
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    $responseBody = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $curlError = curl_error($curl);
    curl_close($curl);

    if ($responseBody === false || $status < 200 || $status >= 300) {
        error_log('Google OAuth token request failed: ' . $curlError . ' HTTP ' . $status);
        throw new HttpException(502, 'The calendar service is temporarily unavailable. Please try again.');
    }

    $response = json_decode($responseBody, true);
    if (!is_array($response) || empty($response['access_token'])) {
        throw new RuntimeException('Google did not return an access token.');
    }
    return $response['access_token'];
}

function googleCalendarRequest(string $accessToken, string $url, ?array $payload = null): array
{
    $headers = ['Authorization: Bearer ' . $accessToken];
    if ($payload !== null) {
        $headers[] = 'Content-Type: application/json';
    }

    $curl = curl_init($url);
    if ($curl === false) {
        throw new HttpException(502, 'The calendar service is temporarily unavailable. Please try again.');
    }
    curl_setopt_array($curl, [
        CURLOPT_CUSTOMREQUEST => $payload === null ? 'GET' : 'POST',
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    if ($payload !== null) {
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($payload));
    }

    $responseBody = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $curlError = curl_error($curl);
    curl_close($curl);

    if ($responseBody === false) {
        error_log('Google Calendar request failed: ' . $curlError);
        throw new HttpException(502, 'The calendar service is temporarily unavailable. Please try again.');
    }

    $response = json_decode($responseBody, true);
    if ($status < 200 || $status >= 300) {
        $googleMessage = is_array($response) ? ($response['error']['message'] ?? 'Unknown error') : 'Unknown error';
        error_log('Google Calendar returned HTTP ' . $status . ': ' . $googleMessage);
        throw new HttpException(502, 'The calendar service is temporarily unavailable. Please try again.');
    }
    return is_array($response) ? $response : [];
}

function bookingInterval(string $date): array
{
    $timezone = new DateTimeZone(BOOKING_TIMEZONE);
    $bookingDate = parseBookingDate($date);

    $today = new DateTimeImmutable('today', $timezone);
    if ($bookingDate < $today || $bookingDate > $today->modify('+' . MAX_BOOKING_DAYS_AHEAD . ' days')) {
        throw new HttpException(400, 'Bookings are available up to 90 days ahead.');
    }
    if (!in_array((int) $bookingDate->format('N'), [5, 6], true)) {
        throw new HttpException(400, 'VIP table bookings are available on Fridays and Saturdays.');
    }

    $start = $bookingDate->setTime(BOOKING_START_HOUR, 0);
    if ($start <= new DateTimeImmutable('now', $timezone)) {
        throw new HttpException(400, 'This booking time has already passed.');
    }
    return [$start, $start->modify('+' . BOOKING_DURATION_HOURS . ' hours')];
}

function parseBookingDate(string $date): DateTimeImmutable
{
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        throw new HttpException(400, 'Choose a valid booking date.');
    }

    $bookingDate = DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone(BOOKING_TIMEZONE));
    $dateErrors = DateTimeImmutable::getLastErrors();
    if ($bookingDate === false ||
        ($dateErrors !== false && ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0)) ||
        $bookingDate->format('Y-m-d') !== $date) {
        throw new HttpException(400, 'Choose a valid booking date.');
    }
    return $bookingDate;
}

function eventDateTime(array $eventTime): ?DateTimeImmutable
{
    $value = $eventTime['dateTime'] ?? $eventTime['date'] ?? null;
    return is_string($value)
        ? new DateTimeImmutable($value, new DateTimeZone(BOOKING_TIMEZONE))
        : null;
}

function calendarEvents(string $accessToken, string $calendarId, DateTimeImmutable $start, DateTimeImmutable $end): array
{
    $baseUrl = 'https://www.googleapis.com/calendar/v3/calendars/'
        . rawurlencode($calendarId) . '/events';
    $query = [
        'timeMin' => $start->format(DateTimeInterface::RFC3339),
        'timeMax' => $end->format(DateTimeInterface::RFC3339),
        'singleEvents' => 'true',
        'showDeleted' => 'false',
        'maxResults' => 2500,
    ];
    $events = [];
    $pageToken = null;
    do {
        if ($pageToken !== null) {
            $query['pageToken'] = $pageToken;
        }
        $result = googleCalendarRequest($accessToken, $baseUrl . '?' . http_build_query($query));
        $events = array_merge($events, $result['items'] ?? []);
        $pageToken = $result['nextPageToken'] ?? null;
    } while (is_string($pageToken) && $pageToken !== '');

    return $events;
}

function overlappingEvents(string $accessToken, string $calendarId, DateTimeImmutable $start, DateTimeImmutable $end): int
{
    $overlapCount = 0;
    foreach (calendarEvents($accessToken, $calendarId, $start, $end) as $event) {
        if (($event['status'] ?? '') === 'cancelled') {
            continue;
        }
        $eventStart = eventDateTime($event['start'] ?? []);
        $eventEnd = eventDateTime($event['end'] ?? []);
        if ($eventStart !== null && $eventEnd !== null && $eventStart < $end && $eventEnd > $start) {
            $overlapCount++;
        }
    }
    return $overlapCount;
}

function availabilityGrid(array $config, string $from, string $to): array
{
    $fromDate = parseBookingDate($from);
    $toDate = parseBookingDate($to);
    $timezone = new DateTimeZone(BOOKING_TIMEZONE);
    $today = new DateTimeImmutable('today', $timezone);
    $maxDate = $today->modify('+' . MAX_BOOKING_DAYS_AHEAD . ' days');
    if ($fromDate < $today || $toDate < $fromDate || $toDate > $maxDate) {
        throw new HttpException(400, 'Choose dates within the next 90 days.');
    }

    $accessToken = getAccessToken($config);
    $events = calendarEvents(
        $accessToken,
        $config['calendarId'],
        $fromDate,
        $toDate->modify('+1 day'),
    );
    $now = new DateTimeImmutable('now', $timezone);
    $slots = [];

    for ($date = $fromDate; $date <= $toDate; $date = $date->modify('+1 day')) {
        if (!in_array((int) $date->format('N'), [5, 6], true)) {
            continue;
        }
        $start = $date->setTime(BOOKING_START_HOUR, 0);
        $end = $start->modify('+' . BOOKING_DURATION_HOURS . ' hours');
        $overlapCount = 0;
        foreach ($events as $event) {
            if (($event['status'] ?? '') === 'cancelled') {
                continue;
            }
            $eventStart = eventDateTime($event['start'] ?? []);
            $eventEnd = eventDateTime($event['end'] ?? []);
            if ($eventStart !== null && $eventEnd !== null && $eventStart < $end && $eventEnd > $start) {
                $overlapCount++;
            }
        }
        $remaining = $start <= $now ? 0 : max(0, BOOKING_CAPACITY - $overlapCount);
        $slots[$date->format('Y-m-d')] = [
            'available' => $remaining > 0,
            'slotsRemaining' => $remaining,
        ];
    }

    return $slots;
}

function enforceRateLimit(string $action, int $limit, int $windowSeconds): void
{
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $filePath = sys_get_temp_dir() . '/kommunity-calendar-' . hash('sha256', $action . ':' . $ipAddress);
    $file = fopen($filePath, 'c+');
    if ($file === false || !flock($file, LOCK_EX)) {
        if (is_resource($file)) {
            fclose($file);
        }
        throw new HttpException(503, 'Bookings are temporarily unavailable. Please try again.');
    }

    try {
        rewind($file);
        $storedRequests = json_decode(stream_get_contents($file), true);
        $cutoff = time() - $windowSeconds;
        $recentRequests = is_array($storedRequests)
            ? array_values(array_filter($storedRequests, static fn ($timestamp) => is_int($timestamp) && $timestamp > $cutoff))
            : [];
        if (count($recentRequests) >= $limit) {
            throw new HttpException(429, 'Too many requests. Please wait a moment and try again.');
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

function slotsRemaining(string $accessToken, array $config, DateTimeImmutable $start, DateTimeImmutable $end): int
{
    return max(0, BOOKING_CAPACITY - overlappingEvents($accessToken, $config['calendarId'], $start, $end));
}

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method !== 'GET' && $method !== 'POST') {
        header('Allow: GET, POST');
        throw new HttpException(405, 'This request method is not supported.');
    }

    if ($method === 'GET') {
        enforceRateLimit('availability', 60, 60);
        $from = $_GET['from'] ?? '';
        $to = $_GET['to'] ?? '';
        if (!is_string($from) || !is_string($to)) {
            throw new HttpException(400, 'Choose a valid date range.');
        }
        $config = configuration();
        respond(200, [
            'slots' => availabilityGrid($config, $from, $to),
        ]);
    }

    enforceRateLimit('booking', 5, 3600);
    $body = file_get_contents('php://input');
    $request = is_string($body) && strlen($body) <= 10000 ? json_decode($body, true) : null;
    if (!is_array($request)) {
        throw new HttpException(400, 'Enter your booking details and try again.');
    }
    if (!empty($request['website'])) {
        throw new HttpException(400, 'The booking details could not be accepted.');
    }

    $rawName = is_string($request['name'] ?? null) ? $request['name'] : '';
    $name = trim(preg_replace('/[\x00-\x1F\x7F]/u', '', $rawName) ?? '');
    $email = trim(is_string($request['email'] ?? null) ? $request['email'] : '');
    $guests = filter_var($request['guests'] ?? null, FILTER_VALIDATE_INT);
    $date = $request['date'] ?? '';
    $time = $request['time'] ?? '';
    if ($name === '' || strlen($name) > 400 ||
        !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 ||
        $guests === false || $guests < 1 || $guests > 999 ||
        !is_string($date) || $time !== '21:00') {
        throw new HttpException(400, 'Enter a name, valid email, guest count, and available booking time.');
    }

    [$start, $end] = bookingInterval($date);
    $config = configuration();
    $lockPath = sys_get_temp_dir() . '/kommunity-calendar-booking.lock';
    $lock = fopen($lockPath, 'c');
    if ($lock === false || !flock($lock, LOCK_EX)) {
        if (is_resource($lock)) {
            fclose($lock);
        }
        throw new HttpException(503, 'Bookings are temporarily unavailable. Please try again.');
    }

    try {
        $accessToken = getAccessToken($config);
        $remaining = slotsRemaining($accessToken, $config, $start, $end);
        if ($remaining < 1) {
            throw new HttpException(409, 'This night is no longer available. Please choose another date.');
        }

        $calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/'
            . rawurlencode($config['calendarId']) . '/events';
        googleCalendarRequest($accessToken, $calendarUrl, [
            'summary' => 'VIP table booking - ' . $name,
            'description' => 'Name: ' . $name . "\nEmail: " . $email . "\nGuests: " . $guests,
            'start' => [
                'dateTime' => $start->format(DateTimeInterface::RFC3339),
                'timeZone' => BOOKING_TIMEZONE,
            ],
            'end' => [
                'dateTime' => $end->format(DateTimeInterface::RFC3339),
                'timeZone' => BOOKING_TIMEZONE,
            ],
        ]);
        $remaining--;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }

    respond(201, [
        'message' => 'Your VIP table is booked. Your contact details are saved with the venue calendar entry.',
        'slotsRemaining' => $remaining,
    ]);
} catch (HttpException $error) {
    respond($error->status, ['message' => $error->getMessage()]);
} catch (Throwable $error) {
    error_log('Kommunity calendar booking error: ' . $error->getMessage());
    respond(500, ['message' => 'We could not complete the booking. Please try again or email us.']);
}
