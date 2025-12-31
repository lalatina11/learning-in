<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyRoomModule extends Model
{
    protected $fillable = ['study_room_id', 'url', 'storage_url', 'description'];

    public function studyRoom()
    {
        return $this->belongsTo(StudyRoom::class, 'study_room_id');
    }

    protected $hidden = ['storage_url'];


}
