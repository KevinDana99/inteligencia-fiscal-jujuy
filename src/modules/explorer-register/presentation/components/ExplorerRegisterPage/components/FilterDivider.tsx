import { Divider } from '@mantine/core';
import classes from '../styles/filterLayout.module.css';

export function FilterDivider() {
  return (
    <Divider orientation="vertical" aria-hidden className={classes.filterDivider} />
  );
}
