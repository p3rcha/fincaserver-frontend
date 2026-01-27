export interface EleccionFormData {
  mcName: string;
  nombrePartido: string;
  bandera: File | null;
  comentarios?: string;
  attachment?: File | null;
}

export interface EleccionSubmission {
  mcName: string;
  nombrePartido: string;
  banderaUrl: string;
  comentarios?: string;
  attachmentUrl?: string;
}

export interface EleccionResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    mcName: string;
    nombrePartido: string;
    banderaUrl: string;
    comentarios?: string;
    attachmentUrl?: string;
    createdAt: string;
  };
}
