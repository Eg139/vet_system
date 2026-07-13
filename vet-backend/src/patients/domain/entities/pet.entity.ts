export class Pet {
  constructor(
    private readonly id: string,
    private name: string,
    private species: string,
    private breed: string,
    private birthDate: Date,
    private ownerId: string,
    private readonly orgId: string,
    
    // Campos del perfil biológico permanente
    private bloodType: string = 'Desconocido', 
    private isNeutered: boolean = false,
    private chronicAllergies: string[] = [],
  ) {}

  // ==========================================
  // Getters obligatorios para el PetMapper e IU
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

  // ==========================================
  // Métodos semánticos de negocio (Comportamiento)
  // ==========================================
  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('El nombre de la mascota no puede estar vacío.');
    }
    this.name = newName;
  }

  public updateSpecies(newSpecies: string): void {
    if (!newSpecies || newSpecies.trim().length === 0) {
      throw new Error('La especie de la mascota no puede estar vacía.');
    }
    this.species = newSpecies;
  }

  public updateBreed(newBreed: string): void {
    if (!newBreed || newBreed.trim().length === 0) {
      throw new Error('La raza de la mascota no puede estar vacía.');
    }
    this.breed = newBreed;
  }

  public updateBirthDate(newBirthDate: Date): void {
    if (newBirthDate > new Date()) {
      throw new Error('La fecha de nacimiento no puede ser una fecha futura.');
    }
    this.birthDate = newBirthDate;
  }

  public transferOwnership(newOwnerId: string): void {
    if (!newOwnerId) {
      throw new Error('El ID del nuevo dueño es obligatorio.');
    }
    if (this.ownerId === newOwnerId) {
      throw new Error('La mascota ya pertenece a este dueño.');
    }
    this.ownerId = newOwnerId;
  }

  public registrarCastracion(): void {
    if (this.isNeutered) {
      throw new Error('La mascota ya está marcada como castrada.');
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
}