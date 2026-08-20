export interface RegulatoryProfile {
  countryCode: string;
  countryName: string;
  licenseLabel: string; // Ej: "Matrícula N°" o "Registro Profesional"
  taxIdLabel: string;   // Ej: "CUIT" (Argentina) vs "RUT" (Chile), etc.
  requiresBatchOnVaccines: boolean;
}

export const REGULATORY_PROFILES: Record<string, RegulatoryProfile> = {
  AR: {
    countryCode: 'AR',
    countryName: 'Argentina',
    licenseLabel: 'Matrícula Provincial / Nacional N°',
    taxIdLabel: 'CUIT',
    requiresBatchOnVaccines: false, // Para la Fase 0 MVP
  },
  // A futuro, cuando expongas a otros países, solo agregas la clave aquí:
  // CL: { countryCode: 'CL', countryName: 'Chile', licenseLabel: 'Registro Colegiado', taxIdLabel: 'RUT', requiresBatchOnVaccines: true }
};

export function getRegulatoryProfile(countryCode: string = 'AR'): RegulatoryProfile {
  return REGULATORY_PROFILES[countryCode] || REGULATORY_PROFILES['AR'];
}