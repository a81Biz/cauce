# PT-150 · `test-scenarios.md` — `PHASE 4` Proposal

> `BUG`: el escenario que **reproduce** va primero y va en **rojo** (`FDGE-R17`).

## TS-01 · `AC-03` — el escenario que reproduce el defecto

```
DADO   tracker.mjs tal como esta hoy
CUANDO se ejecuta  asignar PT --slug x --severidad S4 --ver
ENTONCES HOY falla con «S4 no es una severidad»
   Y     DESPUES crea la allocation
```
**Rojo hoy.** Es la reproducción, y es la que convierte esto en un `BUG` y no en una opinión.

## TS-02 · `AC-05` — el mensaje deja de atribuir a `LEXICON` lo que no declara

```
CUANDO se ejecuta  asignar PT --severidad S9
ENTONCES el mensaje NO contiene «S0»
   Y     enumera S1 · S2 · S3 · S4
   Y     ese texto SALE de la constante, no de una cadena escrita
```
La última línea es la que importa: un mensaje correcto escrito a mano es la próxima copia que
diverge.

## TS-03 · `AC-04` — `S0` se rechaza

```
CUANDO se ejecuta  asignar PT --severidad S0
ENTONCES falla
   Y     no crea allocation
```

## TS-04 · `AC-03` — el valor por defecto de la plantilla del paquete es aceptable

```
DADO   el severity por defecto de INTAKE/templates/CHANGE-REQUEST.md, LEIDO DEL ARCHIVO
CUANDO se pasa ese valor a asignar
ENTONCES lo acepta
```
**Se lee del archivo, no se escribe `S4` en el test.** Es la lección de `RC-03` de `PT-144`: una
comprobación que compara contra una copia del dato no comprueba nada.

Y ata el defecto al paquete: `@a81biz/cauce` instala esa plantilla en cada proyecto destino.

## TS-05 · `AC-02` — la escala es la de `LEXICON`

```
CUANDO se lee SEVERIDADES
ENTONCES es exactamente S1 S2 S3 S4
   Y     NO contiene S0
```

## TS-06 · `AC-01` — romper la escala hace fallar el verificador

```
CUANDO se le anade S0 a SEVERIDADES
ENTONCES verify-patrones falla POR ASERCION, citando SUITE-R38
CUANDO se le quita S4
ENTONCES verify-patrones falla
```
`RULE-02`, y con la lección de `PT-144`: **por aserción, no por excepción**. Un caso cuyo
resultado esperado es un crash pide certificar un verificador muerto, y `revento()` lo invalida.

## TS-07 · `AC-01` — `RE_SEVERIDAD` sigue rechazando lo inválido

```
CUANDO se prueba RE_SEVERIDAD contra «severity: S9»
ENTONCES no casa
CUANDO se prueba contra «severity:» vacio
ENTONCES no casa
CUANDO se prueba contra «severity: S4               # [HUMANO] S1 | S2 | S3 | S4»
ENTONCES casa           <- la forma EXACTA que traen las plantillas, con su comentario
```
El tercer caso es el que `verify-fdge:155` documenta: el patrón tiene que tolerar el comentario
que el paquete distribuye.

## TS-08 · `AC-06` — lo integrado no se rejuzga

```
DADO   PT-107 (S0) y PT-015, PT-016, PT-017, PT-051 (S4), todos INTEGRATED
CUANDO se ejecuta verify-fdge despues del cambio
ENTONCES ninguno sale en rojo
   Y     sus entradas en REGISTRY.json no cambian
```
Sin este escenario, la tarea pondría en rojo cinco trabajos cerrados hace meses — y borrar esas
severidades para que cuadre la cifra perdería la evidencia de que el defecto existió.

## TS-09 · `AC-07` — un `S0` en trabajo **vivo** sí se caza

```
DADO   un PT VIVO con severity: S0 en su intake
CUANDO se ejecuta verify-fdge
ENTONCES lo NOMBRA y falla
```
Es el complemento de `TS-08` y lo que hace que `AC-07` signifique algo: lo terminal se respeta,
lo vivo se exige.

---

## Mapa `AC` → `TS`

| AC | TS |
|:---|:---|
| AC-01 | TS-06 · TS-07 · (`grep` de literales) |
| AC-02 | TS-05 |
| AC-03 | TS-01 · TS-04 |
| AC-04 | TS-03 |
| AC-05 | TS-02 |
| AC-06 | TS-08 |
| AC-07 | TS-09 |
