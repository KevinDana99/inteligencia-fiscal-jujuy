'use client';

import type { ReactNode } from 'react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { useSignOut } from '@/modules/auth/presentation/hooks';
import type { AdminPanelSection } from '../../../data/models/AdminPanel';
import { AdminPanelNavbar } from '../AdminPanelNavbar';
import { AdminPanelSidebar } from '../AdminPanelSidebar';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelTemplate({
  session,
  currentSection,
  children
}: {
  session: IAuthSession;
  currentSection: AdminPanelSection;
  children: ReactNode;
}) {
  const { signOut, isPending: isSignOutPending } = useSignOut();

  return (
    <div className={classes.page}>
      <div className={classes.layout}>
        <AdminPanelNavbar
          session={session}
          signOut={signOut}
          isSignOutPending={isSignOutPending}
        />

        <AdminPanelSidebar currentSection={currentSection} />

        <main className={classes.main}>
          <div className={classes.content}>{children}</div>
        </main>
      </div>
    </div>
  );
}
