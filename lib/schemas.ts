import { z } from 'zod';

// Survey validation schemas
export const surveyIntroSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
});

export const surveyIdSchema = z.object({
  surveyId: z.string().min(1, 'Survey ID is required'),
});

// Avatar API validation schemas
export const avatarRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  imageId: z.string().optional(),
  voiceId: z.string().optional(),
  conversationHistory: z.array(z.object({
    user: z.string().nullable(),
    ai: z.string().nullable(),
  })).optional(),
});

// User session validation
export const userSessionSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
  }),
  expires: z.string(),
});

// D-ID configuration validation
export const dIdConfigSchema = z.object({
  imageId: z.string().min(1, 'Image ID is required'),
  voiceId: z.string().min(1, 'Voice ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

// Type exports for use in components
export type SurveyIntroData = z.infer<typeof surveyIntroSchema>;
export type AvatarRequestData = z.infer<typeof avatarRequestSchema>;
export type UserSession = z.infer<typeof userSessionSchema>;
export type DIdConfig = z.infer<typeof dIdConfigSchema>; 