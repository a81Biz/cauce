# Descubrimiento — `PT-104`

## Dónde estaba el hueco, con archivo y línea

```
tracker.mjs:105   FASES        nombre · produce[] · cierra      <- las tres piezas YA declaradas
tracker.mjs:130   queSigue()   bloqueos[] · avisos[]            <- YA derivados desde PT-030
tracker.mjs:424   cuerpoDeIssue()                               <- no usaba NINGUNO de los dos
```

**Nada había que inventar.** Los datos estaban a trescientas líneas de distancia del sitio donde
hacían falta.

## Y estaba declarado como pendiente

`HISTORY.log:973`, cierre de `EP-007`, textual:

> «LO QUE NO ENTREGA, y por eso existe `EP-008`: un comando no puede exigir haber sido llamado.
> La respuesta existe ahora fuera de la memoria del agente y es citable; **obligar a mirarla es
> otro problema**.»

`EP-008` resolvió que `CORE.md` **abra** con la consulta. No resolvió que **el tablero
responda**.

## La distinción que decide el diseño

```
publicar «PHASE 4 produce seis archivos»     -> copia de FASES · nunca puede discrepar
publicar «existen dos de los seis»           -> contraste · puede contradecir a quien escribe
```

Un issue que solo repite la teoría no sirve para lo que se pide, que es **notar que se saltó un
paso**.

## Lo que este descubrimiento NO establece

- **Que no falte más estado por publicar.** Se publican fase, transiciones, artefactos y
  bloqueos. Si hace falta más, se verá al usarlo.
- **Que publicarlo cambie la conducta.** No es comprobable.
