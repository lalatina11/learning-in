import { LearningSubject, User } from '@/types';

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

export const switchCaseLearningTypeForIndonesianLang = (type: LearningSubject['type']) => {
    switch (type) {
        case 'PRACTICE':
            return 'Praktek';
        case 'THEORY':
            return 'Teori';
        default:
            'Teori';
    }
};
