'use client'

import { Button, Group, Stack, Text } from '@mantine/core'
import { useSignOut } from '../../hooks'
import type { IAuthSession } from '../../../data/models/Auth'

export default function UserSessionMenu({ session }: { session: IAuthSession }) {
  const { signOut, isPending } = useSignOut()

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center">
        <div>
          <Text fw={600}>{session.user.nombreUsuario ?? 'Usuario'}</Text>
          <Text size="sm" c="dimmed">
            {session.user.correo ?? 'Sin correo'}
          </Text>
        </div>

        <Button variant="light" color="red" onClick={signOut} loading={isPending}>
          Sign out
        </Button>
      </Group>
    </Stack>
  )
}
