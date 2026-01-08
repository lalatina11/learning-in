<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyRoomQuizzez extends Model
{
    protected $fillable = ['study_room_id', 'platform', 'join_code', 'is_open'];

    public function study_room()
    {
        return $this->belongsTo(StudyRoom::class, 'study_room_id');
    }

    public function ratings()
    {
        return $this->hasMany(QuizRating::class, 'quiz_id');
    }
}
