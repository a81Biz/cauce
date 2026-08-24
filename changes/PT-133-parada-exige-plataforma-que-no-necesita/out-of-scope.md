# Fuera de alcance — `PT-133`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Revisar las demás acciones de `SIN_PLATAFORMA` | Si hay más en la misma situación es un hallazgo aparte. Mezclarlos haría imposible saber cuál rompió qué | hallazgo propio si aparece |
| Reescribir el `manifest.json` de `PT-116` | `SUITE-R09` es append-only; `FDGE-R29` prefiere la entrada `CORRIGE`. Borrar la afirmación equivocada borraría la prueba de que se hizo | `HISTORY.log` |
| Un verificador que cace «rama escrita pero inalcanzable» en general | Es la clase, no la instancia. Merece su propia tarea y probablemente no se puede en general | declarado, sin número |
