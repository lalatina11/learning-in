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
        Schema::create('study_room_task_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('study_room_tasks', 'id')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users', 'id')->cascadeOnDelete();
            $table->text('url');
            $table->integer('rate')->default(0);
            $table->boolean('is_rated')->default(false);
            $table->text('teacher_note')->nullable();
            $table->timestamps();
            $table->unique(['task_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_room_task_submissions');
    }
};
