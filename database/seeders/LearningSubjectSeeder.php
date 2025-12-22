<?php

namespace Database\Seeders;

use App\Models\LearningSubject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LearningSubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LearningSubject::factory()->count(3)->sequence(
            ['name' => 'Bahasa Indonesia'],
            ['name' => 'Bahasa Inggris'],
            ['name' => 'Matematika'],
        )->create();
    }
}
