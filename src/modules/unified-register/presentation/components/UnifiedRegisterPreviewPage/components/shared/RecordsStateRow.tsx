import { Table, Text } from '@mantine/core';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type RecordsStateRowProps = {
  colSpan: number;
  message: string;
  tone?: 'muted' | 'error';
};

export function RecordsStateRow({
  colSpan,
  message,
  tone = 'muted'
}: RecordsStateRowProps) {
  return (
    <Table.Tr>
      <Table.Td colSpan={colSpan}>
        <Text
          className={tone === 'error' ? classes.modalText : classes.emptyStateText}
          c={tone === 'error' ? 'red' : undefined}
        >
          {message}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}
