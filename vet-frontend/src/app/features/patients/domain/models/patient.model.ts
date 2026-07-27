export class Patient {
  constructor(
    private readonly id: string,
    private name: string,
    private species: string,
    private breed: string,
    private birthDate: Date,
    private ownerId: string,
    private readonly orgId: string,
    private bloodType: string = 'Desconocido',
    private isNeutered: boolean = false,
    private chronicAllergies: string[] = [],
    private photoUrl?: string | null,

    private weightKg?: number,
    private lastWeightDate?: Date,
    private ownerName?: string,
    private ownerPhone?: string
  ) {}

  // ==========================================
  // Getters obligatorios para lectura (UI / Mappers)
  // ==========================================
  public getId(): string { return this.id; }
  public getName(): string { return this.name; }
  public getSpecies(): string { return this.species; }
  public getBreed(): string { return this.breed; }
  public getBirthDate(): Date { return this.birthDate; }
  public getOwnerId(): string { return this.ownerId; }
  public getOrgId(): string { return this.orgId; }
  public getBloodType(): string { return this.bloodType; }
  public getIsNeutered(): boolean { return this.isNeutered; }
  public getChronicAllergies(): string[] { return this.chronicAllergies; }
  public getPhotoUrl(): string | null { return this.photoUrl ?? null; }

  public getWeight(): number | null { return this.weightKg ?? null; }
  public getLastWeightDate(): Date | null { return this.lastWeightDate ?? null; }
  public getOwnerName(): string | null { return this.ownerName ?? null; }
  public getOwnerPhone(): string | null { return this.ownerPhone ?? null; }

  // ==========================================
  // Métodos de Comportamiento y Reglas de Negocio
  // ==========================================
  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('El nombre del paciente no puede estar vacío.');
    }
    this.name = newName;
  }

  public updateSpecies(newSpecies: string): void {
    if (!newSpecies || newSpecies.trim().length === 0) {
      throw new Error('La especie del paciente no puede estar vacía.');
    }
    this.species = newSpecies;
  }

  public updateBreed(newBreed: string): void {
    if (!newBreed || newBreed.trim().length === 0) {
      throw new Error('La raza del paciente no puede estar vacía.');
    }
    this.breed = newBreed;
  }

  public updateBirthDate(newBirthDate: Date): void {
    if (newBirthDate > new Date()) {
      throw new Error('La fecha de nacimiento no puede ser una fecha futura.');
    }
    this.birthDate = newBirthDate;
  }

  public updatePhotoUrl(newPhotoUrl?: string | null): void {
    if (newPhotoUrl && newPhotoUrl.trim().length === 0) {
      this.photoUrl = null;
      return;
    }
    this.photoUrl = newPhotoUrl ?? null;
  }

  public transferOwnership(newOwnerId: string): void {
    if (!newOwnerId) {
      throw new Error('El ID del nuevo dueño es obligatorio.');
    }
    if (this.ownerId === newOwnerId) {
      throw new Error('El paciente ya pertenece a este dueño.');
    }
    this.ownerId = newOwnerId;
  }

  public registrarCastracion(): void {
    if (this.isNeutered) {
      throw new Error('El paciente ya está marcado como castrado.');
    }
    this.isNeutered = true;
  }

  public actualizarTipoSangre(nuevoTipo: string): void {
    this.bloodType = nuevoTipo;
  }

  public agregarAlergia(alergia: string): void {
    if (!alergia || alergia.trim().length === 0) return;
    if (!this.chronicAllergies.includes(alergia)) {
      this.chronicAllergies.push(alergia);
    }
  }

  public registrarPesaje(nuevoPeso: number): void {
    if (nuevoPeso <= 0) {
      throw new Error('El peso debe ser mayor a cero.');
    }
    this.weightKg = nuevoPeso;
    this.lastWeightDate = new Date();
  }
  
}