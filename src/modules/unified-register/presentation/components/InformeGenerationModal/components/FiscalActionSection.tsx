import { Text, TextInput } from '@mantine/core';
import { INFORME_FISCAL_ACTION_FIELDS } from '../../../constants/informeGenerationFields';
import type { InformeGenerationReport } from '../types';
import classes from '../InformeGenerationModal.module.css';

const inputClasses = {
  input: classes.formInput
};

export function FiscalActionSection({
  report
}: {
  report: InformeGenerationReport;
}) {
  const actionData = report.form.datosAccionFiscalizadora;

  return (
    <>
      <div className={classes.sectionLabel}>
        2) Datos de la acción fiscalizadora
      </div>
      <div className={classes.sectionBox}>
        <div className={classes.formGrid}>
          {INFORME_FISCAL_ACTION_FIELDS.map((fieldConfig) => (
            <div key={fieldConfig.field}>
              <Text className={classes.fieldLabel}>{fieldConfig.label}</Text>
              <TextInput
                value={actionData[fieldConfig.field]}
                onChange={(event) =>
                  report.updateFiscalActionField(
                    fieldConfig.field,
                    event.currentTarget.value
                  )
                }
                placeholder={fieldConfig.placeholder}
                classNames={inputClasses}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
