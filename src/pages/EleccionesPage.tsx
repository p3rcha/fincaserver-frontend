import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import Aurora from '../components/backgrounds/Aurora';
import EleccionesError from '../components/EleccionesError';
import { submitEleccion } from '../api/eleccionesApi';
import type { EleccionFormData } from '../types/Elecciones';

const EleccionesPage = () => {
  const [formData, setFormData] = useState<EleccionFormData>({
    mcName: '',
    nombrePartido: '',
    bandera: null,
    comentarios: '',
    attachment: null,
  });

  const [banderaPreview, setBanderaPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof EleccionFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ 
    type: 'success' | 'error'; 
    message: string; 
    discordUrl?: string; 
    errorType?: string;
  } | null>(null);

  const banderaInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5MB

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EleccionFormData, string>> = {};

    if (!formData.mcName.trim()) {
      newErrors.mcName = 'El nombre de MC es requerido';
    }

    if (!formData.nombrePartido.trim()) {
      newErrors.nombrePartido = 'El nombre del partido es requerido';
    }

    if (!formData.bandera) {
      newErrors.bandera = 'La bandera es requerida';
    } else {
      if (!formData.bandera.type.startsWith('image/')) {
        newErrors.bandera = 'La bandera debe ser una imagen';
      }
      // Validate bandera file size (5MB max)
      if (formData.bandera.size > MAX_ATTACHMENT_SIZE) {
        newErrors.bandera = `La bandera no puede exceder ${MAX_ATTACHMENT_SIZE / (1024 * 1024)}MB`;
      }
    }

    if (formData.attachment) {
      if (formData.attachment.size > MAX_ATTACHMENT_SIZE) {
        newErrors.attachment = `El archivo adjunto no puede exceder ${MAX_ATTACHMENT_SIZE / (1024 * 1024)}MB`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof EleccionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setSubmitStatus(null);
  };

  const handleBanderaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, bandera: 'La bandera debe ser una imagen' }));
        return;
      }

      setFormData((prev) => ({ ...prev, bandera: file }));
      setErrors((prev) => ({ ...prev, bandera: undefined }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanderaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSubmitStatus(null);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_ATTACHMENT_SIZE) {
        setErrors((prev) => ({
          ...prev,
          attachment: `El archivo adjunto no puede exceder ${MAX_ATTACHMENT_SIZE / (1024 * 1024)}MB`,
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, attachment: file }));
      setErrors((prev) => ({ ...prev, attachment: undefined }));
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await submitEleccion(formData);

      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: '¡Elección enviada exitosamente!',
        });

        // Reset form
        setFormData({
          mcName: '',
          nombrePartido: '',
          bandera: null,
          comentarios: '',
          attachment: null,
        });
        setBanderaPreview(null);
        if (banderaInputRef.current) banderaInputRef.current.value = '';
        if (attachmentInputRef.current) attachmentInputRef.current.value = '';
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.message || 'Error al enviar la elección',
        });
      }
    } catch (error: any) {
      console.error('Error submitting eleccion:', error);
      
      // Extract error message from axios error response
      let errorMessage = 'Error al enviar la elección. Por favor, intenta de nuevo.';
      let discordUrl: string | undefined;
      let errorType: string | undefined;
      
      if (error?.response?.data) {
        errorMessage = error.response.data.error || errorMessage;
        discordUrl = error.response.data.discordUrl;
        errorType = error.response.data.type;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage,
        discordUrl,
        errorType,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-jungle-dark pt-24 pb-16 relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Aurora
          colorStops={['#fd3535', '#ffffff', '#0053fa']}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Elecciones
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Postúlate como candidato para las elecciones del servidor
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-jungle-medium/90 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8 lg:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* MC Name */}
            <div>
              <label htmlFor="mcName" className="block text-sm font-medium text-white/90 mb-2">
                Nombre de MC <span className="text-tropical-emerald">*</span>
              </label>
              <input
                type="text"
                id="mcName"
                value={formData.mcName}
                onChange={(e) => handleInputChange('mcName', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                  errors.mcName
                    ? 'border-cr-red focus:border-cr-red focus:ring-cr-red'
                    : 'border-white/10 focus:border-tropical-emerald focus:ring-tropical-emerald'
                } text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Ingresa tu nombre de Minecraft"
              />
              {errors.mcName && (
                <p className="mt-1 text-sm text-cr-red">{errors.mcName}</p>
              )}
            </div>

            {/* Nombre del Partido */}
            <div>
              <label htmlFor="nombrePartido" className="block text-sm font-medium text-white/90 mb-2">
                Nombre del Partido <span className="text-tropical-emerald">*</span>
              </label>
              <input
                type="text"
                id="nombrePartido"
                value={formData.nombrePartido}
                onChange={(e) => handleInputChange('nombrePartido', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                  errors.nombrePartido
                    ? 'border-cr-red focus:border-cr-red focus:ring-cr-red'
                    : 'border-white/10 focus:border-tropical-emerald focus:ring-tropical-emerald'
                } text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Ingresa el nombre de tu partido"
              />
              {errors.nombrePartido && (
                <p className="mt-1 text-sm text-cr-red">{errors.nombrePartido}</p>
              )}
            </div>

            {/* Bandera */}
            <div>
              <label htmlFor="bandera" className="block text-sm font-medium text-white/90 mb-2">
                Bandera <span className="text-tropical-emerald">*</span>
              </label>
              <input
                ref={banderaInputRef}
                type="file"
                id="bandera"
                accept="image/*"
                onChange={handleBanderaChange}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                  errors.bandera
                    ? 'border-cr-red focus:border-cr-red focus:ring-cr-red'
                    : 'border-white/10 focus:border-tropical-emerald focus:ring-tropical-emerald'
                } text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-tropical-emerald file:text-white hover:file:bg-tropical-green focus:outline-none focus:ring-2 transition-colors`}
              />
              {errors.bandera && (
                <p className="mt-1 text-sm text-cr-red">{errors.bandera}</p>
              )}
              {banderaPreview && (
                <div className="mt-4">
                  <p className="text-sm text-white/70 mb-2">Vista previa:</p>
                  <img
                    src={banderaPreview}
                    alt="Vista previa de la bandera"
                    className="max-w-xs rounded-lg border border-white/10"
                  />
                </div>
              )}
            </div>

            {/* Comentarios */}
            <div>
              <label htmlFor="comentarios" className="block text-sm font-medium text-white/90 mb-2">
                Comentarios Adicionales
              </label>
              <textarea
                id="comentarios"
                value={formData.comentarios}
                onChange={(e) => handleInputChange('comentarios', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-tropical-emerald focus:ring-tropical-emerald text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-colors resize-none"
                placeholder="Agrega cualquier comentario adicional (opcional)"
              />
            </div>

            {/* Attachment */}
            <div>
              <label htmlFor="attachment" className="block text-sm font-medium text-white/90 mb-2">
                Adjunto Adicional <span className="text-white/60 text-xs">(máx. 5MB)</span>
              </label>
              <input
                ref={attachmentInputRef}
                type="file"
                id="attachment"
                onChange={handleAttachmentChange}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                  errors.attachment
                    ? 'border-cr-red focus:border-cr-red focus:ring-cr-red'
                    : 'border-white/10 focus:border-tropical-emerald focus:ring-tropical-emerald'
                } text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-tropical-emerald file:text-white hover:file:bg-tropical-green focus:outline-none focus:ring-2 transition-colors`}
              />
              {errors.attachment && (
                <p className="mt-1 text-sm text-cr-red">{errors.attachment}</p>
              )}
              {formData.attachment && (
                <p className="mt-2 text-sm text-white/70">
                  Archivo seleccionado: {formData.attachment.name} ({(formData.attachment.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {/* Submit Status */}
            {submitStatus && (
              <>
                {submitStatus.type === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-tropical-green/20 border border-tropical-green text-tropical-emerald"
                  >
                    <p className="text-sm font-medium">{submitStatus.message}</p>
                  </motion.div>
                ) : (
                  <EleccionesError
                    message={submitStatus.message}
                    discordUrl={submitStatus.discordUrl}
                    type={submitStatus.errorType}
                  />
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                isSubmitting
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-tropical-green to-tropical-emerald hover:from-tropical-green-dark hover:to-tropical-green shadow-lg shadow-tropical-emerald/30 hover:shadow-tropical-emerald/50'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Postulación'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EleccionesPage;
