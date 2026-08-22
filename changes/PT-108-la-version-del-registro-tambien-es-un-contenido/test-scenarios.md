# Escenarios de prueba — `PT-108`

## Comprobado a mano, con el registro real

```
1. desalinear REGISTRY.suite_version a 9.9.9
2. version.mjs             ->  «✗ REGISTRY.json declara 9.9.9 · 1 desalineado(s)»
3. version.mjs --aplicar   ->  «→ REGISTRY.json (solo suite_version)»
4. leer el registro        ->  12.0.0 · 128 allocations · counter PT 109
```

**El paso 4 es el que importa**: que alinear la versión **no toque nada más**.

## Lo que NO se prueba

- Que no exista una cuarta forma de declarar la versión.
- Que la escritura sea segura frente a otro comando escribiendo a la vez: **declarado**, no
  protegido.
