# PT-090 — Escenarios   `FDGE-R16`

| | Escenario | Espera |
|:---|:---|:---|
| `E1` | manifiesto con `ast_hash`, huella **igual**, `mtime` distinto | **verde** · el `mtime` deja de importar |
| `E2` | manifiesto con `ast_hash`, huella **distinta** | **deriva** · el archivo se nombra |
| `E3` | manifiesto **sin** hash | cae al `mtime`, como medía antes |
| `E4` | archivo del manifiesto que ya no existe | se nombra con «no existe» |
| `E5` | ruta absoluta de Windows | `bin/cauce.mjs` |
| `E6` | ruta absoluta de POSIX | `bin/cauce.mjs` |
| `E7` | ruta ya relativa | igual |
| `E8` | la raíz no aparece en la ruta | **la ruta tal cual**, no una inventada |
| `E9` | sin `graphify-out/` | «NO ES EVALUABLE» |
| `E10` | sin `graphify-out/` | …y **no** dice «Bloquea G2 en PTs MAJOR» |

## `E1` es el caso que da nombre a la tarea

Mismo contenido, distinto `mtime`: **no hay deriva**. Es lo que `git clone` produce, y lo que dos
`commit` seguidos producen — y era lo que ponía el grafo en `SUSPECT` sin que nada hubiera
cambiado.

## `E3` es el que impide que nazca roja

Un proyecto con manifiesto anterior no trae hash. Sin `E3`, actualizar el marco lo dejaría en
`SUSPECT` permanente, y una comprobación que nace roja se apaga.

## `E8` es el que impide inventar

Si la raíz no casa, se devuelve lo que hay. **Fabricar una ruta relativa plausible sería peor que
decir que no se pudo** — es la misma decisión que `SIN EVALUAR` frente a cero.

## `E10` no es redundante con `E9`

`E9` comprueba que **dice** el hecho nuevo. `E10` comprueba que **dejó de decir** el falso: que ya
no promete bloquear en un sitio donde nunca llegó a evaluarse.

Sin `E10`, el mensaje podría decir las dos cosas a la vez y `E9` seguiría en verde.
