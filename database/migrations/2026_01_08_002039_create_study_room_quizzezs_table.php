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
        Schema::create('study_room_quizzezs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_room_id')->constrained('study_rooms', 'id')->cascadeOnDelete();
            $table->string('platform');
            $table->text('join_code');
            $table->boolean('is_open')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_room_quizzezs');
    }
};
