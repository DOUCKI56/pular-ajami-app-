/* Générateur de QR code autonome (sans dépendance) — mode octet, ECC M, versions 1-6.
   Retourne une matrice de booléens : QR.matrix(texte). */
const QR = (() => {
  "use strict";

  const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function () {
    let x = 1;
    for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();
  const gmul = (a, b) => (a && b) ? EXP[LOG[a] + LOG[b]] : 0;

  /* [total, data, blocs [taille, données, correction]] — ECC M, versions 1-6 */
  const TABLE = [
    [26, 16, [[26, 16, 10]]],
    [44, 28, [[44, 28, 16]]],
    [70, 44, [[70, 44, 26]]],
    [100, 64, [[50, 32, 18], [50, 32, 18]]],
    [134, 86, [[67, 43, 24], [67, 43, 24]]],
    [172, 108, [[43, 27, 16], [43, 27, 16], [43, 27, 16], [43, 27, 16]]]
  ];
  const ALIGN = [[], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34]];

  function toUTF8(s) {
    const out = [];
    for (const c of s) {
      const cp = c.codePointAt(0);
      if (cp < 0x80) out.push(cp);
      else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
      else if (cp < 0x10000) out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
      else out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    }
    return out;
  }

  function rsGen(deg) {
    let poly = [1];
    for (let i = 0; i < deg; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gmul(poly[j], 1);
        next[j + 1] ^= gmul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  function rsRem(data, gen) {
    const res = new Array(gen.length - 1).fill(0);
    for (const b of data) {
      const factor = b ^ res.shift();
      res.push(0);
      for (let i = 0; i < res.length; i++) res[i] ^= gmul(gen[i + 1], factor);
    }
    return res;
  }

  function matrix(text) {
    const bytes = toUTF8(text);
    let ver = 0;
    for (let v = 1; v <= 6; v++) {
      if (bytes.length <= TABLE[v - 1][1] - 2) { ver = v; break; }
    }
    if (!ver) throw new Error("texte trop long");
    const [totalCW, dataCW, blocks] = TABLE[ver - 1];

    const bits = [];
    const push = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >> i) & 1); };
    push(4, 4);
    push(bytes.length, 8);
    bytes.forEach((b) => push(b, 8));
    const capBits = dataCW * 8;
    push(0, Math.min(4, capBits - bits.length));
    while (bits.length % 8 !== 0) bits.push(0);
    const pad = [0xec, 0x11];
    for (let i = 0; bits.length < capBits; i++) push(pad[i % 2], 8);

    const cw = [];
    for (let i = 0; i < dataCW; i++) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i * 8 + j];
      cw.push(b);
    }
    const dataBlocks = [], ecBlocks = [];
    let off = 0;
    for (const [len, d, ec] of blocks) {
      dataBlocks.push(cw.slice(off, off + d));
      ecBlocks.push(rsRem(cw.slice(off, off + d), rsGen(ec)));
      off += d;
    }
    const all = [];
    const maxD = Math.max(...blocks.map((b) => b[1]));
    for (let i = 0; i < maxD; i++)
      for (let b = 0; b < dataBlocks.length; b++)
        if (i < dataBlocks[b].length) all.push(dataBlocks[b][i]);
    const maxE = blocks[0][2];
    for (let i = 0; i < maxE; i++)
      for (let b = 0; b < ecBlocks.length; b++) all.push(ecBlocks[b][i]);
    let remBits = totalCW * 8 - all.length * 8;
    const stream = [];
    all.forEach((b) => { for (let i = 7; i >= 0; i--) stream.push((b >> i) & 1); });
    while (remBits-- > 0) stream.push(0);

    const size = 17 + ver * 4;
    const mods = [], isFn = [];
    for (let i = 0; i < size; i++) { mods.push(new Array(size).fill(false)); isFn.push(new Array(size).fill(false)); }

    const setFn = (r, c, dark) => { mods[r][c] = dark; isFn[r][c] = true; };
    const finder = (r, c) => {
      for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) {
        const rr = r + i, cc = c + j;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const dist = Math.max(Math.abs(i - 3), Math.abs(j - 3));
        setFn(rr, cc, dist !== 2 && dist !== 4);
      }
    };
    finder(0, 0); finder(0, size - 7); finder(size - 7, 0);
    for (let i = 8; i < size - 8; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }
    const ap = ALIGN[ver];
    for (const r of ap) for (const c of ap) {
      if (isFn[r][c]) continue;
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++)
        setFn(r + i, c + j, Math.max(Math.abs(i), Math.abs(j)) !== 1);
    }
    setFn(size - 8, 8, true);

    const drawFormat = (mask) => {
      let data = (0 << 3) | mask;
      let rem = data << 10;
      const G = 0x537;
      for (let i = 14; i >= 10; i--) if ((rem >> i) & 1) rem ^= G << (i - 10);
      const f = ((data << 10) | rem) ^ 0x5412;
      const bit = (i) => ((f >> i) & 1) === 1;
      const put = (r, c, v) => { mods[r][c] = v; isFn[r][c] = true; };
      for (let i = 0; i <= 5; i++) put(i, 8, bit(i));
      put(7, 8, bit(6)); put(8, 8, bit(7)); put(8, 7, bit(8));
      for (let i = 9; i < 15; i++) put(8, 14 - i, bit(i));
      for (let i = 0; i < 8; i++) put(8, size - 1 - i, bit(i));
      for (let i = 8; i < 15; i++) put(size - 15 + i, 8, bit(i));
      setFn(size - 8, 8, true);
    };
    drawFormat(0);

    const MASKS = [
      (i, j) => (i + j) % 2 === 0,
      (i, j) => i % 2 === 0,
      (i, j) => j % 3 === 0,
      (i, j) => (i + j) % 3 === 0,
      (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
      (i, j) => (i * j) % 2 + (i * j) % 3 === 0,
      (i, j) => ((i * j) % 2 + (i * j) % 3) % 2 === 0,
      (i, j) => ((i + j) % 2 + (i * j) % 3) % 2 === 0
    ];
    const placeData = (maskFn) => {
      let idx = 0;
      for (let right = size - 1; right >= 1; right -= 2) {
        if (right === 6) right = 5;
        for (let i = 0; i < size; i++) {
          for (const c of [right, right - 1]) {
            const r = ((right + 1) % 4 < 2) ? (size - 1 - i) : i;
            if (isFn[r][c]) continue;
            const dark = idx < stream.length ? stream[idx] === 1 : false;
            mods[r][c] = dark !== maskFn(r, c);
            idx++;
          }
        }
      }
      return idx;
    };

    const penalty = () => {
      let p = 0;
      for (let i = 0; i < size; i++) {
        let runC = 1, runR = 1, bitsR = 0, bitsC = 0;
        for (let j = 0; j < size; j++) {
          if (j > 0 && mods[i][j] === mods[i][j - 1]) runR++; else { if (runR >= 5) p += 3 + runR - 5; runR = 1; }
          if (j > 0 && mods[j][i] === mods[j - 1][i]) runC++; else { if (runC >= 5) p += 3 + runC - 5; runC = 1; }
          bitsR = ((bitsR << 1) | (mods[i][j] ? 1 : 0)) & 0x3ff;
          bitsC = ((bitsC << 1) | (mods[j][i] ? 1 : 0)) & 0x3ff;
          if (j >= 9 && (bitsR === 0x5d0 || bitsR === 0x05d || bitsC === 0x5d0 || bitsC === 0x05d)) p += 40;
        }
        if (runR >= 5) p += 3 + runR - 5;
        if (runC >= 5) p += 3 + runC - 5;
      }
      for (let i = 0; i < size - 1; i++) for (let j = 0; j < size - 1; j++) {
        const v = mods[i][j];
        if (v === mods[i][j + 1] && v === mods[i + 1][j] && v === mods[i + 1][j + 1]) p += 3;
      }
      let dark = 0;
      for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) if (mods[i][j]) dark++;
      p += Math.floor(Math.abs(dark * 100 / (size * size) - 50) / 5) * 10;
      return p;
    };

    let best = null, bestP = Infinity, bestMask = 0;
    for (let m = 0; m < 8; m++) {
      for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) if (!isFn[i][j]) mods[i][j] = false;
      drawFormat(m);
      placeData(MASKS[m]);
      const p = penalty();
      if (p < bestP) { bestP = p; best = mods.map((r) => r.slice()); bestMask = m; }
    }
    return best;
  }

  function svg(text, px) {
    const m = matrix(text);
    const n = m.length;
    const quiet = 4;
    const dim = n + quiet * 2;
    let path = "";
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
      if (m[i][j]) path += "M" + (j + quiet) + " " + (i + quiet) + "h1v1h-1z";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dim + " " + dim + '" shape-rendering="crispEdges" width="' + px + '" height="' + px + '" role="img" aria-label="QR code">' +
      '<rect width="' + dim + '" height="' + dim + '" fill="#ffffff"/><path d="' + path + '" fill="#000000"/></svg>';
  }

  return { matrix: matrix, svg: svg };
})();
