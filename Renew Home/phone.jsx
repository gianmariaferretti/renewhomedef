/* ============================================================
   RENEW HOME — interactive phone prototype
   8-screen clickable flow inside an iOS-style frame.
   Presentation layout is driven by #phone-root[data-phone-layout]
   (set by the Tweaks panel): "showcase" | "single" | "trio".
   ============================================================ */
const { useState, useEffect, useRef } = React;

const RHP_CSS = `
.rhp-stage{display:flex;justify-content:center;align-items:flex-start;gap:48px;flex-wrap:wrap}
.rhp-stage.showcase{align-items:center;gap:56px}
.rhp-cap{max-width:360px;flex:0 1 360px}
.rhp-cap .rhp-step{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-deep);font-weight:700;margin-bottom:14px}
.rhp-cap h3{font-size:30px;line-height:1.1;letter-spacing:-.025em;margin:0 0 12px;font-weight:800}
.rhp-cap p{font-size:16.5px;line-height:1.55;color:var(--ink-2);margin:0 0 22px}
.rhp-cap .rhp-dots{display:flex;gap:7px;flex-wrap:wrap}
.rhp-cap .rhp-dots i{width:9px;height:9px;border-radius:50%;background:var(--line-2);cursor:pointer;transition:background .2s,transform .2s}
.rhp-cap .rhp-dots i.on{background:var(--accent);transform:scale(1.25)}
.rhp-cap .rhp-nav{display:flex;gap:10px;margin-top:22px}

/* device */
.rhp-phone{position:relative;width:300px;height:620px;border-radius:46px;background:#0b0f12;
  padding:11px;box-shadow:0 2px 4px rgba(16,32,24,.2),0 30px 70px -24px rgba(16,32,24,.5),inset 0 0 0 2px #23292e;flex:0 0 auto}
.rhp-phone .rhp-notch{position:absolute;top:11px;left:50%;transform:translateX(-50%);width:120px;height:26px;background:#0b0f12;border-radius:0 0 16px 16px;z-index:30}
.rhp-screen{position:relative;width:100%;height:100%;border-radius:36px;overflow:hidden;background:#fff;display:flex;flex-direction:column}
.rhp-status{position:absolute;top:0;left:0;right:0;height:38px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;font-size:12.5px;font-weight:700;z-index:20;color:var(--ink)}
.rhp-screen.dark .rhp-status{color:#fff}
.rhp-status .rhp-stat-r{display:flex;gap:5px;align-items:center;font-size:11px}
.rhp-body{flex:1;overflow:hidden;display:flex;flex-direction:column;padding:46px 18px 0}
.rhp-scroll{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;margin:0 -18px;padding:0 18px}
.rhp-scroll::-webkit-scrollbar{width:0}

/* shared bits */
.rhp-screen.dark{background:radial-gradient(130% 90% at 15% 5%,#1f7a4d,#0d3d28 55%,#082019)}
.rhp-h1{font-size:27px;font-weight:800;letter-spacing:-.02em;line-height:1.08;margin:0}
.rhp-screen.dark .rhp-h1{color:#fff}
.rhp-lead{font-size:13.5px;line-height:1.5;color:var(--ink-2);margin:8px 0 0}
.rhp-screen.dark .rhp-lead{color:rgba(255,255,255,.82)}
.rhp-chip{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700}
.rhp-pillbtn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:50px;border-radius:15px;border:0;font-size:15px;font-weight:700;cursor:pointer;transition:transform .14s,filter .14s}
.rhp-pillbtn:active{transform:scale(.98)}
.rhp-pillbtn.green{background:var(--accent);color:var(--accent-ink)}
.rhp-pillbtn.green:hover{filter:brightness(1.04)}
.rhp-pillbtn.ghost{background:rgba(255,255,255,.12);color:#fff}
.rhp-pillbtn.soft{background:var(--green-soft);color:var(--green-ink)}
.rhp-pillbtn.line{background:#fff;border:1.5px solid var(--line-2);color:var(--ink)}
.rhp-foot{padding:12px 18px calc(12px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:9px}
.rhp-svg{width:18px;height:18px}

/* tab bar */
.rhp-tabs{display:flex;justify-content:space-around;align-items:center;height:62px;border-top:1px solid var(--line);background:#fff;padding-bottom:4px}
.rhp-tab{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:0;cursor:pointer;color:#9aa6a0;font-size:10px;font-weight:600;flex:1;padding:6px 0}
.rhp-tab svg{width:21px;height:21px}
.rhp-tab.on{color:var(--accent-deep)}

/* cards */
.rhp-card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:14px}
.rhp-list-item{display:flex;align-items:center;gap:12px;border:1.5px solid var(--line);border-radius:16px;padding:13px 14px;cursor:pointer;transition:border-color .15s,background .15s;background:#fff}
.rhp-list-item .ico{width:38px;height:38px;border-radius:11px;background:var(--green-tint);display:grid;place-items:center;font-size:18px;flex-shrink:0}
.rhp-list-item .nm{font-size:14px;font-weight:700;letter-spacing:-.01em}
.rhp-list-item .sb{font-size:11.5px;color:var(--muted);margin-top:1px}
.rhp-list-item .rt{margin-left:auto}
.rhp-radio{width:22px;height:22px;border-radius:50%;border:2px solid var(--line-2)}
.rhp-list-item.sel{border-color:var(--accent);background:var(--green-tint)}
.rhp-list-item.sel .rt{width:22px;height:22px;border-radius:50%;background:var(--accent);display:grid;place-items:center;color:#fff;border:0}
.rhp-seg{display:flex;gap:7px}
.rhp-segbtn{flex:1;border:1.5px solid var(--line);border-radius:13px;background:#fff;padding:10px 6px;cursor:pointer;text-align:center}
.rhp-segbtn .t{font-size:12px;font-weight:700;display:block;letter-spacing:-.01em}
.rhp-segbtn .s{font-size:9.5px;color:var(--muted);display:block;margin-top:2px}
.rhp-segbtn.on{border-color:var(--accent);background:var(--green-tint)}
.rhp-info{background:var(--paper-2);border-radius:13px;padding:12px;font-size:11.5px;line-height:1.5;color:var(--ink-2)}
.rhp-info b{display:block;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:5px}

/* range */
.rhp-range{-webkit-appearance:none;appearance:none;width:100%;height:7px;border-radius:999px;outline:none;cursor:pointer;
  background:linear-gradient(90deg,#76d59c,var(--accent) var(--p,55%),var(--paper-3) var(--p,55%))}
.rhp-range::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:#fff;border:1px solid var(--line-2);box-shadow:0 2px 6px rgba(0,0,0,.22)}

/* dashboard */
.rhp-greet{display:flex;align-items:center;justify-content:space-between}
.rhp-ava{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#bfeccf,#1d9e75);color:#063a22;display:grid;place-items:center;font-size:12px;font-weight:800}
.rhp-saved{border-radius:18px;padding:16px;color:#fff;background:linear-gradient(150deg,#1f8a5b,#0d3d28)}
.rhp-saved .lab{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.72)}
.rhp-saved .amt{font-size:34px;font-weight:800;letter-spacing:-.03em;margin:4px 0 2px}
.rhp-saved .sub{font-size:11.5px;color:rgba(255,255,255,.78)}
.rhp-alert{display:flex;align-items:center;gap:11px;border-radius:15px;padding:13px;background:linear-gradient(120deg,#f7b13b,#f59e0b);color:#3a2400;cursor:pointer}
.rhp-alert .ai{width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,.35);display:grid;place-items:center;font-size:15px}
.rhp-alert .at{font-size:12.5px;font-weight:800;line-height:1.15}
.rhp-alert .as{font-size:10.5px;opacity:.85;margin-top:1px}
.rhp-alert .ar{margin-left:auto;font-size:18px;font-weight:700}
.rhp-tiles{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.rhp-tile{border:1px solid var(--line);border-radius:14px;padding:12px}
.rhp-tile .tl{font-size:9.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
.rhp-tile .tv{font-size:19px;font-weight:800;letter-spacing:-.02em;margin-top:3px}
.rhp-bars{display:flex;align-items:flex-end;gap:6px;height:74px;margin-top:10px}
.rhp-bars i{flex:1;background:linear-gradient(180deg,#43c97f,#1d9e75);border-radius:5px 5px 0 0;min-height:10px}

/* shift / ring */
.rhp-ring{position:relative;width:160px;height:160px;margin:6px auto 0;border-radius:50%;
  background:conic-gradient(var(--accent) calc(var(--pct,72)*1%),rgba(255,255,255,.14) 0)}
.rhp-ring::after{content:"";position:absolute;inset:13px;border-radius:50%;background:#0d3d28}
.rhp-ring .rc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;z-index:2}
.rhp-ring .rc b{font-size:30px;font-weight:800;letter-spacing:-.02em}
.rhp-ring .rc span{font-size:11px;color:rgba(255,255,255,.7);margin-top:2px}
.rhp-darkcard{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:15px;padding:13px;color:#fff}
.rhp-darkcard .dl{font-size:9.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.rhp-darkcard .dv{font-size:17px;font-weight:800;margin-top:3px;display:flex;align-items:center;justify-content:space-between}

/* rewards */
.rhp-earned{border-radius:18px;padding:16px;text-align:center;background:linear-gradient(150deg,#f7b13b,#f59e0b);color:#3a2400}
.rhp-earned .lab{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:.8}
.rhp-earned .amt{font-size:36px;font-weight:800;letter-spacing:-.03em;margin:3px 0}
.rhp-earned .sub{font-size:11.5px;font-weight:600;opacity:.85}
.rhp-redeem{display:flex;align-items:center;gap:12px;border:1px solid var(--line);border-radius:15px;padding:12px 13px;cursor:pointer;background:#fff}
.rhp-redeem .ico{width:36px;height:36px;border-radius:11px;background:var(--green-tint);display:grid;place-items:center;font-size:17px}
.rhp-redeem .nm{font-size:13.5px;font-weight:700}
.rhp-redeem .sb{font-size:11px;color:var(--muted)}
.rhp-redeem .pr{margin-left:auto;font-size:13.5px;font-weight:800}

/* impact */
.rhp-nbr{border-radius:16px;padding:14px;color:#fff;background:linear-gradient(150deg,#1f8a5b,#0d3d28)}
.rhp-nbr .nl{font-size:9.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:rgba(255,255,255,.7)}
.rhp-nbr .nv{font-size:16px;font-weight:800;margin:4px 0 4px;line-height:1.2}
.rhp-nbr .ns{font-size:11px;color:rgba(255,255,255,.78)}
.rhp-lead-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--line);font-size:12.5px}
.rhp-lead-row .rk{width:18px;font-weight:800;color:var(--muted)}
.rhp-lead-row .nm{font-weight:700}
.rhp-lead-row.me{background:var(--green-tint);margin:0 -8px;padding:9px 8px;border-radius:11px;border-bottom:0}
.rhp-lead-row .kv{margin-left:auto;font-weight:700}

/* share */
.rhp-sharecard{border-radius:18px;padding:18px;text-align:center;color:#fff;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14)}
.rhp-sharecard .amt{font-size:42px;font-weight:800;letter-spacing:-.03em;margin:4px 0 2px}
.rhp-sharecard .q{font-size:12px;line-height:1.5;color:rgba(255,255,255,.82);margin-top:10px;font-style:italic}
.rhp-back{position:absolute;top:42px;left:14px;z-index:20;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;border:0;cursor:pointer;display:grid;place-items:center;font-size:15px}
.rhp-mini-restart{background:none;border:0;color:rgba(255,255,255,.6);font-size:11.5px;cursor:pointer;text-decoration:underline;margin-top:4px}

/* trio side phones */
.rhp-side{transform:scale(.82);opacity:.55;filter:saturate(.9);transition:opacity .3s}
.rhp-stage.trio .rhp-side{pointer-events:none}
@media (max-width:920px){ .rhp-stage.trio .rhp-side{display:none} .rhp-stage{gap:32px} .rhp-cap{flex-basis:100%;max-width:520px;text-align:center} .rhp-cap .rhp-dots{justify-content:center} .rhp-cap .rhp-nav{justify-content:center} }
`;

const ORDER = ['welcome', 'connect', 'comfort', 'dashboard', 'shift', 'rewards', 'impact', 'share'];
const CAPTIONS = {
  welcome:  ['01 · Welcome',     'Turn your home into savings.', "Join the largest residential virtual power plant in the US — free, automatic, and always in your control."],
  connect:  ['02 · Connect',     'Works with what you own.',     'Link the smart device you already have. No new hardware, no installer, nothing to buy.'],
  comfort:  ['03 · Set comfort', 'You set the limits.',          "Choose how far we can flex and what matters most. We never push past the line you draw."],
  dashboard:['04 · Home',        'Savings, at a glance.',        "See what you've saved this summer, when the next Energy Shift is, and how your week is trending."],
  shift:    ['05 · Energy Shift','It just handles itself.',      "During a peak we pre-cool, then ease off. Comfort holds — and you can opt out in one tap, anytime."],
  rewards:  ['06 · Rewards',     'Real money back.',             'Redeem points as an instant bill credit, gift cards, or trees planted. Tangible, not vague.'],
  impact:   ['07 · Impact',      'Better, together.',            'Your shifts add up with the whole neighborhood — cleaner energy and a steadier grid for everyone.'],
  share:    ['08 · Share',       'Worth telling your street.',   'Share the summer and refer a neighbor — you both get $25 when they join.'],
};

/* ---------- shared phone chrome ---------- */
function Status({ dark }) {
  return (
    <div className="rhp-status">
      <span>9:41</span>
      <span className="rhp-stat-r">{dark ? '📶 🔋' : '📶 🔋'}</span>
    </div>
  );
}
function Tabs({ active, go }) {
  const items = [
    ['dashboard', 'Home', 'M3 11l9-8 9 8M5 10v10h14V10'],
    ['shift', 'Events', 'M13 2 4 14h7l-1 8 9-12h-7z'],
    ['rewards', 'Rewards', 'M12 2l2.6 6.3L21 9l-5 4.3L17.5 21 12 17.3 6.5 21 8 13.3 3 9l6.4-.7z'],
    ['impact', 'Impact', 'M4 19V5M4 19h16M8 16l3-4 3 3 4-6'],
  ];
  return (
    <div className="rhp-tabs">
      {items.map(([id, label, d]) => (
        <button key={id} className={'rhp-tab' + (active === id ? ' on' : '')} onClick={() => go(id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
          {label}
        </button>
      ))}
    </div>
  );
}

/* ---------- screens ---------- */
function ScreenWelcome({ go }) {
  return (
    <div className="rhp-screen dark">
      <Status dark />
      <div className="rhp-body" style={{ justifyContent: 'flex-end', paddingBottom: 0 }}>
        <div style={{ flex: 1 }} />
        <span className="rhp-chip" style={{ background: 'rgba(255,255,255,.14)', color: '#fff', alignSelf: 'flex-start' }}>⚡ Largest residential VPP in the US</span>
        <h1 className="rhp-h1" style={{ fontSize: 30, marginTop: 16 }}>Turn your home<br />into savings.</h1>
        <p className="rhp-lead" style={{ marginBottom: 22 }}>Earn rewards for letting Renew Home gently shift your energy when the grid needs it most — you stay in control, always.</p>
      </div>
      <div className="rhp-foot">
        <button className="rhp-pillbtn green" onClick={() => go('connect')}>Get started →</button>
        <button className="rhp-pillbtn ghost" onClick={() => go('dashboard')}>I already have an account</button>
      </div>
    </div>
  );
}

function ScreenConnect({ go }) {
  const [sel, setSel] = useState('nest');
  const rows = [
    ['nest', '🌡️', 'Nest Thermostat', 'Living room · detected'],
    ['water', '💧', 'Smart Water Heater', 'Add later'],
    ['battery', '🔋', 'Home Battery / EV', 'Add later'],
  ];
  return (
    <div className="rhp-screen">
      <Status />
      <div className="rhp-body">
        <h1 className="rhp-h1">Connect a device</h1>
        <p className="rhp-lead">Renew Home works with the smart devices you already own. Connect one to begin.</p>
        <div className="rhp-scroll" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map(([id, ico, nm, sb]) => (
            <div key={id} className={'rhp-list-item' + (sel === id ? ' sel' : '')} onClick={() => setSel(id)}>
              <span className="ico">{ico}</span>
              <div><div className="nm">{nm}</div><div className="sb">{sb}</div></div>
              <span className="rt">{sel === id
                ? <svg className="rhp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6.5" /></svg>
                : <span className="rhp-radio" />}</span>
            </div>
          ))}
          <div className="rhp-info" style={{ display: 'flex', gap: 9 }}>
            <span>🔒</span><span>We never control your home without your limits. You can pause or opt out of any event, anytime.</span>
          </div>
        </div>
      </div>
      <div className="rhp-foot"><button className="rhp-pillbtn green" onClick={() => go('comfort')}>Continue →</button></div>
    </div>
  );
}

function ScreenComfort({ go }) {
  const [temp, setTemp] = useState(76);
  const [pref, setPref] = useState('save');
  const pct = ((temp - 68) / (80 - 68)) * 100;
  return (
    <div className="rhp-screen">
      <Status />
      <div className="rhp-body">
        <h1 className="rhp-h1">Set your comfort</h1>
        <p className="rhp-lead">During an Energy Shift we'll never push past your limits. You're in charge.</p>
        <div className="rhp-scroll" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="rhp-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              <span>Max temp on a hot day</span><span style={{ color: 'var(--ink)', fontSize: 14 }}>{temp}°F</span>
            </div>
            <input className="rhp-range" type="range" min="68" max="80" value={temp} style={{ ['--p']: pct + '%', marginTop: 12 }} onChange={(e) => setTemp(+e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--muted)', marginTop: 7 }}><span>68° cooler</span><span>80° warmer</span></div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>What matters most to you?</div>
            <div className="rhp-seg">
              {[['save', '💰 Save the\u00a0most', 'Max rewards'], ['balanced', '⚖️ Balanced', 'Comfort + savings'], ['comfort', '🛋️ Comfort\u00a0first', 'Subtle shifts']].map(([id, t, s]) => (
                <button key={id} className={'rhp-segbtn' + (pref === id ? ' on' : '')} onClick={() => setPref(id)}><span className="t">{t}</span><span className="s">{s}</span></button>
              ))}
            </div>
          </div>
          <div className="rhp-info"><b>How Energy Shifts work</b>When the grid is strained, we pre-cool your home, then ease off during peak hours. You barely notice — and you earn rewards for the energy you shift.</div>
        </div>
      </div>
      <div className="rhp-foot"><button className="rhp-pillbtn green" onClick={() => go('dashboard')}>Start saving →</button></div>
    </div>
  );
}

function ScreenDashboard({ go }) {
  return (
    <div className="rhp-screen">
      <Status />
      <div className="rhp-body" style={{ paddingBottom: 0 }}>
        <div className="rhp-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div className="rhp-greet">
            <div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Good afternoon,</div><div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>Maya 👋</div></div>
            <span className="rhp-ava">MR</span>
          </div>
          <div className="rhp-saved">
            <div className="lab">Saved this summer</div>
            <div className="amt">$142.60</div>
            <div className="sub">+1,240 reward points · 38 Energy Shifts</div>
          </div>
          <div className="rhp-alert" onClick={() => go('shift')}>
            <span className="ai">⚡</span>
            <div><div className="at">Energy Shift today · 4–8 PM</div><div className="as">Grid demand is high. Tap to see your plan.</div></div>
            <span className="ar">›</span>
          </div>
          <div className="rhp-tiles">
            <div className="rhp-tile"><div className="tl">Home status</div><div className="tv" style={{ color: 'var(--accent-deep)' }}>Optimized</div></div>
            <div className="rhp-tile"><div className="tl">Now</div><div className="tv">72°F</div></div>
          </div>
          <div className="rhp-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--muted)' }}>This week's impact</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-deep)' }}>▲ 12%</span>
            </div>
            <div className="rhp-bars">{[42, 55, 48, 67, 60, 82, 70].map((h, i) => <i key={i} style={{ height: h + '%' }} />)}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', marginTop: 6 }}>kWh shifted · Mon–Sun</div>
          </div>
          <div style={{ height: 6 }} />
        </div>
      </div>
      <Tabs active="dashboard" go={go} />
    </div>
  );
}

function ScreenShift({ go }) {
  const [comfy, setComfy] = useState(null);
  return (
    <div className="rhp-screen dark">
      <Status dark />
      <button className="rhp-back" onClick={() => go('dashboard')}>‹</button>
      <div className="rhp-body" style={{ paddingTop: 52 }}>
        <div className="rhp-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 13, textAlign: 'center' }}>
          <span className="rhp-chip" style={{ background: 'rgba(247,177,59,.22)', color: '#ffd089', alignSelf: 'center' }}>⚡ Energy Shift in progress</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>Peak hours · 4–8 PM</div>
            <div className="rhp-lead" style={{ marginTop: 4 }}>We pre-cooled your home to 70°. Now easing off to support the grid.</div>
          </div>
          <div className="rhp-ring" style={{ ['--pct']: 72 }}><div className="rc"><b>2h 14m</b><span>remaining</span></div></div>
          <div className="rhp-darkcard"><div className="dl">Comfort</div><div className="dv"><span>Holding at 74°F</span><span>😌</span></div></div>
          <div className="rhp-darkcard" style={{ background: 'rgba(29,158,117,.16)', borderColor: 'rgba(29,158,117,.4)' }}>
            <div className="dl" style={{ color: '#7ef0ab' }}>Earning right now</div>
            <div className="dv"><span>+$6.40 · 90 pts</span><span>💰</span></div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', textAlign: 'left' }}>Too warm? You're in control.</div>
          <div style={{ display: 'flex', gap: 9 }}>
            <button className={'rhp-pillbtn ' + (comfy === 'stay' ? 'green' : 'ghost')} onClick={() => setComfy('stay')}>Stay in — I'm comfy</button>
            <button className={'rhp-pillbtn ' + (comfy === 'opt' ? 'soft' : 'ghost')} onClick={() => setComfy('opt')}>Opt out</button>
          </div>
          <div style={{ height: 4 }} />
        </div>
      </div>
      <div className="rhp-foot"><button className="rhp-pillbtn green" onClick={() => go('rewards')}>See my reward →</button></div>
    </div>
  );
}

function ScreenRewards({ go }) {
  const rows = [['💵', 'Bill credit', 'Instant', '$14.80'], ['🎁', 'Gift cards', 'Amazon, Target…', '1,000 pt'], ['🌳', 'Plant trees', 'One Tree Planted', '500 pt']];
  return (
    <div className="rhp-screen">
      <Status />
      <div className="rhp-body" style={{ paddingBottom: 0 }}>
        <div className="rhp-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <h1 className="rhp-h1">Rewards</h1>
          <div className="rhp-earned">
            <div className="lab">Earned today</div>
            <div className="amt">$18.00</div>
            <div className="sub">+240 points · 3.1 kWh shifted</div>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--muted)' }}>Redeem your 1,480 points</div>
          {rows.map(([ico, nm, sb, pr]) => (
            <div key={nm} className="rhp-redeem"><span className="ico">{ico}</span><div><div className="nm">{nm}</div><div className="sb">{sb}</div></div><span className="pr">{pr}</span></div>
          ))}
          <div style={{ height: 6 }} />
        </div>
      </div>
      <Tabs active="rewards" go={go} />
    </div>
  );
}

function ScreenImpact({ go }) {
  const board = [['1', '🏆', 'The Garcias', '214 kWh', false], ['2', '🏠', 'Patel family', '198 kWh', false], ['3', 'MR', 'You (Maya)', '186 kWh', true], ['4', '🏠', 'Chen household', '155 kWh', false]];
  return (
    <div className="rhp-screen">
      <Status />
      <div className="rhp-body" style={{ paddingBottom: 0 }}>
        <div className="rhp-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <h1 className="rhp-h1">Your impact</h1>
          <div className="rhp-tiles">
            <div className="rhp-tile"><div className="tl">CO₂ avoided</div><div className="tv">312 lbs</div></div>
            <div className="rhp-tile"><div className="tl">= Trees</div><div className="tv">🌳 6</div></div>
          </div>
          <div className="rhp-nbr">
            <div className="nl">Maple Street neighborhood</div>
            <div className="nv">Together you shifted 1.2 MWh this month ⚡</div>
            <div className="ns">That's enough to power 40 homes for a day.</div>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--muted)' }}>Neighborhood leaderboard</div>
          <div>
            {board.map(([rk, ic, nm, kv, me]) => (
              <div key={nm} className={'rhp-lead-row' + (me ? ' me' : '')}>
                <span className="rk">{rk}</span>
                <span className="rhp-ava" style={{ width: 24, height: 24, fontSize: 10, background: me ? 'linear-gradient(135deg,#bfeccf,#1d9e75)' : 'var(--paper-3)' }}>{ic}</span>
                <span className="nm">{nm}</span><span className="kv">{kv}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 4 }} />
        </div>
        <div style={{ padding: '10px 0' }}><button className="rhp-pillbtn green" onClick={() => go('share')}>📣 Share my impact</button></div>
      </div>
      <Tabs active="impact" go={go} />
    </div>
  );
}

function ScreenShare({ go }) {
  return (
    <div className="rhp-screen dark">
      <Status dark />
      <button className="rhp-back" onClick={() => go('impact')}>‹</button>
      <div className="rhp-body" style={{ paddingTop: 52 }}>
        <div className="rhp-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="rhp-sharecard">
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.78)' }}>Maya's summer with Renew Home</div>
            <div className="amt">$142</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#7ef0ab' }}>saved · 312 lbs CO₂ avoided</div>
            <div className="q">"I lowered my bill without lifting a finger — and helped keep the lights on for Texas." 💚</div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.82)', textAlign: 'center', lineHeight: 1.5 }}>Refer a neighbor — you both get <b style={{ color: '#7ef0ab' }}>$25</b> when they enroll.</div>
        </div>
      </div>
      <div className="rhp-foot">
        <button className="rhp-pillbtn green" onClick={() => go('share')}>Invite neighbors</button>
        <button className="rhp-pillbtn ghost" onClick={() => go('share')}>Share my impact card</button>
        <button className="rhp-mini-restart" onClick={() => go('welcome')}>↺ Restart prototype</button>
      </div>
    </div>
  );
}

const SCREENS = { welcome: ScreenWelcome, connect: ScreenConnect, comfort: ScreenComfort, dashboard: ScreenDashboard, shift: ScreenShift, rewards: ScreenRewards, impact: ScreenImpact, share: ScreenShare };

function Phone({ screen, go }) {
  const S = SCREENS[screen] || ScreenWelcome;
  return (
    <div className="rhp-phone">
      <div className="rhp-notch" />
      <S go={go} />
    </div>
  );
}

/* static, non-interactive mini phone for the trio layout */
function SidePhone({ screen }) {
  const S = SCREENS[screen] || ScreenWelcome;
  return (
    <div className="rhp-phone rhp-side" aria-hidden="true">
      <div className="rhp-notch" />
      <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}><S go={() => {}} /></div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('welcome');
  const [layout, setLayout] = useState(document.getElementById('phone-root')?.dataset.phoneLayout || 'showcase');
  const scrollKeyRef = useRef(0);

  // react to Tweaks changing data-phone-layout
  useEffect(() => {
    const root = document.getElementById('phone-root');
    if (!root) return;
    const mo = new MutationObserver(() => setLayout(root.dataset.phoneLayout || 'showcase'));
    mo.observe(root, { attributes: true, attributeFilter: ['data-phone-layout'] });
    return () => mo.disconnect();
  }, []);

  const go = (s) => { scrollKeyRef.current++; setScreen(s); };
  const idx = ORDER.indexOf(screen);
  const cap = CAPTIONS[screen];
  const prev = () => go(ORDER[(idx - 1 + ORDER.length) % ORDER.length]);
  const next = () => go(ORDER[(idx + 1) % ORDER.length]);

  const phone = <Phone key={scrollKeyRef.current} screen={screen} go={go} />;

  if (layout === 'single') {
    return (
      <div className="rhp-stage single">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {phone}
          <div className="rhp-dots" style={{ display: 'flex', gap: 7 }}>
            {ORDER.map((s, i) => <i key={s} className={i === idx ? 'on' : ''} style={{ width: 9, height: 9, borderRadius: '50%', background: i === idx ? 'var(--accent)' : 'var(--line-2)', cursor: 'pointer' }} onClick={() => go(s)} />)}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={prev}>‹ Back</button>
            <button className="btn btn-primary btn-sm" onClick={next}>Next ›</button>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'trio') {
    return (
      <div className="rhp-stage trio">
        <SidePhone screen="welcome" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          {phone}
          <div className="rhp-dots" style={{ display: 'flex', gap: 7 }}>
            {ORDER.map((s, i) => <i key={s} className={i === idx ? 'on' : ''} style={{ width: 9, height: 9, borderRadius: '50%', background: i === idx ? 'var(--accent)' : 'var(--line-2)', cursor: 'pointer' }} onClick={() => go(s)} />)}
          </div>
        </div>
        <SidePhone screen="impact" />
      </div>
    );
  }

  // showcase (default): phone + live caption panel
  return (
    <div className="rhp-stage showcase">
      {phone}
      <div className="rhp-cap">
        <div className="rhp-step">{cap[0]}</div>
        <h3>{cap[1]}</h3>
        <p>{cap[2]}</p>
        <div className="rhp-dots">
          {ORDER.map((s, i) => <i key={s} className={i === idx ? 'on' : ''} onClick={() => go(s)} />)}
        </div>
        <div className="rhp-nav">
          <button className="btn btn-ghost btn-sm" onClick={prev}>‹ Back</button>
          <button className="btn btn-primary btn-sm" onClick={next}>Next ›</button>
        </div>
      </div>
    </div>
  );
}

(function mountPhone() {
  const style = document.createElement('style');
  style.textContent = RHP_CSS;
  document.head.appendChild(style);
  const root = document.getElementById('phone-root');
  if (root) ReactDOM.createRoot(root).render(<App />);
})();
