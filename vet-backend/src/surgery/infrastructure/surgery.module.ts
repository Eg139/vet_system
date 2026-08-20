import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * =========================================================================
 * MÓDULO DE CIRUGÍA (SurgeryModule)
 * =========================================================================
 * Propósito y alcance:
 * Este submódulo gestiona de manera integral todo el ciclo de vida de las 
 * intervenciones quirúrgicas y procedimientos de quirófano en el sistema veterinario,
 * implementando los principios de Arquitectura Hexagonal y Domain-Driven Design (DDD).
 * 
 * Fases principales que abarca:
 * 1. Prequirúrgica: Programación de cirugías, evaluación de riesgo anestésico (ASA) 
 *    y revisión de estudios previos (Laboratorio e Imaging).
 * 2. Intraquirúrgica: Registro de hoja de anestesia, monitoreo transoperatorio de 
 *    signos vitales y control de fármacos aplicados.
 * 3. Postquirúrgica: Evolución en recuperación, indicaciones postoperatorias para 
 *    el tutor y vinculación directa con recetas/tratamientos médicos.
 * 
 * Integraciones clave:
 * - Exporta casos de uso de lectura para alimentar la línea de tiempo (Timeline) 
 *   en el módulo de Historia Clínica (`MedicalHistoryModule`).
 * =========================================================================
 */
@Module({
  imports: [
    /* 
     * TODO: Registrar las entidades ORM de TypeORM para este módulo.
     * Ejemplo: TypeOrmModule.forFeature([SurgeryTypeOrmEntity])
     */
  ],
  controllers: [
    /* 
     * TODO: Registrar el controlador HTTP encargado de exponer los endpoints 
     * de gestión quirúrgica hacia el Frontend.
     */
  ],
  providers: [
    /* 
     * TODO: Registrar los Casos de Uso de la capa de aplicación 
     * (Ej: ScheduleSurgeryUseCase, CompleteSurgeryUseCase, GetPatientSurgeriesUseCase).
     * 
     * TODO: Vincular el puerto del dominio con su adaptador de infraestructura:
     * {
     *   provide: SURGERY_REPOSITORY_TOKEN,
     *   useClass: SurgeryRepository,
     * },
     */
  ],
  exports: [
    /* 
     * TODO: Exportar los casos de uso necesarios para que otros módulos 
     * (como MedicalHistoryModule) puedan consultar las cirugías del paciente.
     * Ejemplo: GetPatientSurgeriesUseCase
     */
  ],
})
export class SurgeryModule {}