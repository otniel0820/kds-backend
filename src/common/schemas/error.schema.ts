import { z } from 'zod';
import { HttpStatus } from '@nestjs/common';

export const ErrorSchema = z.object({
  status: z.nativeEnum(HttpStatus),
  code: z.string(),
  message: z.string(),
  timestamp: z.date().optional(),
  details: z.record(z.string(), z.any()).optional(),
});

export type IError = z.infer<typeof ErrorSchema>;
