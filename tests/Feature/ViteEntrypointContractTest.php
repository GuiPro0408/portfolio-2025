<?php

namespace Tests\Feature;

use Tests\TestCase;

class ViteEntrypointContractTest extends TestCase
{
    public function test_app_blade_uses_single_app_entrypoint_without_page_extension_coupling(): void
    {
        $template = file_get_contents(resource_path('views/app.blade.php'));

        $this->assertIsString($template);
        $this->assertStringContainsString("@vite('resources/js/app.tsx')", $template);
        $this->assertStringNotContainsString('resources/js/Pages/{$page[\'component\']}.jsx', $template);
    }
}
