<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyRoomTask extends Model
{
    protected $fillable = ['description', 'task', 'task_storage_url', 'study_room_id'];

    public function studyRoom()
    {
        return $this->belongsTo(StudyRoom::class);
    }
}
