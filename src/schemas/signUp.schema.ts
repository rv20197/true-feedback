import {z} from 'zod';

export const userNameValidation = z.string().min(3, {message: "Username must be at least 3 characters"}).max(20, {message: "Username must be at most 20 characters"}).regex(/^[a-zA-Z0-9_]+$/, {message: "Username must not contain any special characters"})

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"}),
})