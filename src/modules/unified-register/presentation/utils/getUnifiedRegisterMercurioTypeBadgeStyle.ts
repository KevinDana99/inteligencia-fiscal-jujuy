import type { IUnifiedRegisterFine } from '../../data/models/UnifiedRegister';

export function getUnifiedRegisterMercurioTypeBadgeStyle(
  type: IUnifiedRegisterFine['type']
) {
  if (type === 'Destinatario') {
    return {
      background: '#EFF6FF',
      color: '#2563EB'
    };
  }

  if (type === 'Remitente') {
    return {
      background: '#F5F3FF',
      color: '#7C3AED'
    };
  }

  return null;
}
