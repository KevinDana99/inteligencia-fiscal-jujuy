import { Text, TextInput } from '@mantine/core';
import type { InformeGenerationReport } from '../types';
import classes from '../InformeGenerationModal.module.css';

const inputClasses = {
  input: classes.formInput
};

export function InformeHeaderFields({
  report
}: {
  report: InformeGenerationReport;
}) {
  const { form } = report;

  return (
    <>
      <div className={classes.sectionLabel}>Encabezado del informe</div>
      <div className={classes.sectionBox}>
        <div>
          <Text className={classes.fieldLabel}>Título</Text>
          <TextInput
            value={form.titulo}
            onChange={(event) =>
              report.updateFormField('titulo', event.currentTarget.value)
            }
            classNames={inputClasses}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <Text className={classes.fieldLabel}>Destinatario</Text>
          <TextInput
            value={form.destinatario}
            onChange={(event) =>
              report.updateFormField('destinatario', event.currentTarget.value)
            }
            placeholder="Ej: CRA. MARCELA FIGUEROA"
            classNames={inputClasses}
          />
        </div>
      </div>
    </>
  );
}
