<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningSubject extends Model
{
    /** @use HasFactory<\Database\Factories\LearningSubjectFactory> */
    use HasFactory;
    protected $table = "learning_subjects";

    protected $fillable = ['name', 'type'];

    protected function casts(): array
    {
        return [
            'type' => 'string'
        ];
    }

    public function studyRoom()
    {
        return $this->hasMany(StudyRoom::class);
    }

}
