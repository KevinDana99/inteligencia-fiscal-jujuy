import Image from 'next/image';
import { Skeleton, Stack } from '@mantine/core';
import { DashboardPageLoader } from '@/modules/dashboard-layout/presentation/components/DashboardPageLoader';
import classes from '@/modules/dashboard-layout/presentation/components/DashboardLayoutShell/DashboardLayoutShell.module.css';

const NAV_GROUPS = [
  ['100%', '78%', '82%'],
  ['74%'],
  ['76%']
];

export default function PrivateLayoutFallback() {
  return (
    <div className={classes.page}>
      <aside className={classes.sidebar}>
        <div className={classes.sidebarTop}>
          <div className={classes.brandContainer}>
            <div className={classes.brand}>
              <Image
                src="/assets/branding/logo-mini.svg"
                alt="Dirección Provincial de Rentas"
                width={36}
                height={36}
                className={classes.brandLogo}
                priority
              />

              <div className={classes.brandText}>
                <span className={classes.brandTitle}>Inteligencia Fiscal</span>
                <span className={classes.brandSubtitle}>DGR Jujuy</span>
              </div>
            </div>
          </div>

          <div className={classes.navRoot}>
            {NAV_GROUPS.map((items, groupIndex) => (
              <Stack key={groupIndex} gap={4} className={classes.navGroup}>
                <div className={classes.navGroupLabel}>
                  <Skeleton height={8} width={groupIndex === 0 ? 64 : 82} radius="xl" />
                </div>

                {items.map((width, itemIndex) => (
                  <Skeleton key={`${groupIndex}-${itemIndex}`} height={36} width={width} radius="md" />
                ))}
              </Stack>
            ))}
          </div>
        </div>

        <div className={classes.sidebarFooter}>
          <div className={classes.userRow}>
            <Skeleton height={32} width={32} radius="xl" />

            <Stack gap={4} style={{ flex: 1 }}>
              <Skeleton height={10} width="72%" radius="xl" />
              <Skeleton height={8} width="44%" radius="xl" />
            </Stack>
          </div>
        </div>
      </aside>

      <header className={classes.header}>
        <div className={classes.breadcrumb}>
          <span className={classes.breadcrumbBase}>Sistema IF</span>
          <span className={classes.breadcrumbDivider}>/</span>
          <Skeleton height={12} width={128} radius="xl" />
        </div>

        <div className={classes.headerActions}>
          <Skeleton height={40} width={152} radius="xl" />
          <Skeleton height={40} width={144} radius="xl" />
          <Skeleton height={39} width={76} radius="md" />
        </div>
      </header>

      <main className={classes.main}>
        <div className={classes.content}>
          <DashboardPageLoader />
        </div>
      </main>
    </div>
  );
}
