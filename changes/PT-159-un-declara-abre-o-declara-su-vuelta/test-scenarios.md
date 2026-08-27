# `PT-159` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | `declara` sin vuelta | `tracker parada … --desenlace declara` | se niega, y dice qué falta |
| TS-02 | revisión pasada | `--revision 2020-01-01` | se niega: nace caducada |
| TS-03 | dueño inventado | `--dueno "Nadie"` | se niega contra la lista de personas |
| TS-04 | banderas con otro desenlace | `--desenlace continua --revision …` | se niega: no significan nada ahí |
| TS-05 | el cuerpo publicado | `cuerpoDeParada` con `declara` | lleva «Se revisa el … · responde …» |
| TS-06 | el barrido de lo vencido | `verify-fdge` con una revisión pasada | la nombra y dice cuántos días |
| TS-07 | no se juzga hacia atrás | `rigeDesde` sobre lo anterior | lo publicado antes no entra en rojo |
| TS-08 | la regla se resuelve | `regla LEX-R37` y `regla FDGE-R55` | ID, severidad, propietario y verificador |

**Dónde viven**: selftest §EP-024 · 5 casos sobre fixture propio.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
