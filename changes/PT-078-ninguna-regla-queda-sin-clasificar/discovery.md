# PT-078 — Descubrimiento   `PHASE 2`

## Lo que `PT-067` dejó a medias

`PT-067` arregló **la medida**: el denominador pasó de 181 a 223 y las menciones dejaron de contar
como verificadores. Lo que no hizo —ni tenía que hacer— es que **estar sin verificar sea visible
como tal**.

Hoy `audit` publica «ejecutadas / universo» y el resto se reparte entre dos números sueltos. Una
regla puede quedarse fuera de todos ellos sin que nada lo diga: **no hay exhaustividad**.

## Las tres casillas, y la cuarta que había que impedir

```
VERIFICADA        una herramienta la EMITE: fail|warn|ok('ID')
NO_VERIFICABLE    con motivo escrito y firma
PENDIENTE         verificable y sin escribir: deuda DECLARADA
```

**Lo que cambia no es cuántas hay en cada casilla: es que no exista una cuarta silenciosa.**

Medido tras implementarlo:

```
VERIFICADA       94
NO_VERIFICABLE    5
PENDIENTE       125
suma            224 de 224
```

## El propio mecanismo cazó cuatro errores míos

Escribí **nueve** reglas en `NO-VERIFICABLES.md`. `clasificarReglas` señaló que **cuatro
sobraban** —`SUITE-R27`, `SUITE-R43`, `LEX-R21`, `EXEC-R07`— porque alguna herramienta sí las
emite.

Y tenía razón **contra mi propio texto**: yo había escrito de `SUITE-R27` que «lo mecanizable es
que el nombre esté en `firmantes:`, y eso ya se comprueba», y aun así la declaré no verificable.

Sin ese aviso, `NO-VERIFICABLES.md` sería el sitio donde la deuda se aparca detrás de una firma.

## Conclusión

`PT-075` dijo *una regla sin verificador no ocurre*. Esto es el mecanismo para que **ninguna**
pueda quedarse fuera en silencio — y la prueba de que hacía falta es que, en su primera
ejecución, encontró cuatro declaraciones mías que escondían trabajo hecho.

Las **125 pendientes** son deuda, no límite. Su cifra se publica precisamente para que no se
confundan con las cinco.
