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
        User::factory()->count(13)->sequence(
            [
                'role' => 'ADMIN',
                'email' => 'admin@admin.com',
                'master_number' => 'administrator'
            ],
            [
                'role' => 'TEACHER',
                'email' => 'teacher@teacher.com'
            ],
            [
                'role' => 'TEACHER',
                'email' => 'teacher1@teacher.com'
            ],
            [
                'role' => 'TEACHER',
                'email' => 'teacher2@teacher.com'
            ],
            [
                'role' => 'TEACHER',
                'email' => 'teacher3@teacher.com'
            ],
            [
                'role' => 'TEACHER',
                'email' => 'teacher5@teacher.com'
            ],
            [
                'role' => 'TEACHER',
                'email' => 'teacher4@teacher.com'
            ],
            [
                'role' => 'STUDENT',
                'email' => 'student@student.com'
            ],
            [
                'role' => 'STUDENT',
                'email' => 'student1@student.com'
            ],
            [
                'role' => 'STUDENT',
                'email' => 'student2@student.com'
            ],
            [
                'role' => 'STUDENT',
                'email' => 'student3@student.com'
            ],
            [
                'role' => 'STUDENT',
                'email' => 'student4@student.com'
            ],
            [
                'role' => 'STUDENT',
                'email' => 'student5@student.com'
            ],
        )->create();
    }
}
