import { mapIamSessionResponseToAuthSession } from '@/lib/auth/session-mapper';
import type { ApiIamSessionResponseDto } from '../dtos/IamDtos';
import type { IAuthSession } from '../../../models/Auth';

export function mapIamSessionDto(dto: ApiIamSessionResponseDto): IAuthSession {
  return mapIamSessionResponseToAuthSession(dto);
}
