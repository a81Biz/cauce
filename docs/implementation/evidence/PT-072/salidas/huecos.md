# PT-072 — Huecos del proyecto nuevo, con su fase y su síntoma   `AC-03`

Medidos ejecutando la 9.0.0 **empaquetada** (`npm pack`) sobre un proyecto real creado para esto:
`tareitas`, en `C:/tmp/pt072/nuevo`. Ninguno es una impresión.

| # | Fase | Síntoma | Gravedad |
|:---|:---|:---|:---|
| `H1` | instalación | `cauce install` no deja `.gitignore`; el primer `git add -A` versionó **118 archivos**, casi todos `node_modules` | media |
| `H2` | Foundation | `LAYOUT.md` exige la frase **literal** «refleja la estructura que quiero: SÍ». El mensaje de `FND-R23` dice «no está firmado» sin decir cuál es la frase | media |
| `H3` | instalación | `INSTALL.log` exige `I<n> ACCIÓN … OK`, con `I` de **un solo dígito** —así que hay tope de 9 entradas— y **dos o más espacios** antes de `OK`. Nada lo dice antes de fallar | media |
| `H4` | Intake | `tracker asignar` crea la allocation **sin `phase`**, y `avanzar` responde «está en PHASE NaN». La primera tarea de un proyecto nuevo no puede avanzar sin editar el registro a mano | alta |
| `H5` | Intake | Un intake suelto exige `Reportado por:`, no `Firmado por:`. Escribirlo a mano en vez de copiar la plantilla es el error natural, y el mensaje no dice qué palabra espera | baja |
| `H6` | Intake | **La plantilla que distribuye el paquete falla su propio verificador.** `BUG-REPORT.md` trae `severity: S2               # [HUMANO] S1 \| S2…` y `RE_SEVERITY` exige fin de línea tras `S2`. Los demás campos sí toleran el comentario | **alta** |
| `H7` | todas | **`tracker avanzar` es imposible sin tablero.** Exige `--nota`; la nota exige issue; el issue exige plataforma. `FDGE-R52` lo hace la única forma sancionada de cambiar de fase | **crítica** |

## `H7` es una contradicción declarada, no un descuido

Tres sitios del marco dicen que la plataforma es opcional:

- `SUITE-R22` declara soportado el equipo de una sola persona.
- `migrate` lo escribe con todas las letras: «**OPCIONAL** — declarar plataforma de trabajo…
  **Sin ella no cambia nada**».
- `CLAUDE.md` de un proyecto puede no declararla.

Y el código dice lo contrario, literalmente:

```
sin plataforma con la que comentar, la nota no tiene donde ir. avanzar la EXIGE (FDGE-R52).
```

Sin ella **no cambia nada** es falso: sin ella no se avanza ni una fase. → `PT-082`.

## `H6` es el que más lejos llega

Quien instala el paquete, copia la plantilla que el paquete trae y la rellena, **falla `FDGE-R04`**.
No es un caso raro: es el camino que el `MANUAL` describe. → `PT-083`.

## Lo que SÍ funcionó, y conviene decirlo

| Paso | Resultado |
|:---|:---|
| `npm pack` + instalar el `.tgz` en directorio limpio | 58 archivos, 615 KB, sin incidencias |
| `npx cauce install` | 52 archivos · `CORE.md` con 247 reglas · **−70 %** de tokens |
| `cauce verify` sobre la instalación virgen | falló con **los 3 huecos reales** y dijo qué ejecutar en cada uno |
| Foundation con sus cinco documentos | `verify` pasó de 4 errores a **0** guiando uno a uno |
| `plan-layout` | terreno en orden, 0 propuestas, correcto |
| `verify-fdge PT-001` | **sin errores** tras rellenar la plantilla |
| Tests en rojo primero (`FDGE-R17`) | 2 de 3 en rojo, `AC-01` ya pasaba — el estado correcto |

**El marco es utilizable en un proyecto nuevo.** Los siete huecos son fricción de arranque, y
sólo `H7` impide terminar sin declarar plataforma.
