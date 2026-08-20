# PT-081 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Pull request de la tarea a `trabajo` — **NO es `G4`**   ✅ AUTORIZADO AL AGENTE

Es **revisión** (`FDGE-R19`). Y desde `PT-082` el merge ya no depende de que yo mire `gh pr
checks`: `trabajo` está protegida y GitHub lo rechaza en rojo.

## 2 · Etiquetar la `v10.0.0`   **RESERVADO**

El tag es lo que fija la línea base del detector de `AC-08`. Hoy la versión anterior es `v9.0.0`;
cuando esta salga, el tag nuevo mueve la referencia.

```bash
git tag -a v10.0.0 -m "10.0.0 · EP-017 · la prueba de fuego"
git push origin v10.0.0
```

**No lo ejecuto.** Etiquetar es declarar que una versión existe, y va con publicar.

> **Ojo al orden:** el tag debe crearse **después** de que la `10.0.0` esté en la rama por
> defecto. Si se etiqueta antes, la línea base apunta a un árbol que todavía no tiene lo que la
> versión trae — y el detector callaría sobre sus propias reglas nuevas. Es el mismo error que
> esta tarea cometió eligiendo `origin/main`, en otra forma.

## 3 · Publicar la `10.0.0`   **NO AUTORIZADO**

Sigue vigente la instrucción del firmante: «No publiques la 9.0.0» — que ahora es la `10.0.0`.

```bash
# desde main, y sólo cuando EP-017 cierre
gh workflow run publicar.yml
```

`publicar.yml` corre **desde `main`** y sólo 5 de las 8 comprobaciones (`PT-071`), así que antes
de publicar conviene cerrar esa tarea.

## 4 · `G4` del lote   AUTORIZADA, PENDIENTE DEL CIERRE DE `EP-017`

Autorización registrada como excepción declarada en `SESSION_LOG.md`. La `G4` de `EP-016` ya se
ejecutó; la de `EP-017` espera a que el lote cierre (`SUITE-R45` exige sus filas de cierre).

## 5 · Lo que este cambio implica para los proyectos ya instalados

Está escrito en la guía de migración de la entrada `10.0.0`, y se resume así: **lo ya terminado no
se toca**, y en cada tarea viva hay que registrar la viabilidad:

```bash
node docs/methodology/tools/tracker.mjs viabilidad PT-NNN --registrar
```

## 6 · Borrar la rama efímera tras fusionar   `FDGE-R19`

```bash
git push origin --delete fix/alberto-martinez/PT-081-una-regla-nueva-no-rige-hacia-atras
```

`SUITE-R06f`. Seguro desde `PT-079`.
