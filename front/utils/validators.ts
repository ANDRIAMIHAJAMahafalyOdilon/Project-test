import { z } from 'zod';
import { VALIDATION } from '@/config/constants';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Please enter a valid email address');

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`)
  .max(VALIDATION.NAME_MAX_LENGTH, `Name cannot exceed ${VALIDATION.NAME_MAX_LENGTH} characters`);

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * Contact form validation schema
 */
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Please select a subject'),
  message: z
    .string()
    .min(VALIDATION.MESSAGE_MIN_LENGTH, `Message must be at least ${VALIDATION.MESSAGE_MIN_LENGTH} characters`)
    .max(VALIDATION.MESSAGE_MAX_LENGTH, `Message cannot exceed ${VALIDATION.MESSAGE_MAX_LENGTH} characters`),
});

/**
 * Profile form validation schema
 */
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: z.string().optional(),
  bio: z.string().max(VALIDATION.BIO_MAX_LENGTH, `Bio cannot exceed ${VALIDATION.BIO_MAX_LENGTH} characters`).optional(),
  notifications: z.boolean(),
});

/**
 * Invoice form validation schema
 */
export const invoiceSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  clientEmail: emailSchema,
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  dueDate: z.string().min(1, 'Due date is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const result = emailSchema.safeParse(email);
  return result.success;
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  const result = passwordSchema.safeParse(password);
  return result.success;
}

/**
 * Validate phone number format (basic)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}
