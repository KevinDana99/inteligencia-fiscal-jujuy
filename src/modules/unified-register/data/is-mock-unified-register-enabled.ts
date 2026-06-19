import { UNIFIED_REGISTER_DATA_SOURCE_ENV } from './constants/unifiedRegisterDataSource';

export function isMockUnifiedRegisterEnabled(): boolean {
  return process.env[UNIFIED_REGISTER_DATA_SOURCE_ENV.useMock] === 'true';
}
