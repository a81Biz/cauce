# Diseño — `PT-108`

```
detectar   JSON.parse(REGISTRY.json).suite_version !== VIGENTE  ->  regDesalineado
reportar   junto a los documentos y package.json
aplicar    replace sobre el TEXTO: /("suite_version"\s*:\s*")[\d.]+(")/
```

**Sobre el texto y no reserializando**, por lo mismo que `PT-107` aprendió a su costa: ese archivo
guarda el estado del marco, y un descuido al reescribirlo borra allocations.

**Y si el reemplazo no casa, se dice y no se toca**: un `replace` que no encuentra su patrón
devuelve la cadena igual, y escribirla sería fingir que se alineó.
