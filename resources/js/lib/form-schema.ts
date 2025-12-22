import type { ClassRoom, User } from '@/types';
import { z } from 'zod';

export const userRoleEnum = ['ADMIN', 'STUDENT', 'TEACHER'] as const as Array<User['role']>;
export const gradeEnum = ['X', 'XI', 'XII'] as const as Array<ClassRoom['grade']>;

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
    role: z.enum(userRoleEnum),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const majorSchema = z.object({
    name: z.string().min(3, 'Berikan nama jurusan minimal 3 karakter'),
});

export type MajorSchemaType = z.infer<typeof majorSchema>;

export const classRoomSchema = z.object({
    major_id: z.coerce.number().min(1).default(0),
    grade: z.enum(gradeEnum),
});

export type ClassRoomSchemaType = z.infer<typeof classRoomSchema>;

export const studyRoomSchema = z.object({
    classroom_id: z.coerce.number().default(0),
    teacher_id: z.coerce.number().default(0),
});

export type StudyRoomSchemaType = z.infer<typeof studyRoomSchema>;
