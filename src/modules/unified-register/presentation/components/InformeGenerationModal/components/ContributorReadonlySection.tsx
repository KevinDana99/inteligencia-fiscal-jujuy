import { IconLock } from '@tabler/icons-react';
import type { InformeGenerationReport } from '../types';
import classes from '../InformeGenerationModal.module.css';
import { ReadonlyField } from './ReadonlyField';

export function ContributorReadonlySection({
  report
}: {
  report: InformeGenerationReport;
}) {
  const { contributorData } = report;

  return (
    <>
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
    </>
  );
}
