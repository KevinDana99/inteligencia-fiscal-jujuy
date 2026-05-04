'use server';

import { revalidatePath } from 'next/cache';
import { createServerAdminPanelSource } from '../../data-access';
import type { IAdminPanelCommandResult } from '../../models/AdminPanel';

export async function deleteAdminUserAction(
  userId: string
): Promise<IAdminPanelCommandResult> {
  const requestPayload = {
    usuarioId: userId
  };

  const source = await createServerAdminPanelSource();
  const result = await source.deleteAdminUser(userId);

  console.log({
    endpoint: `/api/super-administrador/usuarios/${userId}`,
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
