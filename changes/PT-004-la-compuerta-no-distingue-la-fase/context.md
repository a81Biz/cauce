# PT-004 — Contexto   `PHASE 2` · análisis `2-B`

## Documentación consultada   `FDGE-R07`

| Fuente | Qué aportó |
|:---|:---|
| [11-Conventions.md](../../docs/enterprise-documentation/11-Conventions.md) §Hard Rules | `RULE-02` (un fallo distinguible del éxito), `RULE-05` (un verificador no escribe), `RULE-06` (lo no comprobable se declara no evaluable), `RULE-07` (la salida se escribe para quien decide) |
| [06-Backend-Architecture.md](../../docs/enterprise-documentation/06-Backend-Architecture.md) | Las herramientas son procesos CLI sin estado; el contrato es el código de salida |
| [CORE.md](../../docs/methodology/CORE.md) §Procedimiento por fase | Qué artefacto produce cada fase — la fuente contra la que se mide el defecto |
| [10-Technical-Debt.md](../../docs/enterprise-documentation/10-Technical-Debt.md) | `TD-05` sigue abierto y bloquea el merge a `main`; ajeno a este PT |
| `HANDOFF.md` · `HISTORY.log` | Sin PTs previos: este repositorio no tenía trabajo registrado antes de `EP-001` |

## Estado del grafo   `FDGE-R43` · `FDGE-R08`

`FRESH`, generado el 2026-08-13, **alcance `bin`**. No cubre `docs/methodology/tools/`, que es
donde vive el archivo a modificar.

**Efecto sobre la confianza:** el grafo no sirve para responder quién más depende de
`verify-fdge.mjs`. Se sustituye por enumeración directa —`grep` sobre `package.json`, los
workflows, `bin/cauce.mjs` y `selftest.sh`—, que sobre 15 herramientas sin dependencias
externas (`RULE-04`) es exhaustiva, no una muestra. La limitación queda declarada aquí
(`FDGE-R08`); no baja la confianza porque la enumeración cubre el mismo universo.

Es la deuda `TD-01`, ya registrada. No se amplía el alcance del grafo en este PT.

## Quién consume `verify-fdge.mjs`

```
.github/workflows/verificacion.yml:62   node …/verify-fdge.mjs --all      ← BLOQUEA el merge
bin/cauce.mjs:175                       cauce verify → verify-fdge --all
CLAUDE.md                               documentado como precondición de G4 (FDGE-R34)
docs/methodology/tools/selftest.sh      fixtures del bloque de cumplimiento
npm run verify                          NO lo invoca
```

`npm run verify` no ejecuta `verify-fdge`, así que en local el defecto es invisible: el
desarrollador ve verde y CI ve rojo. Eso retrasa el descubrimiento hasta el push, y es parte
de por qué nadie lo había visto — este repositorio no había abierto un PT hasta hoy.

## Restricciones que el arreglo tiene que respetar

- `RULE-04` · cero dependencias fuera de `node:` y `./`
- `RULE-05` · `verify-fdge` es un verificador: no escribe. No puede «arreglar» la fase que lee
- `RULE-06` · si la fase no se puede determinar, se declara no evaluable; **no** se inventa un valor por defecto que haga pasar la comprobación
- `RULE-03` · parseo por líneas con `split(/\r?\n/)`
- `SUITE-R18` · un PT sellado con una versión anterior conserva las reglas de su versión
- `LEX-R25` · el archivo viaja dentro del paquete instalable: el cambio llega a todos los proyectos destino

## Confianzas declaradas   `FDGE-R09`

| Eje | Valor | Sustento |
|:---|:---|:---|
| Root Cause | **95 %** | La condición defectuosa está localizada en dos puntos con número de línea y el fallo se reproduce a voluntad |
| Architecture | **85 %** | Los consumidores están enumerados exhaustivamente; el grafo no cubre `tools/` (`TD-01`) |
| Solution | **70 %** | El punto de decisión abierto es **de dónde sale la fase**, y ninguna de las opciones está verificada todavía |

Ninguna por debajo del 70 %: no se activa el Investigation Gate (`FDGE-R09`). La confianza de
solución está justo en el límite y es lo que `PHASE 3` tiene que subir antes de proponer.
