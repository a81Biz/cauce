# PT-012 — Diseño   `PHASE 4`

Dos tramos que **comprueban** en vez de recitar:

```
lt('5.0.0')   HANDOFF sin <!-- ESTADO -->   → pide escribirlo, y dice por qué no lo escribe él
              allocations vivas sin `phase` → las nombra
              sin tracker.plataforma        → la OFRECE (opcional y humana)
              con tracker.plataforma        → los comandos del espejo
              siempre                       → qué llega nuevo, y SECRETOS-EXCEPCIONES

lt('6.0.0') && plataforma declarada
              → G4 sobre un pull request (SUITE-R42) · comentarios (SUITE-R43)
```

## Lo que la herramienta NO escribe, y por qué

**El bloque `ESTADO`.** Declara qué compuerta espera y a quién, cuál es la siguiente acción
concreta y qué decisiones están vivas. Nada de eso lo sabe una máquina, y rellenarlo con
plantilla produciría un estado que **miente** — justo lo que `SUITE-R33` existe para impedir.
`SUITE-R19` lo dice sin rodeos: lo que exige criterio humano nunca se inventa.

El mensaje lo explica en vez de limitarse a exigirlo, porque quien lo lee está decidiendo si
migrar (`RULE-07`).

## Resolución de `G2`   `FDGE-R13`

```
Veredicto:    APROBADA · 2026-08-13 · Alberto Martínez · escrita por el agente POR DELEGACIÓN
Cubre SUITE-R06e para: docs/methodology/tools/migrate.mjs · selftest.sh
NO cubre: G4 ni la publicación.
```
