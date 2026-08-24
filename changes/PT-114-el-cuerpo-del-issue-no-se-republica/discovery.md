# `PT-114` — Descubrimiento   `PHASE 2-B`

## D-1 · El punto exacto

`tracker.mjs:1586` · `refDurableDe(a)` busca el directorio de la tarea en la rama de integración
y en la rama por defecto. Si no está en ninguna, devuelve el `sha` del último commit que la tocó;
si tampoco lo hay, **`null`**.

`tracker.mjs:564` · con `null`, el cuerpo publica:

```
`changes/EP-020-el-acto-fuera-del-comando/` — en el repositorio, sin enlace:
no hay ref durable que lo contenga
```

**Esa decisión es de `PT-096` y es correcta**: sin ref durable no se inventa una URL (`RULE-06`).

## D-2 · Lo que falta es la otra mitad

`sincronizarCuerpos()` —que republica— corre **sólo dentro de `abrir()`**. El cuerpo se publica al
crear el issue, la rama se empuja **después**, y **nada vuelve a mirar**.

`PT-096` lo dejó escrito y no lo cerró:

> *«Una vez que un cuerpo está bien, NADA vuelve a mirarlo: la herramienta no comparaba jamás el
> cuerpo que publicó con el derivado.»*

Y el propio cuerpo publicado le pide a un humano que lo arregle:

> *«si ya lo está, `tracker abrir --aplicar` lo republica»*

**Séptima instancia de «existe la herramienta y nada la echa en falta».**

## D-3 · La consecuencia, y no es cosmética

El firmante **no puede leer el intake que se le pide firmar**, así que `G1` no puede pasar. Lo
encontró una persona abriendo `EP-020`:

> *«en el issue del EP-020 tenemos `changes/EP-020-el-acto-fuera-del-comando/` que no lleva a
> ningún lado, no puedo leer el intake por lo que no puedo firmar nada»*

## D-4 · Dónde ponerlo, y por qué no en `verify-fdge`

`verify-fdge` **no lleva credencial en CI** —es el defecto de `PT-120`, medido en 108 de 108
`SUITE-R43` como `SIN EVALUAR`—. `tracker espejo` **sí** la lleva, en los dos workflows, con
`GH_TOKEN` explícito.

Y es su territorio: `SUITE-R35` dice que la plataforma **espeja** el registro. Un cuerpo que no
llega a su intake es una divergencia del espejo.

## Qué establece, y qué no

**ESTABLECE:** que el cuerpo se publica una vez y nada lo revisa; que la consecuencia bloquea `G1`;
y que el sitio con credencial es el espejo.

**NO ESTABLECE:** que el enlace resuelva. Eso depende de la plataforma, no del texto.
