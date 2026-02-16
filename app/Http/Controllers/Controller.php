<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Schema;

abstract class Controller
{
    protected function technologyTablesReady(): bool
    {
        return Schema::hasTable('technologies') && Schema::hasTable('project_technology');
    }
}
