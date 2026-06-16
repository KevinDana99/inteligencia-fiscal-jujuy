import { ActionIcon, Text } from '@mantine/core';
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type PagerProps = {
  current: number;
  total: number;
  onPrevious?: () => void;
  onNext?: () => void;
  disabled?: boolean;
};

export function Pager({
  current,
  total,
  onPrevious,
  onNext,
  disabled
}: PagerProps) {
  return (
    <div className={classes.pager}>
      <ActionIcon
        variant="default"
        radius="md"
        className={classes.pagerButton}
        onClick={onPrevious}
        disabled={disabled || current <= 1}
      >
        <IconArrowNarrowLeft size={14} />
      </ActionIcon>
      <Text className={classes.pagerLabel}>{current} / {total}</Text>
      <ActionIcon
        variant="default"
        radius="md"
        className={classes.pagerButton}
        onClick={onNext}
        disabled={disabled || current >= total}
      >
        <IconArrowNarrowRight size={14} />
      </ActionIcon>
    </div>
  );
}
