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

  if (type === 'Transportista') {
    return {
      background: '#FFF7ED',
      color: '#D97706'
    };
  }

  return null;
}
