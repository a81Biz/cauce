# `PT-151` · `strategy.md` — `PHASE 3`

## Igualar las listas no basta: se comparan solas

Igualarlas hoy las deja iguales **hoy**. Sin una comprobación que las contraste, divergen a la
primera adición — que es literalmente lo que pasó. `AC-02` era el criterio real desde el intake.

## En los dos sentidos, y el porqué salió de medir

El intake suponía una divergencia: **falta en local**. Medido, había **tres**, y una iba al revés:
`matriz:check` corría en local y **no** en CI — una comprobación cuyo rojo **nadie ve en el PR**.

Una equivalencia comprobada en un solo sentido habría dejado pasar exactamente ese caso. Por eso:

```
falta en local   →  BLOQUEA   deja pasar errores al PR
sobra en local   →  AVISA     deja una comprobacion sin compuerta
```

## La comparación se hace posible igualando la forma

`revisar-secretos` corría en CI con `--historial` y en local sin él. Comparar **comandos** exigiría
entender banderas; comparar **nombres de script** es trivial y robusto — a cambio de que los dos
lados invoquen `npm run <script>`.

Eso es lo que se hizo, y **el límite se declara**: si el workflow volviera a invocar la herramienta
directamente, la diferencia sería otra vez invisible. La comprobación no lo impide; lo hace visible
sólo mientras la convención se respete.

## Y una alternativa descartada

**Que CI corriera `npm run verify` como paso único.** Haría imposible la divergencia — y perdería
los nombres de paso del workflow, que es lo que hace legible un fallo en el PR, y el `env` por
paso, que `verify:espejo` y `verify:fdge` necesitan. Se prefirió comparar a fusionar.
