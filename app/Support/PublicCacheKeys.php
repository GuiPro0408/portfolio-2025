<?php

namespace App\Support;

class PublicCacheKeys
{
    // Legacy home payload key retained for safe invalidation/backward compatibility.
    public const HOME_PAYLOAD = 'public:home:v1';

    public const SITEMAP_XML = 'public:sitemap:v1';

    public static function homePayload(bool $technologyTablesReady): string
    {
        return self::HOME_PAYLOAD.':tech:'.($technologyTablesReady ? '1' : '0');
    }

    /**
     * @return array<int, string>
     */
    public static function homePayloadVariants(): array
    {
        return [
            self::HOME_PAYLOAD,
            self::homePayload(true),
            self::homePayload(false),
        ];
    }
}
