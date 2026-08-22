# Autorrevisión — `PT-112`

## Lo que establecí

Que `docs/methodology/` no se puede sobrescribir sin que conste **quién lo decidió**.

## Lo que NO establecí

- **`INC-007` e `INC-013`.** Sin descripción accesible. `L-8` cierra con **uno de tres**.
- **Si otros flags saltan una compuerta.** Se midió `--forzar`.
- **Que una instalación real escriba bien el registro.** Se comprueba el código y su guarda, no
  una instalación completa sobre un proyecto ajeno.

## Lo que esta tarea enseña

**Es la imagen invertida de `PT-103`.** Allí cumplir el marco **exigía** saltarse la herramienta;
aquí saltarse la regla era **un flag**. Las dos son la misma distancia: entre lo que la regla dice
y lo que la herramienta permite.

**Y no se prohíbe.** Prohibir `--forzar` obligaría a copiar archivos a mano — mismo efecto y sin
ningún rastro. Lo que convierte una puerta en compuerta no es cerrarla: es que deje constancia.

## Una comprobación de que `PT-101` sirvió

El salto de línea del registro va por `String.fromCharCode` **porque `SUITE-R59` existe**, no
porque yo me acordara. Es la primera vez en la sesión que una regla nueva se aplica sola en la
tarea siguiente.
