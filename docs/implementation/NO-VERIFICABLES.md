# NO-VERIFICABLES — reglas que ninguna máquina puede comprobar   `PT-078` · `SUITE-R26`

**Esto es una decisión, no una constatación.** Por eso lleva firma.

Una regla en esta tabla deja de contar como deuda pendiente y pasa a ser un límite **declarado**.
Meter aquí una regla que sí se puede verificar es esconder trabajo detrás de una firma — y por
eso cada fila necesita **motivo**, y una celda vacía no cuenta.

`clasificarReglas` reparte las **224** reglas del marco en tres casillas exhaustivas y
excluyentes. Lo que esta tabla cambia no es cuántas hay en cada una, sino que **no exista una
cuarta casilla silenciosa**.

| Regla | Por qué ninguna máquina puede comprobarla |
|:---|:---|
| `FDGE-R17` | Que un test se escribiera **antes** que su arreglo no deja rastro en el repositorio: no hay forma de saber cuándo se escribió cada aserción respecto a su código. Es disciplina, y `TD-16` ya lo declara. Lo comprobable son tres de sus síntomas, y `PT-079` los mecanizó. |
| `SUITE-R22` | Que el marco «sirva» a un equipo de una persona. Es una afirmación sobre utilidad, y la utilidad no se mide desde el repositorio. `PT-072` la puso a prueba ejecutándola, que es lo más cerca que se puede estar. |
| `SUITE-R03` | Que el estado retomable **evite** reconstruir el contexto. Mide un ahorro contrafactual: cuánto se habría tardado sin él. |
| `INTAKE-R01` | Que el intake refleje lo que el humano **quería**. Es la brecha entre lo escrito y lo pretendido. |
| `QA-R01` | Que la prueba en navegador demuestre que el usuario **puede usar** el sistema. Se comprueba que la prueba corrió y pasó; que eso equivalga a usabilidad, no. |
| `SUITE-R01` | **Evidence Before Action.** El sujeto de la regla es una negación sobre el **origen de una creencia**: «se apoyó en evidencia» y «se apoyó en intuición y luego se buscó evidencia» producen **artefactos idénticos**. No hay observable en el repositorio que los distinga. Es una **regla sombrilla**: no se verifica, se **instancia** — y sus cuatro instancias sí se comprueban (`FDGE-R23`, `FDGE-R24`, `PTSA-R14`, `SUITE-R11`). Se intentó verificarla en `PT-088` junto a `SUITE-R09` y `EXEC-R04`; las otras dos salieron y ésta no, por esto. |

## `SUITE-R01` entra en último lugar, y el orden es la mitad del argumento

`PT-088` intentó verificar **tres** reglas del dominio. Dos salieron:

```
SUITE-R09   cuenta lineas borradas del ledger desde el tag anterior       ESCRITA
EXEC-R04    exige constancia con nombre por cada merge a la principal     ESCRITA
SUITE-R01   no hay observable que distinga su sujeto                      AQUI
```

**Declararla antes de intentar las otras dos habría sido declarar sin haber medido.** Después, la
declaración dice «se intentaron tres, dos salieron y ésta no, por esto» — que es una afirmación
contrastable y no una excusa.

Lo que **no** se hizo, y era la salida fácil: verificar que existan artefactos en cada `PT` y
llamarlo `SUITE-R01`. Mediría cumplimiento de formato y afirmaría medir honestidad epistémica —
la séptima instancia del patrón que `PT-087` existe para cerrar, escrita por el lote que lo cierra.

## Firma

```
Declarado por: Alberto Martínez
Fecha: 2026-08-20
Confirmo que SUITE-R01 no se puede comprobar desde el repositorio, y que sus cuatro
instancias sí se comprueban: SÍ
```

## Cuatro salieron de esta tabla, y las quitó la propia herramienta

Escribí nueve. `clasificarReglas` señaló que **cuatro sobraban** —`SUITE-R27`, `SUITE-R43`,
`LEX-R21` y `EXEC-R07`— porque alguna herramienta **sí las emite**.

Y tenía razón contra mi propio texto: yo mismo había escrito de `SUITE-R27` que «lo mecanizable
es que el nombre esté en `firmantes:`, y eso ya se comprueba». Declararla no verificable **mientras
su parte comprobable se comprueba** es esconder una verdad detrás de una firma.

Que la herramienta señale las declaraciones sobrantes no es un adorno: sin eso, esta tabla sería
el sitio donde la deuda se aparca sin que nadie vuelva a mirarla.

## Lo que esta tabla NO cubre, y consta

Quedan **125** reglas en `PENDIENTE`: verificables y sin verificador escrito. **Eso es deuda, no
un límite**, y su cifra se publica en `audit` precisamente para que no se confunda con esto.

`SUITE-R26` dice que una regla `HARD` **aspira** a comprobación mecánica. Aspirar significa que la
deuda se ve; no que se tolere en silencio.

## Firma

```
Declarado por: Alberto Martínez
Fecha: 2026-08-20
Confirmo que estas cinco reglas no son mecánicamente comprobables, y que las 125 restantes
son deuda pendiente y no un límite: SÍ
```
