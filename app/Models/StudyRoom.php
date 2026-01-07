<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyRoom extends Model
{
    protected $fillable = ['teacher_id', 'class_room_id', 'learning_subject_id'];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class, 'class_room_id');
    }

    public function learning_subject()
    {
        return $this->belongsTo(LearningSubject::class, 'learning_subject_id');
    }

    public function modules()
    {
        return $this->hasMany(StudyRoomModule::class);
    }
    public function tasks()
    {
        return $this->hasMany(StudyRoomTask::class);
    }
}
