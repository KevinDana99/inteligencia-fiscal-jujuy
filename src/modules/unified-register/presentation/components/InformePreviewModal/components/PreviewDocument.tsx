import Image from 'next/image';
import { INFORME_INTRO_TEXT } from '../../../constants/informeGeneration';
import type { InformePreviewPayload, InformePreviewReport } from '../types';
import classes from '../InformePreviewModal.module.css';
import { ContributorTable } from './ContributorTable';
import { CrossesPreviewSection } from './CrossesPreviewSection';
import { FiscalActionTable } from './FiscalActionTable';

export function PreviewDocument({
  payload,
  report
}: {
  payload: InformePreviewPayload;
  report: InformePreviewReport;
}) {
  return (
    <div className={classes.documentStage}>
      <div className={classes.paper}>
        <Image
          src="/assets/branding/logo.svg"
          alt="Dirección Provincial de Rentas"
          width={160}
          height={38}
          className={classes.logo}
        />
        <div className={classes.documentTitle}>{payload.titulo}</div>
        <div className={classes.introText}>{INFORME_INTRO_TEXT}</div>
        <div className={classes.sectionTitle}>1)&nbsp;&nbsp;&nbsp;CONTRIBUYENTE</div>
        <ContributorTable contributor={payload.datosContribuyente} />
        <div className={classes.sectionTitle}>
          2)&nbsp;&nbsp;&nbsp;DATOS DE LA ACCIÓN FISCALIZADORA
        </div>
        <FiscalActionTable actionData={payload.datosAccionFiscalizadora} />
        <CrossesPreviewSection selectedCrosses={report.selectedCrosses} />
        <div className={classes.stamp}>DPR Jujuy</div>
      </div>
    </div>
  );
}
