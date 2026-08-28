# `PT-190` · self-review

- **AC verificados**: 3, ninguno huérfano — cada uno cita su `TS` y su caso ejecutable.
- **Código = design**: el cambio está donde el intake dijo que estaría (`revisar-secretos.mjs` y la
  cabecera de `selftest.sh`).
- **Sin regresiones**: `TS-01` existe precisamente para fijar que la heurística **no cambió** para
  quien ya dependía de ella (`CE-014`).
- **Lo que NO se arregla, se declara**: `TS-02` deja el límite **visible y ejecutable** en vez de
  taparlo (`RULE-06`, `SUITE-R26`).
- **Convenciones**: `11-Conventions.md` — sin `debug`, sin restos.
- **Sin credenciales ni datos personales** en la evidencia (`FDGE-R45`). Los valores del fixture son
  sintéticos y el archivo que los contiene lo **declara** ahora explícitamente, que es el objeto de
  esta tarea.
