<?php
declare(strict_types=1);

const INSTAGRAM_FEED_LIMIT = 6;
const INSTAGRAM_CACHE_SECONDS = 900;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300, stale-while-revalidate=600');
header('X-Content-Type-Options: nosniff');

final class InstagramFeedException extends RuntimeException
{
    public function __construct(public readonly int $status, string $message)
    {
        parent::__construct($message);
    }
}

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function instagramConfiguration(): array
{
    $accessToken = getenv('META_INSTAGRAM_ACCESS_TOKEN');
    $instagramUserId = getenv('META_INSTAGRAM_USER_ID');
    $graphApiVersion = getenv('META_GRAPH_API_VERSION');
    $configPath = dirname(__DIR__, 2) . '/kommunity-instagram-config.php';

    if (is_file($configPath)) {
        $localConfig = require $configPath;
        if (!is_array($localConfig)) {
            throw new RuntimeException('The Instagram configuration must return an array.');
        }
        $accessToken = $localConfig['accessToken'] ?? $accessToken;
        $instagramUserId = $localConfig['instagramUserId'] ?? $instagramUserId;
        $graphApiVersion = $localConfig['graphApiVersion'] ?? $graphApiVersion;
    }

    if (!is_string($accessToken) || trim($accessToken) === '' ||
        !is_string($instagramUserId) || !preg_match('/^\d+$/', $instagramUserId) ||
        !is_string($graphApiVersion) || !preg_match('/^v\d+\.\d+$/', $graphApiVersion)) {
        throw new InstagramFeedException(503, 'Instagram posts are not configured yet.');
    }

    return [
        'accessToken' => trim($accessToken),
        'instagramUserId' => $instagramUserId,
        'graphApiVersion' => $graphApiVersion,
    ];
}

function cachedInstagramPosts(string $instagramUserId): ?array
{
    $cachePath = sys_get_temp_dir() . '/kommunity-instagram-' . hash('sha256', $instagramUserId) . '.json';
    if (!is_file($cachePath)) {
        return null;
    }

    $cached = json_decode((string) file_get_contents($cachePath), true);
    if (!is_array($cached) || !is_int($cached['expiresAt'] ?? null) ||
        $cached['expiresAt'] <= time() || !is_array($cached['posts'] ?? null)) {
        return null;
    }

    return $cached['posts'];
}

function storeInstagramPosts(string $instagramUserId, array $posts): void
{
    $cachePath = sys_get_temp_dir() . '/kommunity-instagram-' . hash('sha256', $instagramUserId) . '.json';
    $cache = json_encode([
        'expiresAt' => time() + INSTAGRAM_CACHE_SECONDS,
        'posts' => $posts,
    ], JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    if ($cache === false || file_put_contents($cachePath, $cache, LOCK_EX) === false) {
        error_log('Instagram feed cache could not be written.');
    }
}

function fetchInstagramPosts(array $config): array
{
    $cachedPosts = cachedInstagramPosts($config['instagramUserId']);
    if ($cachedPosts !== null) {
        return $cachedPosts;
    }

    $url = 'https://graph.facebook.com/' . $config['graphApiVersion'] . '/'
        . rawurlencode($config['instagramUserId']) . '/media?'
        . http_build_query([
            'fields' => 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
            'limit' => INSTAGRAM_FEED_LIMIT,
        ]);
    $curl = curl_init($url);
    if ($curl === false) {
        throw new InstagramFeedException(502, 'Instagram posts are temporarily unavailable.');
    }
    curl_setopt_array($curl, [
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $config['accessToken']],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
    ]);
    $responseBody = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $curlError = curl_error($curl);
    curl_close($curl);

    if ($responseBody === false || $status < 200 || $status >= 300) {
        error_log('Instagram Graph API request failed: HTTP ' . $status . ' ' . $curlError);
        throw new InstagramFeedException(502, 'Instagram posts are temporarily unavailable.');
    }

    $response = json_decode($responseBody, true);
    if (!is_array($response) || !is_array($response['data'] ?? null)) {
        throw new RuntimeException('Instagram returned an invalid feed response.');
    }

    $posts = array_values(array_filter($response['data'], static function ($post): bool {
        return is_array($post) && isset($post['id'], $post['permalink']) &&
            is_string($post['id']) && is_string($post['permalink']);
    }));
    storeInstagramPosts($config['instagramUserId'], $posts);

    return $posts;
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
        header('Allow: GET');
        throw new InstagramFeedException(405, 'This request method is not supported.');
    }

    respond(200, ['posts' => fetchInstagramPosts(instagramConfiguration())]);
} catch (InstagramFeedException $error) {
    respond($error->status, ['message' => $error->getMessage()]);
} catch (Throwable $error) {
    error_log('Kommunity Instagram feed error: ' . $error->getMessage());
    respond(500, ['message' => 'Instagram posts are temporarily unavailable.']);
}
