import { mapIamSessionResponseToSerializedAuthSession } from '@/lib/auth/session-mapper';
import type { ApiIamSessionResponseDto } from '../dtos/IamDtos';
import type { ISerializedAuthSession } from '../../../models/Auth';

export function mapIamSessionDto(dto: ApiIamSessionResponseDto): ISerializedAuthSession {
  return mapIamSessionResponseToSerializedAuthSession(dto);
}
