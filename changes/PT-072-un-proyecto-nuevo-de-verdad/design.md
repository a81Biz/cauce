# PT-072 — Propuesta   `PHASE 4` · `G2`

## Lo entregado

1. **El proyecto**, en `C:/tmp/pt072/nuevo`, con tres commits y su historia legible.
2. **La lista de huecos**, siete, con fase, síntoma y gravedad.
3. **Dos tareas nuevas** — `PT-082` y `PT-083` — porque dos de los huecos son defectos del marco,
   no fricción de manual.
4. **La evidencia**, en `evidence/PT-072/salidas/`: instalación, ciclo completo y huecos.

## Por qué el proyecto vive fuera del repositorio

Meterlo dentro convertiría a cauce en su propio caso de prueba, y eso es exactamente lo que la
tarea no puede hacer: `SUITE-R41` ya hace que cauce se aloje a sí mismo, y un proyecto nuevo
**dentro** de cauce heredaría su `REGISTRY`, su `CLAUDE.md` y su plataforma declarada — con lo que
`H7`, el hallazgo más importante, **no habría aparecido**.

Su ruta y sus resultados quedan en la evidencia. Lo que no queda es el directorio: es un fixture,
no un producto, y versionarlo dentro de cauce sería un segundo repositorio dentro del primero.

## Escenarios

| # | Escenario | Espera | Resultado |
|:---|:---|:---|:---|
| E1 | `npm pack` produce un paquete instalable | instala en directorio limpio | ✅ 58 archivos |
| E2 | `cauce install` despliega el marco | 52 archivos y `CORE.md` | ✅ −70 % tokens |
| E3 | `cauce verify` sobre lo virgen | falla, y **dice qué hacer** | ✅ 3 errores accionables |
| E4 | Foundation cierra esos errores | `verify` en verde | ✅ 4 → 0 |
| E5 | Un `PT` recorre las nueve fases | `verify-fdge` sin errores | ✅ |
| E6 | `FDGE-R17` | tests antes, en rojo | ✅ 2 de 3 rojos |
| E7 | Sin plataforma declarada | ¿se puede trabajar? | ❌ **`H7`** |
| E8 | La plantilla del paquete, rellenada | pasa su verificador | ❌ **`H6`** |

`E7` y `E8` son fallos **del marco**, no de la prueba: son lo que la prueba existía para
encontrar. Que salgan es el entregable.

## `G2`

```
Firmado por lote: EP-017 · delegada · 2026-08-19 · Alberto Martínez
Viabilidad (FDGE-R54): registrada en REGISTRY.allocations[].viabilidad
```
