# PT-044 — Estrategia   `PHASE 3`

## Objetivo

Que una divergencia entre el registro y las otras dos copias del estado —el YAML del intake y la
línea de índice— se **reporte**, en vez de decidirse en silencio.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Hacer `phase` obligatoria en el YAML | Es `PT-016`, y no resuelve esto: un `phase` obligatorio puede seguir quedándose atrás. Obliga a escribirlo, no a que sea verdad |
| Quitar `phase` del YAML y leerlo solo del registro | Rompe la precedencia de `PT-004`, que se escribió con motivo: el intake es lo que el PT dice de sí mismo. Y deja al intake sin poder declararse |
| Derivar el YAML del registro al vuelo | Dos copias que se sincronizan solas siguen siendo dos copias, y la que se genera pierde la que el humano escribió |
| **Comparar y reportar, sin cambiar quién manda** | Es lo que `SUITE-R35` ya hace con la plataforma. Aquí falta la misma comprobación hacia dentro |

## Solución

`SUITE-R35` dice que el registro asigna y todo lo demás espeja. `tracker espejo` lo comprueba
**contra GitHub**; nada lo comprueba **contra los artefactos del repositorio**. Se añade esa
dirección:

```
verify-fdge, por cada PT
  YAML.phase   ≠ registro.phase    → se REPORTA, diciendo cuál se usó
  YAML.status  ≠ registro.status   → se REPORTA
  índice.estado ≠ registro.status  → se REPORTA
coinciden                          → ni error ni aviso: lo normal no cuesta ruido
```

**La precedencia no cambia.** El YAML sigue mandando (`PT-004`) y se dice cuál se usó. Lo que
deja de existir es la opción de callarlo.

## Error o aviso

**Aviso**, no error. Razón medida: hoy hay artefactos con divergencia en el repositorio y en
cualquier proyecto instalado; convertirla en error pondría en rojo trabajo válido y ya integrado
—y una compuerta que se pone roja sobre comportamiento correcto enseña a saltársela, que es lo
que `verify-fdge` ya declara en su propio comentario de `exigible()`—. En `G4` sí bloquea: es
donde el estado tiene que ser uno solo.

## Las cuatro de `EP-011`

Se sincronizan sus YAML. Eso enciende `FDGE-R52`, que pedirá 8 notas de reanclaje por tarea que
**nadie escribió**. No se fabrican: se declara la deuda con una entrada `CORRIGE` —la vía que
`PT-046` acaba de abrir— explicando que esas transiciones ocurrieron sin nota y que el rastro no
existe. **Decirlo es la única salida honesta**; escribir ocho notas con fecha de hoy sería
exactamente el rastro falso que el `HANDOFF` prohíbe.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `verify-fdge --all` sobre los 32 PT del repositorio | Se ejecuta: los avisos nuevos no pueden ser errores |
| `FDGE-R52` al sincronizar los cuatro YAML | Se ejecuta y se mira **exactamente** qué exige. Es el riesgo real de esta tarea |
| PTs sin `phase` en el registro (las 8 `DEFERRED`) | No hay nada que comparar: no se inventa una divergencia (`RULE-06`) |
| La precedencia de `PT-004` | Caso propio: con YAML y registro distintos, se sigue usando el del YAML |
| El índice de un PT `DEFERRED`, que no tiene línea con estado vivo | Se comprueba que no genere aviso |

## Criterios de éxito, derivados de los AC

- `AC-01` → la divergencia aparece en la salida, con los dos valores
- `AC-02` → y dice cuál se usó
- `AC-03` → sin divergencia, ni una línea de más
- `AC-04` → `PT-039`…`PT-042` sin divergencia y `verify-fdge --all` sin errores
- `AC-05` → el índice entra en la misma comprobación

## Autorrevisión

Contradicción con `PT-004`: ninguna, la precedencia se conserva y se declara. Con `SUITE-R35`:
ninguna, es su misma idea aplicada hacia dentro. `AC` sin cubrir: ninguno.

**Riesgo que asumo y digo:** sincronizar los cuatro YAML puede destapar más comprobaciones
apagadas además de `FDGE-R52`. No sé cuáles hasta ejecutarlo. Si aparecen, se declaran; no se
apagan otra vez.
