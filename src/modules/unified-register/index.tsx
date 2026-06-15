import { Suspense } from "react";
import { getUnifiedRegisterListAction } from "./data/actions";
import { UnifiedRegisterPage } from "./presentation/components/UnifiedRegisterPage";
import { ModalLoader } from "@/components/core/ModalLoader";

export default async function UnifiedRegisterModule() {
  const result = await getUnifiedRegisterListAction();

  return (
    <Suspense
      fallback={<ModalLoader message="Cargando contribuyentes..." opened />}
    >
      <UnifiedRegisterPage initialData={result.data} />
    </Suspense>
  );
}
