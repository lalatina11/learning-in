import type { ClassRoom, LearningSubject, User } from '@/types';
import { z } from 'zod';

export const userRoleEnum = ['ADMIN', 'STUDENT', 'TEACHER'] as const as Array<User['role']>;
export const gradeEnum = ['X', 'XI', 'XII'] as const as Array<ClassRoom['grade']>;
export const learningSubjectTypeEnum = ['PRACTICE', 'THEORY'] as const as Array<LearningSubject['type']>;

export const loginSchema = z.object({
    master_number: z.string().min(8, 'Minimal 8 karakter'),
    password: z.string().min(8, 'Minimal 8 karakter'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    master_number: z.string().min(8, 'Minimal 8 karakter').max(16, 'Maksimal 8 karakter'),
    name: z.string().min(3, 'Minimal 3 karakter'),
    email: z.email(),
    password: z.string().optional().default(''),
    role: z.enum(userRoleEnum, 'Mohon Pilih Peran/Role Pengguna'),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const majorSchema = z.object({
    name: z.string().min(3, 'Berikan nama jurusan minimal 3 karakter'),
});

export type MajorSchemaType = z.infer<typeof majorSchema>;

export const classRoomSchema = z.object({
    major_id: z.coerce.number().min(1, 'Mohon Masukan jurusan yang sesuai').default(0),
    grade: z.enum(gradeEnum, 'Mohon Tingkatan Kelas'),
});

export type ClassRoomSchemaType = z.infer<typeof classRoomSchema>;

export const learningSubjectSchema = z.object({
    name: z.string().min(3, 'Isi Minimal 3 Karakter').max(64, 'Maksimal 64 Karakter'),
    type: z.enum(learningSubjectTypeEnum, 'Mohon Pilih Tipe Mata Pelajaran'),
});

export type LearningSubjectSchemaType = z.infer<typeof learningSubjectSchema>;

export const studyRoomSchema = z.object({
    classroom_id: z.coerce.number().default(0),
    teacher_id: z.coerce.number().default(0),
});

export type StudyRoomSchemaType = z.infer<typeof studyRoomSchema>;
