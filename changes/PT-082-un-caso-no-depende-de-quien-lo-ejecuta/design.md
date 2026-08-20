# PT-082 — Propuesta   `PHASE 4` · `G2`

## 1 · La identidad, inyectada

```bash
IDENT='GIT_CONFIG_COUNT=2 GIT_CONFIG_KEY_0=user.name GIT_CONFIG_KEY_1=user.email'
YO()   { env $IDENT GIT_CONFIG_VALUE_0="Alberto Martínez" GIT_CONFIG_VALUE_1="albe.mtz@gmail.com" \
         node "$SUITE/tools/tracker.mjs" "$@" "$RAIZ_REAL"; }
OTRO() { env $IDENT GIT_CONFIG_VALUE_0="runner-de-ci" GIT_CONFIG_VALUE_1="r@ci" \
         node "$SUITE/tools/tracker.mjs" "$@" "$RAIZ_REAL"; }
```

Dos helpers, no uno. `OTRO` no es decoración: es la rama del `if` que **nunca tuvo caso** y la
que CI ejecutaba.

## 2 · Los cuatro casos

```bash
chk "viabilidad nombra la sesion abierta"  "en la sesion abierta en"  YO   viabilidad PT-060
chk "…y sigue dando su veredicto"          "veredicto"                YO   viabilidad PT-060
chk "otra identidad NO hereda la sesion"   "no hay sesion abierta"    OTRO viabilidad PT-060
chk "…y lo dice, no lo calla"              "el dia NO es la sesion"   OTRO viabilidad PT-060
```

Los dos últimos fijan que `PT-068` **sigue negándose** a atribuir la sesión ajena. Sin ellos, un
día alguien «arregla» el caso haciendo que `marcaDe` devuelva la marca huérfana y los dos
primeros seguirían verdes.

## 3 · La protección de `trabajo`

```bash
gh api -X PUT repos/a81Biz/cauce/branches/trabajo/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["marco"] },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

Mismo contrato que `main`. `enforce_admins: true` a propósito: una protección que el
administrador salta con un clic convierte la excepción declarada en un gesto sin rastro, y este
lote existe en buena parte por eso.

**Consecuencia buscada:** los commits directos a `trabajo` dejan de ser posibles. Es lo que
`FDGE-R19` ya decía —`trabajo` recibe PRs, no trabajo— y que yo estaba incumpliendo con commits
de mantenimiento.

## 4 · Escenarios

| # | Escenario | Espera |
|:---|:---|:---|
| E1 | Identidad declarada | nombra la sesión abierta |
| E2 | Identidad ajena | dice que **no** hay sesión abierta |
| E3 | Identidad ajena | y lo **dice**, no lo calla (`RULE-06`) |
| E4 | El veredicto sale igual con las dos | la viabilidad no depende de quién pregunta |
| E5 | `gh api` sobre `trabajo` | `["marco"]` · `strict` · `enforce_admins` |
| E6 | La batería completa | sin fallos |

## 5 · `G2`

```
Firmado por lote: EP-017 · delegada · 2026-08-19 · Alberto Martínez
Viabilidad (FDGE-R54): SAFE · registrada en REGISTRY.allocations[].viabilidad
```
