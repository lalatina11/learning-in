<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(3)->sequence(
            [
                'role' => 'ADMIN',
                'email' => 'admin@admin.com'
            ],
            [
                'role' => 'TEACHER',
                'email' => 'teacher@teacher.com'
            ],
            [
                'role' => 'STUDENT',
                'email' => 'student@student.com'
            ],
        )->create();
    }
}
