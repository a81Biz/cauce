# PT-027 — Confirmar que la CI de `main` queda verde tras el merge

```yaml
---
id: PT-027
type: CHORE
track: EXPRESS
status: CLOSED
created: 2026-08-13
structural: no
suite_version: 7.1.0
phase: 10
---
```

## 1. Por qué existe   `[AGENTE]`

`EP-006` arregló dos defectos que rompían la integración. **Lo único que los prueba es que la
CI de `main` quede verde después de un merge**, y eso no se puede comprobar antes de mergear.

No podía ser criterio de aceptación de `PT-026` —`FDGE-R15` lo rechazó por no tener evidencia—
ni fila del `## Cierre del lote` —`SUITE-R45` lo rechazó por la misma razón—. Las dos negativas
eran correctas: es trabajo posterior al cierre, y lo posterior **se asigna** (`SUITE-R44`).

## 2. Criterio de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La verificación de `main` termina en `success` tras el merge de 7.1.0 | ejecución real |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: la CI de `main` está en verde tras el merge, o cuando lo que la ponga en rojo
> tiene su propia tarea.

## 4. Resultado

```
merge de 7.1.0 → main
run 39eb0f6                             success
tracker cerrar --aplicar                trece issues, cero divergencias
```

El orden de `SUITE-R46` funcionó de punta a punta. El intento anterior, invertido, dejó nueve
divergencias; este dejó cero.

## 5. Qué NO entra

- OUT: mantener la CI verde en el futuro. Eso es la CI, no una tarea

## 6. Firma

```
Firmado por: Alberto Martínez (delegada — «ya está publicado, cierra todo», 2026-08-13)
Fecha: 2026-08-13
Estado: FIRMADA · verificación EXPRESS sobre ejecución real
```
