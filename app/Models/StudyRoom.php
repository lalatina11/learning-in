<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyRoom extends Model
{
    protected $fillable = ['teacher_id', 'classroom_id', 'learning_subject_id'];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
    public function classroom()
    {
        return $this->belongsTo(ClassRoom::class, 'classroom_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_in_the_study_room', 'study_room_id', 'student_id')->withTimestamps();
    }

    public function studentsCount()
    {
        return $this->students()->count();
    }

    public function learning_subject()
    {
        return $this->belongsTo(LearningSubject::class, 'learning_subject_id');
    }
}
