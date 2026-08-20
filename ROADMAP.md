## 🗺️ Roadmap de Evolución y Desarrollo - VetSaaS v2.4
**Enfoque: Argentina First, Arquitectura LATAM Ready | Objetivo 2024: Vender**

Este roadmap prioriza "Demo que atiende en 30 días" y luego escala a "Gestión completa".

---

### 🚀 FASE 0: NÚCLEO CLÍNICO MVP [2 SEMANAS] - *Para salir a venta*
*Objetivo: Que el vete pueda atender, guardar historia clínica y generar la receta. Lo mínimo vendible.*
- [x] **Backend:**
    - Módulo de Pacientes multi-tenant (`orgId`, `country_code`) + Búsqueda Global
    - CRUD de Consulta SOAP con plantillas
    - Tabla `RegulatorySettings` para configuración por país
- [ ] **Backend NUEVO:**
    - `POST /prescriptions`: Generar receta/ficha a partir del SOAP
    - `POST /vaccines`: Registrar aplicación de vacuna simple sin lote
- [x] **Frontend:**
    - Pestañas unificadas en perfil: Consultas SOAP, Vacunas, Tratamientos y Resumen de Labs
    - Arquitectura Hexagonal por features
- [ ] **Frontend NUEVO:**
    - Flujo Vete: Buscar Paciente → Nueva Consulta SOAP → Guardar → Imprimir Receta
    - Dashboard "Hoy": Solo Agenda + Pacientes Atendidos
- [ ] **Comercial:**
    - Video demo 2 min: Flujo Buscar → Atender → Guardar HC
    - Landing 1 página + Precio: $15.000/mes AR. "Historia Clínica Digital". Prueba 14 días

---

### 💰 FASE 1: CONTROL COMERCIAL + CAJA OPERATIVA [4 SEMANAS]
*Objetivo: Conectar la clínica con el cobro. Upsell de +$10k/mes.*
- [ ] **Backend (`/cash-register`, `/inventory`):**
    - `POST /invoices` generado automáticamente al cerrar SOAP
    - `POST /payments` + `GET /invoices?status=pending` + `CashSession`
    - Medios de pago: Efectivo, Débito, Crédito, Transferencia, Cta Cte
    - **Descuento de stock**: `DecrementStockUseCase` al cerrar SOAP/Receta
    - Exportadores básicos: Reporte de Caja, Ventas por Servicio CSV
- [ ] **Frontend (`features/cash-register`):**
    - Pantalla "Cobros Pendientes" en Recepción
    - POS rápido integrado al liquidar una consulta
    - Dashboard "Hoy" completo: Agenda + Caja del Día + Alertas
- [ ] **NOTA**: Precio pasa a $25.000/mes AR con módulo Caja

---

### 💊 FASE 2: INVENTARIO PRO + BIOSeguridad BASE [4 SEMANAS]
*Objetivo: Diferenciador de venta. Cumplimiento básico SENASA y no perder plata.*
- [ ] **Backend (`/inventory`, `/biosafety`):**
    - Control de lotes, `batch_number`, `expiration_date`
    - **Lógica FEFO**: `GetAvailableBatchesByLocationUseCase` ordenado por vencimiento
    - **Reportes**: `GetExpiringBatchesReportUseCase` 30/15/7 días + `GetExpiredBatchesReportUseCase`
    - Alertas de stock crítico y vencimiento a nivel `orgId`
    - **Bioseguridad BASE**: Registro de desinfecciones con foto + Stock de insumos críticos
- [ ] **Frontend (`features/inventory`):**
    - Panel con semáforo: Verde OK / Amarillo Próximo / Rojo Vencido
    - Selector de Lotes Typeahead con bloqueo si está vencido
    - Dashboard Bioseguridad: % Cumplimiento + Próximas tareas
    - Botón "Exportar Informe SENASA 1-Click" - CSV básico
- [ ] **NOTA**: Precio pasa a $35.000/mes AR con módulo Inventario

---

### 🔬 FASE 3: DEPARTAMENTOS ESPECIALIZADOS [3 SEMANAS]
*Objetivo: Escalar para clínicas grandes.*
- [ ] **Backend (`/laboratory`, `/imaging`):**
    - Módulos desacoplados con bandejas de trabajo propias
    - Endpoints para órdenes, resultados estructurados y archivos DICOM/PDF
- [ ] **Frontend:**
    - Visores especializados y filtros por estado

---

### 💰 FASE 4A: GESTIÓN DE CAJA Y REPORTES PARA CONTADOR [2 SEMANAS]
*Objetivo: Cerrar el mes sin Excel. Sin factura fiscal todavía.*
- [ ] **Backend (`/cash-register`):**
    - Apertura, movimientos, arqueo y cierre de caja por turno
    - **Exportadores**: Libro Ventas, Compras, Caja, Ventas por Servicio CSV/XLSX
    - Cta Cte de Clientes + Recordatorios de deuda automáticos
- [ ] **Frontend:**
    - Reporte "Exportar para Contador"
- [ ] **NOTA**: Fase 4B "Facturación Fiscal Integrada" queda para post Fase 9

---

### 🏨 FASE 5: HOSPITALIZACIÓN, INTERNACIÓN Y QUIRÓFANO [4 SEMANAS]
*Objetivo: Grado hospitalario. Vender a clínicas de +5 vetes.*
- [ ] **Backend (`/hospitalization`, `/surgery`):**
    - Mapa de camas y cheniles en tiempo real
    - Bitácoras horarias + Programación de quirófanos
    - Integración con Bioseguridad F2: `ValidateBiosafetyBeforeSurgeryUseCase`
- [ ] **Frontend:**
    - Tablero Kanban de internados + Hoja de fluidos digital

---

### 🧠 FASE 6: ASISTENCIA CLÍNICA POR IA NATIVA [3 SEMANAS]
*Objetivo: El "WOW" de ventas. Acelerar documentación.*
- [ ] **Backend (`/ai-assistant`):**
    - Dictado de voz → Nota SOAP estructurada
    - Análisis de analíticas y sugerencias de diagnóstico
- [ ] **Frontend:**
    - Botón "Dictado Médico Inteligente" en consulta SOAP

---

### 🔒 FASE 7: AUDITORÍA FORENSE + BIOSeguridad PRO [3 SEMANAS]
*Objetivo: Blindaje legal para hospitales y licitaciones.*
- [ ] **Backend:**
    - **Audit Logs Inmutables**: Quién creó/modificó/eliminó datos críticos y lotes
    - **Trazabilidad Total**: `GetBatchTraceabilityUseCase` por `batch_number` para recall
    - **Módulo `RegulatoryReportService`**: Exportador adaptable. `SenasaReportService` v1
    - RBAC estricto por roles: Vete, Recepción, Admin
- [ ] **Frontend:**
    - Bloqueo de edición en consultas firmadas
    - Sección "Informes para Ente Regulador" 1 click

---

### 📱 FASE 8: PORTAL DE TUTORES + NOTIFICACIONES [3 SEMANAS]
*Objetivo: Fidelización y reducir no-shows.*
- [ ] **Backend (`/portal`, `/notifications`):**
    - Motor omnicanal: WhatsApp + Email para recordatorios de vacunas/citas
    - API para portal web/app del tutor
- [ ] **Frontend / Portal:**
    - Carnet de vacunación digital con QR + lote aplicado
    - Historial médico resumido + Estado de cuenta

---

### 🌐 FASE 9: OFFLINE-FIRST + ELECTRON HARDENING [4 SEMANAS]
*Objetivo: Disponibilidad 100%. Vender en zonas sin internet.*
- [ ] **Backend / Local Engine:**
    - **Queue & Sync**: SQLite Local <-> Cloud
    - Actualizaciones automáticas firmadas
- [ ] **Frontend:**
    - Indicador de estado de sincronización

---

# Roadmap: Submódulo de Vacunas e Inventario v2.1
*Este submódulo se desarrolla dentro de Fase 2*

## Fase 2.1: Modelado de Datos y Backend
1. **Entidad `Product`**: `id`, `name`, `sku_code`, `requires_batch_control`, `country_code`.
2. **Entidad `InventoryBatch`**: `productId`, `batch_number`, `expiration_date`, `current_stock`.
3. **Entidad `StorageLocation`**: Stock por consultorio/almacén.
4. **Casos de Uso**: `GetAvailableBatchesByLocationUseCase`, `ValidateBatchExpirationUseCase`, `DecrementStockUseCase`.

## Fase 2.2: Frontend UX
1. **Formulario SOAP**: Campos `selectedBatchId`, `expirationDate`.
2. **Selector Typeahead**: Muestra `[Vacuna] | Lote: [XXXX] | Expira: [DD/MM] | Stock: [YY]`
3. **Alertas**: Amarillo < 30 días. Bloqueo si vencido.

## Fase 2.3: Integración y Reportes
1. **`RegisterCompleteVisitUseCase`**: Transacción: Validar lote → Descontar → Guardar SOAP.
2. **Historial**: Pestaña Vacunas muestra `nombre + lote + fecha vencimiento aplicado`.