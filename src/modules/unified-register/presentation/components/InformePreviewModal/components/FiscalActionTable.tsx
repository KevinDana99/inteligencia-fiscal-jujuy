import type { InformePreviewPayload } from '../types';
import classes from '../InformePreviewModal.module.css';

export function FiscalActionTable({
  actionData
}: {
  actionData: InformePreviewPayload['datosAccionFiscalizadora'];
}) {
  return (
    <table className={classes.table}>
      <tbody>
        <tr>
          <td className={classes.labelCell}>Origen del Pedido</td>
          <td colSpan={3}>{actionData.origenPedido}</td>
        </tr>
        <tr>
          <td className={classes.labelCell}>Impuesto/s a Verificar</td>
          <td>{actionData.impuestosAVerificar}</td>
          <td className={classes.labelCell}>Periodos</td>
          <td>{actionData.periodo ?? ''}</td>
        </tr>
        <tr>
          <td className={classes.labelCell}>Origen de la O.I.</td>
          <td colSpan={3}>{actionData.origenOI ?? ''}</td>
        </tr>
        <tr>
          <td className={classes.labelCell}>Programa</td>
          <td colSpan={3}>{actionData.programa ?? ''}</td>
        </tr>
        <tr>
          <td className={classes.labelCell}>Tipo de Instrucción</td>
          <td>{actionData.tipoInstruccion ?? ''}</td>
          <td className={classes.labelCell}>Impuesto Neto</td>
          <td>{actionData.impuestoNeto ?? ''}</td>
        </tr>
      </tbody>
    </table>
  );
}
