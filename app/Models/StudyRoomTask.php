<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyRoomTask extends Model
{
    protected $fillable = ['description', 'task', 'storage_url', 'study_room_id', 'is_closed'];

    public function studyRoom()
    {
        return $this->belongsTo(StudyRoom::class, 'study_room_id');
    }


    protected $hidden = ['storage_url'];
}
