# PT-148 · `test-scenarios.md` — `PHASE 4` Proposal

## TS-01 · `AC-04` — un literal de componente en una herramienta **falla**

```
DADO   una herramienta de tools/ que NO sea patrones.mjs
CUANDO se le mete «'FIDE'» como literal de cadena en codigo ejecutable
ENTONCES verify-suite FALLA, y NOMBRA archivo, linea y componente
```
**Es lo que permite que la regla nazca `CHECK` y no `HARD`.** Sin esto sería una obligación que
nadie comprueba, escrita por el lote que existe para que se comprueben.

## TS-02 · `AC-04` — y **no** caza comentarios

```
DADO   un comentario que cita un componente al explicar por que existe algo
CUANDO se ejecuta verify-suite
ENTONCES NO falla
```
**El criterio que decide si el barrido sirve.** Este mismo lote escribió decenas de comentarios
que citan componentes; un barrido que los cace se desactiva en la primera corrida — y un
verificador desactivado es peor que ninguno.

## TS-03 · `AC-04` — ni rutas de archivo

```
DADO   'QA/QA-Prompts.md' en una herramienta
CUANDO se ejecuta verify-suite
ENTONCES NO falla — es una ruta, y sale del contrato por promptsDe()
```

## TS-04 · `AC-04` — el barrido deriva los nombres, no los escribe

```
DADO   un componente ficticio anadido al contrato
CUANDO se mete su nombre como literal en una herramienta
ENTONCES falla — sin tocar el barrido
```
Escribir la lista de palabras prohibidas sería perseguir el idioma. El séptimo componente entra
solo.

## TS-05 · `AC-01` — el vocabulario está en `LEXICON` y no colisiona

```
CUANDO se ejecuta verify-suite
ENTONCES sin vocabulario derogado ni nombres duplicados
   Y     LEXICON declara los ocho campos de COMPONENTES y los cuatro de FAMILIAS
   Y     declara que componente y familia de reglas NO son lo mismo
```

## TS-06 · `AC-02` — la regla existe, se resuelve y no está duplicada

```
CUANDO se ejecuta  regla.mjs <ID>
ENTONCES la resuelve: que exige, donde vive, quien la comprueba
   Y     verify-suite no la ve definida dos veces (SUITE-R14)
   Y     su severidad es CHECK, y hay un script que la emite
```

## TS-07 · `AC-03` — el catálogo **cita**, no enuncia

```
DADO   las filas E5 y E6
CUANDO se ejecuta verify-suite
ENTONCES no detecta una obligacion enunciada fuera de RULES.md
   Y     las dos filas CITAN la regla por su ID
```
`LEX-R22` y `E4` del propio catálogo.

## TS-08 · `AC-05` — `CORE` regenerado, no editado

```
CUANDO se ejecuta build-core --check
ENTONCES sincronizado
   Y     el diff contiene la regla nueva y el vocabulario nuevo, y NADA MAS
```
El `diff` **se lee**. `RC-01` no es «sin errores»: es que lo que cambió sea lo que se quiso
cambiar.

---

| AC | TS |
|:---|:---|
| AC-01 | TS-05 |
| AC-02 | TS-06 |
| AC-03 | TS-07 |
| AC-04 | TS-01 · TS-02 · TS-03 · TS-04 |
| AC-05 | TS-08 |
