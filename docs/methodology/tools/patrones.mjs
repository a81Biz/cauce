/**
 * patrones — los patrones críticos del marco, en un solo sitio y con su contrato.
 *
 * POR QUÉ EXISTE
 *   Un patrón puede estar mal y compilar. Esa es la frase entera del problema.
 *
 *   Ocho veces en este proyecto una secuencia de escape se perdió al editar: `\b` quedó como
 *   el byte 0x08 y `\s` como la letra «s». El regex resultante es sintácticamente válido y no
 *   casa nada — o casa otra cosa. El verificador entonces informa «sin errores» porque no
 *   encuentra nada que reprochar, y **el fallo es indistinguible del éxito**. Ninguna revisión
 *   por lectura lo ve: `/AC-d+/` y `/AC-\d+/` se parecen demasiado.
 *
 *   La 4.8.0 añadió un detector de bytes de control. Eso trata un síntoma: caza `\b` → 0x08,
 *   y no caza `\d` → `d`, que es exactamente el mismo fallo con un carácter imprimible.
 *
 * QUÉ HACE EN SU LUGAR
 *   Cada patrón viaja con lo que tiene que casar y lo que no. Si un escape se degrada, el
 *   ejemplo deja de casar y `verify-patrones` lo dice con nombre y línea. No hay forma de que
 *   un patrón roto pase por bueno: tendría que romperse Y sus ejemplos tendrían que romperse
 *   en la misma dirección.
 *
 *   Es la misma exigencia que el marco le pone a un criterio de aceptación: si no se puede
 *   escribir la comprobación que lo tumba, no es un criterio.
 *
 * Y DE PASO
 *   La fórmula del sello estaba copiada en tres archivos. Normalizar dos dejó al tercero
 *   contradiciendo a los otros y cinco casos del selftest en rojo. Aquí hay una sola.
 */

import { createHash } from 'node:crypto';

// ── El sello: contenido normalizado, nunca bytes crudos ─────────────────────
// Git entrega LF en Linux y CRLF en Windows. Un sello sobre bytes hacía que el CI acusara de
// desincronizado un núcleo intacto.
export const RE_LINEA = /\r?\n/;
export const lineas = (txt) => String(txt).split(RE_LINEA);
export const selloDe = (txt) => createHash('sha1')
  .update(lineas(txt).join('\n')).digest('hex').slice(0, 12);

/**
 * Cada entrada: el patrón, qué comprueba, y su contrato.
 *   casa    — textos que TIENEN que casar
 *   noCasa  — textos que NO deben casar
 *
 * Un patrón sin ambas listas no se admite: `verify-patrones` lo rechaza. Solo `casa` deja
 * pasar un patrón demasiado laxo; solo `noCasa`, uno que no casa nada.
 */
export const PATRONES = {
  FIRMA_SOLICITANTE: {
    re: /\b(?:Reportado|Solicitado|Validado)\s+por:[ \t]*(?!\[)(\S.*)$/im,
    para: 'quién firmó el intake (INTAKE-R06)',
    casa: [
      'Solicitado por: Ada Lovelace',
      'Reportado por: Equipo de soporte',
      '  Validado por: A. Turing',
    ],
    noCasa: [
      'Solicitado por:',                        // vacío: el campo existe y nadie lo rellenó
      'Solicitado por: [nombre]',               // la plantilla sin personalizar
      'Solicitado por:\nFecha: 2026-08-05',     // \s se comía el salto y capturaba «Fecha:»
    ],
  },

  FIRMA_NOMBRE: {
    re: /(?:solicitad[oa]|integrad[oa]|resuelt[oa]|autorizad[oa]|validad[oa]|aprobad[oa]|cerrad[oa]|revisad[oa])[ \t]+por:[ \t]*(\S.*?)[ \t]*$/gim,
    para: 'toda firma, para contrastarla contra «firmantes:» (SUITE-R27)',
    casa: [
      'integrado por: Ada Lovelace',
      'Revisado por: A. Turing',
      '| PT-050 | BUG | INTEGRATED | validado por: Ada Lovelace |',
    ],
    noCasa: [
      'Revisado por:',
      'integrado por:\nFecha: 2026-08-06',
    ],
  },

  VALOR_FIRMADA: {
    re: /^[ \t]*Firmada por:[ \t]*(\S.*)$/im,
    para: 'la Declaración de Valor firmada (FND-R24)',
    casa: ['Firmada por: Ada Lovelace', '  Firmada por: Comité de producto'],
    noCasa: [
      'Firmada por:',
      'Firmada por:\nFecha: 2026-08-06',        // el verde falso que validaba una declaración en blanco
    ],
  },

  LOTE: {
    re: /Firmado\s+por\s+lote:\s*(EP-\d+)/i,
    para: 'un intake ligero que hereda del lote (INTAKE-R08, FDGE-R51)',
    casa: ['Firmado por lote: EP-014', 'firmado por lote: EP-001'],
    noCasa: ['Firmado por lote:', 'Firmado por lote: PT-014'],
  },

  SEVERIDAD: {
    re: /^\s*severity:\s*(S[1-4])\b/im,
    para: 'la severidad declarada por el humano (INTAKE-R04)',
    casa: ['severity: S1', '  severity: S3'],
    noCasa: ['severity:', 'severity: S5', 'severity: alta'],
  },

  CRITERIO_ACEPTACION: {
    re: /\bAC-\d+\b/,
    para: 'que una tarea traiga criterios de aceptación (FDGE-R51)',
    casa: ['| AC-01 | el login acepta |', 'cubre AC-12 y AC-13'],
    noCasa: ['| AC- | vacío |', 'ACC-01', 'AC-uno'],
  },

  NOTA_BITACORA: {
    re: /^\d{4}-\d{2}-\d{2}\s*·\s*PHASE/gim,
    para: 'cada transición de fase escrita en la tarea (FDGE-R52)',
    casa: ['2026-08-12 · PHASE 4 → 5', '2026-08-12 ·  PHASE 1 → 2'],
    noCasa: ['12-08-2026 · PHASE 4 → 5', 'PHASE 4 → 5', '2026-08-12 · fase 4'],
  },

  CIERRE_DECLARADO: {
    re: /^\s*>?\s*Termina cuando\s*:\s*\S/im,
    para: 'la condición observable que da final a la tarea (FDGE-R53)',
    casa: ['Termina cuando: el endpoint responde 200', '> Termina cuando: hay evidencia'],
    noCasa: ['Termina cuando:', 'Termina cuando : ', 'termina bien'],
  },

  SELLO_CUERPO: {
    re: /^<!-- cuerpo: ([0-9a-f]{12}) -->$/m,
    para: 'el sello que detecta una edición a mano del núcleo (SUITE-R16)',
    casa: ['<!-- cuerpo: 0b550ea075a8 -->'],
    noCasa: ['<!-- cuerpo: -->', '<!-- cuerpo: XYZ -->', '<!-- fuentes: RULES.md:abc -->'],
  },

  ESTADO_BLOQUE: {
    re: /<!--\s*ESTADO\s*-->([\s\S]*?)<!--\s*\/ESTADO\s*-->/,
    para: 'el bloque de estado que hace retomable la sesión (SUITE-R33)',
    casa: ['<!-- ESTADO -->\nsiguiente: cerrar G3\n<!-- /ESTADO -->'],
    noCasa: ['<!-- ESTADO -->\nsiguiente: cerrar G3'],   // sin cerrar: no es un bloque
  },
};
