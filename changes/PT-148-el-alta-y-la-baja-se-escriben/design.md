# PT-148 · `design.md` — `PHASE 4` Proposal

## 1. La regla: qué obliga exactamente

Un enunciado en una frase imperativa, con ID estable, severidad y propietario único
(`RULES.md` §Cómo leer):

> **Un componente se declara en el contrato de `patrones.mjs`, y ninguna herramienta lo nombra.**
> Su nombre, su sigla, su prefijo de reglas, su directorio, si es obligatorio, sus triggers, su
> rango de fases y si va a `CORE` o a overlay salen de ahí. Una herramienta que escriba
> literalmente el nombre o el prefijo de un componente lo está duplicando.

Y lleva el **por qué**, que es lo que distingue una regla de una preferencia: `EP-022` midió la
lista escrita a mano en **dieciséis sitios de cuatro herramientas**, y `verify-suite.mjs:250`
filtraba las reglas por una alternancia literal — así que un componente con prefijo nuevo tenía
**todas sus reglas invisibles al verificador y pasaba en verde**.

## 2. El barrido, y qué NO caza

```
para cada nombre y cada prefijo de COMPONENTES
  buscarlo como LITERAL DE CADENA en tools/*.mjs, excepto patrones.mjs
  -> si aparece, FALLA nombrando archivo, linea y componente
```

**Los nombres salen del contrato, no de una lista.** Si mañana hay un séptimo componente, entra
solo. Escribir la lista de palabras prohibidas sería perseguir el idioma — y el sinónimo que
falte no se ve hasta que algo ya se perdió (`SUITE-R44` lo dice de otra lista).

**Qué se excluye, y se declara**:

```
patrones.mjs      es el contrato: ahi VIVEN los nombres
comentarios       citar un componente al explicar por que existe algo es legitimo y frecuente
                  — este mismo lote lo hace en cada bloque que escribio
rutas de archivo  'QA/QA-Prompts.md' no es el nombre del componente: es una ruta, y sale del
                  contrato por promptsDe()
```

**Un barrido que cace comentarios se desactiva a la primera**, y un verificador desactivado es
peor que ninguno. Por eso el criterio es **literal de cadena en código ejecutable**, no aparición
del texto.

## 3. Las dos filas del catálogo **citan**, no enuncian

`E4` del propio catálogo: *«ningún otro documento enuncia obligaciones: las **citan** por ID»*.

```
E5 · Dar de alta un componente
     Entrada    anadir su entrada a COMPONENTES en patrones.mjs
     Recorrido  verify-patrones comprueba el contrato · build-core lo emite a CORE.md ·
                audit lo audita · verify-suite ve sus reglas
     Fin        npm run verify en verde con el componente dentro
     Humano     decidir que el componente existe. Y si toca docs/methodology, SUITE-R06e

E6 · Dar de baja un componente
     Entrada    quitar su entrada del contrato
     Recorrido  el mismo, a la inversa
     Fin        el arbol queda como estaba — byte a byte
     Humano     lo mismo
```

**`E6` no es simétrico de `E5` por casualidad**: que la baja **no deje residuo** es la mitad de la
propiedad, y es lo que `PT-149` va a ejecutar.

## 4. El vocabulario en `LEXICON`

Los ocho campos de `COMPONENTES` y los cuatro de `FAMILIAS`, con lo que significa cada uno y de
dónde sale. Va en `LEXICON` porque **son nombres** (`LEX-R21`), y porque el contrato ya cita a
`LEXICON` como su fuente en cada campo — sin parsearlo (`RULE-02`).

**Y declara la distinción que `PT-146` destapó**: componente y familia de reglas **no son lo
mismo**. Seis son ambas cosas; `SUITE`, `LEX`, `EXEC` e `INTAKE` son sólo familia. Esa distinción
explicaba por qué `build-core` afirmaba la lista dos veces con cifras distintas, y hoy no está
escrita en ningún sitio.

## 5. Rama propuesta — **no se crea aquí** (`FDGE-R13`)

```
chore/alberto-martinez/PT-148-el-alta-y-la-baja-se-escriben
```
