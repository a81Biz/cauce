# PT-020 — Fuera de alcance   `PHASE 4`

| Fuera | Por qué | Dónde va |
|:---|:---|:---|
| Versionar `graphify-out/` | `SUITE-R37`: es regenerable y su frescura vive en el registro | — |
| Ampliar el grafo a la raíz | `FND-R28` lo prohíbe, y `changes/` son 48 directorios de markdown | — |
| Incluir `selftest.sh` | El grafo es de dependencias entre módulos; un shell no las declara | — |
| Cambiar `FDGE-R43` | La regla es correcta. Lo que estaba mal era el alcance sobre el que corría | — |
| Actuar sobre lo que el grafo revele | Si aparece una herramienta huérfana o un ciclo, es un hallazgo — y se aplaza con su issue, no se arregla aquí | — |
