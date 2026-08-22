# Diseño — `PT-104`

## Lo que el cuerpo publica ahora

```
### Dónde está

| **Paso**         | `PHASE 4` · Propuesta                        |
| **Entró cuando** | los caminos descartados, con su por qué      |
| **Sale cuando**  | G2 · aprobación                              |
| **Después**      | `PHASE 5` · Implementación                   |

**Produce este paso:**
- ✔ `design.md`
- ✔ `tasks.md`
- · `test-scenarios.md` — todavía no
  …

**No puede avanzar:**
- falta la firma de G2
```

Todo derivado: `Paso` y `Después` de `FASES`, `Entró cuando` del `cierra` de la fase anterior,
`Sale cuando` del `cierra` de la actual, los artefactos del **árbol** y los bloqueos de
`queSigue`.

## Dónde vive cada mitad

| | |
|:---|:---|
| `contextoCuerpo(a)` | lee el disco: `artefactos`, `refDurable`, `hayDirectorio` |
| `maquinaDeEstados(a, opciones)` | **pura**: recibe los datos y compone |

`cuerpoDeIssue` es pura desde `PT-048` para que un caso pueda comprobarla sin plataforma ni
disco. `PT-079` respetó lo mismo con el ref durable. Aquí no se rompe.

## Los tres casos que no son el feliz

| Situación | Qué se publica | Por qué |
|:---|:---|:---|
| sin `phase` | «no declara `phase`» | con `?? 0` «PHASE 0» y «nadie lo escribió» daban lo mismo (`PT-004`) |
| directorio ilegible | «no se sabe cuáles existen» | `RULE-06`: no es lo mismo «nada» que «no se pudo mirar» |
| un lote | nada | un lote no recorre fases: inventarle una sería falso |

## Los bordes

La primera fase no tiene entrada y la última no tiene siguiente. Sin tratarlos, se publicaría
`undefined` en los dos extremos — y hay dos casos que lo comprueban.
