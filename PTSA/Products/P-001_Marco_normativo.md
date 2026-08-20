---
id: P-001
nombre: Marco normativo
clase: Primario
estado: VALIDATED
auditoria: PTSA-2026-08-20
criterio_de_validez: "cada regla tiene ID estable, severidad y un unico documento propietario, y ninguna se define dos veces"
hallazgos: []
---

# P-001 — Marco normativo

> Producto **Primario** · estado `VALIDATED`
> Hallazgos activos: ninguno

## Criterio de validez   `FND-R24`

> «cada regla tiene ID estable, severidad y un unico documento propietario, y ninguna se define dos veces»

Redactado por quien conoce el negocio y firmado el 2026-08-13. **No lo fija el auditor**: el
auditor mide contra él.

## Qué entrega

`LEXICON.md` · `RULES.md` · `EXECUTION-MODES.md` y el `CORE.md` compilado a partir de los tres.
**224 reglas** con identificador, severidad y un documento propietario.

## Acid Test   `PTSA-R55`

Ejecutado sobre la salida real —`reglasDelMarco()` leyendo los tres documentos propietarios—, no
sobre pruebas unitarias ni sobre el código que las genera:

```
reglas totales                          224
sin ID estable                            0
sin severidad                             0
en mas de un documento propietario        0
identificador repetido en el universo     0
definidasDosVeces()                       0
severidades:  HARD 191 · CHECK 20 · SOFT 13
```

**Los cinco criterios en cero. `P-001` VÁLIDO.**

## Cadena de trazabilidad inversa   `PTSA-R16` · `PTSA-R36`

```
Producto        CORE.md · 248 reglas · ~24 903 tokens
  ← Transformacion   tools/build-core.mjs, que recorta cada regla a su frase imperativa
  ← Servicio         tools/verify-suite.mjs (coherencia) · tools/audit.mjs (cobertura)
  ← Regla            LEX-R21 orden de autoridad · LEX-R22 ningun documento enuncia obligaciones
  ← Fuente de datos  RULES.md 184 · LEXICON.md 26 · EXECUTION-MODES.md 14
  ← Accion de usuario  el agente carga CORE.md al abrir sesion (SUITE-R15)
```

Cadena completa e ininterrumpida. Ningún eslabón inferido.

## Lo que este producto NO garantiza

Que las reglas se **cumplan**. Eso es `P-003`, y ahí está `H-002`.
