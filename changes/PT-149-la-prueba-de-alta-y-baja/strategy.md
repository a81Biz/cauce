# `PT-149` · `strategy.md` — `PHASE 3`

## Primero ejecutar, después decidir

`PT-148` escribió el procedimiento. Esta tarea empieza **ejecutándolo**, y esa decisión es la que
produjo todo lo demás: leer `E5` no dice que sea falso; darlo de alta, sí, en el primer intento.

Es lo mismo que registra el propio `CASOS-DE-USO.md` sobre los dos `S1` de `PT-072`, y lo que este
lote midió tres veces: **el conteo de sitios subió de 13 a 16 leyendo con una pregunta delante,
nunca ejecutando**. Aquí ocurre al revés — y las dos cosas dicen lo mismo: el defecto aparece
cuando algo se contrasta contra la realidad, no cuando se relee.

## Todo sobre copias, y no por comodidad

`AC-06` pide que el componente de prueba **no quede declarado ni aunque el caso falle a mitad**.
Con un `trap` eso depende de acordarse de escribirlo y de que el `trap` no falle. Trabajando sobre
copias del árbol es **estructuralmente imposible** incumplirlo: el árbol real no se toca nunca.

Y hay un aviso escrito en el `HANDOFF` que apunta al mismo sitio: no editar `selftest.sh` mientras
corre, porque bash lo lee por desplazamiento de bytes. Un caso que escribiera y borrara sobre el
árbol real estaría cerca de ese filo.

## La corrección de `verify-patrones` tiene dirección

Soltar «exactamente seis» **no puede** convertirse en «da igual cuántos». Lo que aquellas
aserciones protegían de verdad es que **el contrato no encoja**: si alguien borra un componente,
sus reglas se vuelven invisibles al verificador y todo pasa en verde — el defecto que abrió
`EP-022`. Lo que no tenían derecho a impedir es que **crezca**.

Por eso la nueva forma es asimétrica y hay un caso que lo fija: **perder uno de los seis sigue
siendo rojo**. Sin ese caso, la corrección sería indistinguible de haber desactivado la aserción.

## Alternativa descartada

**Derivar enteros los bloques de `build-core`.** Habría sido más limpio de leer y habría perdido
la sintaxis de comando de cada componente, que no está en ningún contrato y que `CORE.md` necesita
para que el agente sepa invocarlos. Completar en vez de reescribir conserva las dos propiedades:
lo redactado manda, y nada puede faltar en silencio.
