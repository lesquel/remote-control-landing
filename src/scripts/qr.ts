const QR_SIZE = 21;

function drawQR(seed: string): void {
  const qr = document.getElementById('qr');
  if (!qr) return;
  qr.innerHTML = '';

  let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  function rnd(): number {
    s = (s * 1103515245 + 12345) >>> 0;
    return (s >>> 16) / 65535;
  }

  const finderMask = (x: number, y: number): boolean =>
    (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);

  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      const d = document.createElement('i');
      if (finderMask(x, y) || rnd() > 0.52) d.className = 'off';
      qr.appendChild(d);
    }
  }
  (['tl', 'tr', 'bl'] as const).forEach((pos) => {
    const f = document.createElement('div');
    f.className = `finder ${pos}`;
    qr.appendChild(f);
  });
}

export function initQR(): void {
  drawQR('lan-192.168.1.14');
  document.querySelectorAll<HTMLButtonElement>('.qr-tabs button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.qr-tabs button').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      const which = btn.dataset.qr;
      drawQR(which === 'lan' ? 'lan-192.168.1.14' : 'tunnel-https-4a9c');
      const url = document.getElementById('phoneUrl');
      if (url) {
        url.textContent = which === 'lan'
          ? '192.168.1.14:4097/?t=4a9c…'
          : 'https://pilot-4a9c.trycloudflare.com';
      }
    });
  });
}
