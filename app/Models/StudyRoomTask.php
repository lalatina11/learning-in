<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyRoomTask extends Model
{
    protected $fillable = ['description', 'url', 'storage_url', 'study_room_id', 'is_closed'];

    public function studyRoom()
    {
        return $this->belongsTo(StudyRoom::class, 'study_room_id');
    }

    protected $hidden = ['storage_url'];

    public function taskSubmissions()
    {
        return $this->hasMany(StudyRoomTaskSubmission::class, 'task_id');
    }

    public function submittedTasks()
    {
        return $this->belongsToMany(
            StudyRoomTask::class,
            'study_room_task_submissions',
            'task_id',
            'student_id',
        )->withPivot(['url', 'rate', 'is_rated', 'teacher_note'])
            ->withTimestamps();
    }
}
