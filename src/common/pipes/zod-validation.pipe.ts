import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { buildError } from '../builders/error.builder';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);

    if (!parsed.success) {
      throw new BadRequestException(
        buildError('KDS_SYS_E0002', {
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        }),
      );
    }

    return parsed.data;
  }
}
