<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizRating extends Model
{
    protected $fillable = ['quiz_id', 'student_id', 'is_rated', 'rate', 'teacher_note'];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function quiz()
    {
        return $this->belongsTo(StudyRoomQuizzez::class, 'quiz_id');
    }
}
