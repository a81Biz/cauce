# `PT-129` — Cambios de especificación   `PHASE 4`

> Qué documento normativo cambia, y qué dice antes y después. `SUITE-R06e`: modificar
> `docs/methodology/` **no se automatiza** — se propone aquí y se resuelve en `G2`.

---

## `RULES.md` · `FDGE-R19` — el único documento normativo que cambia

**No cambia la obligación.** La regla sigue exigiendo commits atómicos, una rama por tarea, la
rama declarada en el registro y `G4` una por lote. Cambian **dos enunciados**:

### 1 · El `<type>` de una rama deja de enunciarse aquí

| | |
|:---|:---|
| **Antes** | La regla usa `<type>` para la rama sin decir de dónde sale, y en la misma frase declara `type ∈ feat·fix·refactor·test·docs·chore` para los **commits**. La herramienta usa otro vocabulario y nadie lo dice |
| **Después** | La regla **cita** `LEXICON` §943 para el `<type>` de rama —los tipos de ítem— y conserva intacta la lista de tipos de **commit**, que es la de git y es correcta |

**Autoridad:** `LEX-R21` (`LEXICON` → `RULES`) y `LEX-R23` (un ID se define en un documento; los
demás citan). No se copia la lista.

### 2 · La topología pasa de tres niveles a cuatro tipos

| | |
|:---|:---|
| **Antes** | *«la topología de ramas es **esta**, en tres niveles»* — efímera, integración, por defecto |
| **Después** | Cuatro: los tres anteriores más la **derivada** `cauce/<usuario>`, citando `LEXICON` §810 |

**No es una rama nueva**: existe desde `PT-054` y la crea `tracker proyectar`. Lo que se corrige es
una enumeración que se presentaba como completa.

### 3 · La lista de «Prohibidos» dice de qué habla

| | |
|:---|:---|
| **Antes** | *«Prohibidos: `WIP`, `fix`, `changes`, `update`, `final`…»* — palabras sueltas, con `fix` también en la lista de `type` válidos, en la misma frase |
| **Después** | Se declara que son **descripciones de commit vagas**, no valores de `type` |

`SUITE-R24`: quitar precisión a una regla no es ganancia — *«una regla ambigua se aplica mal justo
en los casos límite»*.

---

## Lo que **no** cambia, y conviene decirlo

- **`LEXICON.md` no se toca.** Ya declara los cinco tipos de ítem (§943) y la rama derivada (§810).
  El defecto no era que faltara vocabulario: era que la regla enunciaba el suyo.
- **Ninguna regla nueva.** No hay `FDGE-R55` aquí. Se corrige un enunciado y se añade la
  comprobación que lo hace contrastable — que es lo que `SUITE-R26` pide de una `HARD`.
- **`RIGE_DESDE` no recibe fila.** La regla no empieza a juzgar nada que antes no juzgara: la
  comprobación nueva **avisa** fuera de `G4`, y en `G4` exige lo que la regla ya exigía. Añadir
  fila sería declarar un alcance que no cambia.
- **`CHANGELOG`**: entra como corrección de texto en la versión que cierre el lote. No es `MAJOR`:
  ninguna obligación cambia, ningún nombre canónico cambia, y un proyecto destino no tiene nada
  que migrar.

## `G2` — qué se aprueba exactamente

```
1  que gane el vocabulario de LEXICON y no el de la regla        (PHASE 3, camino B)
2  que FDGE-R19 enumere cuatro tipos en vez de tres
3  que ramaDeTarea devuelva null sin type en vez de inventar chore
4  que la comprobación AVISE fuera de G4 y FALLE dentro
5  que no se borre ni renombre ninguna rama                      (SUITE-R06f)
```

**El punto 4 es el que merece discusión.** Un `fail` inmediato pondría en rojo el repositorio por
dos ramas históricas, y `FDGE-R19` ya sentó el precedente contrario con el usuario en la rama. Si
el firmante prefiere `fail` desde el primer día, hay que borrar las dos ramas antes — y eso es
`SUITE-R06f`, suyo.
