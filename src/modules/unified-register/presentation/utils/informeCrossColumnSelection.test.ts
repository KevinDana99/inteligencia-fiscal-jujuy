import { INFORME_CROSS_OPTIONS } from '../constants/informeGeneration';
import {
  applyInformeCrossColumnSelections,
  getAvailableInformeCrossColumns,
  getInformeCrossColumnsByKeys
} from './informeCrossColumnSelection';

describe('informeCrossColumnSelection', () => {
  const cross = INFORME_CROSS_OPTIONS[0];

  it('returns visible columns in selected key order', () => {
    const columns = getInformeCrossColumnsByKeys(cross, [
      'diferenciaBaseImponible',
      'baseImponibleIngresosBrutos'
    ]);

    expect(columns.map((column) => column.key)).toEqual([
      'diferenciaBaseImponible',
      'baseImponibleIngresosBrutos'
    ]);
  });

  it('returns available columns excluding selected keys', () => {
    const columns = getAvailableInformeCrossColumns(cross, [
      'baseImponibleIngresosBrutos'
    ]);

    expect(columns.map((column) => column.key)).toEqual([
      'baseImponibleInformadaPorTerceros',
      'diferenciaBaseImponible'
    ]);
  });

  it('applies selections by cross without clearing them when cross is unselected', () => {
    const selectedCrosses = applyInformeCrossColumnSelections(
      INFORME_CROSS_OPTIONS,
      {
        [cross.id]: ['diferenciaBaseImponible']
      }
    );

    expect(selectedCrosses[0].columnasSeleccionadas.claves).toEqual([
      'diferenciaBaseImponible'
    ]);
    expect(selectedCrosses[1].columnasSeleccionadas.claves).toEqual(
      INFORME_CROSS_OPTIONS[1].columnasSeleccionadas.claves
    );
  });
});
