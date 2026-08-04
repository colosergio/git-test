# Arena — MVP free-to-play

Primera versión de **Arena**, una plataforma para crear y aceptar retos competitivos entre jugadores. El repositorio conserva el prototipo web original e incorpora la app móvil en React Native/Expo. Este MVP usa puntos virtuales sin valor monetario: no procesa apuestas, depósitos ni retiros.

## Funcionalidades

- Dashboard responsive con estadísticas y retos destacados.
- Catálogo de retos con filtros por juego y búsqueda por jugador, juego o plataforma.
- Creación local de retos con validación de formulario.
- Confirmación visual al aceptar un reto.
- Ranking de temporada e historial de actividad.
- Modal de ayuda y navegación mobile.
- App móvil Expo/React Native con persistencia local de retos y actividad.
- Arquitectura de producto completa en [`ARQUITECTURA_APP_APUESTAS_ESPORTS.md`](./ARQUITECTURA_APP_APUESTAS_ESPORTS.md).
- Plan operativo para el socio de negocio en [`PLAN_SOCIO_NEGOCIO_LEGAL_MARKETING_GROWTH.md`](./PLAN_SOCIO_NEGOCIO_LEGAL_MARKETING_GROWTH.md).

## Ejecutar localmente

### App móvil

```bash
cd mobile
npm install
npm start
```

Desde Expo se puede abrir el proyecto en iOS, Android o web. Para validar tipos:

```bash
npm run typecheck
```

### Prototipo web original

No hay dependencias de producción. Se necesita Python 3 o cualquier servidor HTTP estático:

```bash
python3 -m http.server 4173
```

Luego visita [http://localhost:4173](http://localhost:4173).

> No abras `index.html` directamente con `file://`: la aplicación utiliza módulos ES y necesita servirse por HTTP.

## Estructura

```text
.
├── mobile/                                 # App Expo + React Native + TypeScript
├── index.html                              # Layout y vistas
├── styles.css                             # Sistema visual responsive
├── app.js                                 # Interacciones y renderizado
├── data.js                                # Datos demo y lógica testeable
├── tests/data.test.js                     # Pruebas unitarias
├── ARQUITECTURA_APP_APUESTAS_ESPORTS.md   # Arquitectura técnica y de producto
└── PLAN_SOCIO_NEGOCIO_LEGAL_MARKETING_GROWTH.md # Plan del socio de negocio
```

## Pruebas

```bash
npm test
```

## Alcance de esta versión

Esta implementación valida experiencia de usuario, creación/aceptación de retos y persistencia local. La integración con cuentas de plataforma, verificación automática de resultados, backend, autenticación, KYC, ledger y pagos pertenecen a fases posteriores y requieren acuerdos oficiales y aprobación legal por jurisdicción.
