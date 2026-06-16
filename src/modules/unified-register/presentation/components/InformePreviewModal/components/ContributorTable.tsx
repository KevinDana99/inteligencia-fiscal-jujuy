import type { InformePreviewPayload } from '../types';
import classes from '../InformePreviewModal.module.css';

function formatBoolean(value: boolean) {
  return value ? 'SI' : 'NO';
}

export function ContributorTable({
  contributor
}: {
  contributor: InformePreviewPayload['datosContribuyente'];
}) {
  return (
    <table className={classes.table}>
      <tbody>
        <tr>
          <td className={classes.labelCell}>Denominación/Razón Social</td>
          <td colSpan={3}>{contributor.razonSocial}</td>
        </tr>
        <tr>
          <td className={classes.labelCell}>C.U.I.T. Nº</td>
          <td>{contributor.cuit}</td>
          <td className={classes.labelCell}>Riesgo Fiscal</td>
          <td className={classes.riskCell}>{contributor.riesgoFiscal}</td>
        </tr>
        <tr>
          <td className={classes.labelCell}>Domicilio Fiscal DPR</td>
          <td colSpan={3}>{contributor.domicilioFiscal}</td>
        </tr>
        <tr>
          <td className={classes.labelCell}>Domicilio Fiscal Electrónico</td>
          <td>{formatBoolean(contributor.domicilioFiscalElectronico)}</td>
          <td className={classes.labelCell}>Email Informado</td>
          <td>{contributor.emailInformado}</td>
        </tr>
        <tr>
          <td className={classes.labelCell}>Actividades Declaradas</td>
          <td colSpan={3}>{contributor.actividadesDeclaradas.join(' / ')}</td>
        </tr>
      </tbody>
    </table>
  );
}
