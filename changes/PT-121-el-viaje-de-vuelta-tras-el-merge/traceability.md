# Trazabilidad — `PT-121`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Existe un comando que escribe `DONE -> INTEGRATED` en el YAML del intake y en el registro, en un solo acto | `TS-01` `TS-02` `TS-03` `TS-04` `TS-05` `TS-06` | `selftest.sh:integrar propone DONE -> INTEGRATED` · `…y al aplicar escribe las dos` · `sin intake, el comando falla` · `…y el registro NO se toca` | `salidas/casos-121.txt` · `salidas/inversa.txt` |
| AC-02 | `FDGE-R19` declara la forma de rama para cerrar un lote, o declara explícitamente que se usa la de tarea y por qué | `TS-10` `TS-11` | `selftest.sh:FDGE-R19 declara la rama del trabajo de lote` · `…y FDGE-R19 llega al nucleo` | `salidas/casos-121.txt` |
| AC-03 | `PHASES.md` declara dónde ocurre el viaje de vuelta, con su artefacto y su salida | `TS-12` `TS-13` `TS-14` `TS-15` | `selftest.sh:PHASES declara el viaje de vuelta` · `…con su comando` · `…y su salida` · `…y el texto copiable lo lleva` | `salidas/casos-121.txt` |
| AC-05 | Ningún comando escribe el estado que `G1` produce: al pasar `G1` un lote debe quedar `READY` | `TS-07` `TS-08` `TS-09` | `selftest.sh:firmar propone DRAFT -> READY` · `un firmante que no esta en la lista falla` · `…y G1 solo produce READY desde DRAFT` | `salidas/casos-121.txt` · `salidas/inversa.txt` |
| AC-06 | `sellar` comprueba que la versión que va a sellar **tendrá** su tag, y que el anterior existe de verdad, derivándolo con `--sort=v:refname` | `TS-16` `TS-17` `TS-18` `TS-19` `TS-20` | `selftest.sh:sellar nombra el tag anterior por VERSION, no por alfabeto` · `…y dice que resuelve` · `…y que el de esta version todavia no existe` | `salidas/casos-121.txt` · `salidas/sellar-tags.txt` |
| ~~AC-04~~ | **RETIRADO en el propio intake** — nació de una medición falsa: los tags `v10.0.0`, `v11.0.0` y `v12.0.0` **sí existen** | — | — | `salidas/sellar-tags.txt` |

**Cinco criterios vivos, cinco con `TS`, cinco con evidencia ejecutada.** Ningún Orphan Criterion.

---

## `AC-04` está retirado, y no se cuenta como cumplido

Lo retiró el propio intake el 2026-08-22 con su corrección: `git tag -l | tail -5` ordena
**lexicográficamente**, así que `v10`, `v11` y `v12` quedan antes de `v4.13.0` y el final de la
lista da `v9.0.0`. Se leyó el final del alfabeto y se llamó «el último tag».

Se deja tachado en la tabla en vez de borrado: un criterio retirado por una medición falsa es
información, y borrarlo dejaría la numeración con un hueco que nadie sabría explicar.

## `AC-02` dice «llega al núcleo» y hay que precisar qué llega

`FDGE-R19` llega. **La frase concreta no**, y está bien: el núcleo condensa cada regla a ~210
caracteres por diseño (`SUITE-R15`), y el documento completo se abre cuando `CORE` lo remite.

Se deja escrito porque mi primer caso esperaba lo contrario y era **falso**.

## Lo que esta trazabilidad **no** establece

- **Que `integrar` haya corrido sobre una integración real.** Se ejerce sobre un proyecto de
  mentira. La integración real de este lote es `G4`, humana, y no ha ocurrido.
- **Que la lista de firmantes pruebe que firmó una persona.** `SUITE-R27` lo dice explícitamente:
  hace la firma **contrastable**, no verificada.
- **Que el trabajo de lote pueda citar el `EP` en un commit.** Es la unidad del **commit**, no la
  rama. Queda declarada como pregunta abierta con su medición hecha.
- **Que los tags anteriores a la `8.2.0` existan.** No existen y se declaran ausentes: fecharlos
  hoy sería inventar cuándo se selló cada versión.
