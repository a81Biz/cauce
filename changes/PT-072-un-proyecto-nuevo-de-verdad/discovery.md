# PT-072 — Descubrimiento   `PHASE 2`

**Ejecutado, no razonado.** Proyecto `tareitas` en `C:/tmp/pt072/nuevo`, creado para esto, contra
la 9.0.0 **empaquetada** con `npm pack` — nunca contra la publicada, que es la `8.2.0`.

## Lo que funcionó

| Paso | Resultado |
|:---|:---|
| `npm pack` | `a81biz-cauce-9.0.0.tgz` · **58 archivos** · 615 KB |
| `npm install ./*.tgz` en directorio limpio | sin incidencias |
| `npx cauce install` | **52 archivos** · `CORE.md` con 247 reglas · **−70 %** de tokens |
| `cauce verify` sobre la instalación virgen | falló con **los 3 huecos reales** y dijo qué ejecutar en cada uno |
| Foundation — cinco documentos | `verify` bajó de 4 errores a **0**, guiando uno a uno |
| `plan-layout` | `alcance: src` · terreno en orden · 0 propuestas |
| `verify-fdge PT-001` | **sin errores** |
| `FDGE-R17` | 3 tests escritos antes; **2 en rojo**, `AC-01` ya pasaba |
| El arreglo | **3 de 3 en verde** |

**Un proyecto nuevo puede recorrer el ciclo completo con la 9.0.0 empaquetada.** Eso es `AC-02`.

## Los siete huecos, con su fase y su síntoma   `AC-03`

| # | Fase | Síntoma | Gravedad |
|:---|:---|:---|:---|
| `H1` | instalación | `cauce install` no deja `.gitignore`; el primer `git add -A` versionó **118 archivos** | media |
| `H2` | Foundation | `LAYOUT.md` exige la frase **literal** «refleja la estructura que quiero: SÍ» y `FND-R23` no la nombra | media |
| `H3` | instalación | `INSTALL.log` exige `I<n> ACCIÓN … OK` con `I` de **un dígito** —tope de 9— y **dos espacios** antes de `OK` | media |
| `H4` | Intake | `tracker asignar` no escribe `phase`; `avanzar` responde **«está en PHASE NaN»** | alta |
| `H5` | Intake | Un intake suelto exige `Reportado por:`, no `Firmado por:` | baja |
| `H6` | Intake | **La plantilla del paquete falla su propio verificador** | **alta** |
| `H7` | todas | **`tracker avanzar` es imposible sin tablero** | **crítica** |

## `H7` · la contradicción

Tres sitios dicen que la plataforma es opcional — `SUITE-R22` declara soportado el equipo de una
persona, `migrate` escribe «**OPCIONAL** … **Sin ella no cambia nada**», y un `CLAUDE.md` puede no
declararla. El código dice lo contrario, literalmente:

```
sin plataforma con la que comentar, la nota no tiene donde ir. avanzar la EXIGE (FDGE-R52).
```

`avanzar` exige `--nota`; la nota exige issue; el issue exige plataforma. Y `FDGE-R52` hace de
`avanzar` **la única forma sancionada** de cambiar de fase. «Sin ella no cambia nada» es falso:
sin ella no se avanza ni una fase. → **`PT-082`** (`SUITE-R44`).

## `H6` · el que más lejos llega

`RE_SEVERITY` es `/^\s*severity:\s*(S[1-4])\s*$/im` — exige fin de línea. Y `BUG-REPORT.md`, la
plantilla que **el paquete distribuye**, trae:

```
severity: S2               # [HUMANO] S1 | S2 | S3 | S4
```

Quien instala el paquete, copia la plantilla que el paquete trae y la rellena, **falla `FDGE-R04`**.
No es un caso raro: es el camino que el `MANUAL` describe. Los demás campos sí toleran el
comentario, así que la incoherencia es de un solo campo. → **`PT-083`**.

## Un error mío que también es dato

Escribí el intake **a mano** en vez de copiar la plantilla, y fallé cuatro comprobaciones seguidas.
Es el error natural de quien llega, y es la razón de que `H5` esté en la lista en vez de
descartarlo como torpeza: el mensaje de `INTAKE-R06` dice «sin rellenar» sin decir qué palabra
espera.

## `AC-04` · el alcance del grafo

`plan-layout` calculó `alcance: src` — **correcto**: todo el código propio está en `src/`. No
midió el defecto de `PT-070`, que aparece cuando hay código fuera de `src/`, como en cauce con
`bin/`. Se declara: este proyecto no podía provocarlo.
