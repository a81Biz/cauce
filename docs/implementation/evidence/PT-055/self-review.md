# PT-055 — Autorrevisión   `PHASE 6`

## Qué se arregló

`--gate G4 EP-A` bloqueaba por las filas de cierre de **cualquier** lote abierto. El 2026-08-15,
cerrando `EP-013` con `EP-014` recién abierto, bloqueó por las cuatro filas de `EP-014` —trabajo
aún no hecho— mientras `EP-013` estaba en verde. Se integró con el rojo declarado como
excepción, no arreglado.

**La causa era más profunda que el reporte.** No era sólo que `enG4` fuese global:
`verify-fdge` **nunca aceptó un `EP-NNN` como objetivo**. El filtro casaba `/^PT-\d+$/`, así que
`--gate G4 EP-013` dejaba `targets` vacío y la herramienta **jamás supo qué lote evaluaba**.
Arreglar sólo `enG4` habría dejado la orden del manual sin efecto.

Se vio reproduciendo, no leyendo, y por eso la `Revisión 1` del intake añadió `AC-03`..`AC-06`.

## Demostrado contra el repositorio real, no sólo el fixture

```
--gate G4 EP-016   (cerrado, con EP-017 abierto)
  lote(s) bajo evaluacion: EP-016
  ! SUITE-R45   EP-017: «## Cierre del lote» está vacía        <- AVISO. No bloquea

--gate G4 EP-017   (es el evaluado, y su sección está vacía)
  lote(s) bajo evaluacion: EP-017
  ✗ SUITE-R45   EP-017: «## Cierre del lote» está vacía        <- ERROR. Bloquea
```

La misma condición, en el mismo repositorio, dando resultados distintos según **qué lote se
evalúa**. Eso es exactamente lo que faltaba.

**Inversa ejecutada:** revertido `enG4` al alcance global, `EP-017` vuelve a bloquear el cierre
de `EP-016`. El defecto original, reproducido.

## El caso que pasaba en vacío, y cómo apareció

`E3` —«un `EP-NNN` se acepta como objetivo»— se escribió asertando que la salida **mencionara**
`EP-050`. Al ejecutarlo **antes** de implementar, salió **verde**: `checkEpics()` recorre todos
los lotes y los nombra igual, así que el caso pasaba sin probar nada.

Es la trampa que `PT-050` documenta —cinco casos en una sesión casando su propia definición— y
esta vez se cazó porque los casos se ejecutaron en rojo primero, que es lo que `FDGE-R17` pide y
lo que en `PT-075` no hice.

Se endureció: ahora exige que la herramienta **diga** qué lote evalúa (`lote(s) bajo evaluacion:
EP-050`), lo que obligó a que el arreglo lo imprima. Un caso mejor produjo una herramienta mejor.

`E1` tuvo el problema simétrico: asertaba que `EP-051` **no apareciera**, y aparece en avisos
legítimos. La aserción correcta es sobre el **error** (`✗ SUITE-R45`), no sobre la mención.

## Lo que NO se tocó, y por qué

**El alcance global de `INTAKE-R09` e `INTAKE-R08`.** `checkEpics()` sigue recorriendo todos los
lotes para ellas, y debe: un intake incompleto es un defecto lo evalúe quien lo evalúe. Acotarlo
sería introducir el defecto simétrico al que esta tarea arregla.

**`alloc.status === 'DONE'`.** Un lote terminado exige sus filas resueltas aunque nadie pase
`--gate`. Es `AC-06` y es la mitad de la condición que no depende de la bandera.

**`SUITE-R45`.** No cambia de texto. Cambia **a quién se le exige** en modo bloqueante.

## Hallazgo de paso

`EP-017` no llevaba `suite_version` y `SUITE-R18` lo avisaba. Sellado a `9.0.0`. No es de esta
tarea, pero corregirlo cuesta un campo y dejarlo habría sido ruido permanente en cada ejecución.

## Delta real contra lo planificado

| | Planificado | Real |
|:---|:---|:---|
| Cambios en `verify-fdge` | 3 | **4** — el cuarto es imprimir qué lote se evalúa, que no estaba en el diseño y lo exigió el caso `E3` al endurecerlo |
| Casos | 6 | **7** — `E3` se partió en dos: nombra el objetivo, y sin objetivo no nombra ninguno |
| Archivos | 2 | 2 |

`AC-01`..`AC-06`, los seis verificados.
