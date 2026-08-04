# Arquitectura senior para una app mobile de retos con apuestas entre jugadores online

> Documento estratégico y técnico para diseñar una plataforma mobile que permita a usuarios pactar retos con dinero real alrededor de partidas online, comenzando por EA SPORTS FC/FIFA en PlayStation y evolucionando hacia múltiples juegos y plataformas.

## 1. Resumen ejecutivo

La idea de producto es una aplicación mobile que conecta jugadores, valida identidades, permite crear un reto con stake económico, retiene los fondos en una billetera/escrow, detecta o verifica el resultado de una partida online y acredita el premio al ganador, cobrando una comisión por match.

La arquitectura recomendada **no debe depender de APIs no oficiales ni scraping de PlayStation Network**. Sony canaliza el acceso formal por PlayStation Partners, y las APIs públicas de comunidad suelen documentar endpoints no oficiales o no públicos. Para operar a escala y con dinero real, el producto debe diseñarse con tres rutas de integración:

1. **Ruta oficial preferida:** acuerdos con publishers/plataformas, por ejemplo PlayStation Partners, EA o torneos autorizados.
2. **Ruta semiautomática controlada:** verificación por captura de pantalla/video, OCR, revisión humana y reputación, útil para MVP en jurisdicciones permitidas.
3. **Ruta competitiva propia:** SDK, API o bots de lobby para juegos que sí permitan integración oficial.

El mayor riesgo no es técnico sino **legal, regulatorio, antifraude y de políticas de plataforma**. Apuestas con dinero real entre usuarios pueden ser consideradas gambling, wagering, skill gaming, sweepstakes o money transmission según jurisdicción. La app debe arrancar con geofencing, KYC/KYB, AML, límites de juego responsable, verificación de edad, licencias por país/estado y revisión legal especializada antes de mover dinero real.

## 2. Principios de diseño

- **Compliance-first:** ninguna apuesta real si el usuario, jurisdicción, edad, método de pago, juego o tipo de mercado no está habilitado.
- **Integraciones oficiales primero:** PlayStation/EA/Xbox/Steam/Epic deben tratarse como socios o proveedores autorizados, no como fuentes scrapeadas.
- **Escrow transaccional:** fondos bloqueados antes del partido; liquidación idempotente y auditable.
- **Resultados verificables:** múltiples señales de evidencia, no una sola fuente manipulable.
- **Antifraude por diseño:** detección de collusion, smurfing, chargebacks, VPN, multi-cuentas y manipulación de evidencia.
- **Arquitectura multi-juego:** separar reglas de juego, adaptadores de integración y modelos de resultado del core financiero.
- **Observabilidad y auditoría:** cada decisión de compliance, riesgo, resultado y payout debe ser reconstruible.
- **Escalabilidad gradual:** MVP modular con monolito modular o servicios pequeños; migración a microservicios cuando el volumen lo justifique.

## 3. Supuestos y restricciones críticas

### 3.1 PlayStation y FIFA/EA SPORTS FC

- PlayStation Network no debe asumirse como una API pública abierta para este caso de uso.
- El acceso formal al ecosistema PlayStation debe iniciarse vía PlayStation Partners.
- Librerías públicas como `psn-api` pueden ser útiles para prototipos personales, pero no son base aceptable para un negocio regulado con dinero real.
- EA SPORTS FC/FIFA pertenece al ecosistema de EA; los resultados oficiales, reglas competitivas y permisos comerciales deben validarse con EA o mediante programas autorizados.

### 3.2 Regulación

- La app puede caer bajo regulación de apuestas, juego de habilidad, fantasy/contest, money transmission, e-wallet, impuestos y protección al consumidor.
- En Estados Unidos, la legalidad de apuestas deportivas/mobile varía por estado; algunos estados autorizan mobile wagering bajo condiciones específicas, otros lo prohíben.
- No se debe lanzar con dinero real sin opinión legal por jurisdicción, licencias, términos, políticas de privacidad, controles AML y juego responsable.

### 3.3 App stores

- Apple App Store y Google Play tienen políticas estrictas para apps de apuestas con dinero real.
- Puede requerirse licencia por jurisdicción, geofencing, clasificación de edad, publicación restringida y cuentas de desarrollador aprobadas.

## 4. Personas y casos de uso

### 4.1 Jugador casual

- Quiere retar a un amigo por una cantidad pequeña.
- Necesita onboarding rápido, depósito simple, reglas claras y resolución confiable.

### 4.2 Jugador competitivo

- Quiere rankear, competir frecuentemente, proteger su reputación y retirar ganancias.
- Requiere matchmaking por skill, historial, torneos y soporte rápido ante disputas.

### 4.3 Organizador/creador

- Quiere crear ligas, torneos privados, brackets y comunidades.
- Necesita herramientas de administración, fees configurables y reportes.

### 4.4 Operador interno

- Revisa KYC, disputas, fraude, pagos fallidos, chargebacks y alertas AML.
- Necesita consola interna con auditoría completa.

## 5. Features funcionales detalladas

### 5.1 Onboarding y cuenta

- Registro por email, teléfono, Apple, Google y opcionalmente PSN/EA si existe integración oficial.
- Verificación de email y teléfono.
- Perfil de jugador con gamertags por plataforma: PSN ID, Xbox Gamertag, EA ID, Steam, Epic.
- Verificación de edad antes de cualquier flujo con dinero real.
- KYC escalonado:
  - Nivel 0: navegación sin dinero real.
  - Nivel 1: depósitos bajos con verificación básica, si la ley lo permite.
  - Nivel 2: retiro y límites mayores con documento, selfie/liveness y screening.
- Aceptación versionada de términos, reglas de retos, política de privacidad y política de juego responsable.

**Pros:** confianza, compliance, reducción de fraude.  
**Contras:** fricción inicial, costo por verificación, posible caída de conversión.

### 5.2 Wallet, depósitos, escrow y retiros

- Billetera por usuario con ledger de doble entrada.
- Saldos separados:
  - Disponible.
  - En escrow.
  - Bono/promocional.
  - Pendiente de retiro.
  - Congelado por riesgo/compliance.
- Depósitos por proveedor regulado: tarjetas, ACH, open banking, Apple Pay/Google Pay si permitido, y métodos locales.
- Escrow automático al aceptar un reto.
- Liquidación:
  - Ganador recibe stake neto + stake del rival - comisión.
  - Comisión se registra como revenue platform fee.
  - Empate/cancelación reembolsa según reglas.
- Retiros con KYC, AML, antifraude, validación de titularidad y cooldown.
- Ledger inmutable con transacciones idempotentes.

**Pros:** trazabilidad financiera y menor riesgo de saldo inconsistente.  
**Contras:** requiere alta precisión, auditorías y proveedor de pagos compatible con gaming/gambling.

### 5.3 Crear reto 1v1

Campos mínimos:

- Juego: EA SPORTS FC, NBA 2K, Madden, etc.
- Plataforma: PlayStation, Xbox, PC.
- Modo permitido: amistoso online, ultimate team, ranked, custom lobby, etc.
- Stake por jugador.
- Comisión visible antes de aceptar.
- Reglas: duración, equipos permitidos, handicap, desconexiones, prórroga, penales, empate.
- Ventana de inicio y expiración.
- Método de verificación de resultado.
- Privacidad: abierto, por invitación, solo amigos, comunidad.

Estados del reto:

1. Draft.
2. Publicado.
3. Matchmaking.
4. Aceptado.
5. Fondos bloqueados.
6. Lobby pendiente.
7. En juego.
8. Resultado pendiente.
9. En disputa.
10. Liquidado.
11. Cancelado/reembolsado.

### 5.4 Matchmaking

- Matchmaking por nivel, reputación, región, latencia, plataforma, disponibilidad, stake y juego.
- Prevención de abuso:
  - No emparejar repetidamente las mismas cuentas si hay patrón sospechoso.
  - Límites por stake para cuentas nuevas.
  - Detección de win trading.
- Cola rápida y retos directos.
- Sistema de ranking separado del dinero para evitar incentivar fraude excesivo.

### 5.5 Lobby y coordinación del partido

- Chat pre-match moderado.
- Instrucciones paso a paso para agregarse en PSN/EA y crear partida.
- Confirmación de ambos jugadores antes del inicio.
- Temporizador de no-show.
- Evidencia obligatoria:
  - Captura de pantalla inicial opcional.
  - Captura del resultado final.
  - Video corto si el stake supera umbral.
- Deep links cuando la plataforma/juego lo permita.

### 5.6 Verificación de resultados

Modelo de verificación por capas:

1. **API oficial:** resultado firmado por publisher/plataforma.
2. **Webhook/partner feed:** eventos de torneo o match.
3. **Cliente/jugador:** ambos reportan resultado; si coinciden, liquidación automática.
4. **Evidencia visual:** OCR/visión por computadora para marcador, IDs y hora.
5. **Revisión humana:** si hay conflicto o riesgo alto.
6. **Árbitro comunitario certificado:** opcional para ligas privadas.

Señales de confianza:

- Coincidencia entre reportes de ambos usuarios.
- Historial de disputas.
- Huella de dispositivo.
- Geolocalización coherente.
- Imagen no manipulada.
- Timestamp y metadatos.
- ID de partida si existe.

**Pros:** flexible para múltiples juegos.  
**Contras:** verificación no oficial escala peor y puede generar disputas.

### 5.7 Disputas

- Apertura automática si los reportes no coinciden.
- SLA según stake y nivel de usuario.
- Evidencias aceptadas: screenshots, video, transmisión, ID de match, chat, logs.
- Consola de agentes:
  - Timeline del reto.
  - Fondos bloqueados.
  - Evidencias comparadas.
  - Historial de ambos jugadores.
  - Recomendación del motor de riesgo.
- Decisiones:
  - Pagar a jugador A.
  - Pagar a jugador B.
  - Reembolso total/parcial.
  - Penalización/no-show.
  - Ban temporal/permanente.
- Apelación limitada y auditable.

### 5.8 Comisiones y monetización

Modelos posibles:

- Comisión fija por match.
- Porcentaje del pot.
- Suscripción premium con menor fee.
- Fee de torneos.
- Revenue share con comunidades/creadores.
- Sponsors o skins digitales solo si permitido por políticas y regulación.

Recomendación inicial:

- Fee transparente del 5% al 10% del pot, sujeto a regulación y elasticidad.
- Sin comisiones ocultas en depósitos/retiros.
- Bonos promocionales con reglas claras de wagering o sin wagering si legalmente más simple.

### 5.9 Juego responsable

Features obligatorias/recomendadas:

- Autoexclusión.
- Límites de depósito, pérdida, tiempo y stake.
- Cooldown.
- Reality checks.
- Detección de comportamiento problemático.
- Links a ayuda profesional por jurisdicción.
- Prohibición de menores.
- Bloqueo de tarjetas/cuentas de terceros.

### 5.10 Notificaciones

- Push: reto aceptado, fondos bloqueados, lobby listo, resultado pendiente, payout, disputa.
- Email: KYC, recibos, cambios legales, retiros.
- SMS: verificación, alertas de seguridad.
- Preferencias granulares y cumplimiento anti-spam.

### 5.11 Social y crecimiento

- Amigos y comunidades.
- Invitaciones con referral regulado.
- Leaderboards por juego/región, evitando rankings que promuevan apuestas irresponsables.
- Torneos privados.
- Perfiles verificables.
- Reputación y badges.

### 5.12 Backoffice

Módulos internos:

- Gestión de usuarios.
- KYC/AML.
- Wallet/ledger.
- Disputas.
- Fraude.
- Configuración de juegos/reglas.
- Jurisdicciones y geofencing.
- App content/CMS.
- Reportes regulatorios.
- Auditoría y permisos RBAC.

## 6. Arquitectura técnica propuesta

### 6.1 Vista de alto nivel

```text
Mobile App (iOS/Android)
        |
API Gateway / BFF
        |
Core Platform Services
        |-- Auth & Identity
        |-- User Profile
        |-- Compliance/KYC
        |-- Wallet & Ledger
        |-- Challenge/Matchmaking
        |-- Game Rules Engine
        |-- Result Verification
        |-- Dispute Management
        |-- Risk/Fraud Engine
        |-- Notifications
        |-- Payments/Payouts
        |-- Admin Backoffice
        |
Integration Layer
        |-- PlayStation Partner Adapter
        |-- EA/Publisher Adapter
        |-- Xbox/Steam/Epic Adapters
        |-- Payment Provider
        |-- KYC Provider
        |-- Geolocation Provider
        |-- OCR/Computer Vision Provider
        |
Data Platform
        |-- PostgreSQL transactional
        |-- Redis cache/locks
        |-- Kafka/PubSub event bus
        |-- Object storage for evidence
        |-- Data warehouse/lakehouse
        |-- Observability stack
```

### 6.2 Mobile

Recomendación:

- **Flutter** o **React Native** para velocidad multi-plataforma.
- **Nativo Swift/Kotlin** solo para módulos sensibles si se requiere máxima seguridad/performance.
- Arquitectura mobile: Clean Architecture + feature modules.
- Seguridad:
  - Certificate pinning.
  - Device attestation: App Attest/DeviceCheck en iOS, Play Integrity en Android.
  - Jailbreak/root detection.
  - Secure storage para tokens.
  - MFA para retiros.

**Flutter pros:** UI consistente, performance sólida, equipo único.  
**Flutter contras:** integración nativa compleja puede requerir especialistas.  
**React Native pros:** ecosistema JS, rápido si el backend usa TypeScript.  
**React Native contras:** más riesgo de dependencia en librerías nativas de terceros.

### 6.3 Backend

Opción recomendada para MVP serio:

- **Backend modular en TypeScript/NestJS** o **Kotlin/Spring Boot**.
- PostgreSQL como base principal.
- Redis para locks, sesiones cortas y colas livianas.
- Kafka/Redpanda/PubSub para eventos.
- Workers asíncronos para KYC, pagos, OCR, fraude y notificaciones.

Evolución a gran escala:

- Separar dominios en servicios independientes cuando existan límites claros:
  - Wallet/Ledger.
  - Compliance.
  - Matchmaking.
  - Results.
  - Risk.
  - Notifications.
  - Admin.

### 6.4 Dominio financiero: ledger de doble entrada

Tablas esenciales:

- accounts.
- wallets.
- ledger_accounts.
- ledger_entries.
- transactions.
- payment_intents.
- payouts.
- escrow_holds.
- fees.
- chargebacks.

Reglas:

- Toda transacción debe balancear debit/credit.
- Idempotency key obligatoria para depósitos, holds, releases y payouts.
- Nunca actualizar saldo sin ledger entry.
- Conciliación diaria con proveedor de pagos.
- Auditoría append-only.

### 6.5 Motor de reglas de juego

Cada juego debe configurarse sin cambiar el core:

- Game.
- Platform.
- Supported modes.
- RuleSet.
- ResultSchema.
- Evidence requirements.
- Disconnection policy.
- Draw policy.
- Allowed stake range.
- Jurisdiction availability.
- Verification adapters.

Ejemplo:

```json
{
  "game": "EA_SPORTS_FC",
  "platform": "PLAYSTATION",
  "mode": "FRIENDLY_1V1",
  "minStake": 1,
  "maxStake": 50,
  "drawPolicy": "REFUND_OR_REMATCH",
  "evidence": ["FINAL_SCORE_SCREENSHOT"],
  "highRiskEvidence": ["VIDEO_CLIP"],
  "verification": ["PLAYER_CONFIRMATION", "OCR", "MANUAL_REVIEW"]
}
```

### 6.6 Result verification service

Componentes:

- Result intake API.
- Evidence upload service.
- OCR/vision pipeline.
- Player report comparator.
- Risk scoring.
- Auto-settlement engine.
- Manual review queue.

Pipeline:

1. Usuario A reporta marcador.
2. Usuario B reporta marcador.
3. Si coinciden y riesgo bajo, liquidar.
4. Si no coinciden, pedir evidencia.
5. OCR extrae marcador y gamertags.
6. Motor calcula confianza.
7. Si confianza alta, liquidar.
8. Si confianza media/baja, escalar a disputa.

### 6.7 Risk/fraud engine

Variables:

- Edad de cuenta.
- KYC level.
- Device fingerprint.
- IP, VPN/proxy, geolocalización.
- Historial de depósitos/retiros.
- Ratio de disputas.
- Repetición de rivales.
- Patrones de ganancias anómalas.
- Chargebacks.
- Velocidad de creación de retos.
- Diferencia de skill.

Acciones:

- Permitir.
- Requerir KYC adicional.
- Reducir límites.
- Solicitar video.
- Enviar a revisión.
- Congelar fondos.
- Bloquear usuario.

### 6.8 Geofencing y jurisdicciones

- Geolocalización en tiempo real antes de depositar, aceptar reto y liquidar si aplica.
- IP + GPS + proveedor especializado de geocompliance.
- Bloqueo de VPN/proxy.
- Configuración por jurisdicción:
  - Juegos permitidos.
  - Stakes máximos.
  - Edad mínima.
  - Impuestos/reporting.
  - KYC requerido.
  - Mensajes legales.
  - Métodos de pago.

### 6.9 Data analytics e IA

Casos de IA útiles:

- OCR de resultados.
- Detección de manipulación de imágenes.
- Scoring de fraude.
- Detección de collusion.
- Recomendación de rivales equilibrados.
- Predicción de churn.
- Moderación de chat.
- Priorización de disputas.

Precauciones:

- Las decisiones financieras adversas no deben depender únicamente de caja negra.
- Mantener explicabilidad, logs y revisión humana.
- Evitar usar IA para incentivar apuestas problemáticas.

## 7. Seguridad

### 7.1 Autenticación y autorización

- OAuth/OIDC propio o proveedor como Auth0/FusionAuth/Cognito.
- MFA adaptativo.
- RBAC/ABAC para admin.
- Sesiones cortas y refresh tokens rotables.
- Step-up auth para retiros, cambio de teléfono/email y stakes altos.

### 7.2 Protección de APIs

- API Gateway con rate limits.
- WAF.
- Bot detection.
- Request signing para clientes críticos.
- Idempotency keys.
- Validación estricta de input.

### 7.3 Datos sensibles

- Cifrado en tránsito y reposo.
- PII tokenizada cuando sea posible.
- Secret manager.
- Separación de ambientes.
- Retención mínima de datos.
- Acceso interno just-in-time y auditado.

### 7.4 Amenazas específicas

- Reportes falsos de resultados.
- Multi-accounting.
- Smurfing.
- Collusion.
- Chargebacks.
- Lavado de dinero.
- Bots que creen retos masivos.
- Manipulación de capturas.
- Robo de cuentas.
- Usuarios menores.

## 8. Infraestructura cloud

Recomendación inicial:

- AWS, GCP o Azure con infraestructura como código.
- Kubernetes si hay equipo DevOps maduro; si no, containers serverless como ECS/Fargate o Cloud Run.
- PostgreSQL gestionado.
- Redis gestionado.
- Object storage.
- CDN.
- Event bus gestionado.
- Observabilidad con OpenTelemetry, Prometheus/Grafana, Datadog o New Relic.

Ambientes:

- dev.
- staging.
- preprod compliance.
- production.

SLOs:

- API core p95 < 300 ms.
- Matchmaking p95 < 1 s.
- Liquidación automática p95 < 10 s tras verificación.
- Uptime mensual 99.9% MVP, 99.95% escala.

## 9. Modelo de datos simplificado

Entidades principales:

- User.
- IdentityVerification.
- JurisdictionProfile.
- PlayerProfile.
- PlatformAccount.
- Wallet.
- LedgerAccount.
- LedgerEntry.
- Challenge.
- Match.
- MatchParticipant.
- RuleSet.
- Evidence.
- ResultReport.
- Settlement.
- Dispute.
- RiskSignal.
- Notification.
- AdminAction.

Relaciones clave:

- User tiene múltiples PlatformAccounts.
- Challenge genera Match cuando ambos aceptan y depositan escrow.
- Match tiene ResultReports y Evidences.
- Settlement genera LedgerEntries.
- Dispute puede pausar Settlement.
- AdminAction audita cambios manuales.

## 10. APIs internas esenciales

### 10.1 Challenge API

- `POST /challenges`
- `GET /challenges/:id`
- `POST /challenges/:id/accept`
- `POST /challenges/:id/cancel`
- `POST /matches/:id/ready`
- `POST /matches/:id/report-result`
- `POST /matches/:id/evidence`

### 10.2 Wallet API

- `GET /wallet`
- `POST /wallet/deposit-intents`
- `POST /wallet/withdrawals`
- `GET /wallet/transactions`

### 10.3 Compliance API

- `POST /kyc/session`
- `GET /kyc/status`
- `POST /jurisdiction/check`
- `POST /responsible-gaming/limits`
- `POST /responsible-gaming/self-exclusion`

### 10.4 Admin API

- `GET /admin/disputes`
- `POST /admin/disputes/:id/resolve`
- `GET /admin/users/:id/risk`
- `POST /admin/users/:id/freeze`

## 11. Roadmap recomendado

### Fase 0: Legal, partnerships y validación

- Opinión legal por país/estado.
- Definir si será skill-based contest, sportsbook, peer-to-peer wagering u otra categoría.
- Contactar PlayStation Partners y EA.
- Validar políticas de Apple/Google.
- Seleccionar proveedores: KYC, pagos, geofencing, AML.
- Diseñar términos, reglas y políticas.

**No construir dinero real antes de cerrar esta fase.**

### Fase 1: MVP sin dinero real

- Perfiles, gamertags, retos free-to-play.
- Matchmaking básico.
- Reporte manual de resultados.
- Evidencias con screenshots.
- Ranking y reputación.
- Admin simple de disputas.

Objetivo: probar UX, demanda, fraude y tasas de disputa sin riesgo financiero.

### Fase 2: Real-money beta cerrada

- Jurisdicción limitada y legalmente aprobada.
- KYC/edad/geofencing.
- Wallet real con límites bajos.
- Escrow y ledger.
- Retiros limitados.
- Disputas manuales.
- Responsible gaming.

Objetivo: validar economía, compliance y operación.

### Fase 3: Automatización y multi-juego

- OCR/visión para resultados.
- Risk engine v1.
- Reglas configurables por juego.
- Torneos y comunidades.
- Integración oficial si se obtiene.

### Fase 4: Escala

- Servicios separados por dominio.
- Data warehouse.
- Fraud ML avanzado.
- Soporte 24/7.
- Licencias/jurisdicciones adicionales.
- SDK/portal para publishers o comunidades.

## 12. Métricas de éxito

Producto:

- Activación: usuarios que completan perfil y primer reto.
- Match completion rate.
- Time to match.
- Time to settlement.
- Repeat match rate.
- Retención D1/D7/D30.
- Conversión free-to-play a real-money.

Negocio:

- GMV/pot volume.
- Net gaming revenue/platform fees.
- ARPU.
- CAC/LTV.
- Take rate.
- Withdrawal rate.

Riesgo:

- Dispute rate.
- Fraud loss rate.
- Chargeback rate.
- KYC fail rate.
- Self-exclusion rate.
- Responsible gaming interventions.

Operación:

- Dispute SLA.
- Manual review load.
- Payment reconciliation issues.
- API uptime.
- Support tickets por match.

## 13. Pros y contras del modelo

### Pros

- Alto engagement por combinar gaming competitivo, social y recompensas.
- Modelo monetizable por comisión recurrente.
- Extensible a múltiples juegos y plataformas.
- Posibilidad de torneos, comunidades y creadores.
- Data moat en reputación, skill, riesgo y resultados.

### Contras

- Regulación compleja y costosa.
- Dependencia de permisos de plataformas/publishers.
- Alto riesgo de fraude y disputas.
- Proveedores de pago pueden rechazar la categoría.
- App stores pueden limitar distribución.
- Sin integraciones oficiales, la verificación puede ser costosa y menos confiable.

## 14. Recomendación final de arquitectura y estrategia

La mejor estrategia es construir primero una **plataforma de retos competitivos multi-juego**, con arquitectura preparada para dinero real pero operando inicialmente en modo free-to-play o créditos sin valor monetario. En paralelo, avanzar con legal, licencias y partnerships oficiales. El core diferencial debe ser:

1. Wallet/ledger robusto.
2. Motor de reglas multi-juego.
3. Verificación de resultados por capas.
4. Risk/compliance integrado desde el inicio.
5. Operación de disputas excelente.

Para que la app sea exitosa a gran escala, debe evitar shortcuts como scraping de APIs privadas, manejo manual de fondos o lanzamiento sin licencias. La confianza del usuario y de los reguladores será más importante que lanzar rápido.

## 15. Fuentes públicas consultadas

- PlayStation Partners indica que el canal oficial para desarrolladores y publishers es el programa de partners de PlayStation: https://partners.playstation.net/
- La página pública de Sony Developer World indica que ese portal cerró el 8 de mayo de 2026 y que varios proyectos migraron a sitios dedicados: https://developer.sony.com/
- La documentación pública de `psn-api` existe para uso comunitario, pero debe tratarse como no oficial para un producto regulado: https://www.npmjs.com/package/psn-api
- La Comisión de Juegos de Nueva York describe que el mobile sports wagering autorizado en Nueva York depende de ubicación y operadores licenciados: https://gaming.ny.gov/sports-wagering
- El reporte NCPG/Vixio compara requisitos de juego responsable para estados de EE. UU. con mobile sports wagering legal: https://www.ncpgambling.org/wp-content/uploads/2024/09/NCPG_Vixio-U.S.-States-Online-Sports-Betting-Regulations.pdf
