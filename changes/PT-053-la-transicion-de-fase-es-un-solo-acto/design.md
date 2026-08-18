# PT-053 — Diseño   `PHASE 4`

## El comando

```
tracker avanzar PT-NNN --a 6 --nota "..."
tracker avanzar PT-NNN --a 6 --nota "..." --ver     valida y NO escribe nada
```

## El orden, y por qué es ése

```
0  VALIDAR      todo lo comprobable, ANTES de tocar nada
1  registro     REGISTRY.phase                       reversible
2  YAML         el intake del PT                     reversible
3  indice       la linea de estado, si cambia        reversible
4  checkpoint   CHECKPOINT.json                      reversible
5  NOTA         el comentario en el issue             IRREVERSIBLE
```

**Lo irreversible va último.** La alternativa —publicar la nota primero— dejaría, si algo falla
después, **una nota sobre una transición que no ocurrió**. Un registro falso es peor que un estado
incompleto: el incompleto lo caza el verificador en la siguiente ejecución; el falso no lo caza
nadie, porque parece correcto.

## La atomicidad, en concreto

Antes de escribir, se guarda el contenido **exacto** de los cuatro archivos. Si cualquier paso —
incluido el comentario— falla, se restauran los cuatro y el comando termina en rojo.

```js
const respaldo = archivos.map((f) => ({ f, antes: existsSync(f) ? readFileSync(f, 'utf8') : null }));
try { …los cinco pasos… }
catch (e) {
  for (const { f, antes } of respaldo) antes === null ? rmSync(f, {force:true}) : writeFileSync(f, antes);
  throw e;
}
```

`antes === null` importa: `CHECKPOINT.json` puede **no existir** antes del primer `avanzar`, y
restaurarlo significa **borrarlo**, no escribir una cadena vacía. Un archivo vacío donde no había
nada es un estado que no existía.

## Las validaciones, y qué hace cada una

| Comprobación | Por qué |
|:---|:---|
| El PT existe en el registro | `SUITE-R08`: sin allocation no hay trabajo |
| No está en estado terminal | Lo cerrado es evidencia, no estado (`SUITE-R36`) |
| Hay `--nota` y no está vacía | Es **la** razón del comando |
| `--a` es la fase **siguiente** | Ni salta ni retrocede: saltar apaga las comprobaciones que la fase saltada habilita — el defecto que `PT-044` documentó |
| Hay plataforma **y** acceso | La nota tiene que poder escribirse; si no, no se avanza |

**Ninguna de las cinco escribe nada.** Se ejecutan todas antes del paso 1.

## Sin plataforma: falla, y dice qué hacer

Al revés que `checkpoint` —que es del repositorio y corre sin red—, `avanzar` **exige plataforma**.
Sin ella la nota no tiene dónde ir, y avanzar sin escribirla sería el defecto que la tarea corrige,
con una excusa.

## Lo que este diseño **no** hace

No resuelve compuertas (`EXEC-R04`, `SUITE-R06a`). No hace commit ni push — quien decide **qué
entra** en el commit es quien trabaja (`FDGE-R19`), y `SUITE-R34` exige que el estado viaje con el
trabajo: agrupar es decisión de la tarea. No evalúa presupuesto (`EP-015`). Y no reimplementa nada:
**llama** a `queSigue`, a `checkpointDe` y al adaptador que ya existen.
