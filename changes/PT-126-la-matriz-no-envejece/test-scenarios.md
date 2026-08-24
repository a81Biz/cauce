# Escenarios de test — `PT-126`

> `FDGE-R17`: rojo primero, y **válido**.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | `sellar` mide la matriz | `matriz de eventos` |
| `TS-02` | …y nombra la clase que llega al umbral | `CE-901` |
| `TS-03` | …y **no** la que no llega | ausencia de `CE-902` |
| `TS-04` | …y una regla que no puede fallar se nombra | `NADA EMITE POR ELLA` |
| `TS-05` | …y no se promueve nada | `decide una persona` |
| `TS-06` | El umbral sale del registro | `umbral_clase_sin_dueno` |
| `TS-07` | …y declara su motivo | `menor de esas cuentas fue tres` |
| `TS-08` | …y `sellar` lo publica | `para ser candidata` |
| `TS-09` | Sin `MATRIZ.md` dice `SIN EVALUAR` | `SIN EVALUAR` |
| `TS-10` | …y no lo confunde con «no hay nada» | `NO es una` |
| `TS-11` | Una entrada que declara su clase, en verde | `declara «Clase de evento` |
| `TS-12` | …y una que no la declara, **avisa** | `no declara «Clase de evento` |
| `TS-13` | …y **no** la hace fallar | ausencia de la marca de error |
| `TS-14` | …y el aviso dice que es opcional | `Es opcional` |
| `TS-15` | `FPGE` recolecta desde `MATRIZ.md` | `MATRIZ.md` |
| `TS-16` | …citando la clase por su `CE-nnn` | `CE-nnn` |
| `TS-17` | …y **no** repite el número del umbral | ausencia |

---

## Los que existen porque algo falló, o habría fallado

**`TS-03`** — sin él, quitar el umbral no se notaría. La matriz de mentira lleva a propósito una
clase con **una** sola instancia, y el caso comprueba que **no** sale.

**`TS-13`** — el par de `TS-12`. Sin él, convertir el aviso en error también pasaría, y las
entradas anteriores empezarían a fallar de golpe: `CE-014` cometido en la comprobación que cuenta
`CE-014`.

**`TS-09` y `TS-10` juntos** — con sólo el primero, una implementación que dijera `SIN EVALUAR`
**siempre** también pasaría.

**`TS-17`** — el umbral escrito dos veces es `CE-008`, la clase que la matriz cuenta. Cometerla en
el documento que la publica sería el desenlace más caro.

---

## Prueba inversa

| Se quita | Qué se pone rojo |
|:---|:---|
| El umbral como filtro | `TS-03` — entra la clase que ocurrió **una** vez |
| El desenlace `SIN EVALUAR` | `TS-09` — la matriz ausente pasa por vacía |
| Separar «tiene regla» de «puede fallar» | `TS-04` — el caso peor desaparece |
| El aviso de `LEX-R31` | `TS-12` — la entrada sin clase pasa callando |

Cuatro supresiones, cuatro escenarios distintos.

---

## Y los casos se rehicieron sobre el proyecto de mentira

La primera versión llamaba a `sellar` sobre el **repositorio real**. `sellar` termina consultando
la plataforma: el bloque estuvo más de tres minutos sin imprimir una línea. **Un arnés que depende
de la red no es un arnés** — daría rojo el día que GitHub esté lento, y ese rojo no diría nada
sobre el marco.

Y la `MATRIZ.md` es **sintética**, escrita dentro del caso. Si usara la real, los casos caducarían
en cuanto la matriz cambiara: `CE-010` en el arnés que la publica.
