export type ApiAdminUserDto = {
  usuarioId: string;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  activo: boolean;
  esSuperAdministrador: boolean;
};

export type ApiListAdminUsersResponseDto = {
  resumen: {
    cantidadUsuariosActivos: number;
  };
  usuarios: ApiAdminUserDto[];
};

export type ApiGetAdminUserResponseDto = ApiAdminUserDto;

export type ApiCreateAdminUserRequestDto = {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  contrasena: string;
};

export type ApiCreateAdminUserResponseDto = ApiAdminUserDto;

export type ApiUpdateAdminUserRequestDto = {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  nuevaContrasena?: string | null;
  confirmarContrasena?: string | null;
};

export type ApiErrorResponseDto = {
  codigo: string;
  mensaje: string;
  estado: number;
};
