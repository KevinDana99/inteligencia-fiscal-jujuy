import { RISK_CLASS_KEYS } from '../constants/unifiedRegisterPreviewStyles';
import type { UnifiedRegisterRiskLevel } from '../../data/models/UnifiedRegister';

type CssModule = Record<string, string>;

export function getRiskClass(
  classes: CssModule,
  riskLevel: UnifiedRegisterRiskLevel | null
) {
  return riskLevel ? classes[RISK_CLASS_KEYS[riskLevel]] : classes.riskEmpty;
}

export function getStatusClass(
  classes: CssModule,
  classKeysByValue: Record<string, string>,
  status: string | null,
  fallback?: string
) {
  if (!status) {
    return fallback;
  }

  const classKey = classKeysByValue[status];
  return classKey ? classes[classKey] : fallback;
}
