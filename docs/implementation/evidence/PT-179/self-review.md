# `PT-179` · self-review

## Lo que se sostiene

- **`AC` verificados: 3, ninguno huérfano.** Tres casos ejecutables, uno por cada salida de
  `RULE-02`.
- **El arreglo no inventa nada.** `exigible()` ya existía diez líneas más arriba, ya tenía las tres
  salidas y ya lo usaban `FDGE-R42` y `FDGE-R15`. Escribir otro helper habría duplicado el mismo
  criterio, que es lo que `SUITE-R38` persigue.
- **`TS-02` sostiene a los otros dos.** `AC-01` lo satisface convertir el aviso en error **siempre**
  — y eso pondría en rojo a todo `PT` recién abierto, que es el defecto contrario y peor. El propio
  comentario de `:2206` lo dice: *«una compuerta que se pone roja sobre comportamiento correcto
  enseña a saltársela»*.
- **Convenciones** (`11-Conventions.md`): sin `debug`, sin restos.

## El alcance creció, y con motivo

No era una regla: eran **tres**.

| Regla | Qué miraba antes |
|:---|:---|
| `FDGE-R23` | sólo la compuerta |
| `FDGE-R25` | `afterPhase6` — **un proxy** |
| `FDGE-R29` | sólo la compuerta, en otra función |

**`FDGE-R25` era el peor caso, y merece nombre.** `afterPhase6` se define como
`manifest !== null && manifest !== undefined`: deduce la fase **de que exista el manifest**. Es
`CE-001` en su forma exacta, y falla justo donde más duele — una tarea en `PHASE 7` **sin manifest y
sin self-review** se escapaba entera, porque el proxy que debía delatarla también faltaba.

Se **conserva** la condición y se le **suma** la fase. Quitarla habría cambiado el comportamiento en
casos que hoy funcionan, y no hacía falta para arreglar éste.

`FDGE-R29` vive en otra función y `exigible()` no está en su ámbito; la fase viaja en el objeto de
opciones, dos líneas de llamada. Se incluye porque **es el mismo defecto**: dejarla fuera habría
puesto a una tarea en `PHASE 8` leyendo *«se escribe en `PHASE 8`»*.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **`FDGE-R25` y `FDGE-R29` no tienen caso de batería propio.** Comparten helper, fixture y las tres
  salidas con `FDGE-R23`; tres casos idénticos medirían lo mismo tres veces. **Se comprobaron a
  mano** sobre el mismo fixture, en `PHASE 7` y en `PHASE 4`, y la salida está en `salida.txt`. Eso
  es lo que se afirma: comprobado a mano, no cubierto por la batería.
- **No se barrieron todas las reglas** que puedan conceder sin mirar la fase. Se cubren las tres de
  evidencia y persistencia, que son las que se midieron.

## Lo que este arreglo hace posible, y no se afirma como hecho

Los tres errores de evidencia que el `SESSION_LOG` registra —ruta equivocada, `tests` como cadena,
`coverage` comparando texto contra texto— **pasaron los tres en verde**. Con este arreglo, una tarea
en `PHASE 7` sin manifest ya no pasa. **No se afirma que esos tres concretos habrían sido detectados**:
tenían manifest, y lo que fallaba era su contenido. Lo que se cierra es el hueco de **no tenerlo**.

## Sin bloqueadores
