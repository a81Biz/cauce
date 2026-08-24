# PT-132 — abrir crea el issue ANTES de guardar el registro, y una interrupción duplica

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-132
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 8
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que interrumpir `tracker abrir --aplicar` no deje issues creados que el registro no conoce.

## 2. El defecto, medido

`tracker.mjs` · `abrir()`:

```js
for (const a of ordenDeApertura(pendientes)) {
  const n = adaptador.crear(...);   // IRREVERSIBLE: crea el issue en la plataforma
  a.issue = n;                      // solo en memoria
}
cerrarPasada();
guardarRegistro(reg, ACCION);       // REVERSIBLE, y va el ULTIMO
```

**El acto irreversible va primero y el registro se guarda al final del bucle.** Si el comando muere
a mitad —timeout, red, `Ctrl+C`— los issues quedan creados y el registro no los conoce. La pasada
siguiente los vuelve a crear.

Es el orden **inverso** al que el propio `tracker.mjs` declara en `avanzar`:

> *«EL ORDEN LO DECIDE LA REVERSIBILIDAD. Lo irreversible va el ÚLTIMO, y todo lo anterior se
> restaura si algo falla. La alternativa dejaría, ante un fallo tardío, un registro falso.»*

**Dos comandos del mismo archivo con contratos opuestos** (`SUITE-R38`).

**Daño medido el `2026-08-22`:** dieciséis issues duplicados en `EP-020` — `PT-114`..`PT-126` por
dos y `PT-129` por **tres**. Los cerró el agente con su nota; el defecto sigue.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El registro se guarda **después de cada issue creado**, no al final del bucle | una interrupción deja como mucho **uno** sin registrar, no trece |
| AC-02 | Antes de crear, se busca un issue **abierto con el título derivado**: si existe, se **adopta** en vez de crear otro | la recuperación de una pasada interrumpida no exige cerrar nada a mano |
| AC-03 | Adoptar se **dice**, no se hace en silencio | el mensaje distingue «creado» de «adoptado», con el número |
| AC-04 | Si no se puede consultar la plataforma, **no se crea a ciegas**: se detiene y se dice | `RULE-06` — crear sin poder comprobar es como se duplicó |
| AC-05 | El contrato queda escrito **una vez** y los dos comandos lo citan | `SUITE-R38`: hoy `avanzar` lo declara y `abrir` lo contradice |

## 4. Cómo termina   `FDGE-R53`

> Termina cuando: interrumpir `abrir --aplicar` a mitad no puede producir un issue duplicado.

## 5. Qué NO entra   `[AGENTE]`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Reabrir los dieciséis duplicados ya cerrados | Están cerrados con su nota y el registro reclama el bueno. Reabrirlos sería ruido | — |
| Hacer transaccional todo `tracker` | Se arregla **el comando que duplicó**. Los demás quedan declarados y sin medir | — |
| Que el borrado de un issue sea posible | La plataforma no lo permite sin permisos de admin, y `SUITE-R06` no lo contempla | — |
| Que `abrir` no dependa de la red | No es posible: espeja contra la plataforma por definición (`SUITE-R35`) | — |

## 6. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Lo provoqué yo, y eso es parte del dato.** Ejecuté `abrir --aplicar` en ventanas de dos
  minutos que expiraron a mitad, dos veces. Pero un comando que duplica cuando se interrumpe es
  un comando frágil: la interrupción es normal —red, timeout, `Ctrl+C`— y el marco entero está
  construido sobre la idea de que un acto se completa o no ocurre.
- **Lo encontró el espejo, no yo.** `SUITE-R35` reportó dieciséis issues abiertos que ninguna
  allocation reclamaba. Sin esa comprobación habrían quedado ahí.
- **Es «el acto fuera del comando» invertido**: aquí el comando **sí** se usó, y el problema es
  que su contrato interno contradice al que el propio archivo declara tres funciones más abajo.
  Va a la matriz como instancia de `SUITE-R38`, no de `PT-127`.
- **`AC-02` es recuperación, no prevención.** `AC-01` limita el daño a uno; `AC-02` hace que ese
  uno se recupere solo. Las dos hacen falta: sin la primera, una interrupción sigue costando
  trece llamadas de más a la plataforma.
