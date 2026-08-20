# PT-075 — Escenarios de prueba   `PHASE 4`

| AC | # | Escenario | Se espera |
|:---|:--|:---|:---|
| AC-01 | E1 | `PHASES.md` cita `FDGE-R54` en `PHASE 4` | `verify-suite` en verde y la cita resuelve |
| AC-01 | E2 | Se **quita** la cita de `PHASES.md` | algo cae: la regla queda sin fase que la abra |
| AC-02 | E3 | PT sin `viabilidad` en el registro, con `--gate G2` | **falla** `FDGE-R54` |
| AC-02 | E4 | PT sin `viabilidad`, sin `--gate`, en `PHASE 2` | **avisa**, no falla |
| AC-02 | E5 | PT con `viabilidad` registrada, `--gate G2` | pasa |
| AC-03 | E6 | PT con `viabilidad: UNSAFE` en `PHASE 5` | **falla** `FDGE-R54` |
| AC-03 | E7 | `viabilidad --registrar` escribe sólo campos derivados | ningún campo que sólo pueda rellenar la memoria (`LEX-R26`) |
| AC-03 | E8 | PT con `branch` declarada y un commit suyo directo en la rama de integración | **falla** `SUITE-R42` |
| AC-03 | E9 | PT con `branch` cuyos commits llegaron por **merge** | pasa: `--first-parent` los ve como un merge |
| AC-03 | E10 | PT **sin** `branch` declarada con commits directos | pasa: no se retrofecha (`FDGE-R19`) |
| AC-03 | E11 | PT en `PHASE 9` sin `acciones-humanas.md` | **falla** `SUITE-R42` |
| AC-04 | E12 | `audit --sin-verificar` | ni `FDGE-R54` ni `SUITE-R42` aparecen |

## Comprobación inversa   — obligatoria

Revertido cada arreglo, deben **caer**:

```
E2   la cita vuelve a poder desaparecer sin consecuencia
E3   un PT sin viabilidad pasa G2
E6   UNSAFE no detiene
E8   escribir un PT en la rama de integracion no lo ve nadie
E11  no hace falta describir el comando
```

Y deben **seguir pasando**, porque no dependen del arreglo:

```
E4  E9  E10
```

`E9` y `E10` son las dos que protegen contra el falso positivo. Si cayeran con el arreglo
puesto, el verificador estaría acusando a trabajo correcto — que es el fallo que `AC-06` prohíbe.
