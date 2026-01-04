# VetSaaS: Sistema Integral de Gestión Veterinaria 🐾



> Hybrid Management Solution: SaaS Web Subscription + Electron Desktop Security.

---

## 🌐 Language / Idioma
- [English Version](#english-version)
- [Versión en Español](#versión-en-español)

---

<a name="english-version"></a>
## 🇺🇸 English Version

### 🚀 Overview
**VetSaaS** is a hybrid management solution designed for modern veterinary clinics. It combines the flexibility of a **SaaS Web** subscription model with the power and security of an **Electron Desktop** application, allowing professionals to manage patients, surgeries, and licenses with or without a permanent internet connection.

### 🌟 Key Features
* **Multi-tenant Architecture:** Total data isolation between organizations using security Guards and database-level filtering.
* **Dynamic Branding:** Real-time UI adaptation to the clinic's corporate identity (logo, colors, and name) using Angular Signals.
* **Automated Backups:** Local and cloud scheduled (@Cron) and manual backup system with a rotation engine for storage optimization.
* **Enterprise Security:** JWT authentication, multi-level route protection, and Hardware ID validation for local licenses.
* **Hybrid Strategy:** PWA for mobile access and Electron for full local hardware integration.

### 🛠️ Tech Stack
* **Backend:** NestJS (Node.js), TypeORM, Swagger UI.
* **Frontend:** Angular 19 (Signals, Standalone Components, SCSS).
* **Desktop:** Electron (for .exe/.dmg distribution).
* **Database:** PostgreSQL / SQLite (for local portability).

---

<a name="versión-en-español"></a>
## 🇪🇸 Versión en Español

### 🚀 Resumen
**VetSaaS** es una solución de gestión híbrida diseñada para clínicas veterinarias modernas. Combina la flexibilidad de un modelo **SaaS Web** por suscripción con la potencia y seguridad de una aplicación de **Escritorio (Electron)**, permitiendo a los profesionales gestionar pacientes, cirugías y licencias con o sin conexión permanente a internet.

### 🌟 Características Principales
* **Arquitectura Multi-tenant:** Aislamiento total de datos entre organizaciones mediante Guards de seguridad y filtrado a nivel de base de datos.
* **Branding Dinámico:** Interfaz que se adapta automáticamente a la identidad corporativa de la clínica (logo, colores y nombre) mediante Angular Signals.
* **Backups Automatizados:** Sistema de respaldos programados (@Cron) y manuales con motor de rotación para optimizar el almacenamiento.
* **Seguridad Empresarial:** Autenticación JWT, protección de rutas y validación de Hardware ID para licencias locales.
* **Estrategia Híbrida:** PWA para móviles y Electron para integración total con el hardware local.

### 🛠️ Stack Tecnológico
* **Backend:** NestJS (Node.js), TypeORM, Swagger UI.
* **Frontend:** Angular 19 (Signals, Standalone Components, SCSS).
* **Desktop:** Electron (Distribución .exe/.dmg).

---

## 📖 Technical Documentation / Documentación Técnica
For in-depth details about DTO standards, migrations, and security guards, please refer to the architecture manual:
Para detalles profundos sobre estándares de DTO, migraciones y guards de seguridad, consulte el manual de arquitectura:

👉 **[ARCHITECTURE.md](./ARCHITECTURE.md)**

## 📋 Roadmap
- [ ] Electron Builder installer finalization.
- [ ] Hardware ID licensing implementation.
- [ ] WhatsApp/Email appointment reminders.