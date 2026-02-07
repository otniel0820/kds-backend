import { z } from 'zod';
import { HttpStatus } from '@nestjs/common';

export const ResponseSchema = <T extends z.ZodTypeAny>(dataSchema?: T) =>
  z.object({
    data: (dataSchema ?? z.any()).optional(),
    status: z.nativeEnum(HttpStatus),
    code: z.string().optional(),
    message: z.string(),
  });

export type IResponse<T = unknown> = T extends z.ZodTypeAny
  ? z.infer<ReturnType<typeof ResponseSchema<T>>>
  : {
      data?: T;
      status: HttpStatus;
      code?: string;
      message: string;
    };
