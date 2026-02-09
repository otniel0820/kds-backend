import { buildError } from 'src/common/builders/error.builder';
import type { IErrorKey } from 'src/common/dictionaries/errors';

type Rule = {
  match: (e: Error) => boolean;
  key: IErrorKey;
  details?: (e: Error) => Record<string, unknown>;
};

const RULES: Rule[] = [
  {
    match: (e) => e.message === 'ORDER_NOT_FOUND',
    key: 'KDS_ORDER_E0001',
  },
  {
    match: (e) => /^Invalid transition from .+ to .+$/.test(e.message),
    key: 'KDS_ORDER_E0002',
    details: (e) => ({ reason: e.message }),
  },

  {
    match: (e) => e.message === 'KDS_ORDER_E0003',
    key: 'KDS_ORDER_E0003',
  },
  {
    match: (e) => e.message === 'KDS_ORDER_E0004',
    key: 'KDS_ORDER_E0004',
  },
  {
    match: (e) => e.message === 'KDS_ORDER_E0005',
    key: 'KDS_ORDER_E0005',
  },
];

export function resolveAppError(e: Error) {
  const rule = RULES.find((r) => r.match(e));
  if (!rule) return null;

  const err = buildError(rule.key, rule.details?.(e));
  return err;
}
