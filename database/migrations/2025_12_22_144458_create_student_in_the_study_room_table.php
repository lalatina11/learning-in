<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_in_the_study_room', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users', 'id')->onDelete('cascade');
            $table->foreignId('study_room_id')->constrained('study_rooms', 'id')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['student_id', 'study_room_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_in_the_study_room');
    }
};
