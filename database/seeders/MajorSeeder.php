<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Major::factory()->count(5)->sequence(
            ['name' => "Farmasi"],
            ['name' => "Rekayasa Perangkat Lunak"],
            ['name' => "Teknik Komputer Jaringan"],
            ['name' => "Design Visual dan Komunikasi"],
            ['name' => "Akuntansi"],
        )->create();
    }
}
