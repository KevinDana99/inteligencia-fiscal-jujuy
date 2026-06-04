import Image from 'next/image';
import { Skeleton, Stack, Text } from '@mantine/core';
import { AdminPanelHomeSectionLoader } from '@/modules/admin-panel/presentation/components/AdminPanelHomeSection';
import classes from '@/modules/admin-panel/presentation/styles/AdminPanel.module.css';

export default function AdminLayoutFallback() {
  return (
    <div className={classes.page}>
      <div className={classes.layout}>
        <header className={classes.header}>
          <div className={classes.headerInner}>
            <div className={classes.brand}>
              <div className={classes.brandMark}>
                <Image
                  src="/assets/branding/logo.svg"
                  alt="Dirección Provincial de Rentas"
                  width={170}
                  height={40.7}
                  className={classes.brandLogo}
                  priority
                />
              </div>
              <span className={classes.divider} />
              <Text size="sm" className={classes.headerTitle}>
                Panel de Administración
              </Text>
            </div>

            <div className={classes.headerActions}>
              <Skeleton height={40} width={122} radius="xl" />
              <Skeleton height={39} width={72} radius="md" />
            </div>
          </div>
        </header>

        <aside className={classes.sidebar}>
          <div className={classes.sidebarInner}>
            <Stack gap={8}>
              <Skeleton height={36} radius="md" />
              <Skeleton height={10} width={108} mt={12} radius="xl" />
              <Skeleton height={36} radius="md" />
            </Stack>
          </div>
        </aside>

        <main className={classes.main}>
          <div className={classes.content}>
            <AdminPanelHomeSectionLoader />
          </div>
        </main>
      </div>
    </div>
  );
}
