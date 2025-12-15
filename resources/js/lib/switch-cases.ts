import { User } from '@/types';

export const switchUserRoleToCapitalize = (role: User['role']) => {
    switch (role) {
        case 'ADMIN':
            return 'Admin';
        case 'TEACHER':
            return 'Teacher';
        case 'STUDENT':
            return 'Student';
        default:
            return '';
    }
};
