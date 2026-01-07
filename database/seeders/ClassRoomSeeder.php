<?php

namespace Database\Seeders;

use App\Models\ClassRoom;
use App\Models\Major;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $major1 = Major::first();
        $major2 = Major::skip(1)->first();
        ClassRoom::factory()->count(6)->sequence(
            ['grade' => 'X', 'major_id' => $major1->id],
            ['grade' => 'XI', 'major_id' => $major1->id],
            ['grade' => 'XII', 'major_id' => $major1->id],
            ['grade' => 'X', 'major_id' => $major2->id],
            ['grade' => 'XI', 'major_id' => $major2->id],
            ['grade' => 'XII', 'major_id' => $major2->id],
        )->create();
        $firstClassRoom = ClassRoom::first();
        User::where('role', "STUDENT")->update(['class_room_id' => $firstClassRoom->id]);
    }
}
