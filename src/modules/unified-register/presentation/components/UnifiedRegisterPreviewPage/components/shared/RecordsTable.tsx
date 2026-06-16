import type { ReactNode } from 'react';
import { Badge, Card, Group, Table, Text } from '@mantine/core';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type RecordsTableProps = {
  title: string;
  badgeLabel: string;
  columns: string[];
  rows: ReactNode;
  footer?: ReactNode;
};

export function RecordsTable({
  title,
  badgeLabel,
  columns,
  rows,
  footer
}: RecordsTableProps) {
  return (
    <Card className={classes.tableCard} padding="md" radius="lg">
      <div className={classes.tableHeader}>
        <Group gap="xs">
          <Text className={classes.sectionTitle}>{title}</Text>
          <Badge className={classes.tableCountBadge} radius="xl">
            {badgeLabel}
          </Badge>
        </Group>
      </div>

      <div className={classes.tableWrapper}>
        <Table
          withTableBorder={false}
          withColumnBorders={false}
          withRowBorders={false}
        >
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column}>{column}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>

      {footer ? <div className={classes.tableFooter}>{footer}</div> : null}
    </Card>
  );
}
