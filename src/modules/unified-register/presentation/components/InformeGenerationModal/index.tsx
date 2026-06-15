'use client';

import { Button, Checkbox, Modal, Text, TextInput } from '@mantine/core';
import { IconArrowRight, IconLock, IconX } from '@tabler/icons-react';
import type { UseInformeGenerationReturn } from '../../hooks/useInformeGeneration';
import classes from './InformeGenerationModal.module.css';

const inputClasses = {
  input: classes.formInput
};

const crossCheckboxClasses = {
  root: classes.crossRow,
  body: classes.crossBody,
  input: classes.crossInput,
  label: classes.crossTitle,
  description: classes.crossDescription
};

function ReadonlyField({
  label,
  value,
  strong,
  risk
}: {
  label: string;
  value: string;
  strong?: boolean;
  risk?: boolean;
}) {
  return (
    <div>
      <span className={classes.readonlyLabel}>{label}</span>
      <div
        className={`${classes.readonlyValue} ${strong ? classes.readonlyValueStrong : ''} ${
          risk ? classes.riskValue : ''
        }`}
      >
        {value || '-'}
      </div>
    </div>
  );
}

export function InformeGenerationModal({
  opened,
  report,
  onClose
}: {
  opened: boolean;
  report: UseInformeGenerationReturn;
  onClose: () => void;
}) {
  const { form, contributorData } = report;
  const actionData = form.datosAccionFiscalizadora;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered={false}
      size={680}
      zIndex={900}
      classNames={{
        overlay: classes.overlay,
        inner: classes.inner,
        content: classes.content,
        body: classes.body
      }}
    >
      <div className={classes.header}>
        <div>
          <Text className={classes.title}>Generar Informe</Text>
          <Text className={classes.subtitle}>
            Completá los datos y elegí los cruces a incluir
          </Text>
        </div>
        <button type="button" className={classes.closeButton} onClick={onClose}>
          <IconX size={18} />
        </button>
      </div>

      <div className={classes.sectionLabel}>Encabezado del informe</div>
      <div className={classes.sectionBox}>
        <div>
          <Text className={classes.fieldLabel}>Título</Text>
          <TextInput
            value={form.titulo}
            onChange={(event) => report.updateFormField('titulo', event.currentTarget.value)}
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

      <div className={classes.sectionLabel}>1) Datos del contribuyente</div>
      <div className={classes.readonlyBox}>
        <div className={classes.readonlyGrid}>
          <ReadonlyField
            label="Denominación/Razón Social"
            value={contributorData.razonSocial}
            strong
          />
          <ReadonlyField label="C.U.I.T. Nº" value={contributorData.cuit} strong />
          <ReadonlyField
            label="Domicilio Fiscal DPR"
            value={contributorData.domicilioFiscal}
          />
          <ReadonlyField
            label="Riesgo Fiscal"
            value={contributorData.riesgoFiscal}
            risk
          />
          <ReadonlyField
            label="Domicilio Electrónico"
            value={contributorData.domicilioFiscalElectronico ? 'SI' : 'NO'}
          />
          <ReadonlyField
            label="Email Informado"
            value={contributorData.emailInformado}
          />
          <div className={classes.fullSpan}>
            <ReadonlyField
              label="Actividades Declaradas"
              value={contributorData.actividadesDeclaradas.join(' · ')}
            />
          </div>
        </div>
        <div className={classes.readonlyNote}>
          <IconLock size={11} />
          Datos traídos automáticamente del sistema. Solo lectura.
        </div>
      </div>

      <div className={classes.sectionLabel}>2) Datos de la acción fiscalizadora</div>
      <div className={classes.sectionBox}>
        <div className={classes.formGrid}>
          <div>
            <Text className={classes.fieldLabel}>Origen del Pedido</Text>
            <TextInput
              value={actionData.origenPedido}
              onChange={(event) =>
                report.updateFiscalActionField('origenPedido', event.currentTarget.value)
              }
              classNames={inputClasses}
            />
          </div>
          <div>
            <Text className={classes.fieldLabel}>Impuesto/s a Verificar</Text>
            <TextInput
              value={actionData.impuestosAVerificar}
              onChange={(event) =>
                report.updateFiscalActionField(
                  'impuestosAVerificar',
                  event.currentTarget.value
                )
              }
              classNames={inputClasses}
            />
          </div>
          <div>
            <Text className={classes.fieldLabel}>Periodos</Text>
            <TextInput
              value={actionData.periodo}
              onChange={(event) =>
                report.updateFiscalActionField('periodo', event.currentTarget.value)
              }
              placeholder="Ej: 01/2025 a 03/2026"
              classNames={inputClasses}
            />
          </div>
          <div>
            <Text className={classes.fieldLabel}>Origen de la O.I.</Text>
            <TextInput
              value={actionData.origenOI}
              onChange={(event) =>
                report.updateFiscalActionField('origenOI', event.currentTarget.value)
              }
              placeholder="Ej: DIV. INVESTIGACIONES"
              classNames={inputClasses}
            />
          </div>
          <div>
            <Text className={classes.fieldLabel}>Programa</Text>
            <TextInput
              value={actionData.programa}
              onChange={(event) =>
                report.updateFiscalActionField('programa', event.currentTarget.value)
              }
              placeholder="Ej: CRUCE DE B.I."
              classNames={inputClasses}
            />
          </div>
          <div>
            <Text className={classes.fieldLabel}>Tipo de Instrucción</Text>
            <TextInput
              value={actionData.tipoInstruccion}
              onChange={(event) =>
                report.updateFiscalActionField(
                  'tipoInstruccion',
                  event.currentTarget.value
                )
              }
              placeholder="Ej: INTEGRAL"
              classNames={inputClasses}
            />
          </div>
          <div>
            <Text className={classes.fieldLabel}>Impuesto Neto</Text>
            <TextInput
              value={actionData.impuestoNeto}
              onChange={(event) =>
                report.updateFiscalActionField('impuestoNeto', event.currentTarget.value)
              }
              placeholder="Ej: $ 11.768.706"
              classNames={inputClasses}
            />
          </div>
        </div>
      </div>

      <div className={classes.sectionLabel}>3) Inconsistencias detectadas — Cruces</div>
      <div className={classes.crossesBox}>
        {report.isLoadingCrosses ? (
          <Text className={classes.crossStateText}>Cargando cruces...</Text>
        ) : null}

        {!report.isLoadingCrosses && report.crossesError ? (
          <Text className={classes.crossStateText}>{report.crossesError}</Text>
        ) : null}

        {!report.isLoadingCrosses &&
        !report.crossesError &&
        report.availableCrosses.length === 0 ? (
          <Text className={classes.crossStateText}>
            No se encontraron cruces asociados
          </Text>
        ) : null}

        {!report.isLoadingCrosses
          ? report.availableCrosses.map((cross) => (
              <Checkbox
                key={cross.id}
                checked={report.selectedCrossIds.includes(cross.id)}
                onChange={() => report.toggleCross(cross.id)}
                label={cross.nombre}
                description={cross.description}
                color="blue"
                size="sm"
                disabled={cross.isReportReady === false}
                classNames={crossCheckboxClasses}
              />
            ))
          : null}
      </div>

      {report.generationError ? (
        <Text className={classes.errorText}>{report.generationError}</Text>
      ) : null}

      <div className={classes.footer}>
        <div className={classes.footerActions}>
          <Button
            variant="default"
            className={classes.ghostButton}
            onClick={onClose}
            disabled={report.isGenerating}
          >
            Cancelar
          </Button>
          <Button
            className={classes.primaryButton}
            rightSection={<IconArrowRight size={14} />}
            onClick={report.generateDocuments}
            disabled={!report.canGenerate}
            loading={report.isGenerating}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </Modal>
  );
}
