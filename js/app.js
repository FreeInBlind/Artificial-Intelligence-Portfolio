(function () {
  'use strict';

  /* ========== 工具 ========== */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  const t = window.t,
    L = window.L,
    I18N = window.I18N;
  const root = document.documentElement;
  const P = window.PROFILE;
  const D = window.PORTFOLIO;
  const coarse = !window.matchMedia('(pointer: fine)').matches;
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem('crt.' + k);
        return v === null ? d : v;
      } catch (e) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem('crt.' + k, v);
      } catch (e) {
        /* 忽略 */
      }
    },
  };

  const PRESETS = ['amber', 'white', 'moss'];
  const state = {
    preset: store.get('preset', 'amber'),
    fx: store.get('fx', 'on'),
    motion: reduceMQ.matches ? 'reduced' : store.get('motion', 'full'),
    scene: 1,
    power: true,
  };

  const motionOff = () => root.dataset.motion === 'reduced';
  const fxOff = () => root.dataset.fx === 'off';
  const wait = (ms) => (motionOff() ? 0 : ms);
  const readColors = () => {
    const cs = getComputedStyle(root);
    const g = (n) => cs.getPropertyValue(n).trim();
    return {
      bg: g('--bg'),
      text: g('--text'),
      accent: g('--accent'),
      ok: g('--ok'),
      warn: g('--warn'),
      muted: g('--muted'),
      textRgb: g('--text-rgb'),
      accentRgb: g('--accent-rgb'),
    };
  };
  let C = readColors();
  const grow = (el) =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        $$('.track > i[data-w]', el).forEach((i) => {
          i.style.width = i.dataset.w + '%';
        });
      }),
    );

  const screen = $('#screen');
  const mask = $('#boot-mask');
  const knob = $('#knob');
  const knobLabel = $('#knob-label');
  const fxBtn = $('#fx');
  const motionBtn = $('#motion');
  const powerBtn = $('#power');
  const chBtns = $$('.ch');

  /* ========== 静态文案：data-i18n 与 data-i18n-attr ========== */
  function applyI18n() {
    const lg = I18N.lang;
    root.lang = lg === 'en' ? 'en' : 'zh-CN';
    root.dataset.lang = lg;
    document.title = t('doc.title');
    const meta = $('meta[name=description]');
    if (meta) meta.setAttribute('content', t('doc.desc'));
    $$('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    $$('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const i = pair.indexOf(':');
        if (i > 0) el.setAttribute(pair.slice(0, i), t(pair.slice(i + 1)));
      });
    });
  }
  applyI18n();

  /* ========== 磁盘封面：由数据排版，不依赖图片 ========== */
  const artHTML = (p) =>
    `<span class='art m-${esc(p.motif || 'browser')}' style='--dc:${esc(p.color || '#8F6A34')}'>` +
    (p.thumb
      ? `<img src='${esc(p.thumb)}' alt='' style='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5;mix-blend-mode:luminosity'>`
      : '') +
    `<i class='art-motif'></i><i class='art-shutter'></i><span class='art-label'><span class='art-id'>${esc(p.id)}</span><span class='art-yr'>${esc(p.year)}</span></span></span>`;

  /* ========== 频道 1：开机与身份 ========== */
  const s1 = (function () {
    const list = $('#selfcheck');
    const cmds = $('#cmds');
    const out = $('#cmd-out');
    const inner = $('#cmd-inner');
    let current = null;
    let timers = [];
    let ran = false;

    P.selfcheck.forEach((it) => {
      const li = document.createElement('li');
      li.className = it.state;
      li.innerHTML = `<span class='dot'></span><span class='lb'></span><span class='dt'></span><span class='tag'></span>`;
      list.appendChild(li);
    });
    const lit = (li) => li.classList.add('lit');
    function runCheck() {
      timers.forEach(clearTimeout);
      timers = [];
      ran = true;
      $$('li', list).forEach((li, i) => {
        li.classList.remove('lit');
        timers.push(setTimeout(() => lit(li), wait(i * 320 + 200)));
      });
    }
    function skipCheck() {
      timers.forEach(clearTimeout);
      $$('li', list).forEach(lit);
    }
    $('#skip-check').addEventListener('click', skipCheck);

    function render(key) {
      const c = P.commands[key];
      let h = `<div class='cmd-body'><h3>${esc(L(c.title))}</h3>`;
      if (c.paragraphs) h += c.paragraphs.map((x) => `<p>${esc(L(x))}</p>`).join('');
      if (c.skills)
        h += c.skills
          .map(
            (s) =>
              `<div class='bar-row'><span>${esc(L(s.name))}</span><span class='track'><i data-w='${+s.level}'></i></span><span class='muted'>${+s.level}</span></div>`,
          )
          .join('');
      if (c.steps)
        h +=
          `<div class='flow'>` +
          c.steps
            .map((s, i) => `<div class='node' style='--i:${i}'><b>${esc(L(s.t))}</b><span>${esc(L(s.d))}</span></div>`)
            .join('') +
          `</div>`;
      return h + '</div>';
    }
    function openCmd(key, btn) {
      if (current === key) {
        out.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        current = null;
        return;
      }
      $$('.cmd', cmds).forEach((x) => x.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', 'true');
      current = key;
      inner.innerHTML = render(key);
      out.classList.add('open');
      grow(inner);
    }
    P.order.forEach((key) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cmd';
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-controls', 'cmd-out');
      b.addEventListener('click', () => openCmd(key, b));
      cmds.appendChild(b);
    });

    function relang() {
      $('#p-name').textContent = L(P.name);
      $('#p-role').textContent = L(P.role);
      $('#facts').innerHTML = (P.facts || [])
        .map((f) => `<div><dt>${esc(L(f.k))}</dt><dd>${esc(L(f.v))}</dd></div>`)
        .join('');
      /* 近况：带日期的进展，读的时候用 <time> 标出时间点 */
      $('#now-list').innerHTML = (P.now || [])
        .map((n) => `<li><time>${esc(L(n.when))}</time><span>${esc(L(n.what))}</span></li>`)
        .join('');
      $$('li', list).forEach((li, i) => {
        const it = P.selfcheck[i];
        $('.lb', li).textContent = L(it.label);
        const dt = $('.dt', li);
        dt.textContent = L(it.detail);
        dt.title = L(it.detail);
        $('.tag', li).textContent = t(it.state === 'ok' ? 'sc.ok' : 'sc.warn');
      });
      $$('.cmd', cmds).forEach((b, i) => {
        b.textContent = L(P.commands[P.order[i]].label);
      });
      if (current) {
        inner.innerHTML = render(current);
        grow(inner);
      }
    }
    relang();

    /* 符号化点阵头像：程序生成的高对比像素人像，鼠标靠近时由抖动网点逐渐变清晰 */
    const cv = $('#portrait');
    const ctx = cv.getContext('2d');
    const W = 28,
      H = 32,
      CELL = 10;
    cv.width = W * CELL;
    cv.height = H * CELL;
    const gray = new Float32Array(W * H);
    (function makeSource() {
      const put = (x, y, v) => {
        if (x >= 0 && x < W && y >= 0 && y < H) gray[y * W + x] = v;
      };
      const rect = (x0, y0, w, h, v) => {
        for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) put(x, y, v);
      };
      const ell = (cx, cy, rx, ry, v) => {
        for (let y = 0; y < H; y++)
          for (let x = 0; x < W; x++) {
            const dx = (x + 0.5 - cx) / rx,
              dy = (y + 0.5 - cy) / ry;
            if (dx * dx + dy * dy <= 1) gray[y * W + x] = v;
          }
      };
      ell(14, 36, 12, 9, 0.6);
      rect(11, 20, 6, 7, 0.4);
      ell(14, 9.5, 8.2, 8, 0.5);
      ell(14, 13, 6.8, 8, 1);
      rect(8, 11, 5, 3, 0);
      rect(15, 11, 5, 3, 0);
      rect(13, 12, 2, 1, 0);
      put(10, 12, 0.9);
      put(17, 12, 0.9);
      rect(12, 17, 5, 1, 0.2);
      [
        [0, 0, 1],
        [W - 1, 0, -1],
        [0, H - 1, 1],
        [W - 1, H - 1, -1],
      ].forEach((c, k) => {
        const sy = k < 2 ? 1 : -1;
        for (let i = 0; i < 5; i++) {
          put(c[0] + c[2] * i, c[1], 0.85);
          put(c[0], c[1] + sy * i, 0.85);
        }
      });
    })();
    const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    let mx = -9999,
      my = -9999,
      raf = 0,
      jit = 0,
      jitTimer = 0,
      active = false;
    const RADIUS = 150;
    function draw() {
      raf = 0;
      if (!active) return;
      const rect = cv.getBoundingClientRect();
      const k = cv.width / (rect.width || cv.width);
      const pointerX = (mx - rect.left) * k;
      const pointerY = (my - rect.top) * k;
      const rad = RADIUS * k;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = C.accent;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const gv = gray[y * W + x];
          const cx = x * CELL + CELL / 2;
          const cy = y * CELL + CELL / 2;
          let tt = 1 - Math.min(1, Math.hypot(cx - pointerX, cy - pointerY) / rad);
          tt = tt * tt * (3 - 2 * tt);
          tt = Math.max(tt, 0.3);
          const th = (BAYER[(y & 3) * 4 + ((x + jit) & 3)] + 0.5) / 16;
          const v = (gv > th ? 1 : 0) * (1 - tt) + gv * tt;
          if (gv < 0.02 || v < 0.06) {
            ctx.globalAlpha = 0.16 + 0.12 * tt;
            ctx.fillRect(cx - 1, cy - 1, 2, 2);
            continue;
          }
          ctx.globalAlpha = 0.3 + 0.7 * v;
          ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
        }
      }
      ctx.globalAlpha = 1;
    }
    const schedule = () => {
      if (active && !raf) raf = requestAnimationFrame(draw);
    };
    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
      schedule();
    }
    function onLeave() {
      mx = my = -9999;
      schedule();
    }
    function start() {
      active = true;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerdown', onMove);
      window.addEventListener('blur', onLeave);
      clearInterval(jitTimer);
      if (!motionOff() && !fxOff() && !coarse)
        jitTimer = setInterval(() => {
          jit = (jit + 1) & 3;
          schedule();
        }, 170);
      draw();
    }
    function stop() {
      active = false;
      clearInterval(jitTimer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('blur', onLeave);
    }
    return {
      enter(fresh) {
        if (fresh || !ran) runCheck();
        else skipCheck();
        if (!current) {
          const b0 = $('.cmd', cmds);
          if (b0) openCmd(P.order[0], b0);
        }
        start();
      },
      leave() {
        stop();
      },
      refresh() {
        if (active) {
          stop();
          start();
        }
      },
      relang,
    };
  })();

  /* ========== 频道 2：项目档案（磁盘装载） ========== */
  const s2 = (function () {
    const rack = $('#rack');
    const slot = $('#slot');
    const slotDisk = $('#slot-disk');
    const drive = $('#drive');
    const stage = $('#stage');
    const driveMsg = $('#drive-msg');
    const log = $('#log');
    const loader = $('#loader');
    const fill = $('#bar-fill');
    const pct = $('#bar-pct');
    const ej = $('#eject');
    const capacity = $('#capacity');
    const catalog = $('#catalog');
    const projects = D.projects;
    const diskBtn = {};
    let mounted = null;
    let busy = false;
    let msgState = { key: 'drive.empty' };
    /* 驱动器状态只有这一处说明，取代原先输入框占位与日志行两处重复 */
    const setMsg = (key, vars) => {
      msgState = { key, vars };
      driveMsg.textContent = t(key, vars);
    };

    /* 封面：磁盘面 + 名称 + 一句话简介 + 摘要 + 技术栈标签 + 两项实测数字，
       信息密度随可用高度变化，高屏上多给出的那块面积由真实数据填，不是靠底纹 */
    function renderCatalog() {
      catalog.innerHTML = projects
        .map((p) => {
          const tech = (p.tech || [])
            .slice(0, 3)
            .map((x) => `<i>${esc(L(x.name))}</i>`)
            .join('');
          const lede = p.overview && p.overview.summary ? L(p.overview.summary) : '';
          const pts = (p.overview && p.overview.bullets ? p.overview.bullets : [])
            .slice(0, 2)
            .map((x) => `<span>▸ ${esc(L(x))}</span>`)
            .join('');
          const stats = (p.results || [])
            .slice(0, 2)
            .map((r) => `<div><b>${esc(L(r.value))}</b><span>${esc(L(r.label))}</span></div>`)
            .join('');
          return (
            `<button type='button' class='cover' data-id='${esc(p.id)}' style='--dc:${esc(p.color || '#8F6A34')}' aria-label='${esc(t('cover.aria', { id: p.id, title: L(p.title) }))}'>` +
            artHTML(p) +
            `<span class='cover-body'><b class='cover-ti'>${esc(L(p.title))}</b><span class='cover-sub'>${esc(L(p.subtitle))}</span>` +
            (lede ? `<p class='cover-lede'>${esc(lede)}</p>` : '') +
            (tech ? `<span class='cover-chips' aria-hidden='true'>${tech}</span>` : '') +
            (pts ? `<span class='cover-points'>${pts}</span>` : '') +
            (stats ? `<span class='cover-stats'>${stats}</span>` : '') +
            `</span><span class='cover-foot'><span>${esc(t('cover.load'))}</span><em aria-hidden='true'>▸</em></span></button>`
          );
        })
        .join('');
    }
    catalog.addEventListener('click', (e) => {
      const c = e.target.closest('.cover');
      const p = c && projects.find((x) => x.id === c.dataset.id);
      if (p && diskBtn[p.id]) insert(p, diskBtn[p.id]);
    });

    function logLine(m, c) {
      const s = document.createElement('span');
      if (c) s.className = c;
      s.textContent = m + '\n';
      log.appendChild(s);
      while (log.childNodes.length > 40) log.removeChild(log.firstChild);
      log.scrollTop = log.scrollHeight;
    }
    logLine('DRIVE A: READY - insert disk');

    /* 磁盘架：由 projects 数据生成，剩余槽位为空白磁盘 */
    for (let i = 0; i < D.capacity; i++) {
      const p = projects[i];
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'disk' + (p ? '' : ' blank');
      if (p) {
        b.style.setProperty('--dc', p.color || '#5A5244');
        b.innerHTML = `<span class='lb'><b>${esc(p.id)}</b><i>${esc(p.year)}</i></span>`;
      } else {
        b.setAttribute('aria-disabled', 'true');
        b.innerHTML = `<span class='lb'></span>`;
      }
      li.appendChild(b);
      rack.appendChild(li);
      if (p) diskBtn[p.id] = b;
      bindDisk(b, p);
    }
    function relabelRack() {
      $$('li', rack).forEach((li, i) => {
        const b = $('button', li);
        const p = projects[i];
        if (p) {
          b.setAttribute('aria-label', t('disk.aria', { id: p.id, title: L(p.title) }));
          b.title = L(p.title);
        } else {
          b.setAttribute('aria-label', t('disk.blank.aria', { n: i + 1 }));
          $('.lb', b).textContent = t('disk.blank', { n: String(i + 1).padStart(2, '0') });
        }
      });
    }

    const over = (x, y) => {
      const r = drive.getBoundingClientRect();
      return x >= r.left - 20 && x <= r.right + 20 && y >= r.top - 20 && y <= r.bottom + 20;
    };
    /* 磁盘架在三个频道都可见：从别的频道点磁盘时先切到档案页，再执行装载 */
    function toArchive(fn) {
      if (state.scene === 2) {
        fn();
        return;
      }
      goTo(2);
      setTimeout(fn, wait(700));
    }
    function blankDisk(b) {
      logLine('E-04 BLANK DISK - nothing to load', 'w');
      b.classList.remove('shake');
      void b.offsetWidth;
      b.classList.add('shake');
      if (!mounted) setMsg('drive.blank');
    }
    function bindDisk(b, p) {
      b.addEventListener('click', () => {
        if (b._dragged) {
          b._dragged = false;
          return;
        }
        if (!p) {
          toArchive(() => blankDisk(b));
          return;
        }
        toArchive(() => insert(p, b));
      });
      if (coarse || !p) return;
      let sx = 0,
        sy = 0,
        pid = null,
        dragging = false;
      b.addEventListener('pointerdown', (e) => {
        if (e.button) return;
        sx = e.clientX;
        sy = e.clientY;
        pid = e.pointerId;
        dragging = false;
        try {
          b.setPointerCapture(pid);
        } catch (err) {
          /* 忽略 */
        }
      });
      b.addEventListener('pointermove', (e) => {
        if (pid === null) return;
        if (!dragging && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) {
          dragging = true;
          const r = b.getBoundingClientRect();
          b.style.width = r.width + 'px';
          b.style.height = r.height + 'px';
          b.classList.add('dragging');
        }
        if (dragging) {
          b.style.left = e.clientX - b.offsetWidth / 2 + 'px';
          b.style.top = e.clientY - b.offsetHeight / 2 + 'px';
          slot.classList.toggle('hot', over(e.clientX, e.clientY));
        }
      });
      const end = (e, cancel) => {
        if (pid === null) return;
        try {
          b.releasePointerCapture(pid);
        } catch (err) {
          /* 忽略 */
        }
        pid = null;
        if (!dragging) return;
        dragging = false;
        b._dragged = true;
        setTimeout(() => {
          b._dragged = false;
        }, 50);
        b.classList.remove('dragging');
        b.style.left = b.style.top = b.style.width = b.style.height = '';
        slot.classList.remove('hot');
        if (!cancel && over(e.clientX, e.clientY)) insert(p, b);
      };
      b.addEventListener('pointerup', (e) => end(e, false));
      b.addEventListener('pointercancel', (e) => end(e, true));
    }

    function setProgress(n) {
      fill.style.width = n + '%';
      pct.textContent = n + '%';
    }

    function insert(p, b) {
      if (busy) return;
      if (mounted) {
        if (mounted.p === p) return;
        eject(() => insert(p, b));
        return;
      }
      busy = true;
      mounted = { p, b };
      b.classList.add('in-drive');
      slotDisk.hidden = false;
      slotDisk.classList.remove('out');
      slotDisk.style.setProperty('--dc', p.color || '#5A5244');
      slotDisk.textContent = p.id;
      drive.dataset.state = 'busy';
      ej.disabled = true;
      setMsg('drive.read', { id: p.id });
      loader.hidden = false;
      setProgress(0);
      logLine('MOUNT A: ' + p.id + ' ' + L({ zh: p.title.en || p.title, en: p.title.en || p.title }), 'a');
      const lines = p.log || [];
      const total = motionOff() ? 300 : 2600;
      const t0 = performance.now();
      let li = 0;
      const iv = setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / total);
        setProgress(Math.round(k * 100));
        while (li < lines.length && k >= (li + 1) / (lines.length + 1)) logLine(lines[li++]);
        if (k >= 1) {
          clearInterval(iv);
          while (li < lines.length) logLine(lines[li++]);
          finish(p);
        }
      }, 50);
    }

    function finish(p) {
      logLine('READY.', 'a');
      drive.dataset.state = 'ready';
      ej.disabled = false;
      busy = false;
      setMsg('drive.ready', { id: p.id });
      setTimeout(() => {
        if (!mounted || mounted.p !== p) return;
        loader.hidden = true;
        openWindow(p);
      }, wait(350));
    }

    /* 项目窗口：概述 / 过程 / 技术 / 结果 / 链接 五层，内容全部来自数据 */
    const TABS = ['overview', 'process', 'tech', 'results', 'links'];
    const bar = (name, lv) =>
      `<div class='bar-row'><span>${esc(L(name))}</span><span class='track'><i data-w='${+lv || 0}'></i></span><span class='muted'>${+lv || 0}</span></div>`;
    const PANELS = {
      overview: (p) => {
        const o = p.overview || {};
        return `<div class='ov'>${artHTML(p)}<div><p>${esc(L(o.summary))}</p><ul class='ticks'>${(o.bullets || []).map((x) => `<li>${esc(L(x))}</li>`).join('')}</ul><p class='muted'>${esc(p.year)} · ${esc(L(p.subtitle))}</p></div></div>`;
      },
      process: (p) =>
        `<ol class='timeline'>${(p.process || []).map((s) => `<li><strong>${esc(L(s.title))}</strong><p>${esc(L(s.text))}</p></li>`).join('')}</ol>`,
      tech: (p) =>
        `<div class='chips'>${(p.tech || []).map((x) => `<span class='chip'>${esc(L(x.name))}</span>`).join('')}</div>${(p.tech || []).map((x) => bar(x.name, x.level)).join('')}`,
      results: (p) =>
        `<div class='kpis'>${(p.results || []).map((r) => `<div class='kpi'><b>${esc(L(r.value))}</b><span>${esc(L(r.label))}</span><small class='muted'>${esc(L(r.note || ''))}</small><span class='track'><i data-w='${+r.bar || 0}'></i></span></div>`).join('')}</div>`,
      links: (p) =>
        `<ul class='links'>${(p.links || []).map((l) => `<li><a href='${esc(l.href)}' target='_blank' rel='noopener'>${esc(L(l.label))}</a></li>`).join('')}</ul>`,
    };
    function openWindow(p) {
      stage.classList.add('has-win');
      stage.insertAdjacentHTML(
        'beforeend',
        `<article class='win' aria-labelledby='win-t' tabindex='-1'><div class='win-bar'><span id='win-t'>${esc(p.id)} · ${esc(L(p.title))}</span><button type='button' data-act='eject'>${esc(t('eject'))}</button></div><div class='tabs' role='tablist' aria-label='${esc(t('tabs.aria'))}'>${TABS.map((k, i) => `<button type='button' class='tab' role='tab' id='tab-${k}' data-k='${k}' aria-controls='pn' aria-selected='${i === 0}' tabindex='${i === 0 ? 0 : -1}'>${esc(t('tab.' + k))}</button>`).join('')}</div><div class='tabpanel' role='tabpanel' id='pn'></div></article>`,
      );
      const win = $('.win', stage);
      showTab(win, 'overview');
      win.focus({ preventScroll: true });
    }
    function showTab(win, k) {
      if (!win || !mounted) return;
      $$('.tab', win).forEach((b) => {
        const on = b.dataset.k === k;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      const pn = $('.tabpanel', win);
      pn.setAttribute('aria-labelledby', 'tab-' + k);
      pn.innerHTML = PANELS[k](mounted.p);
      pn.style.animation = 'none';
      void pn.offsetWidth;
      pn.style.animation = '';
      grow(pn);
    }
    function relangWin() {
      const win = $('.win', stage);
      if (!win || !mounted || win.classList.contains('closing')) return;
      $('#win-t', win).textContent = mounted.p.id + ' · ' + L(mounted.p.title);
      $('[data-act=eject]', win).textContent = t('eject');
      $('.tabs', win).setAttribute('aria-label', t('tabs.aria'));
      const cur = $('.tab[aria-selected=true]', win);
      $$('.tab', win).forEach((b) => {
        b.textContent = t('tab.' + b.dataset.k);
      });
      showTab(win, cur ? cur.dataset.k : 'overview');
    }
    stage.addEventListener('click', (e) => {
      const el = e.target.closest('[data-act],[role=tab]');
      if (!el) return;
      if (el.dataset.act === 'eject') eject();
      else showTab($('.win', stage), el.dataset.k);
    });
    stage.addEventListener('keydown', (e) => {
      const el = e.target.closest('[role=tab]');
      if (!el) return;
      const tabs = $$('[role=tab]', stage);
      let i = tabs.indexOf(el);
      if (e.key === 'ArrowRight') i = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') i = (i - 1 + tabs.length) % tabs.length;
      else return;
      e.preventDefault();
      tabs[i].focus();
      showTab($('.win', stage), tabs[i].dataset.k);
    });

    function eject(cb) {
      if (!mounted || busy) {
        if (cb && !busy) cb();
        return;
      }
      const m = mounted;
      mounted = null;
      busy = true;
      ej.disabled = true;
      const win = $('.win', stage);
      if (win) win.classList.add('closing');
      slotDisk.classList.add('out');
      logLine('EJECT A: ' + m.p.id, 'w');
      setTimeout(() => {
        if (win) win.remove();
        stage.classList.remove('has-win');
        slotDisk.hidden = true;
        slotDisk.classList.remove('out');
        m.b.classList.remove('in-drive');
        loader.hidden = true;
        drive.dataset.state = 'idle';
        busy = false;
        setMsg('drive.empty');
        logLine('DRIVE A: EMPTY - insert disk');
        if (cb) cb();
      }, wait(520));
    }
    ej.addEventListener('click', () => eject());

    function relang() {
      capacity.textContent = t('s2.cap', { n: projects.length, c: D.capacity });
      slot.dataset.empty = t('slot.empty');
      renderCatalog();
      relabelRack();
      if (!mounted) setMsg(msgState.key === 'drive.blank' ? 'drive.empty' : msgState.key);
      else if (drive.dataset.state === 'ready') setMsg('drive.ready', { id: mounted.p.id });
      relangWin();
    }
    relang();

    return {
      enter() {},
      leave() {
        slot.classList.remove('hot');
      },
      refresh() {},
      relang,
    };
  })();

  /* ========== 频道 3：发送信号 ========== */
  const s3 = (function () {
    const form = $('#tx-form');
    const fn = $('#f-name');
    const fm = $('#f-mail');
    const fg = $('#f-msg');
    const msg = $('#form-msg');
    const btn = $('#tx-btn');
    const cv = $('#scope');
    const ctx = cv.getContext('2d');
    const bars = $('#bars');
    const dbm = $('#dbm');
    const rc = $('#receipt');
    const lv = $('#s3-lv');
    const meterNote = $('#meter-note');
    const noteList = $('#note-list');
    const readyList = $('#ready-list');
    const readyCount = $('#ready-count');
    const msgCount = $('#msg-count');
    const txFlow = $('#tx-flow');
    const N = 6;
    let energy = 0,
      level = 0,
      shown = -1,
      phase = 0,
      raf = 0,
      active = false,
      sending = false;
    let btnMode = 'idle',
      rcId = null;

    const paintBtn = () => {
      btn.textContent = t(btnMode === 'sending' ? 'tx.sending' : btnMode === 'again' ? 'tx.again' : 'tx.send');
    };
    const paintReceipt = () => {
      if (!rcId) return;
      rc.innerHTML = `<b>${esc(t('rc.title', { id: rcId }))}</b> · ${esc(t('rc.body', { n: N }))}<br><span>${esc(t('rc.poc'))}</span>`;
    };

    for (let i = 0; i < 10; i++) {
      const b = document.createElement('i');
      b.style.setProperty('--n', i);
      bars.appendChild(b);
    }
    const bi = $$('i', bars);
    const mailOK = (v) => {
      const a = v.indexOf('@');
      return a > 0 && v.indexOf(' ') < 0 && v.indexOf('.', a) > a + 1 && v.charAt(v.length - 1) !== '.';
    };
    const filled = () =>
      ((fn.value.trim() ? 1 : 0) + (mailOK(fm.value.trim()) ? 1 : 0) + Math.min(1, fg.value.trim().length / 40)) / 3;
    const target = () => Math.round(Math.min(10, filled() * 7 + energy * 3));

    /* 发送前确认：三项与信号强度同源，状态列给出进度而不是空标签 */
    const READY = [
      { key: 'rd.name', ok: () => !!fn.value.trim(), note: () => (fn.value.trim() ? t('rd.filled') : t('rd.wait')) },
      {
        key: 'rd.mail',
        ok: () => mailOK(fm.value.trim()),
        note: () => (mailOK(fm.value.trim()) ? t('rd.filled') : t('rd.wait')),
      },
      { key: 'rd.msg', ok: () => fg.value.trim().length >= 5, note: () => fg.value.trim().length + ' / 5' },
    ];
    READY.forEach(() => {
      const li = document.createElement('li');
      li.innerHTML = `<span class='rd'></span><span class='rn'></span><span class='rs'></span>`;
      readyList.appendChild(li);
    });
    const readyItems = $$('li', readyList);
    function paintReady() {
      let on = 0;
      READY.forEach((r, i) => {
        const li = readyItems[i];
        const ok = r.ok();
        if (ok) on++;
        li.classList.toggle('on', ok);
        $('.rn', li).textContent = t(r.key);
        $('.rs', li).textContent = r.note();
      });
      readyCount.textContent = on + ' / ' + READY.length;
      msgCount.textContent = fg.value.length + ' / ' + fg.maxLength;
    }

    function drawScope() {
      const w = cv.width,
        h = cv.height,
        f = filled();
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${C.accentRgb},.2)`;
      for (let x = 0; x <= w; x += w / 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += h / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      const amp = ((0.06 + f * 0.2 + energy * 0.55) * h) / 2;
      const freq = 2 + f * 3 + energy * 4;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const k = x / w;
        const y =
          h / 2 +
          Math.sin(k * Math.PI * 2 * freq + phase) * amp * (0.6 + 0.4 * Math.sin(k * 6 + phase * 0.5)) +
          (Math.random() - 0.5) * (1 - f) * 6;
        if (x) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 3;
      if (!fxOff()) {
        ctx.shadowColor = C.accent;
        ctx.shadowBlur = 16;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    function updateMeter() {
      const n = Math.round(level);
      if (n === shown) return;
      shown = n;
      bi.forEach((b, i) => b.classList.toggle('on', i < n));
      const lvl = n === 0 ? 'none' : n <= 3 ? 'low' : n <= 7 ? 'mid' : 'high';
      bars.dataset.lv = lvl;
      bars.setAttribute('aria-valuenow', String(n));
      bars.setAttribute('aria-valuetext', t('tx.lv.' + lvl));
      lv.textContent = t('tx.lv.' + lvl);
      dbm.textContent = -90 + n * 6 + ' dBm';
    }
    function frame() {
      raf = 0;
      if (!active) return;
      energy *= 0.94;
      if (energy < 0.01) energy = 0;
      level += (target() - level) * 0.25;
      if (!motionOff()) phase += 0.14;
      drawScope();
      updateMeter();
      if (!motionOff() || energy > 0 || Math.abs(target() - level) > 0.05) raf = requestAnimationFrame(frame);
    }
    const kick = () => {
      if (active && !raf) raf = requestAnimationFrame(frame);
    };
    form.addEventListener('input', () => {
      energy = Math.min(1, energy + 0.4);
      paintReady();
      kick();
    });
    form.addEventListener('focusin', () => {
      energy = Math.min(1, energy + 0.2);
      kick();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (sending) return;
      const errs = [];
      let first = null;
      if (!fn.value.trim()) {
        errs.push(t('err.name'));
        first = first || fn;
      }
      if (!mailOK(fm.value.trim())) {
        errs.push(t('err.mail'));
        first = first || fm;
      }
      if (fg.value.trim().length < 5) {
        errs.push(t('err.msg'));
        first = first || fg;
      }
      if (errs.length) {
        msg.textContent = t('err.pre') + errs.join(t('err.sep'));
        first.focus();
        return;
      }
      msg.textContent = '';
      transmit();
    });

    function transmit() {
      sending = true;
      btn.disabled = true;
      btnMode = 'sending';
      paintBtn();
      rc.hidden = true;
      rcId = null;
      const dur = Math.max(1, wait(1800));
      const t0 = performance.now();
      function step(now) {
        const k = Math.min(1, (now - t0) / dur);
        energy = 1;
        kick();
        if (k < 1) requestAnimationFrame(step);
        else done();
      }
      requestAnimationFrame(step);
      function done() {
        rcId = 'ACK-' + Math.random().toString(16).slice(2, 6).toUpperCase();
        rc.hidden = false;
        paintReceipt();
        btn.disabled = false;
        btnMode = 'again';
        paintBtn();
        sending = false;
        form.reset();
        kick();
      }
    }

    function relang() {
      paintBtn();
      paintReceipt();
      msg.textContent = '';
      /* 频道备注：右侧第二块有内容的模块，回答「发出去之后会怎样」 */
      noteList.innerHTML = (P.channel || []).map((c) => `<dt>${esc(L(c.k))}</dt><dd>${esc(L(c.v))}</dd>`).join('');
      /* 发送流程：备注面板的下半段，把右栏余下的高度换成三步真实说明 */
      txFlow.innerHTML = [1, 2, 3]
        .map((n) => `<li><span><b>${esc(t('tx.flow.' + n + '.t'))}</b> ${esc(t('tx.flow.' + n + '.d'))}</span></li>`)
        .join('');
      meterNote.textContent = t('tx.meter.note');
      paintReady();
      shown = -1;
      updateMeter();
    }
    relang(); /* 初始化时就把备注与强度说明填上，不等语言切换 */

    return {
      enter() {
        active = true;
        drawScope();
        updateMeter();
        kick();
      },
      leave() {
        active = false;
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      refresh() {
        if (active) {
          drawScope();
          kick();
        }
      },
      relang,
    };
  })();

  /* ========== 设置：配色旋钮 / 特效 / 动态 ========== */
  function paintKnob() {
    const idx = Math.max(0, PRESETS.indexOf(state.preset));
    const name = t('preset.' + PRESETS[idx]);
    knob.style.setProperty('--rot', (idx - 1) * 50 + 'deg');
    knobLabel.textContent = name;
    knob.setAttribute('aria-label', t('knob.aria', { name }));
  }
  function applySettings(announce) {
    if (PRESETS.indexOf(state.preset) < 0) state.preset = 'amber';
    root.dataset.preset = state.preset;
    root.dataset.fx = state.fx;
    root.dataset.motion = state.motion;
    paintKnob();
    fxBtn.setAttribute('aria-pressed', String(state.fx === 'on'));
    motionBtn.setAttribute('aria-pressed', String(state.motion === 'full'));
    C = readColors();
    s1.refresh();
    s3.refresh();
    if (announce) $('#live').textContent = announce;
  }
  knob.addEventListener('click', () => {
    const i = PRESETS.indexOf(state.preset);
    state.preset = PRESETS[(i + 1) % PRESETS.length];
    store.set('preset', state.preset);
    applySettings(t('say.preset', { name: t('preset.' + state.preset) }));
  });
  fxBtn.addEventListener('click', () => {
    state.fx = state.fx === 'on' ? 'off' : 'on';
    store.set('fx', state.fx);
    applySettings(t(state.fx === 'on' ? 'say.fx.on' : 'say.fx.off'));
  });
  motionBtn.addEventListener('click', () => {
    state.motion = state.motion === 'full' ? 'reduced' : 'full';
    if (!reduceMQ.matches) store.set('motion', state.motion);
    applySettings(t(state.motion === 'full' ? 'say.motion.on' : 'say.motion.off'));
  });
  reduceMQ.addEventListener('change', () => {
    if (reduceMQ.matches) {
      state.motion = 'reduced';
      applySettings();
    }
  });

  /* ========== 换台转场与路由 ========== */
  const scenes = { 1: s1, 2: s2, 3: s3 };
  const sceneEls = { 1: $('#scene-1'), 2: $('#scene-2'), 3: $('#scene-3') };
  const sc = $('#static');
  const sctx = sc.getContext('2d');
  sc.width = 160;
  sc.height = 120;
  let switching = false;

  function drawStatic() {
    if (fxOff() || motionOff()) return;
    let n = 0;
    const iv = setInterval(() => {
      const im = sctx.createImageData(160, 120);
      for (let i = 0; i < im.data.length; i += 4) {
        const v = 40 + Math.random() * 150;
        im.data[i] = v;
        im.data[i + 1] = v * 0.95;
        im.data[i + 2] = v * 0.85;
        im.data[i + 3] = 255;
      }
      sctx.putImageData(im, 0, 0);
      if (++n > 8) clearInterval(iv);
    }, 60);
  }
  /* 当前频道只由控制条上亮灯的按钮表示，屏幕内不再放常驻或闪现的频道角标 */
  function showScene(n) {
    [1, 2, 3].forEach((k) => {
      sceneEls[k].hidden = k !== n;
    });
    state.scene = n;
    document.body.dataset.scene = String(n);
    chBtns.forEach((b) => b.setAttribute('aria-current', +b.dataset.ch === n ? 'page' : 'false'));
  }
  function goTo(n) {
    n = +n;
    if (!scenes[n] || n === state.scene || switching || !state.power) return;
    switching = true;
    const prev = state.scene;
    if (location.hash !== '#' + n) location.hash = '#' + n;
    screen.classList.add('tuning');
    drawStatic();
    setTimeout(() => {
      scenes[prev].leave();
      showScene(n);
      sceneEls[n].scrollTop = 0;
      scenes[n].enter(false);
    }, wait(310));
    setTimeout(() => {
      screen.classList.remove('tuning');
      switching = false;
    }, wait(640));
  }
  chBtns.forEach((b) => b.addEventListener('click', () => goTo(b.dataset.ch)));
  window.addEventListener('hashchange', () => goTo(+location.hash.slice(1)));
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === '1' || e.key === '2' || e.key === '3') goTo(e.key);
  });

  /* ========== 语言开关：屏内两组按钮，拨动后屏幕做一次扫描重绘再整体换文案 ========== */
  let langBusy = false;
  const langBtns = $$('.lang-b');
  const paintLang = () => langBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.l === I18N.lang)));
  function relangAll() {
    applyI18n();
    paintLang();
    paintKnob();
    s1.relang();
    s2.relang();
    s3.relang();
  }
  function setLang(l) {
    if (langBusy || l === I18N.lang) return;
    langBusy = true;
    langBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.l === l)));
    screen.classList.remove('refresh');
    void screen.offsetWidth;
    if (!motionOff()) screen.classList.add('refresh');
    setTimeout(() => {
      I18N.set(l);
      relangAll();
      $('#live').textContent = t('say.lang');
    }, wait(200));
    setTimeout(() => {
      screen.classList.remove('refresh');
      langBusy = false;
    }, wait(580));
  }
  langBtns.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.l)));

  /* ========== 开机 / 关机 ========== */
  function runBoot(cb) {
    mask.classList.remove('shut');
    if (mask.classList.contains('run')) return;
    mask.classList.add('run');
    let done = false;
    const fin = () => {
      if (done) return;
      done = true;
      mask.classList.remove('run');
      if (cb) cb();
    };
    mask.addEventListener('animationend', function h(e) {
      if (e.target !== mask) return;
      mask.removeEventListener('animationend', h);
      fin();
    });
    setTimeout(fin, motionOff() ? 60 : 1600);
  }
  function setPower(on) {
    state.power = on;
    powerBtn.setAttribute('aria-pressed', String(on));
    chBtns.forEach((b) => {
      b.disabled = !on;
    });
    if (on) {
      screen.classList.remove('off');
      runBoot(() => scenes[state.scene].enter(true));
    } else {
      scenes[state.scene].leave();
      mask.classList.remove('run');
      mask.classList.add('shut');
      setTimeout(() => {
        if (state.power) return;
        screen.classList.add('off');
        mask.classList.remove('shut');
      }, wait(700));
    }
  }
  powerBtn.addEventListener('click', () => setPower(!state.power));

  /* ========== 身份卡脚：真实的本地时间，每分钟更新一次 ========== */
  (function clock() {
    const el = $('#clock');
    if (!el) return;
    const tick = () => {
      const d = new Date();
      el.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    };
    tick();
    setInterval(tick, 20000);
  })();

  /* ========== 初始化 ========== */
  applySettings();
  paintLang();
  const initial = +location.hash.slice(1);
  showScene(scenes[initial] ? initial : 1);
  runBoot(() => scenes[state.scene].enter(true));
})();
