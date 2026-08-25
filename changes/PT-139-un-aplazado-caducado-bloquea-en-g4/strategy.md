# Estrategia — `PT-139`   `PHASE 3`

## El camino elegido

Una comprobación global en `verify-fdge`, junto a las demás que miran el registro entero. Avisa
durante el trabajo y **falla en `G4`**, que es el patrón que el marco ya usa para cinco reglas.

## Los caminos descartados, con su por qué

**1 · Cerrar automáticamente el aplazado caducado.** Descartado, y es lo primero que uno piensa.
Decidir qué pasa con trabajo aparcado es humano (`SUITE-R06`): puede retomarse, moverse la fecha,
o cerrarse. La compuerta **obliga a mirarlo** y ahí acaba su trabajo.

**2 · Avisar por fuera del repositorio.** Descartado. El marco no tiene reloj propio ni debe
tenerlo: la compuerta ya es el momento en que alguien mira.

**3 · Fallar siempre, sin esperar a `G4`.** Descartado. Un aplazado que vence a mitad de una tarea
en curso bloquearía trabajo que no tiene nada que ver. `G4` es donde se decide.

**4 · Un margen de gracia —«vencido hace más de N días»—.** Descartado por ahora: sería un juicio
sin datos. «Vencido» es una frontera que la propia fecha declara.

## Cómo se verifica

Casos sobre un fixture con cuatro aplazados —sin bloque, caducado, al día, y anterior a la regla—
y una fecha de revisión en `2099` para que el caso **no caduque solo**.
