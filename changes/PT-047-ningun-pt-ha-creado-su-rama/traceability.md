# PT-047 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La topologia esta declarada donde manda y citada donde se ejecuta | E1 E2 E3 | selftest.sh - «FDGE-R19 declara la topologia» - «y llega al nucleo» - «PHASES la cita» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | Un PT vivo en PHASE 5+ que no declara su rama se reporta | E4 E5 E6 E7 E8 | selftest.sh - «un PT en PHASE 5 sin rama se reporta» - «con rama declarada, silencio» - «en G4 la rama ausente BLOQUEA» - «lo ya integrado no se retrofecha» - «en PHASE 4 todavia no toca» | salidas/selftest.txt · salidas/inversa.txt · salidas/rama.txt | - | VERIFICADO |
| AC-03 | El CLAUDE.md deja de contradecir a PHASE 5 | E9 | selftest.sh - «el CLAUDE.md declara las efimeras» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | G4 sigue siendo humana y no se multiplica sin decirlo | E10 | selftest.sh - «SUITE-R42 dice PARA QUE rama» | salidas/selftest.txt | - | VERIFICADO |

## Lo que NO cubre

Que la rama se CREE, y que el nombre declarado en el registro corresponda a una rama que exista
en git. Lo primero no es comprobable —es el mismo limite que SUITE-R54 y SUITE-R55 declaran de si
mismas—; lo segundo exige hablar con git desde el verificador, y es una decision de alcance que
no se cuela aqui.
