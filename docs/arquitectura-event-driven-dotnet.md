# Guía de interview técnica senior (.NET + Azure Integration)

## 1) Cuándo usar cada pieza

### Azure Functions (compute)
Usalas cuando necesitás **lógica de negocio en código** (C#) y ejecución por eventos.

**Triggers clave para interview:**
- `ServiceBusTrigger`: consume mensajes de queue o topic/subscription.
- `TimerTrigger`: ejecución por schedule (cron).
- `HttpTrigger`: endpoint API liviano.
- `SignalROutput`: envío de eventos real-time a clientes conectados.

> Frase senior: *"Functions resuelven computation; no orquestación visual"*.

### Azure Service Bus (mensajería enterprise)
Resuelve desacople entre productor y consumidor con garantías robustas.

#### Queue
- Patrón: **work queue**.
- Un mensaje lo procesa un solo consumidor efectivo.
- Al completar (`Complete`), desaparece de la entidad.
- Ideal para procesamiento asíncrono de tareas.

#### Topic + Subscriptions
- Patrón: **pub/sub fan-out**.
- Un mensaje se replica lógicamente a múltiples subscriptions.
- Cada subscription mantiene su propio ciclo de vida y reintentos.
- Ideal para notificar varios dominios (billing, analytics, CRM, etc.) desde un solo evento.

#### Conceptos que deben salir en una interview
- **At-least-once delivery**: puede haber duplicados, diseñar consumers idempotentes.
- **PeekLock**: lock temporal; si no se completa, vuelve a estar disponible.
- **DLQ (Dead-letter queue)**: destino de mensajes inválidos o excedidos en reintentos.
- **Retry/backoff**: en app + configuración de host para resiliencia.

> Frase senior: *"Service Bus desacopla y entrega al menos una vez; por eso la idempotencia no es opcional"*.

### Kafka vs Service Bus (respuesta senior breve)
- **Kafka**: log distribuido, retención y replay, consumo pull por offset.
- **Service Bus**: broker enterprise con colas/topics, sesiones, DLQ y operaciones transaccionales.
- En Azure, si necesitás ecosistema Kafka administrado, suele aparecer **Event Hubs con endpoint Kafka**.

### SignalR (real-time)
- Mantiene conexiones persistentes (WebSocket + fallback).
- Permite `broadcast`, envío por `group` o por conexión/usuario.
- Casos: chat, dashboards operativos, estado de procesos en vivo.

> Frase senior: *"SignalR abstrae la complejidad de conexiones en tiempo real; con Azure SignalR Service delegás escalado"*.

### Logic Apps (orquestación e integración)
- Flujo low-code para integrar SaaS/ERP/CRM y procesos de negocio.
- Muy útil para **scheduler** (`Recurrence`) y pipelines de integración.
- No reemplaza lógica compleja de dominio en C#.

> Frase senior: *"Logic Apps orquesta, Functions computa"*.

---

## 2) Arquitectura propuesta para explicar en interview

```text
[Producer/API]
   |
   |  ContractCreated event
   v
[Service Bus Topic: contracts.events]
   |-------------------------------> [Sub: contracts.processing] -> [Function: Processor] -> [DB/External API]
   |
   |-------------------------------> [Sub: contracts.notifications] -> [Function: Notify] -> [SignalR] -> [Web/Mobile clients]
   |
   '-------------------------------> [Sub: contracts.analytics] -> [Function: Analytics] -> [Data Lake/BI]

[Logic App - Recurrence diario]
   -> consulta estado
   -> envía resumen por email/Teams
   -> opcionalmente publica mensaje a Service Bus
```

### Decisiones de diseño (senior-level)
1. **Topic en vez de queue** para fan-out entre dominios independientes.
2. **Contrato de evento versionado** (`eventType`, `version`, `correlationId`, `occurredOn`).
3. **Idempotencia por `eventId`** para tolerar redeliveries.
4. **Observabilidad**: correlation IDs + Application Insights + métricas de DLQ.
5. **Reprocesamiento seguro** desde DLQ con tool operativo.

---

## 3) Preguntas típicas de interview + respuestas esperadas

1. **¿Queue o topic?**
   - Queue para un único pipeline de trabajo.
   - Topic cuando múltiples consumidores necesitan reaccionar de forma independiente.

2. **¿Cómo manejás mensajes duplicados?**
   - Idempotencia (store de `eventId` procesados) + operaciones upsert.

3. **¿Qué hacés con mensajes poison?**
   - Van a DLQ tras umbral de reintentos; se monitorean y reprocesan con workflow controlado.

4. **¿Cuándo Logic Apps y no Functions?**
   - Cuando el valor principal es integración/orquestación con conectores y scheduling declarativo.

5. **¿Cómo notificás en tiempo real a front-end?**
   - Function procesa evento y publica a Azure SignalR por grupos/usuarios.

---

## 4) Storyline de 90 segundos (lista para decir)

"Para workloads event-driven en .NET uso Azure Functions como capa de cómputo y Service Bus como backbone de mensajería. Si necesito fan-out entre múltiples dominios, publico en un topic con subscriptions independientes; si es un único pipeline de trabajo, uso queue. Diseñamos consumidores idempotentes porque Service Bus garantiza at-least-once delivery y controlamos errores con DLQ más observabilidad con correlation IDs. Para real-time hacia web/mobile integro Azure SignalR Service, y para automatizaciones programadas o integración con SaaS uso Logic Apps con recurrence trigger. En resumen: Logic Apps para orquestación, Functions para lógica de negocio y Service Bus para desacople robusto." 
