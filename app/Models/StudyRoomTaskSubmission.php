<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyRoomTaskSubmission extends Model
{
    protected $fillable = ['url', 'student_id', 'task_id', 'rate', 'is_rated', 'teacher_note'];

    public function task()
    {
        return $this->belongsTo(StudyRoomTask::class, 'task_id');
    }
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
