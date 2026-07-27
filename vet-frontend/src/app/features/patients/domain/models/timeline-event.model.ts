export type TimelineEventType = 'consultation' | 'vaccine' | 'surgery' | 'weight_record';

export class TimelineEvent {
  constructor(
    private id: string,
    private petId: string,
    private date: Date,
    private type: TimelineEventType,
    private title: string,
    private description: string,
    private veterinarian: string
  ) {}

  getId(): string { return this.id; }
  getPetId(): string { return this.petId; }
  getDate(): Date { return this.date; }
  getType(): TimelineEventType { return this.type; }
  getTitle(): string { return this.title; }
  getDescription(): string { return this.description; }
  getVeterinarian(): string { return this.veterinarian; }

  // Método auxiliar para obtener colores/iconos según el tipo de evento
  getBadgeConfig(): { label: string; colorClass: string; dotClass: string; icon: string } {
    switch (this.type) {
      case 'consultation':
        return { label: 'Consulta Médica (SOAP)', colorClass: 'text-blue-400', dotClass: 'bg-blue-500', icon: '🩺' };
      case 'vaccine':
        return { label: 'Vacunación / Preventivo', colorClass: 'text-emerald-400', dotClass: 'bg-emerald-500', icon: '💉' };
      case 'surgery':
        return { label: 'Cirugía / Procedimiento', colorClass: 'text-purple-400', dotClass: 'bg-purple-500', icon: '⚡' };
      case 'weight_record':
        return { label: 'Registro de Peso', colorClass: 'text-amber-400', dotClass: 'bg-amber-500', icon: '⚖️' };
      default:
        return { label: 'Evento Clínico', colorClass: 'text-slate-400', dotClass: 'bg-slate-500', icon: '📌' };
    }
  }
}