'use client'

import { Alert, Code, Group, Stack, Text } from '@mantine/core'
import { IconKey } from '@tabler/icons-react'
import { AUTH_MOCK_USERS } from '@/lib/auth/constants'
import classes from './MockCredentialsCard.module.css'

const MOCK_ACCESS_PROFILES = [
  {
    label: 'Analista',
    email: AUTH_MOCK_USERS.user.email,
    password: AUTH_MOCK_USERS.user.password
  },
  {
    label: 'Administrador',
    email: AUTH_MOCK_USERS.admin.email,
    password: AUTH_MOCK_USERS.admin.password
  }
] as const

export function MockCredentialsCard() {
  return (
    <Alert
      variant='light'
      color='blue'
      title='Accesos de prueba'
      icon={<IconKey size={18} stroke={1.9} />}
      className={classes.card}
    >
      <Stack gap={8}>
        {MOCK_ACCESS_PROFILES.map((profile) => (
          <Stack key={profile.label} gap={3} className={classes.profile}>
            <Text fw={700} fz='xs' c='blue.8'>
              {profile.label}
            </Text>
            <Group gap={5} wrap='wrap' className={classes.credentials}>
              <Code>{profile.email}</Code>
              <Text span fz='xs' c='dimmed'>
                /
              </Text>
              <Code>{profile.password}</Code>
            </Group>
          </Stack>
        ))}
      </Stack>
    </Alert>
  )
}
