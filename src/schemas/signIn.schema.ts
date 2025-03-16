import {z} from 'zod';

export const signInSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"}).max(20, {message: "Password must be at most 20 characters"}),
})