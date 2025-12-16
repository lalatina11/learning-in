<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    protected $fillable = ['grade', 'major_id'];

    protected $casts = ['grade' => 'string'];

    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function studyRoom()
    {
        return $this->hasMany(StudyRoom::class);
    }
}
