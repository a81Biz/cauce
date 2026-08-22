# PT-100 — Autorrevisión `PHASE 6`

## `TD-04` es peor de lo que su entrada decía

No es «el verificador busca `QA/` y git guardó `qa/`» —un desajuste entre herramienta y
proyecto—. Es que **el mismo archivo usaba las dos grafías en líneas consecutivas**:

```js
const QA    = join(ROOT, 'QA');            // :36
const SPECS = join(ROOT, 'qa', 'tests');   // :37
```

Nadie eligió mal. **Nadie eligió.**

## Dos de los cinco hechos no tenían dónde estar declarados

Y ahí está la causa común. `LEX-R21` dice que los nombres van a `LEXICON`, y ni el tipo de caso
`QA` ni el `type` de un lote estaban ahí.

**Cuando un nombre no tiene autoridad, cada herramienta elige el suyo — y ninguna está mal, porque
no hay contra qué contrastarla.** Es la enfermedad de la v3 que `LEXICON` nació para curar,
reaparecida **dentro de las herramientas** en vez de entre documentos.

## Uno iba al revés de lo que esperaba

En `INC-008` el que estaba mal era **el documento**. `tracker.mjs:2509` dice *«la nota vive
**ahora** en `TRANSICIONES.log`»* — un cambio deliberado, con su motivo (`SUITE-R09`,
append-only) — y `FDGE-R52` se quedó atrás.

`LEX-R22` dice que las reglas mandan sobre las herramientas. Pero **una regla que describe un
comportamiento que ya no existe no manda: desinforma.** La regla se actualizó, y el motivo va
escrito dentro de ella.

## Mis propios comentarios rompieron mis propios casos

Escribí en `verify-qa.mjs` que «aquí se esperaba `HP|REG|EDGE|NEG`» y en `RULES.md` que «la regla
decía `bitacora.md`». Los dos `chkno` que comprueban que esos nombres **ya no están** los
encontraron **en mis explicaciones**.

Es el patrón que el `HANDOFF` advierte para las emisiones —*«escribir en un comentario el patrón
literal»*— aquí aplicado a un vocabulario. Reescribí los dos comentarios sin nombrar lo viejo, y
lo dejé dicho en el propio archivo para que no vuelva.

## La inversa me obligó a cambiar una aserción, y luego la dejó sin poder fallar

`S-1` salió en **cero**. Mi caso comprobaba que la constante `GRAFIAS_QA` existiera —una aserción
de **texto**— y se podía pasar dejando la constante y codificando la ruta a mano.

La cambié por una de **comportamiento**: montar un proyecto con `qa/` en minúsculas y comprobar
que la herramienta lo encuentra. Eso la hizo honesta **y a la vez la dejó sin poder caer aquí**,
porque en Windows el sistema de archivos no distingue mayúsculas.

```
asercion de TEXTO           cae con la retirada, pero se puede fingir
asercion de COMPORTAMIENTO  no se puede fingir, y en Windows no puede caer
```

Es `TD-04` describiéndose a sí mismo. **El único sitio donde ese caso puede ponerse rojo es CI**,
que corre en Linux, y va declarado. Una inversa en cero no es un verde: aquí el aviso dice **dónde
hay que mirar**, no que el cambio esté sin probar.

## `audit` me pidió algo que no esperaba

Declaré `LEX-R27` y `LEX-R28` como `HARD` y `audit` las marcó como huecos: *«no la cita ningún
documento operativo»*. No bastaba con implementarlas — **una regla que sólo vive en `LEXICON` y en
el código no la ve quien trabaja en modo `MANUAL`**.

Añadidas a `PHASES` y a `QA-Prompts`. Y `verify-suite` cazó además que `PHASES` citara una regla
que `QA-Prompts` no menciona, que es el mismo criterio aplicado al componente.

**Tres verificadores distintos empujando hacia el mismo sitio**: que una regla exista donde alguien
la vaya a leer.

## Lo que no hice

**No elegí una grafía.** El arreglo acepta las dos y dice cuál usó. Elegir obligaría a renombrar el
árbol de proyectos ajenos, y en git un cambio de mayúsculas rompe clones.

**No toqué el `CHANGELOG`**, que también nombra `bitacora.md`: es historia y `SUITE-R09` la
protege. Lo que decía era cierto cuando se escribió.

**No auditè cuántos hechos más tienen nombre doble.** Cinco conocidos, cinco arreglados. Un `grep`
no puede encontrar lo que no sabe buscar, y decir «no quedan» sería afirmar sin medir.
