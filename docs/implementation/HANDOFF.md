# HANDOFF — estado retomable

<!-- ESTADO -->
implementación: EP-024 (#306) CLOSED · 28 tareas, 27 INTEGRATED. G4 resuelta y en main con 13.3.0. Tags v13.2.0 y v13.3.0 creados, mas los CINCO recuperados —v5.2.1 v5.2.2 v5.2.3 v6.0.1 v7.1.0—: publicadas en npm sin tag pasan de 5 a 0. EP-025 (#326) READY y EMPEZADA por PT-188.
tarea:          PT-188 en PHASE 8, DETENIDA por su propia compuerta: FDGE-R54 dio UNSAFE y esa regla detiene con checkpoint y handoff. Su trabajo esta COMPLETO y en verde; falta la bateria completa y G4.
compuerta:      G4 de EP-024 resuelta. FDGE-R54 de PT-188 en UNSAFE: la decision de seguir es HUMANA (SUITE-R06). No se rodeo.
siguiente:      1) decidir si se sigue pese al UNSAFE · 2) bateria completa · 3) G4 de PT-188 · 4) PT-173, que necesita rehacer la bandera --seccion —se perdio sin commitear cuando el arnes daño el arbol— · 5) PT-174, PT-175, PT-176 en ese orden. npm publish SIGUE RESERVADO.
decisiones:     1) EP-025 gana Revision 1: PT-188 entra el PRIMERO, antes que PT-173. El orden de las otras cuatro no cambia. 2) Los cinco tags se RECUPERARON, no se inventaron: cada commit se localizo y se verifico leyendo su package.json. 3) La carpeta de un PT se BUSCA por prefijo (PT-180). 4) El sello del HANDOFF va al final, en su propio commit (SUITE-R34).
no hacer:       -17) EL ARNES PUDO ESCRIBIR EN EL REPOSITORIO REAL y ocurrio: un «( cd "$WORK"» sin «&&» dejo caer git init, commit, checkout -b y merge sobre main. Quedaron 4 allocations de 213. Arreglado en PT-188 con DOS puertas, pero ANTES de correr el arnes conviene comprobar «git log -1» y el numero de allocations. -16) El sello del HANDOFF va al final, en su propio commit. -13) Las banderas son --epica y --severidad. -11) NO editar tools/ con la bateria corriendo. -12) EL ORDEN DE LOS DERIVADOS: eventos ANTES que matriz, los dos DESPUES de la ultima edicion.
lo que este lote descubrio: EL ARNES DESTRUYO EL ARBOL LOCAL y el remoto lo salvo (PT-188, S1) · la cifra de «338 casos sobre estado ajeno» del intake NO SE PUDO REPRODUCIR: cuatro criterios estaticos dieron 595, 292, 111 y 276, los cuatro falsos, y la causa es que un analisis por lineas de shell no ve comandos multilinea ni rutas con variables · graphify-out/graph.json esta VACIO —«{}», 3 bytes— mientras GRAPH_REPORT.md declara 1028 nodos, y su alcance no incluye changes/: hoy el grafo NO puede decir de donde sale cada caso.
hallazgo sin tarea: NINGUNO. EP-026 tiene PT-179 (S1) PT-181 PT-182 PT-187. Declarados con vuelta al 2026-09-30: la forma de los bloques (PT-172) · la clasificacion retroactiva y el sello por VERSION del marco (PT-176) · el paso de sincronizacion que PHASE 9 no declara (PT-186) · el ciclo de dos viajes al tablero (PT-186) · la severidad de PT-179/181/182 (PT-183).
pregunta abierta: si el trazo PT -> caso debe derivarse del grafo, como pidio el firmante. Existe en el nombrado —26 de 46 secciones nombran su PT— y NADIE lo deriva. Y graphify, que el marco exige (FND-R14, FDGE-R43), tiene su salida legible por maquina vacia.
lo que sigue sin resolverse: PT-025 (#35) DEFERRED · 21 allocations sin suite_version · 4 PT historicos sin lote · el slug de PT-155 sigue divergiendo, ahora NOMBRADO · v9.0.0, v10.0.0 y v5.2.0 tienen tag y no estan en npm · 4.13.0, 5.0.0 y 5.1.0 estan en npm y no en el CHANGELOG.
actualizado:    2026-08-27 · PT-188 detenida por FDGE-R54 UNSAFE · decision humana
<!-- /ESTADO -->

---

## `EP-018` — lo que la auditoría encontró   `2026-08-20`

**Abierta y con `G1` resuelta.** Siete tareas en `READY`, ninguna empezada.

| Orden | Tarea | Sev | Qué cierra | Hallazgo |
|:---|:---|:---|:---|:---|
| 1 | `PT-088` #164 | S1 | `SUITE-R09`, `EXEC-R04` y `SUITE-R01` se verifican **o se declaran** | `H-002` |
| 2 | `PT-087` #163 | S1 | Una comprobación declara **qué hecho establece** | `H-003` |
| 3 | `PT-089` #165 | S2 | La divergencia registro/YAML deja de apagar comprobaciones | `H-004` |
| 4 | `PT-090` #166 | S2 | La frescura del grafo es comprobable en cualquier clon | `H-005` · `TD-17` |
| 5 | `PT-091` #167 | S3 | Las cifras del inventario se derivan | `H-007` · `H-006` |
| 6 | `PT-093` #169 | S2 | El límite de las compuertas se declara | `H-009` |
| 7 | `PT-092` #168 | S2 | Ejecutar `QA` y `FPGE` | `H-008` · `TD-15` |

**El orden no es preferencia.** `PT-088` va primero porque sus tres comprobaciones son el **banco
de pruebas** del mecanismo que construye `PT-087`: si el mecanismo no sabe expresar qué mide
`SUITE-R09`, está mal, y se sabe antes de imponerlo a 224 reglas. `PT-092` va último para
ejecutar `QA` y `FPGE` sobre el marco **ya corregido**.

**Dos tareas devuelven la pelota al firmante a mitad**, y está declarado en el intake §8:
`PT-093` pide una decisión de diseño, y `PT-092` tiene que decidir qué es «usar el sistema» para
un paquete de línea de comandos sin navegador.

Auditoría de origen: [`PTSA/RESUMEN.md`](../../PTSA/RESUMEN.md) · certificación **B** ·
el score **caduca el 2026-09-20** (`PTSA-R20`).

---

## Retomar aquí — 2026-08-22

**El lote NO está cerrado.** Lo que sigue es exacto y contrastable.

### Lo cerrado (`DONE`, con `HISTORY` y evidencia)

```
PT-096  PT-097  PT-098  PT-099  PT-100      (sesiones anteriores)
PT-102  PT-103  PT-104  PT-105  PT-106  PT-107
```

### Lo cerrado en la última tanda

```
PT-108  #208   la tercera forma de declarar la version
PT-109  #209   una compuerta no es una revision sorpresa   L-7, PARCIAL
PT-110  #210   sellar mide lo que exige
```

Las tres en `PHASE 8`, `DONE`, con `HISTORY`, evidencia y trazabilidad.

**`PT-109` cierra `L-7` PARCIALMENTE y está declarado.** De los cinco `INC` del reparto, dos se
arreglaron y **tres no tienen descripción accesible**: viven en el `INCIDENTS.log` de la
calculadora, que no está en esta máquina. Arreglar «algo parecido» sería inventar el defecto y su
arreglo a la vez.

**`PT-108` deja un `AC` sin cubrir y lo dice.** `AC-04` pide un caso de batería y no se escribió:
exigiría un fixture con su propio `REGISTRY.json`. Está comprobado **a mano** y queda como deuda
declarada, no como verde.

### Lo abierto sin empezar

```
PT-101   L-9 · el escapado que no existe no se rompe   intake FIRMADO, sin codigo
L-8      lo que una compuerta no puede exigir sin contradecir a otra   SIN allocation
```

### El sello, hecho salvo los dos pasos humanos

```
HECHO    CHANGELOG 12.0.0 con guia de migracion (SUITE-R19)
         version alineada en 12.0.0 en los 21 documentos, CLAUDE.md, package.json y REGISTRY
         CORE.md regenerado · 252 reglas
         SELLO.md de la 12.0.0 · cinco documentos de entrada decididos
         MANUAL.md actualizado por SUITE-R58
         grafo regenerado · inventario al dia

FALTA    tag        SUITE-R06a · HUMANO
         PR a main  SUITE-R06a · HUMANO
```

### Lo que bloquea cerrar los issues

**Quince issues siguen abiertos en GitHub** y no es un descuido: `SUITE-R46` prohíbe cerrarlos
antes del merge —el estado terminal se apunta, se mergea, y **entonces** se cierra—. Como nada se
ha fusionado a `trabajo`, ninguno puede cerrarse todavía.

```
#189 EP-019   #191 PT-096   #194 PT-097   #196 PT-098   #197 PT-099
#198 PT-100   #199 PT-101   #200 PT-102   #201 PT-103   #202 PT-104
#203 PT-105   #204 PT-106   #205 PT-107   #208 PT-108   #209 PT-109
#210 PT-110   #35 PT-025 (ajeno al lote)
```

### El orden para retomar

```
1  PT-101 (L-9)          el escapado que no existe no se rompe · intake YA FIRMADO
2  L-8                   asignar y ejecutar · lo que una compuerta no puede exigir
3  PT-108 AC-04          el caso de bateria que quedo sin escribir
4  cerrar EP-019         resolver el ## Cierre del lote (SUITE-R45)
5  merge a trabajo       permite cerrar los QUINCE issues
6  tag y PR a main       HUMANO · SUITE-R06a
```

**Nada de esto esta empezado.** El paso 1 tiene su intake firmado y ni una linea de codigo.

### Lo que NO se ha hecho y no se hará sin decirlo

- **Publicar.** No autorizado. La `11.0.0` está en npm; la `12.0.0` no se publica.
- **Merge a `main`.** El firmante lo scoped a «todo se queda en `trabajo`, y `main` al final».
- **La calculadora y el legado.** Fuera: tienen su rama y su firmante.

### Los tres avisos del firmante, y qué salió de cada uno

| Señalamiento | Medido | Resultado |
|:---|:---|:---|
| «el grafo no se usa» | `SUSPECT` seis tareas, declarado seis veces, usado cero | al regenerarlo **dio el diagnóstico de `PT-102`** |
| «problemas con los escapes» | **ocho** roturas · el marco las cuenta en cuatro comentarios sin sumar: son **diecisiete** | `PT-101` |
| «nada te obliga a seguir el marco» | `asignar` escribía **4 campos de 9**; registro a mano **cinco veces** | `PT-103` → `PT-105` → `PT-107` |

**Cinco de las once tareas de hoy salieron de ejecutar las otras**, no de planificarlas.

### Lo que este handoff NO establece

- **Que el reparto esté completo.** Once tareas en un día salieron de ejecutar; es esperable que
  ejecutar las que quedan destape más.
- **Que `PT-104` cambie la conducta del agente.** No es comprobable y no se afirma.

---

## Retomar aquí — 2026-08-22, segunda tanda

**El reparto está completo.** `L-0` a `L-9` con dueño y estado, y las catorce tareas en `DONE`.
Solo `EP-019` sigue vivo.

### Lo cerrado en esta tanda

```
PT-101  #199   L-9 · SUITE-R59 · el escape que no existe no se rompe
PT-111  #211   el espejo compara lo que se lee
PT-112  #212   L-8 · «--forzar» no es una compuerta
```

### Lo que queda, y es corto

```
1  merge del PR #195 a trabajo      CI «marco» debe estar en verde
2  cerrar los issues del lote       SUITE-R46 los libera DESPUES del merge
3  tag de la 12.0.0                 SUITE-R06a · HUMANO
4  PR de trabajo a main             SUITE-R06a · HUMANO
```

**Nada más está pendiente de trabajo.** Lo que falta son actos del firmante.

### Las dos partes que NO se hicieron, y constan

- **Cinco de los quince `INC`** —`INC-003`, `INC-005`, `INC-007`, `INC-013`, `INC-014`— no tienen
  descripción accesible: viven en el `INCIDENTS.log` de la calculadora, que no está en esta
  máquina. Declarados en `PT-109` y `PT-112`.
- **La fila del cuarto proyecto desde npm.** El paquete publicado es la `11.0.0`, el marco
  **anterior** al lote. Se resuelve cuando exista un paquete `12.0.0`, y publicar es acto del
  firmante.

### Lo que no se hará sin decirlo

- **Publicar.** No autorizado.
- **Fusionar a `main`.** El PR se abre; fusionarlo es `SUITE-R06a`.
- **La calculadora y el legado.** Fuera: tienen su rama y su firmante.
