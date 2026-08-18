# PT-059 — Diseño   `PHASE 4`

## El vocabulario

```js
export const SAFE = 'SAFE';
export const MARGINAL = 'MARGINAL';
export const UNSAFE = 'UNSAFE';
export const VEREDICTOS = [SAFE, MARGINAL, UNSAFE];

// HOLGURA es un JUICIO, como MINIMO_REFERENCIA en PT-057. Nada demuestra que 1.5 sea el numero.
// Vive aqui, con nombre, para que se pueda discutir en vez de quedar dentro de un `if`.
export const HOLGURA = 1.5;

// Estado de TAREA. La tarea no esta fallando: no debe ejecutarse todavia.
export const BLOCKED_BY_CONTEXT = 'BLOCKED_BY_CONTEXT';
```

## La función pura

```js
/**
 * ¿Se puede empezar esto AHORA? Tres veredictos, y el motivo SIEMPRE.
 *
 * No compara contra un presupuesto: PHASE 2 midio que «disponible = total - gastado» es
 * inoperable porque el total es el contexto del modelo y sale SIN EVALUAR siempre. Compara
 * contra el PRECEDENTE — lo mayor que esta sesion ya completo—, que es observable.
 *
 * `coste` y `precedente` son cifras de PT-058: llevan su naturaleza pegada.
 * `techoHistorico` es lo mayor que CUALQUIER sesion registrada hizo nunca, para AC-06.
 */
export function viabilidadDe(coste, precedente, techoHistorico = null, holgura = HOLGURA) {
  // AC-06 · «no cabria NUNCA» es distinto de «no cabe ahora», y se decide ANTES: si la tarea
  // supera lo mayor que ninguna sesion hizo jamas, la siguiente sesion dara lo mismo y
  // BLOCKED_BY_CONTEXT seria un bucle infinito garantizado.
  if (coste?.valor != null && techoHistorico?.valor != null && coste.valor > techoHistorico.valor) {
    return { veredicto: UNSAFE, nunca: true,
      motivo: `${coste.valor} supera las ${techoHistorico.valor} de la mayor sesion registrada. `
        + 'No es que esta sesion vaya justa: ninguna ha hecho nunca tanto. Hay que PARTIR la tarea '
        + '(el alcance lo firma una persona, INTAKE-R06), no reintentarla.' };
  }
  // AC-05 · el corazon. Sin una de las dos cifras no se puede comparar, y entonces NI se aprueba
  // NI se prohibe: MARGINAL. Aprobar seria aprobar por omision; prohibir bloquearia TODO para
  // siempre —el disponible es SIN EVALUAR siempre— y una compuerta que bloquea siempre se apaga.
  if (coste?.valor == null || precedente?.valor == null) {
    return { veredicto: MARGINAL, nunca: false,
      motivo: 'no se puede comparar: ' + (coste?.valor == null ? 'el coste' : 'el precedente')
        + ' esta SIN EVALUAR. No se aprueba por omision, y tampoco se prohibe sin evidencia.' };
  }
  if (coste.valor <= precedente.valor) {
    return { veredicto: SAFE, nunca: false,
      motivo: `la sesion ya completo algo de ${precedente.valor}, mayor que ${coste.valor}. `
        + 'Es PRECEDENTE, no capacidad: no promete que quepa, dice que ya se pudo con algo asi.' };
  }
  if (coste.valor <= precedente.valor * holgura) {
    return { veredicto: MARGINAL, nunca: false,
      motivo: `${coste.valor} pasa de las ${precedente.valor} ya completadas pero cabe en la `
        + `holgura (x${holgura}). Solo trabajo atomico: nada que deje algo a medias.` };
  }
  return { veredicto: UNSAFE, nunca: false,
    motivo: `${coste.valor} es mas del doble de holgura sobre las ${precedente.valor} completadas. `
      + 'Hay evidencia EN CONTRA, no solo falta de evidencia a favor: checkpoint, handoff y parada.' };
}
```

**El orden de las comprobaciones es la parte que importa.** `AC-06` va **primero**: una tarea que
nunca cabría no debe salir como `MARGINAL` porque falte el precedente. Y `SIN EVALUAR` va **antes**
que las comparaciones, porque comparar `null` con un número da `false` silenciosamente en
JavaScript — un veredicto correcto por accidente sigue siendo un accidente.

## La acción

```
tracker viabilidad PT-NNN
```

Deriva:

- **coste**: `costeDe(...)` del tipo y complejidad de la tarea → `ESTIMADO`, o `SIN EVALUAR` si su
  grupo no llega a `MINIMO_REFERENCIA`.
- **precedente**: la mayor tarea **completada en la sesión de hoy** → `MEDIDO`, o `SIN EVALUAR` si
  la sesión no ha completado nada.
- **techoHistorico**: la mayor sesión del historial completo → `MEDIDO`.

Y en `SIN_PLATAFORMA`: sale del registro y de git, y exigir credencial para eso fue lo que CI le
enseñó a `PT-056`.

## `BLOCKED_BY_CONTEXT` no es terminal

```js
// tracker.mjs y verify-fdge.mjs — VIVOS
const VIVOS = new Set([..., 'BLOCKED', 'BLOCKED_BY_CONTEXT', ...]);
```

Mecánicamente importa: los estados terminales se tratan como trabajo cerrado. Una tarea esperando
al momento **sigue viva** y sigue apareciendo en el tablero — si desapareciera, el marco habría
convertido «no es el momento» en «ya está».

## Lo que NO se construye

| Qué | Por qué |
|:---|:---|
| Que la compuerta resuelva `G1`..`G4` | Es **viabilidad**, no gobernanza · `out-of-scope` del intake |
| Partir la tarea automáticamente | Cambia el alcance, y el alcance lo firma una persona |
| Un contador de reintentos | No distingue mala suerte de imposibilidad · se deriva del historial |
| Poner el estado en el registro sola | Escribir el estado de una tarea es de `tracker avanzar`, no de una consulta |
| `SESSION.json` | `PT-060` |
