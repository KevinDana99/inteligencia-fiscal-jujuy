import { getExplorerRegisterCatalogAction } from './data/actions';
import { ExplorerRegisterPage } from './presentation/components/ExplorerRegisterPage';

export default async function ExplorerRegisterModule() {
  const catalogResult = await getExplorerRegisterCatalogAction();

  return (
    <ExplorerRegisterPage
      catalog={catalogResult.data}
      catalogError={catalogResult.error}
    />
  );
}
