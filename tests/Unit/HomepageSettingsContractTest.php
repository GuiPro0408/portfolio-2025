<?php

namespace Tests\Unit;

use App\Support\HomepageSettingsContract;
use Tests\TestCase;

class HomepageSettingsContractTest extends TestCase
{
    public function test_public_fields_are_unique_and_non_empty(): void
    {
        $fields = HomepageSettingsContract::PUBLIC_FIELDS;

        $this->assertNotEmpty($fields);
        $this->assertSame($fields, array_values(array_unique($fields)));
    }

    public function test_image_fields_are_subset_of_public_fields(): void
    {
        $publicFields = HomepageSettingsContract::PUBLIC_FIELDS;

        foreach (array_keys(HomepageSettingsContract::IMAGE_FIELDS) as $imageField) {
            $this->assertContains($imageField, $publicFields);
        }
    }
}
