# Autorrevisión — `PT-106`

## Lo que establecí

Que veinte reglas dejan de juzgar trabajo escrito antes de que pudieran fallar, con la versión
real de cada una, derivada del árbol y trazable a su commit.

## Lo que NO establecí

- **Si las reglas de `PTSA` necesitan lo mismo.** Numeración y verificador aparte.
- **Que las 87 sin emisión deban tenerla.** Es la cobertura mecánica, que `audit` ya mide.

## Lo importante de esta tarea

**El enunciado del lote estaba equivocado, y en la dirección peligrosa.** Decía «las 151 reglas
`HARD`»; habría producido 151 filas, de las cuales **125 serían restricciones inventadas** —
diciendo «antes de esta versión no regía» sobre reglas que regían desde el primer commit.

**Y el método obvio miente en silencio.** El `CHANGELOG` parece la fuente natural: 41 entradas,
166 reglas nombradas. Contrastado contra las diez filas ya escritas, **dos de cada diez son
falsas** — y no habría fallado nada. Habría quedado escrito, y sería mentira.

La razón es semántica y conviene no perderla: **el `CHANGELOG` dice cuándo se redactó una regla;
`RIGE_DESDE` dice desde cuándo juzga.** Eso es cuando apareció su comprobación, que puede llegar
mucho después.

## La mitad que casi se pierde

**Lo que no se toca es la mitad del trabajo.** Por eso hay dos casos que comprueban la
**ausencia** de fila, y una retirada —`S-3`— que devuelve el valor que el `CHANGELOG` sugeriría
para comprobar que la batería lo caza.

Sin `S-3`, la batería habría pasado igual con las cifras falsas.

## Lo que la batería me corrigió, y es lo mejor de la tarea

**Mi derivación le puso fila a `SUITE-R35`, y un caso anterior la defendió.** `PT-089` la había
declarado «no procede» con este motivo:

> «nace verde porque las seis se resolvieron aquí… copiar el criterio habría añadido **una fila
> que mantener y que no protege**»

Su razón es **mejor que la mía**. La mía era «la derivación lo dice»; la suya mira si la fila
defiende a alguien. Cronológicamente yo tenía razón —la comprobación apareció en la `5.0.0`— y
eso **no basta**: una fila derivada no es automáticamente correcta.

Y esto abre lo que **no** establecí: se derivó **cuándo** empezó a juzgar cada regla, no **si hay
trabajo histórico que la falle**. Son preguntas distintas, y el caso de `SUITE-R35` lo demuestra.

## Lo que salió mal

**Una retirada no aplicó a la primera**: el patrón buscaba `'EXEC-R04': [11, 0, 0],` y el archivo
lo tiene alineado con doble espacio. La inversa lo dijo —«NO APLICADA, el patrón no casó»— en vez
de contarlo como cero, que es la diferencia entre un aviso útil y uno mudo.
