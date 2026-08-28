# HANDOFF — estado retomable

<!-- ESTADO -->
implementación: EP-025 (#326) con 11 tareas: 10 en DONE y 1 aplazada (PT-172). NO cierra hasta despues del merge a main: DONE no es terminal, INTEGRATED si (SUITE-R46). Version 13.4.0. LA BATERIA SE CERTIFICA POR UNA CORRIDA, NO POR UNA BANDERA (PT-191): completa 1923 casos / 27m24s, y con SU RECIBO se sellaron los 4 bloques; acotada despues 126 casos / 4m23s. EP-024 (#306) CLOSED y en main con 13.3.0.
tarea:          ninguna abierta. PT-190, PT-191 y PT-193 en PHASE 8 DONE. El PR #346 esta FUSIONADO a trabajo; el PR #352 (trabajo -> main) es G4.
compuerta:      G4 AUTORIZADA por el firmante y con constancia en SESSION_LOG.md (EXEC-R04a), entrada del 2026-08-28. La autorizacion cubre tambien el borrado de ramas remotas (excepcion declarada a SUITE-R06f). NO cubre publicar: «salvo publicar» lo reserva por su nombre, y npm publish sigue sin autorizar.
siguiente:      1) merge del PR de cierre a trabajo · 2) G4: merge del #352 a main · 3) «tracker integrar PT-190 PT-191 PT-193 --aplicar» · 4) «tracker cerrar --aplicar» (SUITE-R46) · 5) «tracker cierre EP-025 --aplicar» · 6) «tracker proyectar --publicar» (SUITE-R56) · 7) tag v13.4.0 DESPUES del merge · 8) borrar las ramas efimeras · 9) EP-026: PT-179 (S1), PT-181, PT-187, PT-192, PT-194, PT-195.
decisiones:     1) El bloque agrupa por MAJOR y su MAJOR sale del COMMIT que introdujo la seccion. 2) UN BLOQUE SE CERTIFICA POR HABER PASADO, y desde PT-191 eso se comprueba: «selftest.sh --todo» deja CORRIDA.json con veredicto, recuento y HUELLA DEL ARNES, y «sellar-bloques --verde» se niega sin recibo, con recibo ilegible, en rojo o de otra bateria — y dice CUAL. 3) EL RECIBO NO SE VERSIONA: si viajara, cualquier clon podria sellar sin correr nada. El SELLO si: es la decision. 4) Reabrir NO es volver a correr. 5) verificacion.yml salta lo sellado; publicar.yml corre la COMPLETA a proposito. 6) Los literales de fixture se ENSAMBLAN en mitades (PT-193, precedente PT-015). 7) Las ramas que el marco necesita son main, trabajo y cauce/<usuario> (proyeccion, SUITE-R56). Todo lo demas es efimero y se borra al fusionar (FDGE-R19).
no hacer:       -27) LA IDENTIDAD GIT DEL REPO PUEDE NO SER DE NADIE: era «T <t@t>», la del arnes, en la config LOCAL — y firmo TRES commits de esta sesion. «tracker personas» lo decia y ninguna compuerta lo leia. Corregido con «git config --local --unset»; el hueco es PT-195. Mira «git config user.name» antes de commitear. -26) MAIN LOCAL PUEDE TENER RESTOS DEL ARNES: 13 commits («base del fixture», PT-001, otro.txt) que origin/main nunca tuvo. Se alinea con «git branch -f main origin/main»: origin es la fuente (SUITE-R31). -25) «trabajo» ESTA PROTEGIDA y no acepta «update-branch» por API: para traer main hay que hacerlo en una rama efimera y pasar por PR. -24) LOS DERIVADOS VAN DESPUES DE LA ULTIMA EDICION, TAMBIEN SI ES UN COMENTARIO: 28 minutos de bateria por una cifra de lineas. -23) NO CITAR EL VALOR DE UN FIXTURE EN LA DOCUMENTACION: escribi los documentos de la tarea que SACA el literal citandolo, y FDGE-R45 me cazo en cuatro archivos. -22) EL ANCLA DE UNA INSERCION CASA LA PRIMERA APARICION: usa rindex y comprueba que no queda nada detras. -21) NUNCA RUTAS RELATIVAS AL FINAL DEL ARNES: hace «cd $WORK» en el shell PRINCIPAL (1159, 3019). Por esto una corrida de 1923 casos termino SIN RECIBO y nada lo dijo. -20) EL HEREDOC DEL SHELL SE COME LOS BACKSLASH: escribe el script a un archivo. -19) CORRER «npm run verify» ENTERO. -18) UN CASO PUEDE FIJAR EL CERO DE LO PROHIBIDO, NUNCA EL NUMERO DE LO CORRECTO: cuarta y quinta aparicion en PT-191, ya con tarea (PT-192). -17) EL ARNES PUDO ESCRIBIR EN EL REPOSITORIO REAL: arreglado en PT-188, pero mira «git log -1» y el numero de allocations antes de correr. -16) El sello del HANDOFF va al final, en su propio commit. -15) NO trabajar sobre «trabajo». -14) «node -e» pone los argumentos en argv[1]. -13) Las banderas son --epica y --severidad. -12) eventos ANTES que matriz. -11) NO editar tools/ con la bateria corriendo.
lo que este lote descubrio: el sello se estampaba con una BANDERA y nadie comprobaba que la corrida ocurriera — el caso que lo destapo es real, y sellar entonces habria certificado 16 secciones que ese dia NO corrieron · CINCO defectos en el arreglo del sello, TRES del codigo que la sesion anterior dejo escrito sin correr y DOS mios, y los cinco producian SILENCIO en vez de rojo · commitear el fixture de PT-190 metio una contrasena sintetica en la HISTORIA, donde «cauce:senuelos» no llega · el mismo valor estaba DOS veces y con la segunda en pie el AC era INALCANZABLE · Y LA IDENTIDAD GIT DEL REPOSITORIO ERA LA DEL ARNES, con tres commits de esta sesion firmados por «T <t@t>».
hallazgo sin tarea: NINGUNO. EP-026 tiene PT-179 (S1), PT-181, PT-187, PT-192, PT-194 y PT-195. Los cuatro nuevos citan la parada de PT-191 que los produjo (FDGE-R55), con su explicacion en changes/PT-191-.../paradas/ y publicada en el issue #348.
pregunta abierta: si el trazo PT -> caso debe derivarse del grafo, como pidio el firmante. Y graphify, que el marco exige (FND-R14, FDGE-R43), tiene graphify-out/graph.json VACIO: «{}», 3 bytes, mientras GRAPH_REPORT.md declara 1028 nodos.
lo que sigue sin resolverse: PT-025 (#35) DEFERRED · PT-172 DEFERRED en este lote · PT-181 es la UNICA allocation que sigue sin citar su parada (FDGE-R55), y es anterior a esta sesion · 21 allocations sin suite_version · 4 PT historicos sin lote · el slug de PT-155 sigue divergiendo · v9.0.0, v10.0.0 y v5.2.0 tienen tag y no estan en npm · 4.13.0, 5.0.0 y 5.1.0 estan en npm y no en el CHANGELOG · verify-fdge deja 7 comprobaciones SIN EVALUAR (SUITE-R43 x6, SUITE-R08 x1) y eso no aprueba ni bloquea · GitGuardian esta en rojo por la contrasena sintetica de fb10d3de, no es required y se silencia en su dashboard, no desde el repo.
actualizado:    2026-08-28 · EP-025 CLOSED · 11 tareas terminales (10 INTEGRATED, 1 aplazada) · G4 HECHA y v13.4.0 etiquetada en a5f3b676. Falta la SEGUNDA vuelta a main para que INTEGRATED llegue alli y «tracker cerrar» pueda cerrar los issues (SUITE-R46): cerrar un lote exige pasar por G4 DOS veces, y eso es PT-196
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
