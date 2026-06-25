"use client";

import { CloseButton, TextInput, Group, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { FocusEvent, KeyboardEvent, MouseEvent } from "react";
import type { ChangeEvent } from "react";
import { UNIFIED_REGISTER_SEARCH_PLACEHOLDER } from "../../constants/unifiedRegisterPage";
import { formatUnifiedRegisterContributorsCount } from "../../utils/formatUnifiedRegisterContributorsCount";
import classes from "../UnifiedRegisterPage/UnifiedRegisterPage.module.css";
interface UnifiedRegisterSearchProps {
  disabled: boolean;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  totalItems: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onReset: () => void;
  value: string;
}

export function UnifiedRegisterSearch({
  disabled,
  onBlur,
  totalItems,
  onChange,
  onKeyDown,
  onReset,
  value,
}: UnifiedRegisterSearchProps) {
  const handleResetMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Group gap={8} align="center" wrap="nowrap" className={classes.searchRow}>
      <TextInput
        disabled={disabled}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={UNIFIED_REGISTER_SEARCH_PLACEHOLDER}
        leftSection={<IconSearch size={16} stroke={2} />}
        rightSection={
          value ? (
            <CloseButton
              aria-label="Limpiar búsqueda"
              disabled={disabled}
              onMouseDown={handleResetMouseDown}
              onClick={onReset}
              size="sm"
            />
          ) : null
        }
        rightSectionPointerEvents={value ? "all" : "none"}
        className={classes.searchInput}
      />
      <Text component="span" className={classes.searchCount}>
        {formatUnifiedRegisterContributorsCount(totalItems)}
      </Text>
    </Group>
  );
}
