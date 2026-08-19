# PT-064 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `soloDe` con persona | solo los suyos |
| E2 | AC-05 | …con `null` | **todos** — es el caso sin personas declaradas |
| E3 | AC-04 | …y los sin persona **no** entran en el filtro de nadie | fuera |
| E4 | AC-04 | `sinPersona` los cuenta | el número |
| E5 | AC-01 | Las tres derivaciones piden el autor | `%an` y `%ae` en el formato |
| E6 | AC-01 | …con un separador que no aparece en un nombre | no un espacio |
| E7 | AC-01 | El precedente se filtra **siempre** | el código |
| E8 | AC-02 | El techo, también | el código |
| E9 | AC-03 | `tracker coste --mio` filtra | la salida lo dice |
| E10 | AC-03 | …y `--de "Nombre"` también | lo dice |
| E11 | AC-03 | …y **sin filtro** dice que es de todas | lo dice |
| E12 | AC-04 | Los no declarados se cuentan y se dicen | el texto |
| E13 | AC-05 | Sin `personas`, el coste es el de hoy | mismas cifras |
| E14 | AC-05 | …y el precedente y el techo también | mismas cifras |
| E15 | AC-01 | `viabilidad` sigue dando su veredicto | el veredicto |

**`E2` es `AC-05` y es lo que impide romper `EP-015`.** Filtrar por `null` devuelve **todo**: un
proyecto sin `personas` declaradas —el caso de este repositorio— ve exactamente las cifras de
antes.

**`E11` es la decisión de `PHASE 3`.** Sin filtro **también** se dice de quién es la cifra. Lo
peligroso no es dar una cifra u otra: es no saber cuál te están dando.

**`E6` no es un detalle.** `PT-057` usó un espacio como separador porque el SHA no lleva ninguno.
Un **nombre** sí, así que aquí hace falta otro — y usar un espacio partiría «Alberto Martínez» en
dos campos.

**`E3` y `E4` juntos son `AC-04`.** Un commit sin persona declarada no se reparte, y **se cuenta**:
la ausencia se ve en vez de restar en silencio.

## Lo que ningún caso puede comprobar

**Que las cifras por persona sean útiles.** Con dos personas y grupos pequeños, `costeDe` devolverá
`SIN REFERENCIA` a menudo — que es correcto y menos útil que hoy. Es el precio de no mezclar, y
está declarado.

**Que dos personas se comporten así.** Todo lo probado es con una y tres identidades.

**Que nadie use esto para comparar personas.** El marco puede dar la cifra de cada una; qué se hace
con ella no lo decide una herramienta.
