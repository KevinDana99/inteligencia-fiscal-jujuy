export type ApiIamSignInRequestDto = {
  correo: string;
  contrasena: string;
};

export type ApiIamSessionResponseDto = {
  token: string;
  expiraEn: number;
  refrescarToken: string;
  refrescarTokenExpiraEn: number;
  usuario: {
    nombreUsuario: string;
    correo: string;
  };
};

export type ApiIamCurrentContextResponseDto = {
  autenticado: boolean;
  esquema: string | null;
  nombreUsuario: string | null;
  correo: string | null;
  sujeto: string | null;
  tipoUsuario: 'SUPER_ADMIN' | 'ANALISTA_FISCAL' | null;
};

export type ApiIamRefreshSessionRequestDto = {
  refrescarToken: string;
};

export type ApiIamSignOutRequestDto = {
  refrescarToken: string;
};
