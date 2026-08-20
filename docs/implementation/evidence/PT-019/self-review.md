# PT-019 — Autorrevisión   `PHASE 6`

## La respuesta

**Un legado real de cinco majors atrás puede migrarse, y la herramienta lo dice bien.**

`Inteligencia de Mercados Energéticos Mexicanos`: cauce `4.12.0`, **127 tareas** en `changes/`,
seis lotes cerrados, monorepo con cuatro aplicaciones y pruebas end-to-end. No es un juguete.

## Lo que más vale del resultado

`migrate` no se limitó a decir «se puede». Separó **1 acción automática de 6 decisiones humanas**
y explicó, una por una, **por qué cada decisión es humana**:

> «El bloque `ESTADO` declara qué compuerta esperas y a quién. Rellenarlo con plantilla produce un
> estado que miente.»

Eso es la diferencia entre una herramienta que migra y una que **te deja migrar sin mentir**. Es
lo que la épica quería comprobar.

## Cuánto se separan dos copias del mismo marco

```
cauce                52 archivos
el legado (4.12.0)   39 archivos

DIFIEREN     36 de 39
IDÉNTICOS     3
AUSENTES     13, entre ellos 7 de las 16 herramientas — incluida tracker
```

**Tres archivos de treinta y nueve son iguales.** Un proyecto en `4.12.0` no es cauce con menos
funciones: es, en la práctica, otro marco. Es el mejor argumento que he visto a favor de
`SUITE-R21` —una copia que puede divergir, diverge— y del paquete que la sustituye.

## Lo que NO se hizo, y no se disfraza

**No se ejecutó `migrate --apply`.** El intake lo pone `OUT` y la autorización es usar el proyecto
como caso de prueba, no migrarlo. Intervenir un sistema con 127 tareas de historia que alguien usa
no es una prueba: es una intervención.

Así que lo validado es que **el informe es correcto y accionable**, no que la migración funcione
de extremo a extremo. Entre las dos cosas hay un paso, y los huecos de aplicar sólo salen
aplicando. El camino no destructivo para darlo —clonar y aplicar sobre el clon— está escrito.

**Y `AC-01` quedó reducido**: no construí el legado sintético. El real provoca los casos mejor
porque sus divergencias son auténticas. Es defendible y **sigue siendo una reducción**, así que
se declara en vez de contarla como cumplida.

## Los dos huecos

**`HL-1`** salió de mi propio error de uso: ejecuté `comparar-marco` **desde cauce contra el
proyecto**, y la herramienta llama «canónica» al argumento. Las etiquetas se invierten — dice
«solo en la copia local» de lo que son las novedades del marco. El contenido es correcto; el
rótulo miente. Que esté pensada para correr **desde el proyecto** no está escrito en ningún sitio,
y por eso es un hueco y no una torpeza mía.

**`HL-2`** es más serio y confirma lo que `PT-072` midió por otro camino: `migrate` dice de la
plataforma «**OPCIONAL** … **Sin ella no cambia nada**», y sin ella `tracker avanzar` es
imposible. Un legado que migre siguiendo este informe y decida no declararla **se queda sin poder
mover una tarea**. Dos pruebas independientes llegando al mismo defecto es la señal más fuerte que
ha dado este lote.

## El original, intacto

```
git status --short  →  0 archivos
```

Antes y después. `AC-03` cumplido de la única forma que vale: comprobándolo, no prometiéndolo.

`AC-02`, `AC-03`, `AC-04` verificados · `AC-05` no aplica · **`AC-01` reducido y declarado**.
