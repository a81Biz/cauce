# PT-030 — Diseño   `PHASE 4` · `FDGE-R21`

```js
export const FASES = { 0..10 : { nombre, produce: [...], cierra: '…' } };
export function queSigue(alloc, { comentarioPendiente, issueAbierto }) → {
  id, estado, fase, nombre, produce, cierra, compuerta, bloqueos[], siguiente
}
```

Pura: quien llama le pasa lo que ya leyó del tablero. La acción `tracker siguiente` habla con la
plataforma, y si no puede **no afirma** — no convierte «no sé» en «no hay».

| Entrada | Respuesta |
|:---|:---|
| viva con fase | qué produce, qué cierra, qué compuerta, y la fase siguiente |
| comentario sin responder | `RESUELVE PRIMERO`, y el resto detrás |
| sin `phase` | `SIN EVALUAR`. No se adivina |
| terminal | «lo cerrado es evidencia, no estado» (`SUITE-R36`) |
| sin allocation | «el registro asigna» (`SUITE-R08`) |

Sin argumento recorre **todo lo vivo**, por fase descendente: lo más avanzado primero, que es lo
que está a punto de cerrarse.
