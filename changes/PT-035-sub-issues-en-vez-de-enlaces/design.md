# PT-035 — Diseño   `PHASE 4` · `FDGE-R21`

```js
anidar(padre, hijo)  →  POST /issues/{padre}/sub_issues  { sub_issue_id: <ID> }
```

La API pide el **ID** del issue, no su número: son cosas distintas y confundirlas da un `422`
mudo si nadie lee la respuesta. `idDeIssue()` lo resuelve.

`subIssues()` devuelve `null` si falla, no `[]`. La diferencia es la que separa «no hay ninguno»
de «no lo sé».
