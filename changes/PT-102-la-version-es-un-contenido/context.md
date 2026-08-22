# Contexto — `PT-102` · la versión es un contenido, no un número

## De dónde sale

`L-4` del lote `EP-019`, causa `C-3`. Su origen es `INC-004`, registrado por la calculadora:
«la versión es un CONTENIDO, no un número».

## Lo que la entrada decía, y lo que hay

| | |
|:---|:---|
| **`INC-004` decía** | `version.mjs` alinea veintiún documentos y da por alineado lo que no mira |
| **Lo medido** | termina diciendo «Todo declara 11.0.0» con **cuatro** documentos declarando otra |

La diferencia importa: no es que la herramienta deje algo sin mirar y lo diga. Es que **afirma
lo contrario**. Un silencio se nota; un verde falso, no.

## Estado del terreno

```
rama            chore/alberto-martinez/PT-097-apertura
suite           11.0.0
lote            EP-019 · seis cerradas (L-0, L-1, L-2, L-3, L-6) · esta es L-4
grafo           REGENERADO hoy · 761 nodos · 1186 aristas · 28 comunidades
```

**El grafo se regeneró en esta tarea**, y no por higiene: llevaba `SUSPECT` desde el primer
commit de la sesión —ocho de diecisiete archivos cambiados— y no se había mirado ni una vez en
seis tareas. `FDGE-R43` dice que no bloquea, y eso se convirtió en permiso para ignorarlo. Lo
señaló el firmante.

Y **el grafo dio el diagnóstico de esta tarea**, que el `grep` no daba:

```
quien depende de patrones.mjs, la fuente unica de los patrones criticos
   68  tracker.mjs
   42  verify-fdge.mjs
   10  verify-suite.mjs
    6  audit.mjs
    3  build-core.mjs
    2  migrate.mjs
    2  version.mjs      <- la herramienta de la VERSION
```

La herramienta cuyo trabajo **es** reconocer una forma escrita era la que menos compartía de las
siete. La causa se ve en la estructura, no en el texto.

## Lo que este contexto NO establece

- **Cuántas formas más de declarar una versión existen.** Se conocen dos y se miden cinco
  sitios. Un `grep` no encuentra lo que no sabe buscar.
- **Que el grafo esté completo.** Cubre `bin/` y `docs/methodology/tools/` —diecisiete archivos
  de código—. Los documentos de la metodología no están en él.
