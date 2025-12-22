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

interface Major extends TimeStamp {
    id: number;
    name: string;
}

interface ClassRoom extends TimeStamp {
    id: number;
    major_id: number;
    grade: 'XI' | 'XI' | 'XII';
    created_at: Date;
    updated_at: Date;
}

interface ClassRoomWithMajor extends ClassRoom {
    id: number;
    major_id: number;
    grade: 'XI' | 'XI' | 'XII';
    created_at: Date;
    updated_at: Date;
    major: Major;
}
