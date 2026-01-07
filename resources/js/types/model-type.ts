export interface TimeStamp {
    created_at: Date;
    updated_at: Date;
}

export interface TimeStampAndId extends TimeStamp {
    id: number;
}

export interface User extends TimeStampAndId {
    master_number: number | string;
    name: string;
    email: string;
    class_room_id: number | null;
    email_verified_at: string | null;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export interface ClassRoom extends TimeStampAndId {
    major_id: number;
    grade: 'X' | 'XI' | 'XII';
}

export interface Major extends TimeStampAndId {
    name: string;
}

export interface LearningSubject extends TimeStampAndId {
    name: string;
}

export interface StudyRoom extends TimeStampAndId {
    class_room_id: number;
}

export interface StudyRoomModule extends TimeStamp {
    id: number;
    description: string;
    url: string;
}

export interface StudyRoomTask extends TimeStamp {
    id: number;
    description: string;
    url: string;
    is_closed: boolean;
}
export interface StudyRoomTaskSubmission extends TimeStamp {
    id: number;
    student_id: number;
    task_id: number;
    url: string;
    rate: number;
    is_rated: boolean;
    teacher_note: string;
}

export interface StudyRoomTask extends TimeStamp {
    id: number;
    description: string;
    url: string;
    is_closed: boolean;
    study_room_id: number;
}

export interface ClassRoomWithMajor extends ClassRoom {
    major: Major;
}
