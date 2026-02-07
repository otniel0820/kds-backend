import { ordersErrors } from './application/update-order-status-error.dictionary';
import { systemErrors } from './system-errors.dictionary';

export const errors = {
  ...systemErrors,
  ...ordersErrors,
} as const;

export type IErrorKey = keyof typeof errors;
