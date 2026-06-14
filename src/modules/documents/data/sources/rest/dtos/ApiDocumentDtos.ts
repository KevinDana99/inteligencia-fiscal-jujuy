export interface ApiGeneratedDocumentResponseDto {
  documentoId: string;
  urlDescarga: string;
}

export interface ApiDocumentErrorResponseDto {
  codigo?: string;
  mensaje?: string;
  estado?: number;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
}
