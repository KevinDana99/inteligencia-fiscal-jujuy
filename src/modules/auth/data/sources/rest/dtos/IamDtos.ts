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

export type ApiIamRefreshSessionRequestDto = {
  refrescarToken: string;
};

export type ApiIamSignOutRequestDto = {
  refrescarToken: string;
};
