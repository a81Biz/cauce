# `PT-152` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | `triggers()` devuelve la lista completa | importar `patrones.mjs` y contar | aparece `[START MIGRATE]`, que no es de ningún componente |
| TS-02 | cada trigger de suite declara su regla | leer `TRIGGERS_DE_SUITE` | cada entrada trae `regla` y `para` |
| TS-03 | los de componente siguen estando | buscar `[START FDGE]` en la lista | la lista creció, no cambió de contenido |
| TS-04 | `CORE.md` publica lo declarado | regenerar y buscar el trigger | el bloque de triggers del núcleo lo incluye |

**Dónde viven**: selftest §EP-024 · 4 casos `mlib`.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
