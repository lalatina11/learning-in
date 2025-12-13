import type { User } from '@/types';
import { z } from 'zod';

const userRoleEnum = ['ADMIN', 'STUDENT', 'TEACHER'] as const as Array<User['role']>;

export const loginSchema = z.object({
    master_number: z.string().min(3, 'Minimal 3 karakter'),
    password: z.string().min(8, 'Minimal 8 karakter'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(3, 'Minimal 3 karakter'),
    email: z.email(),
    password: z.string().min(8, 'Minimal 8 karakter'),
    role: z.enum(userRoleEnum),
    master_number: z.string().min(8, 'Minimal 8 karakter').max(16, 'Maksimal 8 karakter'),
});
