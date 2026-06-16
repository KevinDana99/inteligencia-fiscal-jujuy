import type { ReactNode } from 'react';
import { Card, Text } from '@mantine/core';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type SectionCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function SectionCard({
  title,
  action,
  children,
  footer
}: SectionCardProps) {
  return (
    <Card className={classes.sectionCard} padding="md" radius="lg">
      <div className={classes.sectionHeader}>
        <Text className={classes.sectionTitle}>{title}</Text>
        {action}
      </div>
      {children}
      {footer ? <div className={classes.sectionFooter}>{footer}</div> : null}
    </Card>
  );
}
