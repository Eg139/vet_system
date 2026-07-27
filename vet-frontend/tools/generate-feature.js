const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];

if (!featureName) {
  console.error('❌ Por favor, indica el nombre de la feature. Ej: npm run g:feature -- patients');
  process.exit(1);
}

// Apunta a src/app/features desde la carpeta tools/
const basePath = path.join(__dirname, '..', 'src', 'app', 'features', featureName);

// Estructura hexagonal optimizada para Angular
const folders = [
  'domain/models',            // Entidades y tipos de dominio puro
  'domain/ports',             // Interfaces / Contratos de repositorios
  'application/use-cases',    // Casos de uso (Lógica de orquestación)
  'infrastructure/adapters',  // Implementaciones reales (API HTTP, LocalStorage)
  'infrastructure/mappers',   // Transformadores de datos (API <-> Domain Models)
  'infrastructure/ui/pages',    // Vistas / Contenedores principales (Componentes Angular)
  'infrastructure/ui/components'// Componentes visuales reutilizables de la feature
];

folders.forEach(folder => {
  const dirPath = path.join(basePath, folder);
  fs.mkdirSync(dirPath, { recursive: true });
});

console.log(`\n🚀 ¡Feature "${featureName}" creada con arquitectura hexagonal optimizada en:\n${basePath}\n`);