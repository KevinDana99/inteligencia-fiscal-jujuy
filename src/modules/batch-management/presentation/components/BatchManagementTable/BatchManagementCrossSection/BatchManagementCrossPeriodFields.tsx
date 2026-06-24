"use client";

import { Group, Select, Text } from "@mantine/core";
import type { BatchManagementCrossSectionController } from "../BatchManagementCrossMenu/useBatchManagementCrossMenu";
import { getBatchCrossYearSelectData } from "../../../utils";
import styles from "./BatchManagementCrossPeriodFields.module.css";
import { IconArrowRight } from "@tabler/icons-react";

type BatchManagementCrossPeriodFieldsProps = {
  section: BatchManagementCrossSectionController;
  comboboxProps: ReturnType<
    typeof import("../BatchManagementCrossMenu/useBatchManagementCrossMenu").useBatchManagementCrossMenu
  >["comboboxProps"];
};

type BatchManagementCrossPeriodEndpointProps = {
  label: string;
  monthField: BatchManagementCrossSectionController["fromMonth"];
  yearField: BatchManagementCrossSectionController["fromYear"];
  isMonthly: boolean;
  comboboxProps: BatchManagementCrossPeriodFieldsProps["comboboxProps"];
};

function BatchManagementCrossPeriodEndpoint({
  label,
  monthField,
  yearField,
  isMonthly,
  comboboxProps,
}: BatchManagementCrossPeriodEndpointProps) {
  const yearSelectData = getBatchCrossYearSelectData(
    yearField.data,
    !isMonthly ? (label === "Desde" ? "fromAnnual" : "toAnnual") : "default"
  );

  return (
    <div className={styles.periodField}>
      <Text
        className={
          isMonthly ? styles.monthlyPeriodLabel : styles.annualPeriodLabel
        }
      >
        {label}
      </Text>
      {monthField ? (
        <div className={styles.monthlySelectPair}>
          <Select
            data={monthField.data}
            value={monthField.value}
            onChange={monthField.onChange}
            className={styles.crossMenuSelect}
            classNames={{
              input: styles.crossMenuSelectInput,
              dropdown: styles.crossMenuSelectDropdown,
            }}
            comboboxProps={comboboxProps}
          />
          <Select
            data={yearSelectData}
            value={yearField.value}
            onChange={yearField.onChange}
            className={styles.crossMenuSelect}
            classNames={{
              input: styles.crossMenuYearInput,
              dropdown: styles.crossMenuSelectDropdown,
            }}
            comboboxProps={comboboxProps}
          />
        </div>
      ) : (
        <Select
          data={yearSelectData}
          value={yearField.value}
          onChange={yearField.onChange}
          className={styles.crossMenuSelect}
          classNames={{
            input: styles.crossMenuSelectInput,
            dropdown: styles.crossMenuSelectDropdown,
          }}
          comboboxProps={comboboxProps}
        />
      )}
    </div>
  );
}

export function BatchManagementCrossPeriodFields({
  section,
  comboboxProps,
}: BatchManagementCrossPeriodFieldsProps) {
  const isMonthly = section.periodTone === "monthly";

  return (
    <div
      className={`${styles.periodCard} ${
        isMonthly ? styles.monthlyPeriodCard : styles.annualPeriodCard
      }`}
    >
      <div
        className={`${styles.periodCardTitle} ${
          !isMonthly ? styles.annualPeriodCardTitle : ""
        }`}
      >
        Período
      </div>
      <Group
        gap={6}
        wrap="nowrap"
        align="flex-end"
        className={styles.periodRow}
      >
        <BatchManagementCrossPeriodEndpoint
          label="Desde"
          monthField={section.fromMonth}
          yearField={section.fromYear}
          isMonthly={isMonthly}
          comboboxProps={comboboxProps}
        />
        <span className={styles.periodArrow}>
          <IconArrowRight size={16} />
        </span>
        <BatchManagementCrossPeriodEndpoint
          label="Hasta"
          monthField={section.toMonth}
          yearField={section.toYear}
          isMonthly={isMonthly}
          comboboxProps={comboboxProps}
        />
      </Group>
    </div>
  );
}
