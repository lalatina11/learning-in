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

interface Major {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}
