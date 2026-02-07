import { authErrors } from './orders/auth-errors.dictionary';
import { ordersErrors } from './orders/update-order-status-error.dictionary';
import { systemErrors } from './system-errors.dictionary';

export const errors = {
  ...systemErrors,
  ...ordersErrors,
  ...authErrors,
} as const;

export type IErrorKey = keyof typeof errors;
