import Image from 'next/image';
import { Skeleton } from '@mantine/core';
import { DashboardPageLoader } from '@/modules/dashboard-layout/presentation/components/DashboardPageLoader';
import classes from '@/modules/dashboard-layout/presentation/components/DashboardLayoutShell/DashboardLayoutShell.module.css';

const NAV_GROUPS = [
  { labelWidth: 56, itemWidths: [118, 112, 106, 114] },
  { labelWidth: 86, itemWidths: [78] },
  { labelWidth: 96, itemWidths: [84] }
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
            {NAV_GROUPS.map((group, groupIndex) => (
              <div key={groupIndex} className={classes.navGroup}>
                <span
                  className={classes.navGroupLabel}
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    minHeight: 26,
                    boxSizing: 'border-box'
                  }}
                >
                  <Skeleton height={10} width={group.labelWidth} radius="xl" />
                </span>

                {group.itemWidths.map((itemWidth, itemIndex) => (
                  <div
                    key={`${groupIndex}-${itemIndex}`}
                    className={classes.navItem}
                    aria-hidden="true"
                    style={{
                      minHeight: 37,
                      boxSizing: 'border-box'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--mantine-spacing-sm)',
                        height: 20
                      }}
                    >
                      <Skeleton height={15} width={15} radius="sm" />
                      <Skeleton height={12} width={itemWidth} radius="xl" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={classes.sidebarFooter}>
          <div className={classes.userRow}>
            <Skeleton height={32} width={32} radius="xl" />

            <div className={classes.userMeta} aria-hidden="true">
              <span className={classes.userName}>
                <Skeleton height={12} width={112} radius="xl" />
              </span>
              <span className={classes.userRole}>
                <Skeleton height={10} width={76} radius="xl" />
              </span>
            </div>
          </div>
        </div>
      </aside>

      <header className={classes.header}>
        <div className={classes.mobileMenuButton} aria-hidden="true">
          <Skeleton height={28} width={28} radius="md" />
        </div>

        <div className={classes.breadcrumb}>
          <span className={classes.breadcrumbBase}>Sistema IF</span>
          <span className={classes.breadcrumbDivider}>/</span>
          <Skeleton height={12} width={128} radius="xl" />
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
