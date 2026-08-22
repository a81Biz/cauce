# Test scenarios — `PT-097`

> Cada `TS` cita su `AC`. El rojo tiene que fallar **por su aserción** (`FDGE-R17`).

## Los que sí pueden estar en rojo válido hoy

### `TS-01` — `§24.2` existe `AC-01`

```
chk "la especificacion define la clasificacion base"   "### 24.2"
  cat "$SUITE/PTSA/PTSA-V3-Especificacion-Oficial.md"
```

**Hoy falla:** `§24` no tiene subsecciones.

### `TS-02` — `§24.4` existe `AC-02`

```
chk "…y los topes que la rebajan"   "### 24.4"
  cat "$SUITE/PTSA/PTSA-V3-Especificacion-Oficial.md"
```

**Hoy falla.**

### `TS-03` — lo que ya regía sigue donde estaba `regresión`

```
chk "las transiciones de producto siguen en §24"   "PTSA-R38"
  cat "$SUITE/PTSA/PTSA-V3-Especificacion-Oficial.md"
```

**Hoy pasa y debe seguir.** `PT-097.2` renombra `§24` y mete `24.1` por encima: si `PTSA-R38`
desapareciera o cambiara de sitio, este caso lo dice.

### `TS-04` — `verify-ptsa` mira la letra `AC-05`

```
chk "verify-ptsa contrasta la certificacion"   "letraDeCertificacion"
  cat "$SUITE/tools/verify-ptsa.mjs"
```

**Hoy falla:** cero apariciones de `certificac` en ese archivo.

### `TS-05` — ninguna banda publicada sin respaldo `AC-07`

```
chkno "el RESUMEN no publica una banda inventada"   "(75-89)"
  cat "$RAIZ/PTSA/RESUMEN.md"
```

**Hoy falla:** la banda está en `:195`.

## Los de la función — **especificación, no reproducción**

`letraDeCertificacion` no existe, así que su fallo previo sería «la herramienta reventó», que este
arnés trata —con razón— como «no verifica nada». **No son rojos válidos y se dice**, igual que en
`PT-096`.

### `TS-06`…`TS-08` — las tres bandas base `AC-01` `AC-03`

```
trlib "Health 95 da A"       "^A$"   letraDeCertificacion({health:95, confidence:95, freshness:'2026-08-20', healthUnstable:false, riesgoMaximo:5})
trlib "Health 79.9 da B"     "^B$"   letraDeCertificacion({health:79.9, confidence:95, freshness:'2026-08-20', healthUnstable:false, riesgoMaximo:5})
trlib "Health 55 da F"       "^F$"   letraDeCertificacion({health:55, confidence:95, freshness:'2026-08-20', healthUnstable:false, riesgoMaximo:5})
```

### `TS-09`…`TS-12` — los cuatro topes `AC-02` `AC-03`

```
trlib "freshness UNKNOWN topa en C"        "^C$"   …{health:95, freshness:null, …}
trlib "un hallazgo CRITICO topa en C"      "^C$"   …{health:95, riesgoMaximo:12, …}
trlib "health_unstable topa en B"          "^B$"   …{health:95, healthUnstable:true, …}
trlib "Confidence < 90 impide la A"        "^B$"   …{health:95, confidence:89, …}
```

**Cada tope con su caso, y todos partiendo de `health: 95`** — que sin tope daría `A`. Si un tope
no se aplicara, el caso devolvería `A` y fallaría. Es lo que hace que el `min` esté probado y no
sólo escrito.

### `TS-13` — un dato ausente no produce letra `AC-04`

```
trlib "sin Confidence no hay letra"   "^SIN LETRA$"   letraDeCertificacion({health:95, confidence:null, …})
```

**Es el freno.** Sin él, `S-3` sería una frase en un documento; con él, la función no puede
inventarse una letra aunque alguien quiera.

### `TS-14` — el formato leído es el formato escrito `RIE-3`

```
chk "verify-ptsa lee el frontmatter que el RESUMEN escribe"   "certificacion:"
  cat "$RAIZ/PTSA/RESUMEN.md"
```

Ata las dos puntas. Si el frontmatter cambia de forma, la lectura devolvería `undefined`, la
función `null` y la comprobación **se apagaría en silencio** — el riesgo que `PT-096` documentó
con su marcador, aquí en la otra dirección.

## Mapa

| TS | AC | Rojo válido hoy |
|:---|:---|:---|
| `TS-01` `TS-02` | `AC-01` `AC-02` | **sí** |
| `TS-03` | regresión | no — pasa y debe seguir |
| `TS-04` | `AC-05` | **sí** |
| `TS-05` | `AC-07` | **sí** |
| `TS-06`…`TS-13` | `AC-01` `AC-02` `AC-03` `AC-04` | **no** — especificación, declarado |
| `TS-14` | `RIE-3` | no — por construcción |

**Cuatro rojos válidos.** Los ocho de la función son especificación, y va escrito en `selftest.sh`
y no sólo aquí.
