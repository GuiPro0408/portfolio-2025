<?php

namespace App\Support;

class PublicCacheKeys
{
    public const HOME_PAYLOAD = 'public:home:v2';

    public const SITEMAP_XML = 'public:sitemap:v1';

    public static function homePayload(): string
    {
        return self::HOME_PAYLOAD;
    }

    /**
     * @return array<int, string>
     */
    public static function homePayloadVariants(): array
    {
        return [
            'public:home:v1',
            'public:home:v1:tech:1',
            'public:home:v1:tech:0',
            self::HOME_PAYLOAD,
        ];
    }
}
