"use client";

import {
  ActionIcon,
  Button,
  Card,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconXFilled } from "@tabler/icons-react";
import type { IntimationTemplateController } from "../../../hooks/intimation-template";
import { INTIMATION_TEMPLATE_LABELS } from "../../../constants";
import classes from "./IntimationTemplateColumnsSection.module.css";

type IntimationTemplateColumnsSectionProps = {
  controller: IntimationTemplateController;
  allowedColumns?: boolean;
};

export function IntimationTemplateColumnsSection({
  controller,
  allowedColumns = true,
}: IntimationTemplateColumnsSectionProps) {
  const { state, errors, columnRows, openColumnPicker, fieldHandlers } =
    controller;

  return (
    <Card className={classes.sectionCard} radius="lg" padding={0}>
      {allowedColumns ? (
        <>
          <Text className={classes.sectionLabel}>
            {INTIMATION_TEMPLATE_LABELS.sections.columns}
          </Text>
          <Text className={classes.sectionHint}>
            {INTIMATION_TEMPLATE_LABELS.hints.columns}
          </Text>

          <Stack gap="sm" className={classes.columnList}>
            {columnRows.map((column) => (
              <div key={column.id} className={classes.columnRow}>
                <span className={classes.columnToken}>✓</span>
                <TextInput
                  value={column.value}
                  onChange={column.handleChange}
                  readOnly={column.readOnly}
                  className={classes.columnInput}
                  classNames={{ input: classes.formInput }}
                />
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label={column.removeLabel}
                  onClick={column.handleRemove}
                  className={classes.columnRemove}
                >
                  <IconXFilled size={16} />
                </ActionIcon>
              </div>
            ))}
          </Stack>

          {errors.columnas ? (
            <Text className={classes.errorText}>{errors.columnas}</Text>
          ) : null}

          <Button
            variant="default"
            className={classes.addColumnButton}
            leftSection={<IconPlus size={14} />}
            onClick={openColumnPicker}
          >
            {INTIMATION_TEMPLATE_LABELS.buttons.addColumns}
          </Button>
        </>
      ) : null}

      <div className={classes.fieldGroup}>
        <Text className={classes.fieldTitle}>
          {INTIMATION_TEMPLATE_LABELS.fields.informationSource}{" "}
          <span className={classes.optionalLabel}>
            {INTIMATION_TEMPLATE_LABELS.fields.informationSourceOptional}
          </span>
        </Text>
        <TextInput
          value={state.fuenteInformacion}
          onChange={fieldHandlers.handleInformationSourceChange}
          placeholder={
            INTIMATION_TEMPLATE_LABELS.placeholders.informationSource
          }
          classNames={{ input: classes.formInput }}
        />
      </div>

      <div className={classes.fieldGroupFooter}>
        <Text className={classes.fieldTitle}>
          {INTIMATION_TEMPLATE_LABELS.fields.cutoffDate}
        </Text>
        <TextInput
          value={state.fechaCorte}
          onChange={fieldHandlers.handleCutoffDateChange}
          error={errors.fechaCorte}
          classNames={{ input: classes.formInput }}
        />
      </div>
    </Card>
  );
}
