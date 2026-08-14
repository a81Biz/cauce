# PT-036 — Descubrimiento   `PHASE 2` · `FDGE-R42`

```js
? `[\`${dir}/\`](${url}/tree/${rama ?? 'main'}/${dir})`
```

`rama` viene de `adaptador.repo()`, que devuelve la rama **por defecto** del repositorio. Un
issue se abre al **empezar** el trabajo, y entonces su contenido solo existe en la rama de
trabajo: el enlace daba 404 durante toda la vida del issue y solo empezaba a funcionar cuando ya
no hacía falta.

El cuerpo lo advertía —«este enlace puede no resolver todavía»— y eso era peor que arreglarlo:
una advertencia convierte un defecto en una característica documentada.

## Y un defecto de fondo que salió con él

El cuerpo del issue nuevo **no se resincronizaba** tras crearlo: `abrir()` tenía **dos finales**
y solo uno estaba completo. Es la cuarta vez en este archivo que un arreglo queda detrás de un
`return` —`PT-014`, `PT-022`, `PT-035`—. Cuatro veces no es descuido: era la forma de la función.
