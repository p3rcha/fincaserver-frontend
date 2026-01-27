import { apiClient } from './client';
import { getDeviceFingerprint } from '../utils/deviceFingerprint';
import type { EleccionFormData, EleccionResponse } from '../types/Elecciones';

/**
 * Submit election form data
 * Files are sent as FormData to the backend
 */
export const submitEleccion = async (formData: EleccionFormData): Promise<EleccionResponse> => {
  const data = new FormData();
  
  data.append('mcName', formData.mcName);
  data.append('nombrePartido', formData.nombrePartido);
  
  // Add device fingerprint for rate limiting
  const deviceFingerprint = await getDeviceFingerprint();
  data.append('deviceFingerprint', deviceFingerprint);
  
  if (formData.bandera) {
    data.append('bandera', formData.bandera);
  }
  
  if (formData.comentarios) {
    data.append('comentarios', formData.comentarios);
  }
  
  if (formData.attachment) {
    data.append('attachment', formData.attachment);
  }

  const response = await apiClient.post<EleccionResponse>('/elecciones', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
