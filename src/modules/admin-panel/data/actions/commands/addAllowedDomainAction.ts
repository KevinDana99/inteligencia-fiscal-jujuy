"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_PANEL_ROUTES } from "@/constants";
import { createServerAdminPanelSource } from "../../data-access";
import type { IAdminPanelActionState } from "../../models/AdminPanel";

const DOMAIN_PATTERN =
  /^(?:[a-z0-9._%+-]+@)?[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

function buildErrorState(
  message: string,
  code: string,
  statusCode: number
): IAdminPanelActionState<null> {
  return {
    success: false,
    message,
    errors: {
      code,
      message,
      statusCode,
    },
    data: null,
  };
}

function normalizeAllowedDomain(value: string) {
  return value.trim().toLowerCase().replace(/^@/, "");
}

function logAddAllowedDomainAction(params: {
  request: { dominio: string };
  response: {
    success: boolean;
    status: number;
    code: string;
    error: string | null;
  };
}) {
  console.log({
    endpoint: "/api/super-administrador/dominios-permitidos",
    action: "addAllowedDomainAction",
    METHOD: "POST",
    REQUEST: params.request,
    RESPONSE: {
      ...params.response,
      data: null,
    },
  });
}

export async function addAllowedDomainAction(
  _previousState: IAdminPanelActionState<null>,
  formData: FormData
): Promise<IAdminPanelActionState<null>> {
  const normalizedDomain = normalizeAllowedDomain(
    String(formData.get("dominio") ?? "")
  );
  const requestPayload = {
    dominio: normalizedDomain,
  };

  if (!normalizedDomain) {
    logAddAllowedDomainAction({
      request: requestPayload,
      response: {
        success: false,
        status: 400,
        code: "super_administrador.dominios_permitidos.agregar.dominio_requerido",
        error: "Ingresá un dominio antes de continuar.",
      },
    });

    return buildErrorState(
      "Ingresá un dominio antes de continuar.",
      "super_administrador.dominios_permitidos.agregar.dominio_requerido",
      400
    );
  }

  if (!DOMAIN_PATTERN.test(normalizedDomain)) {
    logAddAllowedDomainAction({
      request: requestPayload,
      response: {
        success: false,
        status: 400,
        code: "super_administrador.dominios_permitidos.agregar.dominio_invalido",
        error: "Ingresá un dominio válido, por ejemplo jujuy.gob.ar.",
      },
    });

    return buildErrorState(
      "Ingresá un dominio válido, por ejemplo jujuy.gob.ar.",
      "super_administrador.dominios_permitidos.agregar.dominio_invalido",
      400
    );
  }

  try {
    const source = await createServerAdminPanelSource();
    const currentDomains = await source.getAllowedDomains();
    const duplicatedDomain = currentDomains.some(
      (domain) => normalizeAllowedDomain(domain.domain) === normalizedDomain
    );

    if (duplicatedDomain) {
      logAddAllowedDomainAction({
        request: requestPayload,
        response: {
          success: false,
          status: 409,
          code: "super_administrador.dominios_permitidos.agregar.dominio_duplicado",
          error: "Ese dominio ya está incluido en la lista.",
        },
      });

      return buildErrorState(
        "Ese dominio ya está incluido en la lista.",
        "super_administrador.dominios_permitidos.agregar.dominio_duplicado",
        409
      );
    }

    const result = await source.addAllowedDomain(normalizedDomain);

    logAddAllowedDomainAction({
      request: requestPayload,
      response: {
        success: result.success,
        status: result.status ?? (result.success ? 200 : 500),
        code: result.code ?? "",
        error: result.error ?? null,
      },
    });

    if (!result.success) {
      return buildErrorState(
        result.error ?? "No fue posible agregar el dominio.",
        result.code ??
          "super_administrador.dominios_permitidos.agregar.error_desconocido",
        result.status ?? 500
      );
    }

    // revalidatePath(ADMIN_PANEL_ROUTES.settings)

    return {
      success: true,
      message: null,
      errors: null,
      data: null,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No fue posible agregar el dominio.";

    logAddAllowedDomainAction({
      request: requestPayload,
      response: {
        success: false,
        status: 500,
        code: "super_administrador.dominios_permitidos.agregar.error_interno",
        error: message,
      },
    });

    return buildErrorState(
      message,
      "super_administrador.dominios_permitidos.agregar.error_interno",
      500
    );
  }
}
