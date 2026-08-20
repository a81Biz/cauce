# PT-019 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Migrar de verdad el proyecto de Mercados Energéticos   **NO AUTORIZADO**

El intake lo declara `OUT` y la autorización vigente es usarlo como **caso de prueba**. Su
migración se cierra cuando vayas a trabajar allí.

**Lo que esta tarea dejó preparado** es el informe completo. Cuando decidas hacerlo, el camino no
destructivo es este:

```bash
# 1 · sobre un CLON, nunca sobre el original
git clone "C:/DevOps/Desarrollos/Inteligencia de Mercados Energéticos Mexicanos" /c/tmp/ime-clon
cd /c/tmp/ime-clon

# 2 · el informe otra vez, ya sobre el clon
node "C:/DevOps/Desarrollos/cauce/docs/methodology/tools/migrate.mjs" .

# 3 · aplicar, con las 6 decisiones ya tomadas
node "C:/DevOps/Desarrollos/cauce/docs/methodology/tools/migrate.mjs" . --apply

# 4 · comprobar antes de creerse nada
npx cauce verify
```

**Las seis decisiones son tuyas** y `migrate` explica por qué cada una: el bloque `ESTADO` de
`HANDOFF.md`, la `phase` de `EP-009` y `EP-014`, si declaras plataforma, mirar las 7 herramientas
nuevas, firmar falsos positivos de secretos, y la `suite_version` del `CLAUDE.md`.

**Sobre la tercera, un aviso medido:** `migrate` dice que la plataforma es «OPCIONAL … sin ella no
cambia nada». Es **falso** —`PT-072` lo midió— y hasta que `PT-084` lo arregle, **declararla no es
opcional si quieres avanzar fases**.

## 2 · El original no se tocó, y se puede comprobar

```bash
cd "C:/DevOps/Desarrollos/Inteligencia de Mercados Energéticos Mexicanos" && git status --short
```

Devolvió **vacío** antes y después de esta tarea. Todo se hizo en lectura y sin `--apply`.

## 3 · El legado sintético   **NO SE CONSTRUYÓ**

`AC-01` lo pedía y se declara como alcance reducido: el proyecto real provoca los casos mejor, y
sus divergencias son auténticas. Si quieres el sintético igualmente, es trabajo nuevo y no cabe
en esta tarea sin reabrirla.

## 4 · Publicar   **NO AUTORIZADO**

Sigue vigente «No publiques la 9.0.0» — que ahora es la `10.0.0`.
