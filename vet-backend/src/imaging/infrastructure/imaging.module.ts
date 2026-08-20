import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * =========================================================================
 * MÓDULO DE DIAGNÓSTICO POR IMAGEN (ImagingModule)
 * =========================================================================
 * Propósito y alcance:
 * Este submódulo gestiona de manera integral el ciclo de vida de los estudios 
 * de diagnóstico por imagen (radiografías, ecografías, tomografías, resonancias, etc.) 
 * de los pacientes veterinarios, bajo los principios de Arquitectura Hexagonal 
 * y Domain-Driven Design (DDD).
 * 
 * Funcionalidades principales que abarcará:
 * 1. Solicitud de Estudios: Creación de órdenes de diagnóstico por imagen indicando 
 *    la zona anatómica y proyecciones requeridas por el veterinario tratante.
 * 2. Carga y Gestión de Archivos: Almacenamiento de archivos multimedia, DICOM o 
 *    enlaces a servidores de almacenamiento externo de las imágenes médicas.
 * 3. Informes Radiológicos / Ecográficos: Registro del dictamen, hallazgos clínicos 
 *    y conclusiones emitidas por el especialista en diagnóstico por imagen.
 * 
 * Integraciones clave:
 * - Exporta casos de uso de lectura para que el módulo de Historia Clínica 
 *   (`MedicalHistoryModule`) pueda integrar las imágenes y sus informes directamente 
 *   en la línea de tiempo (Timeline) del paciente.
 * - Sirve como insumo visual y clínico crítico para el módulo de Cirugía (`SurgeryModule`) 
 *   durante la planificación prequirúrgica.
 * =========================================================================
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      /* 
       * TODO: Registrar las entidades ORM de TypeORM para este módulo.
       * Ejemplo: ImagingOrderTypeOrmEntity, ImagingStudyTypeOrmEntity
       */
    ]),
  ],
  controllers: [
    /* 
     * TODO: Registrar los controladores HTTP encargados de exponer los endpoints 
     * de gestión de imágenes (solicitar estudio, subir archivos, registrar informe) 
     * hacia el Frontend.
     */
  ],
  providers: [
    /* 
     * TODO: Registrar los Casos de Uso de la capa de aplicación 
     * (Ej: CreateImagingOrderUseCase, UploadImagingStudyUseCase, GetPatientImagingStudiesUseCase).
     * 
     * TODO: Vincular los puertos de dominio con sus adaptadores de infraestructura:
     * {
     *   provide: IMAGING_REPOSITORY_TOKEN,
     *   useClass: ImagingRepository,
     * },
     */
  ],
  exports: [
    /* 
     * TODO: Exportar los casos de uso de lectura necesarios para que otros módulos 
     * (como MedicalHistoryModule o SurgeryModule) puedan consultar los estudios de imagen.
     * Ejemplo: GetPatientImagingStudiesUseCase
     */
  ],
})
export class ImagingModule {}