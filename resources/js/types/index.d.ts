interface TimeStamp {
    created_at: string;
    updated_at: string;
}

export interface Auth {
    user: User;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: 'TEACHER' | 'STUDENT' | 'ADMIN';
    master_number: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface GroupMemberSlide {
    name: string;
    nim: string;
    image: string;
}

export interface Major extends TimeStamp {
    id: number;
    name: string;
}

export interface ClassRoom extends TimeStamp {
    id: number;
    major_id: number;
    grade: 'X' | 'XI' | 'XII';
    created_at: Date;
    updated_at: Date;
}

export interface ClassRoomWithMajor extends ClassRoom {
    id: number;
    major_id: number;
    created_at: Date;
    updated_at: Date;
    major: Major;
}

export interface StudyRoom extends TimeStamp {
    id: int;
    classroom_id: int;
    teacher_id: int;
}

export interface StudyRoomWithTeacher extends StudyRoom {
    teacher: User;
}

export interface StudyRoomWithClassRoom extends StudyRoom {
    classroom: ClassRoom;
}
export interface StudyRoomWithStudent extends StudyRoom {
    classroom: ClassRoom;
}

export interface StudyRoomWithClassRoomAndTeacher extends StudyRoom {
    classroom: ClassRoom;
    teacher: User;
}
export interface StudyRoomWithClassRoomAndTeacherAndTeacher extends StudyRoom {
    classroom: ClassRoomWithMajor;
    teacher: User;
    students: Array<User>;
}

export interface LearningSubject extends TimeStamp {
    id: number;
    name: string;
    type: 'PRACTICE' | 'THEORY';
}
