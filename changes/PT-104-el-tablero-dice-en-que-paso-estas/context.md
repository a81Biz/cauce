# Contexto — `PT-104` · el tablero dice en qué paso estás

## De dónde sale

Petición del firmante del 2026-08-21, y **acordada el 2026-08-13**. `REGISTRY.json:172` guarda
las palabras originales: «usarlo hasta de **máquina de estados** para saber qué va cuándo».

## Lo que ya se intentó, y qué entregó

`EP-007` — «el tablero como máquina de estados» — cerró el 2026-08-13 con `PT-030` y `PT-031`.

```
ENTREGO      tracker siguiente · deriva que toca y como se cierra
             los tres modos de ejecucion exigiendo lo mismo

DECLARO       «LO QUE NO ENTREGA, y por eso existe EP-008: un comando no puede exigir
             haber sido llamado. La respuesta existe ahora fuera de la memoria del
             agente y es citable; obligar a mirarla es otro problema.»
```

`EP-008` (`PT-033`, `PT-034`) hizo que `CORE.md` **abra** con la consulta al tablero. Pero el
tablero **no responde lo que hace falta**: hay que ejecutar `tracker siguiente` para saberlo.

**El hueco quedó escrito hace ocho días y nadie volvió a él.**

## Lo medido

```
cuerpoDeIssue publica     tipo · severidad · lote
                          veredicto de viabilidad (FDGE-R54)
                          enlace a changes/ con ref durable (SUITE-R56)
                          rama donde vive el contenido

NO publica                fase · regla de entrada · regla de salida · siguiente
                          artefactos producidos y cuales EXISTEN
                          bloqueos
```

Y los datos **ya existen**:

```
FASES[n]      nombre · produce[] · cierra      <- las tres piezas, declaradas
queSigue(a)   bloqueos[] · avisos[]            <- derivados desde PT-030
```

Nada de esto había que inventarlo. Había que **publicarlo**.

## Por qué importa en esta sesión concreta

El firmante señaló tres cosas y las tres resultaron ciertas al medirlas: el grafo sin usar en
seis tareas, seis roturas de escapado, y el registro escrito a mano cinco veces. **Las tres las
vio una persona, no una herramienta.**

## Lo que este contexto NO establece

- **Que publicarlo cambie la conducta del agente.** No es comprobable y no se afirma. Lo que
  consigue es que el paso siguiente esté escrito donde se mira sin acordarse, y que saltárselo
  sea visible.
