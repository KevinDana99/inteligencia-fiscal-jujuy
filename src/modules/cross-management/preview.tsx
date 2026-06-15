import { Suspense } from "react";
import { getCrossPreviewAction } from "./data/actions";
import { CrossPreviewPage } from "./presentation/components/CrossPreviewPage";
import { CrossPreviewPageLoader } from "./presentation/components/CrossPreviewPage/CrossPreviewPageLoader";

interface CrossPreviewModuleProps {
  params: Promise<{ crossId: string }>;
}

export default function CrossPreviewModule({
  params,
}: CrossPreviewModuleProps) {
  return <CrossPreviewModuleContent params={params} />;
}

async function CrossPreviewModuleContent({ params }: CrossPreviewModuleProps) {
  const { crossId } = await params;
  const result = await getCrossPreviewAction(crossId);

  return <CrossPreviewPage cross={result.data} error={result.error} />;
}
