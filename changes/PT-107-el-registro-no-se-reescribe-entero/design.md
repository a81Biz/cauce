# Diseño — `PT-107`

## Una función, cuatro llamadas

```
HUELLA_AL_LEER      el contenido del archivo cuando arranco el proceso

guardarRegistro(datos, quien)
  lee el archivo AHORA
  si difiere de HUELLA_AL_LEER   -> lanza, sin escribir
  si no                          -> escribe
```

Las cuatro escrituras sueltas pasan por ella. Es `SUITE-R38` aplicado a una operación en vez de a
un dato: **un hecho, una fuente** — aquí, *una forma de escribir el registro*.

## El mensaje

```
REGISTRY.json cambio mientras corria «abrir»: tenia 124 allocations al leerlo y ahora
tiene 125. NO se ha escrito nada. Otro comando lo modifico en paralelo — escribir encima
habria borrado su trabajo en silencio (SUITE-R08). Espera a que termine y repite este comando.
```

Cuatro cosas, y las cuatro hacen falta:

| | |
|:---|:---|
| **qué comando** | `abrir` — para saber cuál repetir |
| **las dos cifras** | 124 → 125 — para ver que se perdió algo, no que falló al azar |
| **«NO se ha escrito nada»** | el registro está intacto: no hay que reparar nada |
| **qué hacer** | esperar y repetir |

## Dónde vive

**Dentro** del bloque que solo corre cuando el módulo se ejecuta como comando. Quien lo importa
como librería —`verify-fdge`, la batería— no escribe el registro, y no debe llevarse un guardia
que no le toca.

## Lo que deliberadamente no hace

- **No fusiona.** Si dos versiones difieren, no hay forma de saber cuál gana.
- **No reintenta.** Un reintento repite efectos ya ocurridos.
- **No bloquea.** Un bloqueo mal liberado cuelga el proyecto.
