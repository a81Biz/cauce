# Diseño — `PT-138`   `PHASE 4`

## `tracker aplazar`

```
tracker aplazar PT-NNN --reentrada "qué tiene que pasar" --revision AAAA-MM-DD \
                       --dueno "Nombre" [--de PT-NNN] [--aplicar]
```

| Paso | Qué comprueba | Regla |
|:---|:---|:---|
| 1 | La allocation existe y **no** es terminal | `SUITE-R08` |
| 2 | `--reentrada` tiene contenido real, no una celda rellenada | `SUITE-R26` |
| 3 | `--revision` es una fecha válida **y futura** | — |
| 4 | `--dueno` está en `firmantes` o en `personas` | `SUITE-R27` |
| 5 | Escribe `status: DEFERRED` y el bloque `aplazamiento` | `SUITE-R44` |
| 6 | Publica en el issue con marca de procedencia | `SUITE-R43` |

```json
"aplazamiento": {
  "reentrada": "cuando exista un proyecto Azure real contra el que probar",
  "revision": "2026-11-01",
  "dueno": "Alberto Martínez",
  "de": "PT-113",
  "fecha": "2026-08-24"
}
```

## Por qué la fecha tiene que ser **futura**

Una revisión ya pasada nace caducada, y un aplazado que nace caducado es indistinguible del que
no declara nada — el defecto que esta tarea cierra, reintroducido por la puerta de al lado.

## Lo que NO es mecanizable, declarado   `SUITE-R26`

**Que la condición de reentrada sea buena.** Se puede exigir que exista y que tenga contenido;
que diga algo útil lo sabe quien conoce el trabajo. Se declara en vez de fingir que se detecta.

**Que la fecha sea la correcta.** Se puede exigir futura. Que sea el momento adecuado, no.

## Los aplazados existentes   `AC-07`

| | Qué se hace |
|:---|:---|
| `PT-134` | Ya no está aplazada: `PT-137` la retomó. No aplica |
| `PT-025` | Se le escribe el bloque **con lo que se sabe**, y lo que no, se declara |

`PT-025` es el arrastre que el firmante acepta explícitamente. Su condición de reentrada sale de
su propio título —la guarda de cierre en Azure— y no se inventa nada más.
