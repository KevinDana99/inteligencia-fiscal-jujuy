'use client';

import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title
} from '@mantine/core';
import { IconInfoCircle, IconMail, IconPlus, IconTrash } from '@tabler/icons-react';
import { useAdminConfig } from '../../contexts';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelSettingsSection() {
  const { adminConfig, addWhitelistDomain, removeWhitelistDomain } = useAdminConfig();
  const [domainValue, setDomainValue] = useState('');
  const [domainError, setDomainError] = useState<string | null>(null);

  const handleAddDomain = () => {
    const normalizedDomain = domainValue.trim().toLowerCase();

    if (!normalizedDomain) {
      setDomainError('Ingresá un dominio.');
      return;
    }

    if (!normalizedDomain.includes('@')) {
      setDomainError('El dominio debe incluir @.');
      return;
    }

    const wasAdded = addWhitelistDomain(normalizedDomain);

    if (!wasAdded) {
      setDomainError('Ese dominio ya está configurado.');
      return;
    }

    setDomainValue('');
    setDomainError(null);
  };

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={1} className={classes.heroTitle}>
          Configuración
        </Title>
        <Text className={classes.heroDate}>
          Administrá los parámetros generales del sistema
        </Text>
      </Stack>

      <Card className={classes.configCard} radius="lg" padding="lg">
        <Stack gap="md">
          <Group gap="sm" align="center">
            <ThemeIcon
              variant="light"
              color="blue"
              radius={8}
              size={32}
              className={classes.configHeaderIcon}
            >
              <IconMail size={16} />
            </ThemeIcon>

            <Stack gap={0}>
              <Title order={5} className={classes.configCardTitle}>
                Dominios de email permitidos
              </Title>
              <Text className={classes.configCardSubtitle}>
                Solo los emails con estos dominios podrán registrarse en el sistema
              </Text>
            </Stack>
          </Group>

          <Divider />

          <Stack gap="sm">
            {adminConfig.whitelist.map((domain) => (
              <div key={domain} className={classes.configDomainItem}>
                <Group gap="sm">
                  <span className={classes.configDomainPoint} />
                  <Text className={classes.configDomainText}>{domain}</Text>
                </Group>

                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => removeWhitelistDomain(domain)}
                  aria-label={`Eliminar dominio ${domain}`}
                  className={classes.configDeleteButton}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </div>
            ))}

            <Stack gap="xs">
              <Text className={classes.configSectionLabel}>Agregar nuevo dominio</Text>

              <Group gap="sm" align="flex-start">
                <TextInput
                  placeholder="@ejemplo.gob.ar"
                  value={domainValue}
                  onChange={(event) => {
                    setDomainValue(event.currentTarget.value);
                    if (domainError) {
                      setDomainError(null);
                    }
                  }}
                  leftSection={<IconMail size={16} />}
                  className={classes.configDomainInput}
                  classNames={{
                    input: classes.modalInput,
                    section: classes.modalInputSection
                  }}
                  error={domainError}
                />

                <Button
                  onClick={handleAddDomain}
                  leftSection={<IconPlus size={15} />}
                  className={classes.configAddButton}
                  radius="xl"
                >
                  Agregar
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      <Card className={classes.configInfoCard} radius="md" padding="md">
        <Group gap="sm" align="flex-start">
          <IconInfoCircle className={classes.configInfoIcon} />

          <Stack gap="xs">
            <Text className={classes.configInfoTitle}>¿Cómo funciona la validación?</Text>
            <Text className={classes.configInfoText}>
              Al crear o modificar un usuario, el sistema verificará que el email
              ingresado termine con alguno de los dominios listados arriba. Si el email
              no coincide, se mostrará un error y no se podrá guardar el usuario.
            </Text>
          </Stack>
        </Group>
      </Card>
    </Stack>
  );
}
