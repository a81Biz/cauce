# PT-063 — Diseño   `PHASE 4`

## La función pura

```js
/**
 * Como debe llamarse la rama de una tarea.
 *
 * El usuario sale del nombre CANONICO (PT-061), no de `git config` a pelo: desde la maquina que
 * produjo los 9 commits de «a81Biz», leerlo directo habria dado «chore/a81biz/PT-063-…» — otra
 * rama, para la misma persona.
 *
 * Sin usuario resuelto, DOS niveles como siempre: un proyecto de una persona no cambia nada.
 */
export function ramaDeTarea(tipo, id, slug, usuario = null) {
  const t = String(tipo ?? 'chore').toLowerCase();
  const u = usuario ? normaliza(usuario) : null;
  const cola = `${id}-${slug}`;
  return u ? `${t}/${u}/${cola}` : `${t}/${cola}`;
}

/** ¿Lleva usuario esta rama? Tres niveles con el PT al final. */
export const ramaLlevaUsuario = (rama) => {
  const p = String(rama ?? '').split('/');
  return p.length >= 3 && /^(PT|EP)-\d+/.test(p[p.length - 1]);
};
```

`normaliza` es el mismo que usa `ramaDe` para `cauce/<usuario>`: minúsculas, sin acentos, guiones.
Se extrae para que las dos ramas del marco normalicen **igual** — si divergieran, la misma persona
tendría dos nombres según qué rama se mire.

## La acción

```
tracker rama PT-063
```

```
  chore/alberto-martinez/PT-063-el-usuario-vive-en-la-rama-de-tarea

  Así debe llamarse. NO se crea: crear una rama toca el árbol de trabajo, y si falla a
  mitad deja a quien la usa en otro sitio. Lo que no se automatiza se describe (EXEC-R07):

    git switch trabajo
    git checkout -b chore/alberto-martinez/PT-063-el-usuario-vive-en-la-rama-de-tarea
```

## La comprobación, que **avisa**

```js
// verify-fdge · FDGE-R19
//
// AVISA, no falla. Las 22 ramas declaradas hoy son de DOS niveles y fallarian todas (AC-04), y
// renombrarlas rompe los PR abiertos sobre ellas.
//
// Y el aviso DICE DESDE CUANDO aplica: una rama de antes de 8.3.0 no es un incumplimiento, es
// una rama de antes. Lo que NO se hace es fallar «a partir de la proxima version»: una
// comprobacion que cambia de severidad con el tiempo es una que nadie puede razonar.
if (fase >= 5 && alloc.branch && personas.length && !ramaLlevaUsuario(alloc.branch)) {
  warn('FDGE-R19', `${pt}: la rama «${alloc.branch}» no lleva usuario. Desde 8.3.0 el formato es `
    + '«<type>/<usuario>/PT-NNN-slug» (FDGE-R19). Las ramas anteriores siguen valiendo: una rama '
    + 'abierta se termina como empezo.');
}
```

**Solo si hay `personas` declaradas.** Sin ellas no hay usuario que poner, y el aviso sería una
exigencia imposible de cumplir.

## Lo que se comprueba que **no** cambia

`AC-02` y `AC-03` son criterios sobre lo que no debe pasar, y esos son los que más fácil se dan por
buenos sin mirar:

```
no existe «trabajo/<usuario>» en ninguna parte del marco
verify-fdge --gate G4 sigue exigiendo UN PR para la rama por defecto
EXEC-R03 sigue diciendo que G4 es una por lote
```

## Lo que NO se construye

| Qué | Por qué |
|:---|:---|
| Crear la rama | Toca el árbol · `PT-054` ya decidió que no · `EXEC-R07` la describe |
| Renombrar ramas existentes | Rompe los PR abiertos · `AC-04` |
| `trabajo/<usuario>` | Decisión 3 del firmante |
| Una `G4` por persona | `EXEC-R03` |
| Fallar si la rama no lleva usuario | Rompería `AC-04` · avisa |
| Tocar `cauce/<usuario>` | Es la rama derivada de `PT-054`, otra cosa |
