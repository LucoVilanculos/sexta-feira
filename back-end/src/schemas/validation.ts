import { z } from 'zod';

// Task Schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
});

// Event Schema
export const eventSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
});

// User Settings Schema
export const settingsSchema = z.object({
  key: z.string().min(1, 'Chave é obrigatória'),
  value: z.any(),
  userId: z.string().optional(),
});

// Project Schema
export const projectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
});

// Auth Schema
export const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// Middleware de validação
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
}; 