import Image from 'next/image';
import { Skeleton, Text } from '@mantine/core';
import { PageLoader } from '@/components/core/PageLoader';
import classes from '@/modules/admin-panel/presentation/styles/AdminPanel.module.css';

const NAV_GROUPS = [
  {
    labelWidth: null,
    itemWidths: [56]
  },
  {
    labelWidth: 96,
    itemWidths: [98]
  }
];

export default function AdminLayoutFallback() {
  return (
    <div className={classes.page}>
      <div className={classes.layout}>
        <header className={classes.header}>
          <div className={classes.headerInner}>
            <div className={classes.mobileMenuButton} aria-hidden='true'>
              <Skeleton height={28} width={28} radius='md' />
            </div>

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
            <nav className={classes.navList} aria-hidden='true'>
              {NAV_GROUPS.map((group, groupIndex) =>
                group.labelWidth ? (
                  <div key={groupIndex} className={classes.navGroup}>
                    <span
                      className={classes.navGroupLabel}
                      style={{
                        display: 'block',
                        minHeight: 26,
                        boxSizing: 'border-box'
                      }}
                    >
                      <Skeleton
                        height={10}
                        width={group.labelWidth}
                        radius='xl'
                      />
                    </span>

                    {group.itemWidths.map((itemWidth, itemIndex) => (
                      <div
                        key={`${groupIndex}-${itemIndex}`}
                        className={classes.navItem}
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
                          <Skeleton height={18} width={18} radius='sm' />
                          <Skeleton
                            height={12}
                            width={itemWidth}
                            radius='xl'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  group.itemWidths.map((itemWidth, itemIndex) => (
                    <div
                      key={`${groupIndex}-${itemIndex}`}
                      className={classes.navItem}
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
                        <Skeleton height={18} width={18} radius='sm' />
                        <Skeleton height={12} width={itemWidth} radius='xl' />
                      </div>
                    </div>
                  ))
                )
              )}
            </nav>
          </div>
        </aside>

        <main
          className={classes.main}
          style={{
            display: 'flex',
            minHeight: 'calc(100vh - var(--admin-header-height))'
          }}
        >
          <div
            className={classes.content}
            style={{
              display: 'flex',
              flex: 1,
              minHeight: '100%'
            }}
          >
            <PageLoader />
          </div>
        </main>
      </div>
    </div>
  );
}
