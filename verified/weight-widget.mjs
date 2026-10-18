/* Live aluminium weight calculator used by /products/calculator/* pages.
   Every length is converted to metres, density is in g/cm³ (= t/m³). */
const UNITS = {mm: .001, cm: .01, m: 1, in: .0254, ft: .3048};
const PI4 = Math.PI / 4;
const SHAPES = {
  plate:      {fields: ['length', 'width', 'thickness'], area: v => v.width * v.thickness, len: v => v.length,
               formula: 'Weight = length × width × thickness × density'},
  round:      {fields: ['diameter', 'length'], area: v => PI4 * v.diameter ** 2, len: v => v.length,
               formula: 'Weight = π/4 × diameter² × length × density'},
  square:     {fields: ['side', 'length'], area: v => v.side ** 2, len: v => v.length,
               formula: 'Weight = side² × length × density'},
  hexagon:    {fields: ['across', 'length'], area: v => Math.sqrt(3) / 2 * v.across ** 2, len: v => v.length,
               formula: 'Weight = 0.866 × across-flats² × length × density'},
  flat:       {fields: ['width', 'thickness', 'length'], area: v => v.width * v.thickness, len: v => v.length,
               formula: 'Weight = width × thickness × length × density'},
  tube:       {fields: ['od', 'wall', 'length'], area: v => Math.PI * v.wall * (v.od - v.wall), len: v => v.length,
               check: v => 2 * v.wall < v.od || 'Wall thickness must be less than half the outside diameter.',
               formula: 'Weight = π × wall × (OD − wall) × length × density'},
  squaretube: {fields: ['side', 'wall', 'length'], area: v => v.side ** 2 - (v.side - 2 * v.wall) ** 2, len: v => v.length,
               check: v => 2 * v.wall < v.side || 'Wall thickness must be less than half the side.',
               formula: 'Weight = [side² − (side − 2·wall)²] × length × density'},
  recttube:   {fields: ['width', 'height', 'wall', 'length'], area: v => v.width * v.height - (v.width - 2 * v.wall) * (v.height - 2 * v.wall), len: v => v.length,
               check: v => 2 * v.wall < Math.min(v.width, v.height) || 'Wall thickness must be less than half the smaller side.',
               formula: 'Weight = [W × H − (W − 2·wall)(H − 2·wall)] × length × density'},
  coil:       {fields: ['width', 'od', 'id'], area: v => PI4 * (v.od ** 2 - v.id ** 2), len: v => v.width,
               check: v => v.id < v.od || 'Inner diameter must be smaller than the outer diameter.',
               formula: 'Weight = π/4 × (OD² − ID²) × width × density'},
  circle:     {fields: ['diameter', 'thickness'], area: v => PI4 * v.diameter ** 2, len: v => v.thickness,
               formula: 'Weight = π/4 × diameter² × thickness × density'},
  ring:       {fields: ['diameter', 'hole', 'thickness'], area: v => PI4 * (v.diameter ** 2 - v.hole ** 2), len: v => v.thickness,
               check: v => v.hole < v.diameter || 'The centre hole must be smaller than the outside diameter.',
               formula: 'Weight = π/4 × (D² − d²) × thickness × density'},
};
const LABELS = {length: 'Length', width: 'Width', thickness: 'Thickness', diameter: 'Diameter', side: 'Side', across: 'Across flats',
  od: 'Outside diameter', wall: 'Wall thickness', height: 'Height', id: 'Inner diameter', hole: 'Centre hole'};

const fmt = (n, d = 2) => n.toLocaleString('en-IN', {minimumFractionDigits: d, maximumFractionDigits: d});

for (const form of document.querySelectorAll('form.wc')) {
  const profile = form.querySelector('[name=profile]');
  const alloy = form.querySelector('[name=alloy]');
  const density = form.querySelector('[name=density]');
  const pieces = form.querySelector('[name=pieces]');
  const dims = form.querySelector('.wc-dims');
  const out = {total: form.querySelector('[data-out=total]'), lb: form.querySelector('[data-out=lb]'),
    each: form.querySelector('[data-out=each]'), perm: form.querySelector('[data-out=perm]'),
    formula: form.querySelector('[data-out=formula]'), msg: form.querySelector('[data-out=msg]')};
  const quote = form.querySelector('.wc-quote');
  const defaults = JSON.parse(form.dataset.defaults || '{}');
  const shape = () => SHAPES[profile ? profile.value : form.dataset.shape];

  function build() {
    const keep = {};
    dims.querySelectorAll('input').forEach(i => { keep[i.name] = [i.value, i.nextElementSibling.value]; });
    dims.innerHTML = '';
    for (const key of shape().fields) {
      const id = form.id + '-' + key;
      const row = document.createElement('div');
      row.className = 'wc-field';
      row.innerHTML = `<label for="${id}">${LABELS[key]}</label><div class="wc-unit"><input id="${id}" name="${key}" type="number" inputmode="decimal" min="0" step="any" placeholder="0"><select aria-label="${LABELS[key]} unit">${Object.keys(UNITS).map(u => `<option>${u}</option>`).join('')}</select></div>`;
      const [val, unit] = keep[key] || [defaults[key] ?? '', 'mm'];
      row.querySelector('input').value = val;
      row.querySelector('select').value = unit;
      dims.append(row);
    }
    calc();
  }

  function calc() {
    const s = shape();
    out.formula.textContent = s.formula;
    const v = {};
    for (const key of s.fields) {
      const input = dims.querySelector(`[name=${key}]`);
      const n = parseFloat(input.value);
      if (!(n > 0)) return show(null);
      v[key] = n * UNITS[input.nextElementSibling.value];
    }
    const check = s.check ? s.check(v) : true;
    if (check !== true) return show(null, check);
    const rho = parseFloat(density.value);
    if (!(rho > 0)) return show(null, 'Enter a density greater than zero.');
    const n = Math.max(1, Math.round(parseFloat(pieces.value) || 1));
    const each = s.area(v) * s.len(v) * rho * 1000;
    show({each, total: each * n, perm: s.area(v) * rho * 1000});
  }

  function show(r, msg = '') {
    out.msg.textContent = msg;
    form.classList.toggle('wc-ready', !!r);
    out.total.textContent = r ? fmt(r.total, r.total < 10 ? 3 : 2) : '0.00';
    out.lb.textContent = r ? fmt(r.total * 2.20462) + ' lb' : '—';
    out.each.textContent = r ? fmt(r.each, 3) + ' kg' : '—';
    out.perm.textContent = r ? fmt(r.perm, 3) + ' kg/m' : '—';
    if (quote) {
      const parts = [alloy.options[alloy.selectedIndex].text.split(' ·')[0], profile ? profile.options[profile.selectedIndex].text : form.dataset.label];
      dims.querySelectorAll('.wc-field').forEach(f => { const i = f.querySelector('input'); if (i.value) parts.push(`${f.querySelector('label').textContent} ${i.value} ${f.querySelector('select').value}`); });
      parts.push(`${pieces.value || 1} pcs`);
      if (r) parts.push(`approx. ${fmt(r.total)} kg`);
      quote.href = '/metline-aluminium/contact/?enquiry=' + encodeURIComponent(parts.join(', ')) + '#enquiry';
    }
  }

  alloy.addEventListener('change', () => { if (alloy.value !== 'custom') density.value = alloy.value; calc(); });
  density.addEventListener('input', () => { alloy.value = [...alloy.options].some(o => o.value === density.value) ? density.value : 'custom'; calc(); });
  if (profile) profile.addEventListener('change', build);
  form.addEventListener('input', e => { if (e.target !== density && e.target !== alloy) calc(); });
  form.addEventListener('change', e => { if (e.target.tagName === 'SELECT' && e.target !== alloy && e.target !== profile) calc(); });
  form.addEventListener('submit', e => { e.preventDefault(); calc(); });
  form.addEventListener('reset', () => setTimeout(() => { density.value = alloy.value; dims.innerHTML = ''; build(); }));
  density.value = alloy.value;
  build();
}

