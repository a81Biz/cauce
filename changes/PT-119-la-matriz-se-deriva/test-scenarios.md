# Escenarios de test — `PT-119`

> `FDGE-R17`: rojo primero, y **válido**.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | La fila lleva clase, veces, primera y última aparición | `CE-001 2 2026-01-01 2026-02-02` |
| `TS-02` | …y las tareas donde ocurrió | `PT-1 PT-2` |
| `TS-03` | Alterar el `jsonl` cambia la cifra | `1 luego 3` |
| `TS-04` | Una **mención** no suma como instancia | `1 instancia 1 mencion` |
| `TS-05` | La regla dueña sale de que la regla **cite** la clase | `X-R01` |
| `TS-06` | …también en la forma **suelta**, que ocupa varias líneas | `Y-R02` |
| `TS-07` | …y sin cita, la clase sale **sin dueño** | `SIN DUENO` |
| `TS-08` | Tener regla **no** es tener verificador | `CON REGLA SIN VERIFICADOR` |
| `TS-09` | Un `jsonl` ilegible **no** es un `jsonl` vacío | `SIN EVALUAR` |
| `TS-10` | …y un `jsonl` vacío **sí** produce matriz, con ceros | `0` |
| `TS-11` | Sin fuentes **no** escribe una matriz vacía | `NO ESCRIBIO` |
| `TS-12` | …y lo **dice** en vez de callar | `no es lo mismo` |
| `TS-13` | `npm run matriz` existe | `matriz.mjs` |
| `TS-14` | …y la frescura entra en `verify` | `matriz:check` |
| `TS-15` | La matriz publicada está al día | `al dia` |
| `TS-16` | No estampa la fecha de hoy | ausencia de `Derivada el` |
| `TS-17` | …lleva el rango de los datos | `datos de` |
| `TS-18` | La matriz dice que **no prioriza ni abre** | la frase está |

---

## Los que existen porque algo falló

**`TS-06`** — la primera versión sólo leía la fila de tabla. `SUITE-R14` se define en forma
**suelta**, así que `CE-008` salía «sin dueño» **teniendo dueño**. Una clase mal marcada como
huérfana es peor que no derivar: parece un hecho.

**`TS-08`** — `SUITE-R59` tiene regla y **nada emite por ella**. Sin separar «tiene regla» de
«puede fallar», la matriz habría dicho que `CE-002` está cubierta. Ese caso es lo que hizo visible
el hallazgo de la primera corrida.

**`TS-09` y `TS-10` juntos** — son el par que hace válido el desenlace `SIN EVALUAR`. Con sólo el
primero, una implementación que devolviera `SIN EVALUAR` **siempre** también pasaría.

**`TS-16`** — sin él, alguien añadiría la fecha de generación por parecer completo, `--check`
empezaría a fallar siempre y la comprobación de frescura se apagaría sola.

---

## Prueba inversa

| Se quita | Qué se pone rojo |
|:---|:---|
| Separar `MENCION` de `INSTANCIA` | `TS-04` |
| La forma **suelta** de definir una regla | `TS-06` |
| El desenlace `SIN EVALUAR` | `TS-09` |
| Distinguir «tiene regla» de «tiene verificador» | `TS-08` |

Cuatro supresiones, cuatro escenarios distintos.

### Y la prueba inversa dio cuatro rojos falsos

Las cuatro decían «no compila». No era cierto: las copias mutadas se escribían en un directorio
temporal y `matriz.mjs` importa `./regla.mjs`, que ahí no existe. **Cuatro rojos por el motivo
equivocado, contados como aciertos** — `CE-005` dentro de la prueba que existe para detectarlo.

Ahora las copias van al lado del original y se borran al empezar **y** al terminar: dejar un
`_mut119-*.mjs` en `tools/` sería una herramienta fantasma que `audit` contaría como hueco.
