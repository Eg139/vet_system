import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * =========================================================================
 * MÓDULO DE LABORATORIO (LaboratoryModule)
 * =========================================================================
 * Propósito y alcance:
 * Este submódulo gestiona de manera integral el ciclo de vida de los análisis 
 * clínicos y estudios de laboratorio de los pacientes veterinarios, bajo los 
 * principios de Arquitectura Hexagonal y Domain-Driven Design (DDD).
 * 
 * Funcionalidades principales que abarcará:
 * 1. Órdenes de Laboratorio: Creación y solicitud de perfiles bioquímicos, 
 *    hemogramas, urocultivos, citologías, biopsias y anatomía patológica.
 * 2. Carga y Registro de Resultados: Registro de valores cuantitativos y 
 *    cualitativos, rangos de referencia y observaciones del bioquímico/veterinario.
 * 3. Dictamen y Validación: Aprobación y firma de informes de laboratorio.
 * 
 * Integraciones clave:
 * - Exporta casos de uso de lectura para que el módulo de Historia Clínica 
 *   (`MedicalHistoryModule`) pueda integrar los resultados de laboratorio 
 *   directamente en la línea de tiempo (Timeline) del paciente.
 * - Sirve como insumo crítico para el módulo de Cirugía (`SurgeryModule`) 
 *   al validar los perfiles prequirúrgicos antes de una intervención.
 * =========================================================================
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      /* 
       * TODO: Registrar las entidades ORM de TypeORM para este módulo.
       * Ejemplo: LaboratoryOrderTypeOrmEntity, LaboratoryResultTypeOrmEntity
       */
    ]),
  ],
  controllers: [
    /* 
     * TODO: Registrar los controladores HTTP encargados de exponer los endpoints 
     * de gestión de laboratorio (crear órdenes, subir resultados, listar exámenes) 
     * hacia el Frontend.
     */
  ],
  providers: [
    /* 
     * TODO: Registrar los Casos de Uso de la capa de aplicación 
     * (Ej: CreateLabOrderUseCase, RegisterLabResultUseCase, GetPatientLabOrdersUseCase).
     * 
     * TODO: Vincular los puertos de dominio con sus adaptadores de infraestructura:
     * {
     *   provide: LABORATORY_REPOSITORY_TOKEN,
     *   useClass: LaboratoryRepository,
     * },
     */
  ],
  exports: [
    /* 
     * TODO: Exportar los casos de uso de lectura necesarios para que otros módulos 
     * (como MedicalHistoryModule o SurgeryModule) puedan consultar los análisis.
     * Ejemplo: GetPatientLabOrdersUseCase
     */
  ],
})
export class LaboratoryModule {}