import type { UserRole } from '@/constants';

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
  tipoUsuario?: UserRole | null;
  tipo_usuario?: UserRole | null;
};

export type ApiIamRefreshSessionRequestDto = {
  refrescarToken: string;
};

export type ApiIamSignOutRequestDto = {
  refrescarToken: string;
};
