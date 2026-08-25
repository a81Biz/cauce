# HANDOFF — estado retomable

<!-- ESTADO -->
implementación: EP-021 (#270) CERRADA · el aplazado sin puerta de vuelta. OCHO tareas: PT-137 a PT-143 y PT-134, que entró RETOMADA POR COMANDO. G1 y G4 firmadas el 2026-08-24 POR DELEGACIÓN, con la autorización enumerada en SESSION_LOG.md.
tarea:          NINGUNA en curso. Las ocho INTEGRATED y el lote CLOSED, escritos por «tracker integrar». Los siete BUG los validó el firmante por delegación con «tracker validar»; PT-134 es CHORE y también quedó INTEGRADA.
compuerta:      G4 RESUELTA: PR #276, de «trabajo» a «main», fusionado el 2026-08-24 sobre e2dcda2. G1 resuelta y registrada; G2 y G3 delegadas por lote. El PR que le sigue NO es una segunda G4: es el viaje de vuelta del estado terminal (EXEC-R03).
siguiente:      Fusionar el viaje de vuelta a «trabajo» y de ahí a «main» —no es compuerta— y luego «tracker cerrar --aplicar», que hoy se niega con razón porque el estado terminal aún no está en main (SUITE-R46). Y «npm publish», QUE ES DEL FIRMANTE.
decisiones:     El firmante autorizó firmar en su nombre esta compuerta y las siguientes, y pidió que el único arrastre al cerrar sea PT-025 (#35). npm publish sigue reservado PARA ÉL. La regeneración del grafo sigue reservada (FDGE-R32) y esta autorización no la nombra: el grafo queda SUSPECT.
no hacer:       -1) derivar MATRIZ.md antes de escribir HISTORY.log: la matriz LEE el ledger, y regenerarla antes deja CI en rojo. El orden es escribir el ledger, alinear la versión, y derivar lo derivado AL FINAL. 0) DOS baterías a la vez sobre el mismo $WORK: se cometió el 2026-08-24 y el resultado no vale nada — «HAY FALLOS» sin un solo caso rojo visible. 1) npm publish. 2) escribir REGISTRY.json a mano — ahora hay comando también para retomar un aplazado. 3) editar selftest.sh MIENTRAS corre: bash lo lee por desplazamiento de bytes y parte los heredoc. 4) sustituir texto contra un ancla sin comprobar que es ÚNICA: costó 902 líneas de tracker.mjs. 5) commitear el HANDOFF antes que el trabajo (SUITE-R34).
lo que este lote descubrió: DEFERRED no tenía NI entrada NI salida · un AC que decae no tenía dónde declararse · FDGE-R19 pedía el «type» de un lote que LEX-R27 prohíbe · y el manejador de error de SUITE-R56 lanzaba otro error — ningún comando lo escribía ni lo retiraba, e integrar exigía el intake que SUITE-R44 declara exento. Y LEXICON §5.1 ya declaraba «DEFERRED --> READY» sin que nada pudiera ejecutarla.
hallazgo sin tarea: «contradiceElRegistro» busca «INTEGRAD» —la forma castellana— y NO reconoce «INTEGRATED», que es el nombre canónico del estado en LEXICON §5.1. Escribir el estado por su nombre hace fallar SUITE-R34. Se rodeó escribiendo «INTEGRADA» para poder cerrar, y eso es DOCUMENTAR LA LIMITACIÓN en vez de quitarla — justo lo que PT-130 rechazó. Merece tarea propia.
pregunta abierta: si el trabajo DE LOTE puede citar el EP en un commit. Sigue sobre FDGE-R19 desde PT-127. Y una nueva: FDGE-R19 pide el «type» del lote para nombrar su rama y LEX-R27 dice que un lote no lleva type — va a PT-142.
lo que sigue sin resolverse: PT-025 (#35) DEFERRED, el arrastre aceptado · 21 allocations sin suite_version, que NO se rellenan porque sería inventar · las clases CE sin regla que las reclame · el grafo SUSPECT.
actualizado:    2026-08-24 · PT-143 en PHASE 8 Persistencia
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
