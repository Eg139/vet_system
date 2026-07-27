## 🗺️ Roadmap de Evolución y Desarrollo a Largo Plazo

Este apartado detalla la visión estratégica de crecimiento, la evolución de los módulos clínicos y la transición planificada de la arquitectura Full-Stack a medida que el ecosistema VetSaaS escala.

---

### 🚀 Fase 1: Núcleo Clínico y Fundamentos (Estado Actual)
*Objetivo: Consolidar el expediente básico del paciente y la gestión transaccional estándar dentro de una misma interfaz unificada.*
- [x] **Backend:** 
    - Módulo de Pacientes con aislamiento multi-tenant (`orgId`) y modelos base.
    - Estructura transaccional inicial para consultas y prescripciones.
- [x] **Frontend:** 
    - Pestañas unificadas en el perfil del paciente (Consultas SOAP, Vacunas, Tratamientos y Resumen de Labs).
    - Implementación inicial de Arquitectura Hexagonal por features.

---

### 💊 Fase 2: Control Comercial, Farmacia e Inventario (Core Veterinario)
*Objetivo: Conectar la práctica clínica con la gestión de stock y trazabilidad de medicamentos.*
- [ ] **Backend (`/inventory`, `/pharmacy`):**
    - Control de lotes, números de serie y fechas de vencimiento de vacunas y fármacos.
    - Descuento automático de stock al registrar un tratamiento o aplicación en el módulo SOAP.
    - Alertas de stock crítico a nivel de organización (`orgId`).
- [ ] **Frontend (`features/inventory`):**
    - Panel de gestión de inventario, entradas/salidas y alertas visuales de productos próximos a caducar.

---

### 🔬 Fase 3: Evolución a Departamentos Especializados (Mediano Plazo)
*Objetivo: Desacoplar las áreas de soporte clínico para otorgarles flujos operativos independientes.*
- [ ] **Backend (`/laboratory`, `/imaging`):** 
    - Entidades, controladores y servicios separados de la tabla general de pacientes.
    - Endpoints específicos para órdenes, resultados estructurados, rangos de referencia por especie y gestión de archivos pesados (DICOM/PDF).
- [ ] **Frontend (`features/laboratory`, `features/imaging`):** 
    - Bandejas de trabajo independientes para técnicos, filtros por estado y visores especializados.

---

### 💰 Fase 4: Gestión Financiera, Facturación y Caja (POS)
*Objetivo: Cerrar el ciclo operativo vinculando actos médicos, farmacia y recepción con la rentabilidad.*
- [ ] **Backend (`/billing`, `/cash-register`):**
    - Generación de comprobantes fiscales y facturación vinculada a consultas, cirugías e internaciones.
    - Apertura, arqueo y cierre de caja por turno o usuario, con control de pagos múltiples.
    - Cuentas corrientes de clientes (gestión de créditos y saldos pendientes).
- [ ] **Frontend (`features/billing`):**
    - Punto de Venta (POS) rápido integrado al liquidar una consulta o receta.
    - Reportes gerenciales e indicadores de ingresos.

---

### 🏨 Fase 5: Hospitalización, Internación y Quirófano (Áreas Críticas)
*Objetivo: Proveer control en tiempo real para pacientes internados y zonas quirúrgicas.*
- [ ] **Backend (`/hospitalization`, `/surgery`):**
    - Mapa digital de camas y cheniles con estados de ocupación en tiempo real.
    - Bitácoras horarias de constantes vitales y fluidoterapia.
    - Programación de quirófanos y asignación de personal quirúrgico.
- [ ] **Frontend (`features/hospitalization`):**
    - Tablero Kanban/Matriz visual del estado de pacientes internados.
    - Hoja de fluidos digital y alertas configurables de administración de fármacos IV.

---

### 🧠 Fase 6: Asistencia Clínica por Inteligencia Artificial (Nativo)
*Objetivo: Acelerar la documentación médica utilizando patrones inspirados en plataformas EHR de nivel humano.*
- [ ] **Backend (`/ai-assistant`):**
    - Integración segura con modelos de lenguaje para análisis de analíticas y redacción estructurada.
    - Procesamiento de comandos de voz orientados a la generación de notas SOAP.
- [ ] **Frontend:**
    - Botón de "Dictado Médico Inteligente" que transcribe y puebla automáticamente las secciones Subjetiva y Objetiva de la consulta SOAP.

---

### 🔒 Fase 7: Auditoría Forense, Cumplimiento y Seguridad (Grado Médico / Enterprise)
*Objetivo: Blindar el software legalmente frente a modificaciones indebidas de historiales o fármacos controlados.*
- [ ] **Backend:**
    - **Audit Logs Inmutables:** Registro forense de quién creó, modificó o eliminó cualquier dato crítico (con énfasis en estupefacientes y recetas firmadas).
    - Control de roles granulares (RBAC estricto heredado de estándares hospitalarios humanos).
- [ ] **Frontend:**
    - Bloqueo absoluto de edición en consultas médicas cerradas/firmadas (solo notas de evolución adicionales permitidas por normativa legal).

---

### 📱 Fase 8: Ecosistema del Paciente y Portal de Tutores
*Objetivo: Fidelizar al cliente final mediante la autogestión y la comunicación automatizada.*
- [ ] **Backend (`/portal`, `/notifications`):**
    - Motor omnicanal de notificaciones automáticas (recordatorios de vacunas, citas y desparasitación).
    - API segura para consumo externo del portal web y app móvil del tutor.
- [ ] **Frontend / Portal Web:**
    - Historial médico resumido, carnet de vacunación digital con código QR y visualización de estados de cuenta para el dueño de la mascota.

---

### 🌐 Fase 9: Ecosistema Distribuido, Cloud Híbrido y Electron Hardening
*Objetivo: Garantizar disponibilidad absoluta y sincronización resiliente en escenarios sin conexión a internet.*
- [ ] **Backend / Local Engine:**
    - **Estrategia Offline-First:** Mecanismo robusto de *Queue & Sync* bidireccional entre la base de datos local SQLite (Electron) y el servidor cloud central.
    - Actualizaciones automáticas firmadas criptográficamente para la versión de escritorio.
- [ ] **Frontend:**
    - Indicadores visuales en tiempo real del estado de sincronización y conectividad de red.


# Roadmap: Submódulo de Vacunas e Inventario (v2.0)

## Fase 1: Modelado de Datos y Backend (La base sólida)

Antes de tocar la interfaz, preparar la estructura de datos para soportar la complejidad de los lotes y el inventario.

1. **Entidad de Producto (Catálogo General):**
   * Crear el modelo `Product` (vacunas, medicamentos, etc.).
   * Campos clave: `id`, `name`, `sku_code`, `category` (ej: 'Vacuna', 'Medicamento'), `requires_batch_control` (booleano).

2. **Entidad de Lote (Trazabilidad Total):**
   * Crear el modelo `InventoryBatch`.
   * Relación: `productId` (N:1).
   * Campos críticos: `id`, `batch_number`, `manufacture_date`, `expiration_date` (FECHA DE VENCIMIENTO), `initial_stock`, `current_stock`.

3. **Configuración de Ubicaciones (Multi-almacén):**
   * Crear el modelo o enum `StorageLocation` (ej: 'Consultorio 1', 'Almacén Central', 'Farmacia Móvil').
   * El stock de un lote debe estar asociado a una ubicación física (`BatchStockLocation`).

4. **Casos de Uso de Inventario (Lógica de Negocio):**
   * `GetAvailableBatchesByLocationUseCase`: Lista lotes con stock > 0 en una ubicación específica, ordenados por fecha de caducidad (FIFO por defecto).
   * `ValidateBatchExpirationUseCase`: Regla de negocio transversal que verifica si un lote está vencido antes de cualquier operación clínica.
   * `DecrementStockUseCase`: Lógica atómica para descontar el stock de un lote específico al confirmar una aplicación médica.

---

## Fase 2: Evolución del Frontend (Experiencia de Usuario - UX)

Transformar el modal de consulta actual para integrar el inventario de forma inteligente y ágil.

1. **Actualización del Formulario Reactivo (`PatientConsultationModal`):**
   * Agregar los campos ocultos `selectedBatchId`, `batchNumber`, `expirationDate` al formulario de vacuna.

2. **Implementación del Buscador/Selector de Lotes (Typeahead):**
   * Reemplazar el input de texto de vacuna por un componente de autocompletado (`autocomplete/typeahead`).
   * Al escribir, el componente consultará al caso de uso `GetAvailableBatchesByLocationUseCase`.
   * El dropdown mostrará: `[Nombre Vacuna] | Lote: [XXXX] | Expira: [DD/MM/AAAA] | Stock: [YY]`.

3. **Alertas Visuales Críticas en UI:**
   * **Alerta de Vencimiento Próximo:** Si faltan menos de 30 días para expirar, la fecha en el dropdown se mostrará en amarillo/naranja.
   * **Bloqueo de Vencimiento:** Si la fecha de expiración es menor o igual a la fecha actual, el lote aparecerá deshabilitado (gris) y será imposible seleccionarlo, mostrando un tooltip de "Lote Vencido".

---

## Fase 3: Integración y Registro Clínico

Conectar la selección del lote con el registro histórico del paciente.

1. **Caso de Uso Coordinador (`RegisterCompleteVisitUseCase`):**
   * Este caso de uso recibirá la data completa del modal (SOAP + Vacuna seleccionada).
   * **Orquestación:**
     1. Llama a `ValidateBatchExpirationUseCase` (falla si está vencido).
     2. Llama a `DecrementStockUseCase` (descuenta 1 unidad de ese lote específico).
     3. Llama a `CreateConsultationUseCase` (registra el SOAP).
     4. Llama a `RegisterVaccineAdministrationUseCase` (registra la vacuna en el historial del paciente).
   * Esta orquestación debe ser transaccional (si un paso falla, se revierte todo).

2. **Visualización del Historial (Pestaña de Vacunas):**
   * Actualizar el componente de visualización (`PatientVaccinesComponent`) para que muestre no solo el nombre de la vacuna, sino también el **lote específico y la fecha de vencimiento** que se le aplicó al paciente (imprescindible para auditorías).