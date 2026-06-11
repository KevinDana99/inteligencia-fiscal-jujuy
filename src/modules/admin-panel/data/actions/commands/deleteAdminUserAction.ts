'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminPanelSource } from '../../data-access';
import type { IAdminPanelCommandResult } from '../../models/AdminPanel';

export async function deleteAdminUserAction(
  userId: string
): Promise<IAdminPanelCommandResult> {
  const normalizedUserId = userId.trim();
  const endpoint = `/api/super-administrador/usuarios/${encodeURIComponent(normalizedUserId)}`;
  const requestPayload = {
    usuarioId: normalizedUserId
  };

  const source = await createServerAdminPanelSource();
  const result = await source.deleteAdminUser(normalizedUserId);

  console.log({
    endpoint,
    action: 'deleteAdminUserAction',
    METHOD: 'DELETE',
    REQUEST: requestPayload,
    RESPONSE: {
      success: result.success,
      status: result.status,
      code: result.code,
      error: result.error,
      data: result.success ? null : undefined
    }
  });

  if (result.success) {
    revalidatePath('/admin');
  }

  return result;
}
