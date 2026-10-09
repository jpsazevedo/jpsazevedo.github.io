(() => {
  "use strict";
  const R = window.RESUME;
  const $ = (sel, root = document) => root.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<mark class="hl">$1</mark>');
  const plain = (s) => s.replace(/\*\*/g, "");
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parseYM = (ym) => { if (!ym) return new Date(); const [y, m] = ym.split("-").map(Number); return new Date(y, m - 1, 1); };
  const fmtYM = (ym) => (ym ? `${MONTHS[parseYM(ym).getMonth()]} ${parseYM(ym).getFullYear()}` : "Present");
  const monthsBetween = (a, b) => (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  const duration = (start, end) => {
    // Inclusive of both months: end dates on the CV are month-ends
    const m = monthsBetween(parseYM(start), parseYM(end)) + 1;
    const y = Math.floor(m / 12), r = m % 12;
    return [y && `${y} yr${y > 1 ? "s" : ""}`, r && `${r} mo`].filter(Boolean).join(" ") || "1 mo";
  };
  const phaseOf = (id) => R.phases.find((p) => p.id === id);
  const initials = (name) => name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || name.slice(0, 2);
  const allSkills = R.skills.flatMap((c) => c.items.map((s) => ({ ...s, category: c.category })));
  const skillsForRole = (id) => allSkills.filter((s) => s.used.includes(id));
  const roleById = (id) => R.experience.find((e) => e.id === id);

  const ICONS = {
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 4.6 3.4 8.4 8 9 4.6-.6 8-4.4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    layers: '<svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
    nodes: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7.3 11 16.7 6M7.3 13l9.4 5"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
  };

  const state = { phase: null, skill: null, category: R.skills[0].category };

  // ---------- Hero ----------
  $("#hero-title").textContent = R.title;
  $("#hero-name").textContent = R.name;
  $("#hero-lede").innerHTML = md(R.summary[0]);
  $("#cv-download").href = R.cvFile;
  $("#year").textContent = new Date().getFullYear();

  (function typeRoles() {
    const el = $("#typed-role");
    if (reduceMotion) { el.textContent = R.roles.join(" · "); return; }
    let i = 0, j = 0, deleting = false;
    const tick = () => {
      const word = R.roles[i];
      j += deleting ? -1 : 1;
      el.textContent = word.slice(0, j);
      let delay = deleting ? 28 : 55;
      if (!deleting && j === word.length) { deleting = true; delay = 1800; }
      else if (deleting && j === 0) { deleting = false; i = (i + 1) % R.roles.length; delay = 300; }
      setTimeout(tick, delay);
    };
    tick();
  })();

  // ---------- Stats ----------
  const years = Math.floor(monthsBetween(parseYM(R.careerStart), new Date()) / 12);
  const companies = new Set(R.experience.map((e) => e.company)).size;
  const stats = [
    { value: years, unit: "+", label: "Years in tech & security" },
    { value: R.experience.length, unit: "", label: "Roles across the stack" },
    { value: companies, unit: "", label: "Global organisations" },
    { value: 3, unit: "", label: "Frameworks: NIST · ISO · DORA" },
  ];
  $("#stats").innerHTML = stats.map((s) =>
    `<div class="stat reveal"><dd><span class="num" data-to="${s.value}">0</span><span class="unit">${s.unit}</span></dd><dt>${esc(s.label)}</dt></div>`
  ).join("");

  const countUp = (el) => {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1100;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // ---------- About ----------
  $("#about-text").innerHTML = R.summary.map((p) => `<p>${md(p)}</p>`).join("");
  $("#pillars").innerHTML = R.pillars.map((p) => `
    <div class="card pillar reveal">
      <div class="pillar-icon" aria-hidden="true">${ICONS[p.icon] || ""}</div>
      <div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>
    </div>`).join("");

  // ---------- Trajectory ----------
  (function buildTrajectory() {
    const start = parseYM(R.careerStart), end = new Date();
    const total = monthsBetween(start, end) || 1;
    const pct = (d) => (monthsBetween(start, d) / total) * 100;

    // Merge consecutive roles of the same phase; small gaps (<3 months) are absorbed.
    const chrono = [...R.experience].sort((a, b) => parseYM(a.start) - parseYM(b.start));
    const segs = [];
    chrono.forEach((r) => {
      const s = parseYM(r.start), e = parseYM(r.end);
      const last = segs[segs.length - 1];
      if (last) {
        const gap = monthsBetween(last.end, s);
        if (gap >= 3) segs.push({ gap: true, label: "Degree", start: last.end, end: s });
        else if (last.phase === r.phase) { last.end = e; return; }
        else last.end = s;
      }
      segs.push({ phase: r.phase, start: s, end: e });
    });

    $("#trajectory-track").innerHTML = segs.map((s) => {
      const left = pct(s.start), width = pct(s.end) - left;
      if (s.gap) {
        return `<div class="seg gap" style="left:${left}%;width:${width}%" title="Bachelor's degree, ISCTE"><span class="seg-label">${width > 6 ? "🎓" : ""}</span></div>`;
      }
      const ph = phaseOf(s.phase);
      const label = width > 14 ? ph.label : width > 7 ? ph.label.split(" ")[0] : "";
      return `<button type="button" class="seg" data-phase="${ph.id}" style="left:${left}%;width:${width}%;--seg-color:${ph.color}"
        aria-label="Filter timeline: ${esc(ph.label)}" title="${esc(ph.label)}"><span class="seg-label">${esc(label)}</span></button>`;
    }).join("");

    const axis = [];
    for (let y = start.getFullYear(); y <= end.getFullYear(); y += 2) axis.push(y);
    $("#trajectory-axis").innerHTML = axis.map((y) => {
      const p = Math.max(0, pct(new Date(y, 0, 1)));
      return `<span style="left:${p}%">${y}</span>`;
    }).join("") + `<span style="left:100%">Now</span>`;

    $("#phase-filters").innerHTML =
      `<button type="button" class="chip" data-phase="" aria-pressed="true">All roles</button>` +
      R.phases.map((p) => `<button type="button" class="chip" data-phase="${p.id}" aria-pressed="false" style="--seg-color:${p.color}"><span class="swatch"></span>${esc(p.label)}</button>`).join("");

    $("#trajectory").addEventListener("click", (e) => {
      const b = e.target.closest("[data-phase]");
      if (!b) return;
      const id = b.dataset.phase || null;
      setPhase(state.phase === id ? null : id);
    });
  })();

  function setPhase(id) {
    state.phase = id;
    document.querySelectorAll(".phase-filters .chip").forEach((c) => c.setAttribute("aria-pressed", String((c.dataset.phase || null) === id)));
    document.querySelectorAll(".trajectory-track .seg[data-phase]").forEach((s) => s.classList.toggle("dim", !!id && s.dataset.phase !== id));
    document.querySelectorAll(".timeline > li").forEach((li) => { li.hidden = !!id && li.dataset.phase !== id; });
  }

  // ---------- Timeline ----------
  (function buildTimeline() {
    const items = R.experience.map((r) => ({ type: "role", sort: parseYM(r.start), r }));
    items.push({ type: "edu", sort: new Date(2016, 8, 1) });
    items.sort((a, b) => b.sort - a.sort);

    $("#timeline").innerHTML = items.map(({ type, r }) => {
      if (type === "edu") {
        const e = R.education;
        return `<li class="role timeline-edu reveal" data-phase="edu" style="--seg-color:var(--muted)">
          <span class="role-node" aria-hidden="true"></span>
          <div class="role-when">${esc(e.period)}<span class="dur">Studies</span></div>
          <div class="card role-card"><div class="role-head" style="cursor:default">
            <div class="role-logo" aria-hidden="true">🎓</div>
            <div class="role-meta"><div class="role-title">${esc(e.degree)}</div>
              <div class="role-company">ISCTE<span class="sep">·</span>${esc(e.location)}</div>
              <p class="role-preview">Bridged hands-on telecom experience with formal engineering, including an introduction to information security.</p>
            </div></div></div>
        </li>`;
      }
      const ph = phaseOf(r.phase);
      const tags = skillsForRole(r.id);
      return `<li class="role reveal${r.end ? "" : " current"}" id="role-${r.id}" data-id="${r.id}" data-phase="${r.phase}" style="--seg-color:${ph.color}">
        <span class="role-node" aria-hidden="true"></span>
        <div class="role-when">${fmtYM(r.start)} – ${fmtYM(r.end)}<span class="dur">${duration(r.start, r.end)}</span></div>
        <div class="card role-card">
          <button type="button" class="role-head" aria-expanded="false" aria-controls="body-${r.id}">
            <div class="role-logo" aria-hidden="true">${esc(initials(r.company))}</div>
            <div class="role-meta">
              <div class="role-title">${esc(r.title)}</div>
              <div class="role-company">${esc(r.company)}<span class="sep">·</span>${esc(r.location)}</div>
              <span class="badge">${esc(ph.label)}</span>${r.end ? "" : '<span class="badge now">Current</span>'}
              <p class="role-preview">${md(r.bullets[0])}</p>
            </div>
            ${ICONS.chev}
          </button>
          <div class="role-body" id="body-${r.id}"><div>
            ${r.focus ? `<p class="role-focus">// ${esc(r.focus)}</p>` : ""}
            <ul>${r.bullets.map((b) => `<li>${md(b)}</li>`).join("")}</ul>
            ${tags.length ? `<div class="role-tags">${tags.map((s) => `<button type="button" class="tag" data-skill="${esc(s.name)}">${esc(s.name)}</button>`).join("")}</div>` : ""}
          </div></div>
        </div>
      </li>`;
    }).join("");

    $("#timeline").addEventListener("click", (e) => {
      const tag = e.target.closest(".tag");
      if (tag) { selectSkill(tag.dataset.skill); return; }
      const head = e.target.closest(".role-head[aria-expanded]");
      if (head) head.setAttribute("aria-expanded", String(head.getAttribute("aria-expanded") !== "true"));
    });
  })();

  // Expand the most recent role by default
  const firstHead = $(".timeline .role-head[aria-expanded]");
  if (firstHead) firstHead.setAttribute("aria-expanded", "true");

  function openRole(id, scroll = true) {
    const li = document.getElementById(`role-${id}`);
    if (!li) return;
    if (li.hidden) setPhase(null);
    $(".role-head", li).setAttribute("aria-expanded", "true");
    if (scroll) li.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }

  // ---------- Skills ----------
  function renderSkillTabs() {
    $("#skill-tabs").innerHTML = R.skills.map((c) =>
      `<button type="button" role="tab" class="skill-tab" aria-selected="${c.category === state.category}" data-cat="${esc(c.category)}">
        <span>${esc(c.category)}</span><span class="count">${c.items.length}</span></button>`).join("");
  }
  function renderSkillChips() {
    const cat = R.skills.find((c) => c.category === state.category);
    $("#skill-chips").innerHTML = cat.items.map((s, i) =>
      `<button type="button" class="skill-chip" data-skill="${esc(s.name)}" aria-pressed="${state.skill === s.name}" style="animation-delay:${i * 25}ms">
        ${esc(s.name)}${s.used.length ? `<span class="pip" aria-hidden="true">${s.used.map(() => "<i></i>").join("")}</span>` : ""}
      </button>`).join("");
  }
  function renderSkillDetail() {
    const box = $("#skill-detail");
    const s = allSkills.find((x) => x.name === state.skill);
    if (!s) {
      box.innerHTML = `<h3>Where I used it</h3><p class="empty">Select a skill to trace it back to the roles where I applied it. Dots on a skill show how many roles used it.</p>`;
      return;
    }
    if (!s.used.length) {
      box.innerHTML = `<h3>${esc(s.name)}</h3><p class="empty">Part of my core toolkit, used across projects and studies rather than tied to a single role.</p>`;
      return;
    }
    box.innerHTML = `<h3>${esc(s.name)}</h3><ul>${s.used.map((id) => {
      const r = roleById(id), ph = phaseOf(r.phase);
      return `<li style="--seg-color:${ph.color}"><span class="mini"></span><span>${esc(r.title)} · <b>${esc(r.company)}</b><small>${fmtYM(r.start)} – ${fmtYM(r.end)}</small></span></li>`;
    }).join("")}</ul><button type="button" class="link-btn" id="see-in-timeline">See it in the timeline →</button>`;
  }
  function selectSkill(name) {
    state.skill = state.skill === name ? null : name;
    const s = allSkills.find((x) => x.name === state.skill);
    if (s) state.category = s.category;
    renderSkillTabs(); renderSkillChips(); renderSkillDetail();
    const used = s ? s.used : [];
    document.querySelectorAll(".timeline .role[data-id]").forEach((li) => {
      li.classList.toggle("match", !!s && used.includes(li.dataset.id));
      li.classList.toggle("dim", !!s && used.length > 0 && !used.includes(li.dataset.id));
    });
    const banner = $("#skill-banner");
    banner.hidden = !s || !used.length;
    if (s) $("#skill-banner-name").textContent = s.name;
  }

  $("#skill-tabs").addEventListener("click", (e) => {
    const t = e.target.closest(".skill-tab");
    if (!t) return;
    state.category = t.dataset.cat;
    renderSkillTabs(); renderSkillChips();
  });
  $("#skill-tabs").addEventListener("keydown", (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const idx = R.skills.findIndex((c) => c.category === state.category);
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    state.category = R.skills[(idx + dir + R.skills.length) % R.skills.length].category;
    renderSkillTabs(); renderSkillChips();
    $(".skill-tab[aria-selected='true']").focus();
  });
  $("#skill-chips").addEventListener("click", (e) => {
    const c = e.target.closest(".skill-chip");
    if (c) selectSkill(c.dataset.skill);
  });
  $("#skill-detail").addEventListener("click", (e) => {
    if (!e.target.closest("#see-in-timeline")) return;
    const s = allSkills.find((x) => x.name === state.skill);
    if (s && s.used.length) { setPhase(null); s.used.forEach((id) => openRole(id, false)); openRole(s.used[0]); }
  });
  $("#skill-banner-clear").addEventListener("click", () => selectSkill(state.skill));
  renderSkillTabs(); renderSkillChips(); renderSkillDetail();

  // ---------- Education, languages, soft skills ----------
  (function buildEducation() {
    const e = R.education;
    $("#edu-card").innerHTML = `
      <p class="section-kicker mono">degree</p>
      <p class="degree">${esc(e.degree)}</p>
      <p class="school">${esc(e.school)}</p>
      <p class="meta">${esc(e.period)} · ${esc(e.location)} · ${esc(e.field)}</p>
      <div class="modules">${e.modules.map((m) => `<div class="module"><b>${esc(m.name)}</b><span>${esc(m.detail)}</span></div>`).join("")}</div>`;

    const SCALE = ["A1", "A2", "B1", "B2", "C1", "C2"];
    $("#languages").innerHTML = R.languages.map((l) => {
      const lvl = l.native ? 6 : SCALE.indexOf(l.levels[0]) + 1;
      const label = l.native ? "Native" : l.levels[0];
      return `<div class="lang">
        <div class="lang-head"><span>${esc(l.name)}</span><span class="level">${label}</span></div>
        <div class="meter" data-level="${lvl}" role="img" aria-label="${esc(l.name)}: ${label}">${SCALE.map(() => "<i></i>").join("")}</div>
        <div class="meter-labels" aria-hidden="true">${SCALE.map((s) => `<span>${s}</span>`).join("")}</div>
      </div>`;
    }).join("");

    $("#soft-skills").innerHTML = R.softSkills.map((g) =>
      `<article class="card reveal"><h3>${esc(g.title)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></article>`).join("");
  })();

  const fillMeters = () => document.querySelectorAll(".meter").forEach((m) => {
    [...m.children].forEach((bar, i) => setTimeout(() => bar.classList.toggle("on", i < +m.dataset.level), reduceMotion ? 0 : i * 90));
  });

  // ---------- Contact ----------
  $("#email-value").textContent = R.email;
  $("#location-value").textContent = R.location;
  $("#linkedin-link").href = R.linkedin;
  $("#copy-email").addEventListener("click", async () => {
    const hint = $("#copy-hint");
    try {
      await navigator.clipboard.writeText(R.email);
      hint.textContent = "copied ✓";
    } catch (e) {
      window.location.href = `mailto:${R.email}`;
      return;
    }
    setTimeout(() => (hint.textContent = "copy"), 2000);
  });

  // ---------- Theme ----------
  $("#theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(current === "dark" ? "light" : "dark");
  });
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
  }

  // ---------- Scroll effects ----------
  const nav = $(".nav");
  window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 8), { passive: true });

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      revealObs.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  const once = (el, fn) => {
    if (!el) return;
    const o = new IntersectionObserver(([en]) => { if (en.isIntersecting) { fn(); o.disconnect(); } }, { threshold: 0.15 });
    o.observe(el);
  };
  once($("#stats"), () => document.querySelectorAll(".stat .num").forEach(countUp));
  once($("#languages"), fillMeters);

  const links = [...document.querySelectorAll(".nav-links a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

  // ---------- Terminal ----------
  (function terminal() {
    const out = $("#terminal-output"), input = $("#terminal-input"), body = $("#terminal-body");
    const history = []; let hIdx = 0;
    const SECTIONS = ["about", "experience", "skills", "education", "contact"];

    const print = (html, cls = "") => {
      const div = document.createElement("div");
      div.className = `line ${cls}`;
      div.innerHTML = html;
      out.appendChild(div);
      body.scrollTop = body.scrollHeight;
    };
    const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    const link = (cmd, text = cmd) => `<span class="t-link" data-cmd="${esc(cmd)}">${esc(text)}</span>`;

    const commands = {
      help: {
        desc: "list available commands",
        run: () => {
          print(`<span class="t-accent">Available commands</span>`);
          Object.entries(commands).filter(([, c]) => !c.hidden).forEach(([name, c]) =>
            print(`  ${link(name)}${" ".repeat(Math.max(1, 13 - name.length))}<span class="t-muted">${esc(c.desc)}</span>`));
          print(`<span class="t-muted">Tip: Tab autocompletes, ↑/↓ browse history.</span>`);
        },
      },
      whoami: {
        desc: "short introduction",
        run: () => {
          print(`<span class="t-accent">${esc(R.name)}</span>`);
          print(`${esc(R.title)} · ${esc(R.location)}`);
          print(`<span class="t-muted">${esc(plain(R.summary[0]))}</span>`);
        },
      },
      experience: {
        desc: "career history (try: experience 1)",
        run: (args) => {
          const n = parseInt(args[0], 10);
          if (n) {
            const r = R.experience[n - 1];
            if (!r) return print(`No role #${esc(args[0])}. Try 1–${R.experience.length}.`, "t-err");
            print(`<span class="t-accent">${esc(r.title)}</span> @ ${esc(r.company)}`);
            print(`<span class="t-muted">${fmtYM(r.start)} – ${fmtYM(r.end)} · ${esc(r.location)}</span>`);
            r.bullets.forEach((b) => print(`  › ${esc(plain(b))}`));
            openRole(r.id, false);
            return;
          }
          R.experience.forEach((r, i) => {
            const yrs = `${parseYM(r.start).getFullYear()}–${r.end ? parseYM(r.end).getFullYear() : "now"}`;
            print(`  ${link(`experience ${i + 1}`, `[${i + 1}]`)} ${yrs.padEnd(10)} <span class="t-accent">${esc(r.company)}</span> <span class="t-muted">${esc(r.title)}</span>`);
          });
        },
      },
      skills: {
        desc: "skill categories (try: skills grc)",
        run: (args) => {
          const q = args.join(" ").toLowerCase();
          if (!q) {
            R.skills.forEach((c, i) => print(`  ${link(`skills ${i + 1}`, `[${i + 1}]`)} ${esc(c.category)} <span class="t-muted">(${c.items.length})</span>`));
            return;
          }
          const n = parseInt(q, 10);
          const cat = n ? R.skills[n - 1] : R.skills.find((c) => c.category.toLowerCase().includes(q) ||
            c.category.toLowerCase().split(/[^a-z]+/).map((w) => w[0]).join("").includes(q));
          if (!cat) return print(`No category matching "${esc(q)}".`, "t-err");
          print(`<span class="t-accent">${esc(cat.category)}</span>`);
          print(cat.items.map((s) => `  • ${esc(s.name)}`).join("\n"));
          state.category = cat.category; renderSkillTabs(); renderSkillChips();
        },
      },
      education: {
        desc: "degree and studies",
        run: () => {
          const e = R.education;
          print(`<span class="t-accent">${esc(e.degree)}</span>`);
          print(`${esc(e.school)} · ${esc(e.period)}`);
          print(`<span class="t-muted">modules: ${e.modules.map((m) => esc(m.name)).join(", ")}</span>`);
        },
      },
      languages: {
        desc: "spoken languages",
        run: () => R.languages.forEach((l) => print(`  ${esc(l.name.padEnd(11))}${l.native ? '<span class="t-accent">native</span>' : `<span class="t-accent">${esc(l.levels[0])}</span>`}`)),
      },
      contact: {
        desc: "how to reach me",
        run: () => {
          print(`  email     <a class="t-link" href="mailto:${esc(R.email)}">${esc(R.email)}</a>`);
          print(`  linkedin  <a class="t-link" href="${esc(R.linkedin)}" target="_blank" rel="noopener">linkedin.com/in/josé-pedro-azevedo</a>`);
          print(`  location  ${esc(R.location)}`);
        },
      },
      cv: {
        desc: "download the PDF resume",
        run: () => { print(`Downloading <span class="t-accent">${esc(R.cvFile.split("/").pop())}</span>…`); $("#cv-download").click(); },
      },
      goto: {
        desc: `scroll to a section (${SECTIONS.join(", ")})`,
        run: (args) => {
          const s = SECTIONS.find((x) => x.startsWith((args[0] || "").toLowerCase()));
          if (!args[0] || !s) return print(`usage: goto &lt;${SECTIONS.join("|")}&gt;`, "t-warn");
          print(`→ ${s}`, "t-muted"); go(s);
        },
      },
      theme: {
        desc: "switch theme (light | dark)",
        run: (args) => {
          const t = (args[0] || "").toLowerCase();
          if (t !== "light" && t !== "dark") return print("usage: theme &lt;light|dark&gt;", "t-warn");
          setTheme(t); print(`Theme set to ${t}.`, "t-muted");
        },
      },
      scan: {
        desc: "run a security assessment on this candidate",
        run: async () => {
          input.disabled = true;
          const steps = [
            ["Enumerating experience…", `${R.experience.length} roles, ${years}+ years`],
            ["Checking framework alignment…", "NIST ✓  ISO 27001 ✓  DORA ✓"],
            ["Reviewing architecture controls…", "SIEM ✓  Cloud ✓  DevSecOps ✓"],
            ["Assessing stakeholder management…", "business ↔ technical translation: strong"],
            ["Testing communication channels…", "EN C1 · ES B1 · PT native"],
          ];
          for (const [a, b] of steps) {
            print(`<span class="t-muted">[*]</span> ${a}`);
            await new Promise((r) => setTimeout(r, reduceMotion ? 0 : 420));
            print(`    <span class="t-accent">${esc(b)}</span>`);
          }
          print(`\n<span class="t-accent">Scan complete: 0 critical findings.</span> Recommendation: ${link("contact", "schedule an interview")}.`);
          input.disabled = false; input.focus();
        },
      },
      ls: {
        desc: "list sections",
        hidden: true,
        run: () => print(SECTIONS.map((s) => link(`goto ${s}`, `${s}/`)).join("  ")),
      },
      sudo: {
        desc: "",
        hidden: true,
        run: (args) => {
          if (args.join(" ").toLowerCase().includes("hire")) {
            print(`[sudo] access granted. Great choice.`, "t-accent");
            print(`Opening contact details…`, "t-muted");
            setTimeout(() => go("contact"), 600);
          } else {
            print(`${esc(R.shortName)} is not in the sudoers file. This incident will be reported… to the GRC team.`, "t-warn");
          }
        },
      },
      clear: { desc: "clear the screen", run: () => { out.innerHTML = ""; } },
    };
    const aliases = { exp: "experience", edu: "education", lang: "languages", about: "whoami", resume: "cv", hire: "contact", "?": "help" };

    const runLine = (line) => {
      const raw = line.trim();
      print(`<span class="prompt">jose@resume:~$</span>${esc(raw)}`, "cmd");
      if (!raw) return;
      history.push(raw); hIdx = history.length;
      const [name, ...args] = raw.split(/\s+/);
      const key = aliases[name.toLowerCase()] || name.toLowerCase();
      const cmd = commands[key];
      if (cmd) cmd.run(args);
      else print(`command not found: ${esc(name)}. Type ${link("help")} for options.`, "t-err");
    };

    $("#terminal-form").addEventListener("submit", (e) => { e.preventDefault(); const v = input.value; input.value = ""; runLine(v); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && history.length) { e.preventDefault(); hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx]; }
      else if (e.key === "ArrowDown") { e.preventDefault(); hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; }
      else if (e.key === "Tab") {
        const v = input.value.toLowerCase();
        if (!v || v.includes(" ")) return;
        const match = Object.keys(commands).filter((c) => !commands[c].hidden && c.startsWith(v));
        if (match.length) { e.preventDefault(); if (match.length === 1) input.value = match[0] + " "; else print(match.join("  "), "t-muted"); }
      } else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.innerHTML = ""; }
    });
    body.addEventListener("click", (e) => {
      const l = e.target.closest(".t-link[data-cmd]");
      if (l) { runLine(l.dataset.cmd); return; }
      if (!window.getSelection().toString() && !e.target.closest("a")) input.focus({ preventScroll: true });
    });

    $("#terminal-hints").innerHTML = ["help", "whoami", "experience", "skills", "scan", "contact"]
      .map((c) => `<button type="button" class="hint" data-cmd="${c}">${c}</button>`).join("");
    $("#terminal-hints").addEventListener("click", (e) => {
      const h = e.target.closest(".hint");
      if (h) { runLine(h.dataset.cmd); input.focus({ preventScroll: true }); }
    });

    print(`<span class="t-accent">resume-os v${new Date().getFullYear()}.1</span> <span class="t-muted">· secure session established</span>`);
    print(`Welcome! This is an interactive version of my CV.`);
    print(`Type ${link("help")} or tap a command below to start.\n`);
  })();
})();
