---
id: P-003
nombre: Verificacion mecanica
clase: Primario
estado: IN_REVIEW
auditoria: PTSA-2026-08-20
criterio_de_validez: "cada regla HARD que declara comprobacion tiene un script que puede fallar, y el fallo es distinguible del exito"
hallazgos: [H-002, H-003]
---

# P-003 — Verificacion mecanica

> Producto **Primario** · estado `IN_REVIEW`
> Hallazgos activos: [[H-002]] · [[H-003]]

## Criterio de validez   `FND-R24`

> «cada regla HARD que declara comprobacion tiene un script que puede fallar, y el fallo es distinguible del exito»

Redactado por quien conoce el negocio y firmado el 2026-08-13. **No lo fija el auditor**: el
auditor mide contra él.

## Qué entrega

Las **16 herramientas** de `docs/methodology/tools/`, y una batería de **1118 casos** que las
ejercita contra un proyecto sintético con defectos inyectados.

## Acid Test   `PTSA-R55`

El criterio firmado tiene dos mitades, y las dos se miden por separado:

**(a) toda regla que declara comprobación tiene un script que puede fallar**

```
CHECK (las que declaran comprobacion): 20 · SIN verificador: 0
```

**Cero excepciones. La mitad (a) PASA.**

**(b) el fallo es distinguible del éxito**  `SUITE-R38`

```
bash docs/methodology/tools/selftest.sh   ->  selftest: OK · 1118 casos
```

Cada caso comprueba una inyección de defecto **y** su ausencia. Un verificador que fallara siempre
no pasaría su propio caso. **La mitad (b) PASA.**

## Y sin embargo, `IN_REVIEW`   `PTSA-R17`

**El producto cumple su rúbrica y la rúbrica está por debajo de la promesa del dominio.**

```
101 de 224 reglas sin ningun verificador  ·  90 de ellas HARD
SUITE-R01  «Evidence Before Action»     ningun verificador la emite
SUITE-R09  el ledger es append-only     ningun verificador la emite
EXEC-R04   G4 es humana                 ningun verificador la emite
```

La Regla del Agua Potable dice que la corrección técnica jamás compensa una falla de dominio. Aquí
el agua está potable según el análisis que se le hace, y el análisis no busca el contaminante:
`SUITE-R01` no está marcada `CHECK`, así que su ausencia de verificador no incumple nada.

Y `H-003`: cinco comprobaciones que miran un proxy en vez del hecho, cuatro de ellas gobernando
compuertas. Una comprobación que mira un proxy **produce un verde que no significa lo que dice**.

## Cadena de trazabilidad inversa

```
Producto        un veredicto que bloquea o deja pasar una compuerta
  ← Transformacion   fail()/warn()/ok() emitiendo el ID de la regla
  ← Servicio         las 16 herramientas · selftest.sh como arnes
  ← Regla            SUITE-R26 cobertura · SUITE-R38 el fallo se distingue del exito
  ← Fuente de datos  RULES.md · LEXICON.md · EXECUTION-MODES.md · REGISTRY.json · el arbol
  ← Accion de usuario  npm run verify · cauce verify · el PR que dispara verificacion.yml
```
