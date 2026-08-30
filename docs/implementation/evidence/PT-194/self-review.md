# `PT-194` · self-review

## La decisión que el intake dejaba abierta

El intake decía: *«y puede que la respuesta sea que NO debe valer […] Decidirlo es el trabajo»*
(`RULE-06`). **La respuesta es que no debe valer**, y por tres motivos que van **en la salida** y no
sólo aquí:

1. **La declaración vive en el árbol de HOY; la historia es de SIEMPRE.** Aplicarla eximiría todo
   lo que ese archivo tuvo **alguna vez**, incluida una credencial real puesta y borrada después.
   Y el archivo que declara ser señuelo es justo donde más cómodo resulta esconder algo.
2. **El riesgo va al revés del síntoma.** Lo que molesta es un falso positivo; ampliar mal una
   exención hace que un secreto **real** deje de bloquear. Entre molestia y agujero, molestia.
3. **El mecanismo correcto ya existe**: firmar la huella en `SECRETOS-EXCEPCIONES.md`, que **sigue
   mostrándola** y que ata la firma **al valor** — si el valor cambia, vuelve a bloquear. Una
   exención por archivo no tiene esa propiedad.

## No era una decisión: era un efecto de por dónde mira el escáner

```js
revisarTexto(linea.slice(1), `historia ${commit}`, false, 'historia');
//                                                 ^^^^^  pasado EN DURO
```

Y el diff de `git log -p` **sí lleva el archivo** en sus cabeceras `+++ b/`: el escáner las
ignoraba. **Hacer que la exención llegara habría sido fácil** — y eso es justo lo que hacía
peligrosa esta tarea. Que no llegue pasa a estar **escrito, con su motivo**, en vez de ser un
efecto de la implementación.

## Las tres piezas

| Dónde | Qué |
|:---|:---|
| `:115` | **El ámbito viaja con el hallazgo.** Se usaba para la huella y se tiraba, así que el informe no podía distinguir árbol de historia — dos hechos con arreglos distintos (`RULE-02`) |
| `:164` | **El archivo del hunk se lee.** Se sabía el commit y no el archivo |
| `:236` | **El mensaje dice qué ocurre de verdad**, con el motivo y el mecanismo (`RULE-07`) |

## El contexto que no es permiso

Cuando el archivo del hunk **sí** declara `cauce:senuelos` hoy, se dice — y se dice **aparte**:

```
→ a.sh SI declara «cauce:senuelos» HOY — es contexto, no exencion.
```

Sin esa línea, quien lee un rojo sobre un fixture declarado **no entiende por qué no le vale la
declaración**; con ella lo entiende **y sigue bloqueado**, que es lo correcto.

## `AC-02` es el que gobierna, y su caso no se puede quitar

`TS-01`, `TS-03` y `TS-04` los cumple un escáner que haya **ampliado** la exención. **Sólo `TS-02`
—el secreto que bloquea *con* la declaración puesta— prueba que no se hizo.** Y `TS-04` prueba lo
otro: que la exención del **árbol** sigue intacta, que es lo que `PT-190` compró.

## Un error mío, y ya conocido

La expectativa decía `alguna vez` y el mensaje escribe `ALGUNA VEZ`. Falló en la corrida acotada,
no en la revisión — que es exactamente lo que `PT-181` compró al pasar las expectativas a literal:
**la expectativa se equivoca en voz alta** en vez de casar por accidente. Segunda vez en este lote,
tras `PT-196`.

## Lo que NO se toca, y consta   `SUITE-R26`

- **La exención en el ÁRBOL no cambia**: funciona, y es lo que `PT-190` compró. Tiene su caso.
- **La heurística de los 4000 caracteres se queda**: los destinos instalados dependen de ella
  (`CE-014`), y `revisar-secretos.mjs:87` ya lo declara.
- **No se reescribe historia** (`SUITE-R06f`) ni se retira ninguna huella firmada.
- **No se promete que ningún fixture vuelva a aparecer en la historia**: eso lo cerró `PT-193`
  ensamblando los literales — y este mismo caso los ensambla en dos mitades por el mismo motivo.
- **El `false` sigue siendo `false`.** No cambia la conducta del escáner: cambia que sea una
  **decisión declarada** en vez de un efecto de por dónde mira.

## Sin bloqueadores
