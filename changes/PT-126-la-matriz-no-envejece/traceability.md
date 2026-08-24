# Trazabilidad — `PT-126`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `tracker sellar` mide la matriz y la publica junto a las otras cosas que ya recorre | `TS-01` `TS-02` `TS-03` `TS-04` `TS-05` | `selftest.sh:sellar mide la matriz` · `…y nombra la clase que llega al umbral` · `…y NO la que no llega` | `salidas/casos-126.txt` · `salidas/sellar.txt` |
| AC-02 | Toda entrada nueva de `HISTORY.log` declara su clase, y `verify-fdge` avisa cuando falta — avisa, no falla | `TS-11` `TS-12` `TS-13` `TS-14` | `selftest.sh:una entrada que declara su clase, en verde` · `…y una que no la declara, AVISA` · `…y no la hace fallar` | `salidas/casos-126.txt` |
| AC-03 | `FPGE` lee `MATRIZ.md` y toda clase con recuento ≥ umbral sin regla con verificador entra como candidato, sin que nadie la transcriba | `TS-15` `TS-16` `TS-17` `TS-02` `TS-04` | `selftest.sh:FPGE recolecta desde MATRIZ.md` · `…citando la clase por su CE-nnn` · `…y no repite el numero del umbral` | `salidas/casos-126.txt` |
| AC-04 | El umbral 3 está DECLARADO con su motivo y es un parámetro, no un número escondido | `TS-06` `TS-07` `TS-08` | `selftest.sh:el umbral sale del registro` · `…y declara su motivo` · `…y sellar lo publica` | `salidas/casos-126.txt` |

**Cuatro criterios, cuatro con `TS`, cuatro con evidencia ejecutada.** Ningún Orphan Criterion.

`AC-03` se apoya además en `TS-09` y `TS-10`: sin el desenlace `SIN EVALUAR`, una `MATRIZ.md`
ausente le daría a `FPGE` una lista vacía de candidatos que parecería una respuesta.

---

## `AC-03` dice «sin regla con verificador» y se publican **dos** situaciones

El criterio junta en una frase dos cosas que la matriz separa:

```
sin regla que la reclame            6 clases hoy
con regla y NADA EMITE por ella     1 clase hoy — CE-002 / SUITE-R59
```

Las dos entran como candidato, pero se **publican distintas**, porque la segunda es peor: parece
cubierta. Se deja escrito en vez de fundirlas para que el criterio encaje sin roce.

## Lo que esta trazabilidad **no** establece

- **Que las seis huérfanas deban tener regla.** Son candidatos; decide una persona (`FPGE-R04`).
- **Que declarar la clase sea obligatorio.** Es opcional a propósito, y el aviso lo dice.
- **Que el umbral 3 sea el correcto.** Es un **juicio**, declarado con su motivo y parametrizable:
  subirlo o bajarlo es un acto visible en el registro.
- **Que `FPGE` haya corrido con esta fuente.** Establece que la recolección la **declara**.
  Ejecutar `FPGE` es otra cosa, y `PT-092` ya midió lo que cuesta.
