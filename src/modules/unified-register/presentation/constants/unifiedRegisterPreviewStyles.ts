import type { UnifiedRegisterRiskLevel } from '../../data/models/UnifiedRegister';

export const RISK_CLASS_KEYS = {
  A: 'riskA',
  B: 'riskB',
  C: 'riskC',
  D: 'riskD'
} as const satisfies Record<UnifiedRegisterRiskLevel, string>;

export const FINE_STATUS_CLASS_KEYS: Record<string, string> = {
  Impaga: 'badgeCritical',
  Pagada: 'badgePositive',
  'En gestión': 'badgeWarning'
};

export const FINE_AMOUNT_CLASS_KEYS: Record<string, string> = {
  Impaga: 'amountCritical',
  Pagada: 'amountPositive',
  'En gestión': 'amountWarning'
};

export const FINE_AMOUNT_COLOR: Record<string, string> = {
  Impaga: '#dc2626',
  Pagada: '#059669',
  'En gestión': '#d97706'
};

export const ORDER_STATUS_CLASS_KEYS: Record<string, string> = {
  'En curso': 'badgeWarning',
  Cerrada: 'badgePositive'
};

export const ORDER_AMOUNT_CLASS_KEYS: Record<string, string> = {
  'En curso': 'amountCritical',
  Cerrada: 'amountDefault'
};

export const ORDER_AMOUNT_COLOR: Record<string, string> = {
  'En curso': '#DC2626',
  Cerrada: 'var(--mantine-color-gray-7)'
};

export const SOURCE_STATUS_CLASS_KEYS: Record<string, string> = {
  '✓ Validado': 'badgeNeutral',
  Diferencia: 'badgeCritical',
  Desvío: 'badgeCritical',
  Revisar: 'badgeWarning',
  '✓ OK': 'badgeNeutral',
  'Al día': 'badgeNeutral',
  'Deuda parcial': 'badgeWarning',
  Pagado: 'badgeNeutral',
  Pendiente: 'badgeCritical'
};
