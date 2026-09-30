/* Visual-only KBstar waiting card. Read existing progress; never own PIN, time or navigation. */
(() => {
  'use strict';
  const frame = document.getElementById('app');
  if (!frame) return;
  const VERSION = 'cinematic-v3';

  function install() {
    let d;
    try { d = frame.contentDocument; } catch { return; }
    if (!d?.head || !d.body || !d.defaultView) return;
    const w = d.defaultView;

    function apply() {
      const card = d.getElementById('ks-approval-countdown');
      if (!card) return false;
      const head = card.querySelector('.ksa-wait-head');
      const timer = d.getElementById('ks-approval-countdown-time');
      const progress = d.getElementById('ks-approval-countdown-progress');
      if (!head?.firstElementChild || !timer || !progress || !card.contains(timer) || !card.contains(progress)) return false;
      if (card.dataset.waitingPremium === VERSION) return true;
      if (typeof card.kswmCleanup === 'function') card.kswmCleanup();

      let style = d.getElementById('kswm-style');
      if (!style) { style = d.createElement('style'); style.id = 'kswm-style'; d.head.appendChild(style); }
      style.textContent = `
#ks-approval-countdown.kswm,#ks-approval-countdown.kswm *{box-sizing:border-box}
#ks-approval-countdown.kswm{--mx:0px;--my:0px;position:relative;isolation:isolate;overflow:hidden;margin:22px 0 0;padding:28px 30px 0;border:1px solid rgba(231,208,250,.55);border-radius:30px;color:#fff;background:linear-gradient(118deg,#4f157d 0%,#7022ab 46%,#8f37c7 100%);box-shadow:0 28px 70px rgba(77,23,119,.28),inset 0 1px 0 rgba(255,255,255,.18),inset 0 -36px 80px rgba(55,9,89,.18);transform:translateZ(0)}
#ks-approval-countdown.kswm[hidden]{display:none!important}
#ks-approval-countdown .kswm-atmosphere{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
#ks-approval-countdown .kswm-depth{position:absolute;inset:-12%;transform:translate3d(var(--mx),var(--my),0);transition:transform .18s ease-out}
#ks-approval-countdown .kswm-depth::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 82% 28%,rgba(255,234,157,.13),transparent 28%),radial-gradient(circle at 15% 82%,rgba(212,170,255,.16),transparent 34%),linear-gradient(120deg,transparent 0 28%,rgba(255,255,255,.025) 45%,transparent 62%);animation:kswmSlowZoom 22s ease-in-out infinite}
#ks-approval-countdown .kswm-depth::after{content:"";position:absolute;inset:8% 3%;border-radius:34px;border:1px solid rgba(255,255,255,.05);box-shadow:0 22px 55px rgba(36,4,60,.14);transform:translate3d(calc(var(--mx) * -.35),calc(var(--my) * -.35),0)}
#ks-approval-countdown .kswm-sweep{position:absolute;inset:-55% -45%;z-index:1;background:linear-gradient(112deg,transparent 43%,rgba(255,255,255,.06) 47%,rgba(255,244,207,.42) 50%,rgba(255,213,73,.22) 52%,transparent 57%);animation:kswmGoldWhiteSweep 10s cubic-bezier(.42,0,.25,1) infinite;pointer-events:none}
#ks-approval-countdown .kswm-reflection{position:absolute;left:7%;right:7%;top:0;height:46%;border-radius:0 0 50% 50%;background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,0));filter:blur(.2px);opacity:.34;transform:translate3d(calc(var(--mx) * .22),calc(var(--my) * .12),0);pointer-events:none}
#ks-approval-countdown .kswm-particles{position:absolute;inset:0;z-index:2;pointer-events:none}
#ks-approval-countdown .kswm-particles i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff0a9;box-shadow:0 0 12px rgba(255,226,105,.75);opacity:.42;animation:kswmFloatParticle 9s ease-in-out infinite}
#ks-approval-countdown .kswm-particles i:nth-child(1){left:10%;top:25%}
#ks-approval-countdown .kswm-particles i:nth-child(2){left:24%;top:76%;width:3px;height:3px;animation-duration:12s;animation-delay:-4s}
#ks-approval-countdown .kswm-particles i:nth-child(3){left:71%;top:18%;width:2px;height:2px;animation-duration:10s;animation-delay:-7s}
#ks-approval-countdown .kswm-particles i:nth-child(4){left:88%;top:62%;animation-duration:14s;animation-delay:-6s}
#ks-approval-countdown .kswm-particles i:nth-child(5){left:58%;top:82%;width:3px;height:3px;animation-duration:11s;animation-delay:-8s}
#ks-approval-countdown .kswm-particles i:nth-child(6){left:42%;top:13%;width:2px;height:2px;animation-duration:15s;animation-delay:-3s}
#ks-approval-countdown .kswm-particles i:nth-child(7){left:93%;top:25%;width:3px;height:3px;animation-duration:13s;animation-delay:-9s}
#ks-approval-countdown .kswm-particles i:nth-child(8){left:6%;top:67%;width:2px;height:2px;animation-duration:16s;animation-delay:-5s}
#ks-approval-countdown .kswm-top{position:relative;z-index:4;display:flex;align-items:center;justify-content:space-between;gap:14px;padding-bottom:21px;border-bottom:1px solid rgba(255,255,255,.17);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}
#ks-approval-countdown .kswm-brand{display:flex;align-items:baseline;gap:10px;white-space:nowrap}
#ks-approval-countdown .kswm-brand strong{font-size:28px;line-height:1;letter-spacing:-1.1px;font-weight:650}
#ks-approval-countdown .kswm-brand b{color:#ffe34f;font-size:21px;font-weight:800}
#ks-approval-countdown .kswm-brand small{color:#f3e4ff;font-size:10px}
#ks-approval-countdown .kswm-pause{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:8px 13px;border:1px solid rgba(255,255,255,.32);border-radius:999px;background:linear-gradient(120deg,rgba(255,255,255,.12),rgba(255,255,255,.06));box-shadow:inset 0 1px 0 rgba(255,255,255,.12);color:#fff;font:600 10px/1.4 'Segoe UI',Arial,sans-serif;cursor:pointer;flex-shrink:0}
#ks-approval-countdown .kswm-pause:hover{background:rgba(255,255,255,.17)}
#ks-approval-countdown .kswm-pause:focus-visible{outline:3px solid #ffe34f;outline-offset:3px}
#ks-approval-countdown .kswm-pause svg{width:12px;height:12px;flex:none}
#ks-approval-countdown.kswm .ksa-wait-head{position:relative;z-index:4;display:grid;grid-template-columns:minmax(0,1fr) 250px;align-items:center;gap:28px;padding:31px 0 27px}
#ks-approval-countdown .kswm-eyebrow{display:inline-flex;align-items:center;gap:9px;margin-bottom:15px;padding:7px 10px;border:1px solid rgba(255,234,155,.24);border-radius:999px;background:rgba(255,255,255,.06);color:#ffefaa;font-size:9px;font-weight:700;letter-spacing:1.2px;line-height:1.5}
#ks-approval-countdown .kswm-eyebrow::before{content:"";width:5px;height:5px;flex:none;border-radius:50%;background:#ffe675;box-shadow:0 0 0 4px rgba(255,227,79,.07);animation:kswmGlowPulse 3.8s ease-in-out infinite}
#ks-approval-countdown.kswm h4{max-width:465px;margin:0 0 13px;font-size:clamp(25px,3.6vw,36px);font-weight:760;line-height:1.15;letter-spacing:-.8px;color:#fff;text-wrap:balance;text-shadow:0 4px 24px rgba(41,8,67,.20)}
#ks-approval-countdown.kswm .ksa-wait-head p{max-width:410px;margin:0;font-size:13px;line-height:1.8;color:#f2e6fc}
#ks-approval-countdown .kswm-timer{position:relative;width:228px;height:228px;display:flex;flex-direction:column;align-items:center;justify-content:center;justify-self:center;border:1px solid rgba(255,255,255,.20);border-radius:50%;background:linear-gradient(145deg,rgba(225,189,255,.11),rgba(255,255,255,.04) 48%,rgba(67,14,104,.28));box-shadow:inset 0 2px 0 rgba(255,255,255,.20),inset 0 -8px 18px rgba(49,6,82,.22),0 18px 34px rgba(41,9,66,.20);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);animation:kswmTimerEntrance .72s cubic-bezier(.2,.8,.2,1) both}
#ks-approval-countdown .kswm-timer::before{content:"";position:absolute;inset:24px;border:1px solid rgba(255,241,187,.20);border-radius:50%;background:radial-gradient(circle at 35% 18%,rgba(219,174,255,.24),transparent 60%),linear-gradient(155deg,#7f34ad,#5e208f);box-shadow:inset 0 2px 4px rgba(255,255,255,.14),inset 0 -4px 14px rgba(44,8,70,.18),0 8px 18px rgba(40,8,64,.19)}
#ks-approval-countdown .kswm-timer::after{content:"";position:absolute;inset:26px;border-radius:50%;background:radial-gradient(circle,rgba(255,232,139,.16),transparent 68%);animation:kswmGlowPulse 4.5s ease-in-out infinite;pointer-events:none}
#ks-approval-countdown .kswm-ring{position:absolute;inset:-10px;border:1px solid transparent;border-top-color:rgba(255,240,185,.62);border-right-color:rgba(255,231,139,.20);border-radius:50%;pointer-events:none;animation:kswmOrbit 26s linear infinite}
#ks-approval-countdown .kswm-ring::before{content:"";position:absolute;top:13%;right:13%;width:5px;height:5px;border-radius:50%;background:#fff0b0;box-shadow:0 0 10px rgba(255,228,133,.55)}
#ks-approval-countdown .kswm-glass{position:absolute;inset:27px;overflow:hidden;border-radius:50%;pointer-events:none}
#ks-approval-countdown .kswm-glass::before{content:"";position:absolute;inset:-30% -100%;background:linear-gradient(122deg,transparent 41%,rgba(255,255,255,.08) 46%,rgba(255,247,216,.28) 50%,rgba(255,255,255,.08) 54%,transparent 59%);animation:kswmReflection 12s ease-in-out infinite}
#ks-approval-countdown .kswm-clock{position:relative;z-index:1;display:block;width:20px;height:20px;margin-bottom:9px;color:#ffe8a0}
#ks-approval-countdown.kswm #ks-approval-countdown-time{position:relative;z-index:1;display:block;flex:none;color:#fff8d8;font:760 48px/1.12 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:-1.8px;font-variant-numeric:tabular-nums;text-shadow:0 0 12px rgba(255,229,120,.18),0 0 30px rgba(255,223,98,.20),0 4px 16px rgba(32,3,51,.25);animation:kswmCountdownGlow 3.6s ease-in-out infinite}
#ks-approval-countdown .kswm-timer-label{position:relative;z-index:1;margin-top:10px;color:#f5eaff;font-size:9px;letter-spacing:1.8px}
#ks-approval-countdown .kswm-progress-label{position:relative;z-index:4;display:flex;justify-content:space-between;gap:14px;color:#f4e9fe;font-size:10px;line-height:1.5;margin:0 0 10px}
#ks-approval-countdown .kswm-progress-label span:last-child{color:#fff0a8}
#ks-approval-countdown.kswm #ks-approval-countdown-progress{position:relative;z-index:4;height:8px;margin:0 0 26px;border-radius:99px;overflow:hidden;background:rgba(255,255,255,.14);box-shadow:inset 0 1px 2px rgba(48,9,74,.20)}
#ks-approval-countdown.kswm #ks-approval-countdown-progress i{height:100%;border-radius:inherit;background:linear-gradient(90deg,#ffd960,#fff3b8);transform-origin:left center;box-shadow:0 0 12px rgba(255,212,56,.20)}
#ks-approval-countdown.kswm #ks-approval-countdown-progress::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:kswmProgressSweep 5.6s ease-in-out infinite}
#ks-approval-countdown.kswm .ksa-wait-note{position:relative;z-index:4;margin:0 -30px;padding:16px 30px;border-top:1px solid #ede0f4;color:#694d79;background:linear-gradient(100deg,#fbf7fe,#fffaf0);font-size:11px;line-height:1.8}
#ks-approval-countdown.kswm:not([hidden]){animation:kswmCardEntrance .7s cubic-bezier(.2,.8,.2,1) both}
#ks-approval-countdown.kswm[data-motion-paused="true"] *{animation-play-state:paused!important}
@keyframes kswmCardEntrance{from{opacity:0;transform:scale(.985) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes kswmTimerEntrance{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes kswmSlowZoom{0%,100%{transform:scale(1)}50%{transform:scale(1.055)}}
@keyframes kswmGoldWhiteSweep{0%,18%{transform:translate3d(-38%,0,0);opacity:0}45%{opacity:.78}78%,100%{transform:translate3d(38%,0,0);opacity:0}}
@keyframes kswmGlowPulse{0%,100%{opacity:.45;filter:brightness(1)}50%{opacity:1;filter:brightness(1.12)}}
@keyframes kswmCountdownGlow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.08)}}
@keyframes kswmFloatParticle{0%,100%{transform:translate3d(0,0,0);opacity:.25}50%{transform:translate3d(8px,-14px,0);opacity:.8}}
@keyframes kswmOrbit{to{transform:rotate(360deg)}}
@keyframes kswmReflection{0%,20%{transform:translateX(-28%);opacity:0}48%{opacity:.6}78%,100%{transform:translateX(28%);opacity:0}}
@keyframes kswmProgressSweep{0%,20%{transform:translateX(-100%);opacity:0}50%{opacity:.7}80%,100%{transform:translateX(100%);opacity:0}}
@media(max-width:600px){#ks-approval-countdown.kswm{padding:21px 20px 0;border-radius:22px}#ks-approval-countdown .kswm-top{padding-bottom:17px}#ks-approval-countdown .kswm-brand small{display:none}#ks-approval-countdown.kswm .ksa-wait-head{grid-template-columns:1fr;gap:22px;padding:22px 0}#ks-approval-countdown.kswm h4{font-size:26px;max-width:340px}#ks-approval-countdown.kswm .ksa-wait-head p{font-size:12px}#ks-approval-countdown .kswm-timer{width:166px;height:166px}#ks-approval-countdown.kswm #ks-approval-countdown-time{font-size:40px}#ks-approval-countdown.kswm .ksa-wait-note{margin:0 -20px;padding:14px 20px}#ks-approval-countdown .kswm-progress-label{font-size:9px}}
@media(max-width:360px){#ks-approval-countdown.kswm{padding:18px 16px 0}#ks-approval-countdown .kswm-brand strong{font-size:24px}#ks-approval-countdown.kswm h4{font-size:24px}#ks-approval-countdown.kswm .ksa-wait-note{margin:0 -16px;padding:13px 16px}#ks-approval-countdown .kswm-pause{padding:7px 9px}}
@media(hover:none),(pointer:coarse){#ks-approval-countdown .kswm-depth{transform:none!important}}
@media(prefers-reduced-motion:reduce){#ks-approval-countdown.kswm,#ks-approval-countdown.kswm *,#ks-approval-countdown.kswm *::before,#ks-approval-countdown.kswm *::after{animation:none!important;transition:none!important}#ks-approval-countdown .kswm-pause{display:none}}
      `;

      card.querySelectorAll('.kswm-top,.kswm-atmosphere,.kswm-eyebrow,.kswm-progress-label,.kswm-timer-label,.kswm-ring,.kswm-glass').forEach(el=>el.remove());

      const atmosphere = d.createElement('div');
      atmosphere.className='kswm-atmosphere';
      atmosphere.innerHTML='<div class="kswm-depth"></div><div class="kswm-sweep"></div><div class="kswm-reflection"></div><div class="kswm-particles">'+('<i></i>'.repeat(8))+'</div>';
      card.prepend(atmosphere);

      const top = d.createElement('div');
      top.className='kswm-top';
      top.innerHTML='<div class="kswm-brand"><strong><b>KB</b>star</strong><small>by KB Bank</small></div><button type="button" class="kswm-pause" aria-pressed="false"><svg aria-hidden="true" viewBox="0 0 12 12" fill="currentColor"><path d="M3 2h2v8H3zm4 0h2v8H7z"/></svg><span>Jeda animasi</span></button>';
      atmosphere.insertAdjacentElement('afterend',top);

      const eyebrow=d.createElement('div'); eyebrow.className='kswm-eyebrow'; eyebrow.textContent='PROSES PENGAJUAN'; head.firstElementChild.prepend(eyebrow);

      const timerWrap=d.createElement('div'); timerWrap.className='kswm-timer';
      const ring=d.createElement('span'); ring.className='kswm-ring';
      const glass=d.createElement('span'); glass.className='kswm-glass';
      const clock=d.createElementNS('http://www.w3.org/2000/svg','svg'); clock.setAttribute('viewBox','0 0 24 24'); clock.setAttribute('fill','none'); clock.setAttribute('aria-hidden','true'); clock.setAttribute('class','kswm-clock'); clock.innerHTML='<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>';
      timer.before(timerWrap); timerWrap.append(ring,glass,clock,timer);
      const timerLabel=d.createElement('span'); timerLabel.className='kswm-timer-label'; timerLabel.textContent='SISA WAKTU'; timerWrap.appendChild(timerLabel);

      const progressLabel=d.createElement('div'); progressLabel.className='kswm-progress-label'; progressLabel.innerHTML='<span>Waktu tunggu berjalan</span><span>Hasil setelah 00:00</span>'; progress.before(progressLabel);

      let paused=false;
      const pause=top.querySelector('button');
      const setMotion=()=>{card.dataset.motionPaused=String(paused||d.hidden)};
      pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.querySelector('span').textContent=paused?'Lanjutkan animasi':'Jeda animasi';setMotion()});
      const parallax=e=>{if (w.matchMedia('(hover:none),(pointer:coarse)').matches) return; const r=card.getBoundingClientRect(); const x=((e.clientX-r.left)/r.width-.5)*8; const y=((e.clientY-r.top)/r.height-.5)*6; card.style.setProperty('--mx',x.toFixed(2)+'px'); card.style.setProperty('--my',y.toFixed(2)+'px')};
      const resetParallax=()=>{card.style.setProperty('--mx','0px');card.style.setProperty('--my','0px')};
      card.addEventListener('pointermove',parallax); card.addEventListener('pointerleave',resetParallax); d.addEventListener('visibilitychange',setMotion); setMotion();
      card.kswmCleanup=()=>{card.removeEventListener('pointermove',parallax);card.removeEventListener('pointerleave',resetParallax)};
      card.classList.add('kswm'); card.dataset.waitingPremium=VERSION;
      return true;
    }
    if (apply()) return;
    const observer=new w.MutationObserver(()=>{if(apply())observer.disconnect()}); observer.observe(d.body,{childList:true,subtree:true});
    w.setTimeout(()=>observer.disconnect(),10000);
  }
  frame.addEventListener('load',install);
  if (frame.contentDocument?.readyState==='complete') install();
})();