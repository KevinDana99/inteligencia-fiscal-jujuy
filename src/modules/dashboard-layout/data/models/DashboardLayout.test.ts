import { DASHBOARD_SECTIONS } from '../../constants'
import { getDashboardSectionFromPathname } from './DashboardLayout'

describe('getDashboardSectionFromPathname', () => {
  it('marks cross preview detail routes as Gestion de Cruces', () => {
    expect(
      getDashboardSectionFromPathname(
        '/gestion-de-cruces/vista-previa-cruce/92'
      )
    ).toBe(DASHBOARD_SECTIONS.GESTION_DE_CRUCES)
  })
})
