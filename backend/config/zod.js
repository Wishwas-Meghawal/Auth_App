import {z}  from 'zod';
// Zod schema for user registration validation
export const registerUserSchema = z.object({
  name : z.string().min(3, "Name must be at least 3 characters long"),
  email : z.string().email("Invalid email format"),
  password : z.string().min(6, "Password must be at least 6 characters long"),
})

//Zod schema for user login validation
export const loginUserSchema = z.object({
  email : z.string().email("Invalid email format"),
  password : z.string().min(6, "Password must be at least 6 characters long"),
})