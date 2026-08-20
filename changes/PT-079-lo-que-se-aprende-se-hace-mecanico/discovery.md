# PT-079 — Descubrimiento   `PHASE 2-B`

## Familia A · Dónde está el defecto de trazabilidad, exactamente

```js
// tracker.mjs · cuerpoDeIssue()
const ramaDelEnlace = (viva && ramaTrabajo) ? ramaTrabajo : (rama ?? 'main');
const enlace = `[\`${dir}/\`](${url}/tree/${ramaDelEnlace}/${dir})`;
```

`ramaTrabajo` es **la rama en la que corre el espejo**, no la de la tarea enlazada. Se pasa desde
`espejo()`/`abrir()`, que la derivan de `git branch --show-current`.

Dos consecuencias, y ninguna es hipótesis:

| | Qué | Medido |
|:---|:---|:---|
| `A-1` | El enlace apunta a la rama de **otra** tarea | el issue de `PT-072` apunta a la rama de `PT-074` |
| `A-2` | Esa rama se borra al fusionar (`FDGE-R19`) | **14 de 16** enlaces vivos dan 404 |

## A.1 · Lo que NO se pierde, y corrige mi primer diagnóstico

```
$ git ls-tree --name-only origin/trabajo changes/PT-075-una-regla-sin-verificador-no-ocurre/
  10 archivos
```

**El contenido está a salvo.** Muere el enlace, no la documentación. La distinción decide el
arreglo: no hay que salvar los `.md`, hay que apuntar a un sitio que no desaparezca.

## A.2 · La rama acordada existe, y nunca se publicó

`LEXICON` §6.5 lo tiene escrito:

> *«`proyectar` escribe la rama DERIVADA `cauce/<usuario>`: un agregado de lo vivo, **con el SHA
> de cada rama**. (…) Es LOCAL: publicarla es `--publicar`, una decisión y no un efecto
> colateral.»*

```
local    cauce/alberto-martinez   ✅ ESTADO.md + CHECKPOINT.json
origin   desarrollo · main · trabajo    ❌ la proyección NO está
```

`tracker proyectar --publicar` existe en `tracker.mjs:1936` y funciona. **Nunca se ejecutó.**

Y un defecto dentro del defecto: la columna `SHA` de `ESTADO.md` está **vacía** (`—`) para casi
todas las filas, porque una tarea en `PHASE 1` aún no declara rama. El registro pensado para ser
durable **no está registrando lo durable**.

## A.3 · Por qué nadie lo publicó

Comprobado en los cuatro sitios donde debería obligar:

```
$ grep -c "proyectar\|proyeccion"  CORE.md PHASES.md   ->  0  ·  0
$ grep -c "proyecc"                verify-fdge.mjs      ->  0
$ grep -i "proyecc"                CASOS-DE-USO.md      ->  nada
$ grep -i "proyectar"              MANUAL.md            ->  nada
```

`SUITE-R31` gobierna «medir la divergencia del marco» — **no** publicar la proyección.

**Ninguna regla lo exige, ninguna fase lo abre, ningún verificador lo echa en falta, ningún caso
de uso lo describe y el manual no lo nombra.** Es el séptimo caso del lote con esta forma.

---

## Familia B · Diez fallos míos, y la raíz es una

La tabla completa está en el intake. Lo que el descubrimiento añade es **por qué** se repiten:

**El patrón que los produce es asertar sobre si un identificador aparece en una salida.** Casi
nunca prueba lo que pretende, porque las herramientas nombran cosas por muchos motivos: avisos,
referencias cruzadas, el cuerpo de otra regla, un comentario del propio código.

Tres veces en este lote la aserción correcta resultó ser otra cosa:

```
✗ SUITE-R45              el VEREDICTO, no la mencion
bajo evaluacion: EP-050  una linea que la herramienta NO emitia hasta que el caso la exigio
md5sum antes/despues     una HUELLA — no se satisface por accidente
```

Y dos fallos no son de aserción sino de **andamiaje**: casos que invocan un helper definido mil
líneas más abajo. `TRR` en `PT-076` y `RG2` en `PT-066`. Los dos se manifiestan como «la
herramienta reventó» o «no apareció», que apunta al arreglo y no a la colocación.

## B.1 · Qué es comprobable de esto, y qué no

| Fallo | ¿Detectable mecánicamente? |
|:---|:---|
| Inversa que no revierte | **Sí.** Un helper que aborte si el patrón no casa |
| Aserción anclada sólo en un ID | **Sí, como aviso.** El patrón es reconocible |
| Helper usado antes de definirse | **Sí.** Comparar números de línea |
| Aserción que no casa por caja o acentos | **No.** Sólo se sabe ejecutándola |
| Un arreglo que no arregla | **No.** Es el trabajo, no su forma |
| Que el caso se viera en rojo ANTES | **No.** No deja rastro en el repositorio |

Las tres últimas van a `TD-16`. `PT-023` midió que un verificador equivocado tres de cada cuatro
veces es peor que ninguno.

---

## Familia C · Por qué las dos anteriores no bastan

`PT-075` demostró que una regla sin verificador **no ocurre**. Este lote lleva siete casos de lo
mismo, y el de la proyección es el más claro: **estaba diseñada, escrita, implementada y
documentada en `LEXICON` — y nunca se ejecutó.**

Arreglar `A` y `B` sin `C` produce exactamente eso otra vez: dos mecanismos correctos que nadie
invoca.

`C` es que la regla exista en `RULES.md`, la cite una fase, la exija un verificador, la describa
un caso de uso y la nombre el manual. **Los cinco, o el arreglo caduca.**
