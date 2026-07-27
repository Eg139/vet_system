// src/patients/domain/entities/owner.entity.ts

export class Owner {
  constructor(
    private readonly id: string,
    private firstName: string,
    private lastName: string,
    private email: string,
    private readonly orgId: string,
    private phone?: string | null,
    private userId?: string | null,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {
    this.validateEmail(email);
  }

  // ==========================================
  // Getters
  // ==========================================
  public getId(): string { return this.id; }
  public getFirstName(): string { return this.firstName; }
  public getLastName(): string { return this.lastName; }
  public getFullName(): string { return `${this.firstName} ${this.lastName}`; }
  public getEmail(): string { return this.email; }
  public getPhone(): string | null { return this.phone ?? null; }
  public getUserId(): string | null { return this.userId ?? null; }
  public getOrgId(): string { return this.orgId; }
  public getCreatedAt(): Date | undefined { return this.createdAt; }
  public getUpdatedAt(): Date | undefined { return this.updatedAt; }

  // ==========================================
  // Métodos de Negocio (Información Físico/Clínica)
  // ==========================================
  public updateName(firstName: string, lastName: string): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío.');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('El apellido no puede estar vacío.');
    }
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
  }

  public updateContactInfo(email: string, phone?: string | null): void {
    this.validateEmail(email);
    this.email = email;
    this.phone = phone ?? null;
  }

  // ==========================================
  // Métodos de Negocio para Cuentas / App Angular
  // ==========================================

  /**
   * Consulta si el dueño ya tiene una cuenta activa para la app
   */
  public hasAppAccount(): boolean {
    return this.userId !== null && this.userId !== undefined;
  }

  /**
   * Vincula la cuenta creada cuando el dueño se registra en la app
   */
  public linkUserAccount(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new Error('El ID de usuario es obligatorio para vincular la cuenta.');
    }
    if (this.hasAppAccount()) {
      throw new Error('Este dueño ya tiene una cuenta de usuario vinculada.');
    }
    this.userId = userId;
  }

  /**
   * Desvincula la cuenta de usuario (ej. si el usuario elimina su cuenta de la app)
   */
  public unlinkUserAccount(): void {
    if (!this.hasAppAccount()) {
      throw new Error('El dueño no tiene ninguna cuenta de usuario vinculada.');
    }
    this.userId = null;
  }

  // ==========================================
  // Validaciones Internas de Dominio
  // ==========================================
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('El formato del correo electrónico es inválido.');
    }
  }
}