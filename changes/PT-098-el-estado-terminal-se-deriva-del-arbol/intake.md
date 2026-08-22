# Intake — BUG · `PT-098` · el estado terminal se deriva del árbol

```yaml
---
id: PT-098
type: BUG
severity: S1
complexity:
track: STANDARD
status: DONE
phase: 8
created: 2026-08-21
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: un `INTEGRATED` que no está en la rama por defecto **se reporta**, y `avanzar` no
> puede escribirlo sin que el árbol lo sostenga.

---

## 1. Qué está pasando `[HUMANO]`

Transcripción del reparto del lote y de su causa `C-1` (`FDGE-R02`, `INTAKE-R01`):

> «`C-1` · El estado de una tarea se escribe una vez y nada lo reconcilia. Y cuando ese estado es
> **terminal y falso**, no sólo miente: **apaga comprobaciones**.
>
> `INC-011` es el que hay que leer entero. La calculadora tenía sus dos primeras tareas en
> `INTEGRATED` con `git rev-list --count main` devolviendo `2`. Al corregirlo a `DONE` —lo único
> cierto— se encendieron cinco comprobaciones y cuatro salieron en rojo sobre trabajo del día
> anterior: *"`verify-fdge --all` daba verde con esos huecos todos los días, bajo un `HANDOFF` que
> decía todo preparado"*.»

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Un estado que apaga comprobaciones tiene que ser verificable.** `LEXICON` §5.1 define
`INTEGRATED` como «mergeado a la línea principal»: eso es un hecho del árbol, no una opinión del
registro.

Si el árbol no lo sostiene, algo lo tiene que decir. Y `avanzar` no debería poder escribirlo por
el mero hecho de que alguien pida la última fase.

---

## 3. Comportamiento observado `[HUMANO]`

`avanzar --a <última>` escribe `INTEGRATED` sin mirar nada:

```js
const terminal = esFinal && !ESTADOS_TERMINALES.has(String(a.status));
if (terminal) a.status = 'INTEGRATED';          // tracker.mjs
```

Y ese estado **apaga cinco comprobaciones** de `verify-fdge`, todas con la misma forma:

```js
if (… && !ESTADOS_TERMINALES.has(enRegistroPT?.status))
```

En la calculadora, corregirlo a `DONE` encendió las cinco y **cuatro salieron en rojo** sobre
trabajo que llevaba un día dado por bueno.

---

## 4. Reproducción `[HUMANO]`

```
1. tracker avanzar PT-NNN --a <ultima fase>   sin haber mergeado nada
2. el registro dice INTEGRATED
3. verify-fdge --all  ->  verde, porque cinco comprobaciones se eximen
4. verify-fdge --gate G4 PT-NNN  ->  «estado INTEGRATED. G4 exige DONE»
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | el registro de este repositorio, y el de la calculadora |
| Build o commit | `497cf40` · rama `trabajo` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | medido el 2026-08-21 en dos repositorios |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto destino |
| Volumen estimado | **91** allocations `INTEGRATED` en este registro · **2 falsas** medidas en la calculadora |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | sí, y es el problema: `--gate G4` lo caza y `--all` no |
| Impacto de negocio | un falso **verde**. Un falso rojo se investiga; un falso verde se archiva |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

`INC-011` de la calculadora, con su medición:

```
$ git rev-list --count main                    2      (solo la instalacion)
$ git branch --contains 1db7082 | grep main    (vacio) PT-001 NO esta en main
REGISTRY.json    PT-001 status: INTEGRATED

al corregir a DONE:
✗ FDGE-R54  PT-001: no consta el veredicto de viabilidad
✗ FDGE-R52  PT-001: esta en PHASE 10 y su bitacora tiene 0 nota(s); faltan 9
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: quitar la exencion de lo terminal      -> existe por una razon buena: no exigir bitacora
     retroactiva a lo integrado antes de la 5.1.0, y quitarla pondria en rojo todo repositorio
     con historia. Lo que falla es que el ESTADO no se verifique, no que exima

OUT: rellenar los artefactos que faltan     -> «lo ya terminado no se retrofecha» (CORE.md).
     Una bitacora reconstruida hoy no seria falsa en los hechos y SI en lo que la regla
     persigue: FDGE-R52 existe porque «escribir obliga a releer»

OUT: arreglar la calculadora                -> tiene su rama y su firmante

OUT: la transicion de un BUG (INC-006)      -> es L-2, y toca el mismo archivo. Van SERIADAS
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que un INTEGRATED que no esta en main se reporte, no que pase en verde
- que «avanzar» no pueda escribirlo si el arbol no lo sostiene
- que lo que no se pueda comprobar se diga, en vez de darlo por bueno
- que no ponga en rojo los 91 que ya estan bien
```

---

## 10. Firma `[HUMANO]` — obligatorio

```
Reportado por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote: EP-019
```

> **Base**, escrita por el agente (`INTAKE-R06`): el reparto del lote —`L-1`, la causa `C-1`— y la
> delegación autónoma del 2026-08-21. `SUITE-R27`: contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: existe una forma MECANICA de contrastar «INTEGRATED» con el arbol, sin depender de
       que la allocation declare rama — 58 de las 91 no la declaran.

AC-02: verify-fdge REPORTA una allocation INTEGRATED cuyo contenido no esta en la rama
       por defecto. Hoy pasa en verde porque el estado la exime.

AC-03: lo que NO se puede contrastar se declara SIN EVALUAR y se dice por que. No saber no
       es permiso (RULE-06), pero tampoco es una acusacion.

AC-04: «avanzar» a la ultima fase no escribe INTEGRATED si el arbol no lo sostiene: se
       niega y dice que falta. Es el acto que lo escribe, y es donde hay que impedirlo.

AC-05: los 91 INTEGRATED actuales siguen en verde. Medido: los 91 tienen su directorio en
       «main», asi que el arreglo no inventa deuda donde no la hay.

AC-06: la bateria falla SIN el arreglo, con un caso por cada direccion —el falso terminal
       se reporta, y el verdadero NO— porque sin el negativo «reportar siempre» pasaria.
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: una comprobación en verify-fdge, una guarda en avanzar, y su batería. El
mecanismo de contraste YA EXISTE —lo construyó PT-096— y no hay que inventarlo.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-097 (PHASE 6, otro archivo)
HISTORY.log — PTs similares:  PT-024 y PT-026 (el tablero no se adelanta a main, SUITE-R46) ·
                              PT-094 (el checkpoint de lo cerrado bloquea main)
Roadmap — R-NNN relacionado:  ninguno
```

`SUITE-R46` es la vecina y **no es la misma**: prohíbe **cerrar el issue** antes de que el estado
terminal llegue a la principal. Ésta es al revés: prohíbe **escribir el estado terminal** antes de
que el trabajo llegue. Las dos miran el mismo borde desde lados opuestos.

## 14. Observaciones del agente `[AGENTE]` — obligatorio

`INTAKE-R07`:

- **El mecanismo de contraste ya existe y nadie lo usa para esto.** `PT-096` construyó
  `refDurableDe`, que pregunta a git si `changes/<ID>-<slug>/` está en una rama. Medido sobre este
  registro: **91 de 91** `INTEGRATED` tienen su directorio en `main`, y **0** están sólo en
  `trabajo`. La comprobación es posible hoy, para todas, y **no necesita que la allocation declare
  rama** — que es lo que la hacía parecer inviable: **58 de las 91 no la declaran**.

- **`AC-05` no es una formalidad.** Los 91 salen ciertos, así que el arreglo **no abre deuda**. Si
  alguno hubiera salido falso, el intake tendría que decir qué se hace con él — y no lo dice
  porque no hay ninguno. Eso se midió antes de escribir esto.

- **El sitio donde impedirlo es `avanzar`, no el verificador.** `INC-011` es explícito: *«el
  estado terminal lo escribió el propio comando al avanzar de fase, sin que ningún humano lo
  declarara: un `avanzar --a 10` apagó cinco reglas sobre dos `PT` y nadie tuvo que decidirlo»*.
  Un verificador que lo reporte llega tarde; la guarda en `avanzar` impide que ocurra.

- **`AC-06` pide el caso negativo por un motivo medido.** Sin él, «reportar siempre» pasaría el
  positivo — la trampa que `PT-096` documentó con `TS-04` y que `PT-095` documentó con su inversa
  en cero.

- **Lo que este intake NO establece:** cuántas de las 22 apariciones de `ESTADOS_TERMINALES` en las
  herramientas dependen de este dato. Se contaron **cinco** alcanzando a las dos tareas de la
  calculadora; el `grep` devuelve más usos, y `INC-011` lo declara sin medir. Aquí se arregla el
  **dato**, no cada consumidor.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S1 · «el mas peligroso de los once» (INC-011)
DoR-03 firma humana presente             [x]  §10, con su base
DoR-04 out-of-scope declarado            [x]  cuatro entradas con motivo
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-098
DoR-06 no duplica trabajo vivo           [x]  §13 · SUITE-R46 mira el mismo borde del otro lado
DoR-07 observaciones registradas         [x]  §14 · cinco
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con el código citado
DoR-B3 reproducción                      [x]  §4
DoR-B4 entorno identificado              [x]  §5 · dos repositorios
DoR-B5 frecuencia declarada              [x]  siempre
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
