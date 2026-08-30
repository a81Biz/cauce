# HANDOFF — estado retomable

<!-- ESTADO -->
implementación: EP-026 (#331) READY · 16 tareas, 10 DONE y 6 sin terminar. El lote crecio de 14 a 16 en marcha: PT-204 y PT-205 entraron con su motivo declarado en el intake. Cerradas hoy: PT-196 (lo posterior a G4 tiene dueno), PT-198 (el campo del frontmatter se lee por un sitio), PT-203 (la pertenencia la asigna el registro, y 26 firmas certificadas con dueno EP-027) y PT-205 (lo que rompera en CI se dice antes de empujar). NINGUNA esta INTEGRATED: el lote no ha pasado por G4 todavia.
tarea:          PT-205 en PHASE 8 DONE y fusionada a «trabajo». Siguiente por el orden del lote: PT-195, la identidad git que no se comprueba. SU ANALISIS YA ESTA ESCRITO —discovery, strategy, escenarios y trazabilidad— igual que el de PT-194 y PT-202, y el discovery de PT-187. Empezar por «tracker firmar PT-195 --compuerta G1» y avanzar a PHASE 5: las cuatro fases de analisis estan hechas.
compuerta:      G3 delegada por el VoBo del 2026-08-28 (SESSION_LOG), vigente para todo EP-026. NO cubre publicar: «salvo publicar» lo reserva por su nombre y npm publish sigue sin autorizar. G1 de EP-027 #375 y de EP-028 SIN FIRMAR a proposito: la autorizacion del 2026-08-29 cubrio ABRIRLAS, no admitirlas. Y PT-197 (DICTAMEN) necesita una decision del firmante en PHASE 2 que FND-R24 le reserva.
siguiente:      1) «tracker firmar PT-195 --compuerta G1 --firmante ... --aplicar» y avanzar a PHASE 5, que su analisis ya esta · 2) PT-194 · 3) PT-202 · 4) PT-187 · 5) PT-206 (solo tiene la parada) · 6) PT-204 (intake escrito, G1 sin firmar) · 7) PT-197, la ultima, con la decision del firmante delante · 8) el cierre del lote, que estrena el protocolo de PT-196 y pasa por G4 DOS veces · 9) abrir EP-028.
decisiones:     1) El bloque agrupa por MAJOR y su MAJOR sale del COMMIT que introdujo la seccion. 2) UN BLOQUE SE CERTIFICA POR HABER PASADO, y desde PT-191 eso se comprueba: «selftest.sh --todo» deja CORRIDA.json con veredicto, recuento y HUELLA DEL ARNES, y «sellar-bloques --verde» se niega sin recibo, con recibo ilegible, en rojo o de otra bateria — y dice CUAL. 3) EL RECIBO NO SE VERSIONA: si viajara, cualquier clon podria sellar sin correr nada. El SELLO si: es la decision. 4) Reabrir NO es volver a correr. 5) verificacion.yml salta lo sellado; publicar.yml corre la COMPLETA a proposito. 6) Los literales de fixture se ENSAMBLAN en mitades (PT-193, precedente PT-015). 7) Las ramas que el marco necesita son main, trabajo y cauce/<usuario> (proyeccion, SUITE-R56). Todo lo demas es efimero y se borra al fusionar (FDGE-R19).
no hacer:       -34) «git add -A» EN UNA RAMA COMPARTIDA SE LLEVA EL TRABAJO DE LA TAREA SIGUIENTE: el commit 4811527 dice «PT-194 su viabilidad consta» y arrastro revisar-secretos.mjs (+53) y seis casos del arnes (+61), que son la IMPLEMENTACION de PT-194, dentro del PR de PT-195. El mensaje no miente sobre el PT que cita (FDGE-R19) pero SI sobre su contenido. Anade por RUTA lo que estas commiteando, no «-A», cuando en el arbol hay trabajo de dos tareas. -33) EL BLOQUE ESTADO CADUCA CON FECHA FRESCA: «sellar-estado» estampa SOLO «actualizado:» —por diseno, LEX-R26: la prosa es lo unico que no se deriva—, asi que SUITE-R34 puede pasar sobre un bloque que describe un lote cerrado hace dias. Al cerrar jornada, RELEE las cuatro lineas de prosa y corrigelas a mano. -32) LA PARADA SE REGISTRA CON «tracker parada», NO ESCRIBIENDO EL ARCHIVO: el comando escribe «origen_parada» en el registro EN EL MISMO ACTO que publica la parada. Escribir solo el .md deja FDGE-R55 en rojo en CI, y es CE-006. Firma: tracker parada <EP/PT que paro> --motivo <clase> --texto <ruta> --desenlace abre --abre PT-NNN --aplicar. -31) TRAS CREAR UNA ALLOCATION, REPUBLICA EL ISSUE DESPUES DEL PUSH: «abrir» publica cuando el intake todavia no esta en un ref durable, asi que el issue queda SIN ENLACE y SUITE-R51 bloquea en CI. Corre «tracker abrir --aplicar» OTRA VEZ despues de empujar. Tres veces hoy (EP-027, PT-204, PT-205). Hueco: PT-207. -30) EL ESTADO SOLO SE SELLA AVANZANDO DE FASE, Y ESO ES UN HUECO: «avanzar» es el UNICO que estampa «actualizado:» en HANDOFF.md (tracker.mjs:3799). Cualquier trabajo legitimo en changes/ fuera de una transicion —el analisis de las siguientes tareas, una parada— deja el estado atras y SUITE-R34 BLOQUEA, sin via sancionada para refrescarlo. Es CE-006 por construccion. Mientras no exista el comando: escribe la prosa del HANDOFF y estampa «actualizado:» con su valor DERIVADO (fecha de «git log -1 --format=%cs» + el PT en su fase), y commitea el HANDOFF EL ULTIMO. Registrado como parada que abre PT-205. -29) NO AVANZAR LA FASE DE LA SIGUIENTE TAREA CON UN PR EN VUELO: «avanzar» publica en el TABLERO al instante y escribe el registro en la RAMA. Avanzar PT-203 a PHASE 2 mientras el PR de PT-198 estaba en CI dejo el issue #365 diciendo «fase: 2» sin que ninguna rama lo tuviera, y SUITE-R35 fallo en CI con razon. El analisis (leer, medir) SI se puede adelantar; «avanzar» no. -28) UN MODULO IMPORTADO NO DEBE VALIDAR LOS ARGV DEL PROCESO: verify-fdge IMPORTA tracker.mjs, y su validacion de banderas rechazaba «--sellar» nombrando banderas de tracker. Arreglado con la guarda EJECUTADO_DIRECTO, que ya existia 500 lineas mas abajo. -27) EL SELLO DE UN PT DEBE INCLUIR EL VERIFICADOR: sin la huella de verify-fdge.mjs y patrones.mjs, el sello certifica contra reglas que ya no existen. Es la pieza de PT-191 y la mas facil de olvidar. -27) LA IDENTIDAD GIT DEL REPO PUEDE NO SER DE NADIE: era «T <t@t>», la del arnes, en la config LOCAL — y firmo TRES commits de esta sesion. «tracker personas» lo decia y ninguna compuerta lo leia. Corregido con «git config --local --unset»; el hueco es PT-195. Mira «git config user.name» antes de commitear. -26) MAIN LOCAL PUEDE TENER RESTOS DEL ARNES: 13 commits («base del fixture», PT-001, otro.txt) que origin/main nunca tuvo. Se alinea con «git branch -f main origin/main»: origin es la fuente (SUITE-R31). -25) «trabajo» ESTA PROTEGIDA y no acepta «update-branch» por API: para traer main hay que hacerlo en una rama efimera y pasar por PR. -24) LOS DERIVADOS VAN DESPUES DE LA ULTIMA EDICION, TAMBIEN SI ES UN COMENTARIO: 28 minutos de bateria por una cifra de lineas. -23) NO CITAR EL VALOR DE UN FIXTURE EN LA DOCUMENTACION: escribi los documentos de la tarea que SACA el literal citandolo, y FDGE-R45 me cazo en cuatro archivos. -22) EL ANCLA DE UNA INSERCION CASA LA PRIMERA APARICION: usa rindex y comprueba que no queda nada detras. -21) NUNCA RUTAS RELATIVAS AL FINAL DEL ARNES: hace «cd $WORK» en el shell PRINCIPAL (1159, 3019). Por esto una corrida de 1923 casos termino SIN RECIBO y nada lo dijo. -20) EL HEREDOC DEL SHELL SE COME LOS BACKSLASH: escribe el script a un archivo. -19) CORRER «npm run verify» ENTERO. -18) UN CASO PUEDE FIJAR EL CERO DE LO PROHIBIDO, NUNCA EL NUMERO DE LO CORRECTO: cuarta y quinta aparicion en PT-191, ya con tarea (PT-192). -17) EL ARNES PUDO ESCRIBIR EN EL REPOSITORIO REAL: arreglado en PT-188, pero mira «git log -1» y el numero de allocations antes de correr. -16) El sello del HANDOFF va al final, en su propio commit. -15) NO trabajar sobre «trabajo». -14) «node -e» pone los argumentos en argv[1]. -13) Las banderas son --epica y --severidad. -12) eventos ANTES que matriz. -11) NO editar tools/ con la bateria corriendo.
lo que este lote descubrio: el sello se estampaba con una BANDERA y nadie comprobaba que la corrida ocurriera — el caso que lo destapo es real, y sellar entonces habria certificado 16 secciones que ese dia NO corrieron · CINCO defectos en el arreglo del sello, TRES del codigo que la sesion anterior dejo escrito sin correr y DOS mios, y los cinco producian SILENCIO en vez de rojo · commitear el fixture de PT-190 metio una contrasena sintetica en la HISTORIA, donde «cauce:senuelos» no llega · el mismo valor estaba DOS veces y con la segunda en pie el AC era INALCANZABLE · Y LA IDENTIDAD GIT DEL REPOSITORIO ERA LA DEL ARNES, con tres commits de esta sesion firmados por «T <t@t>».
hallazgo sin tarea: NINGUNO. EP-026 tiene PT-179 (S1), PT-181, PT-187, PT-192, PT-194 y PT-195. Los cuatro nuevos citan la parada de PT-191 que los produjo (FDGE-R55), con su explicacion en changes/PT-191-.../paradas/ y publicada en el issue #348.
pregunta abierta: si el trazo PT -> caso debe derivarse del grafo, como pidio el firmante. Y graphify, que el marco exige (FND-R14, FDGE-R43), tiene graphify-out/graph.json VACIO: «{}», 3 bytes, mientras GRAPH_REPORT.md declara 1028 nodos.
lo que sigue sin resolverse: PT-025 (#35) DEFERRED · PT-172 DEFERRED en este lote · PT-181 es la UNICA allocation que sigue sin citar su parada (FDGE-R55), y es anterior a esta sesion · 21 allocations sin suite_version · 4 PT historicos sin lote · el slug de PT-155 sigue divergiendo · v9.0.0, v10.0.0 y v5.2.0 tienen tag y no estan en npm · 4.13.0, 5.0.0 y 5.1.0 estan en npm y no en el CHANGELOG · verify-fdge deja 7 comprobaciones SIN EVALUAR (SUITE-R43 x6, SUITE-R08 x1) y eso no aprueba ni bloquea · GitGuardian esta en rojo por la contrasena sintetica de fb10d3de, no es required y se silencia en su dashboard, no desde el repo.
actualizado:    2026-08-30 · PT-187 en PHASE 8 Persistencia
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
