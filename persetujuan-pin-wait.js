/* Additive PIN confirmation + 5-minute waiting step for the local simulation. */
(() => {
  'use strict';
  const frame = document.getElementById('app');
  if (!frame) return;

  function install() {
    let d;
    try { d = frame.contentDocument; } catch { return; }
    if (!d || !d.defaultView || d.getElementById('ks-pin-layer')) return;
    const w = d.defaultView;
    const root = d.getElementById('kbstar-loan-hero');
    const approval = d.getElementById('ks-approval-view');
    const form = d.getElementById('ks-approval-form');
    const confirm = d.getElementById('ks-approval-confirm');
    if (!root || !approval || !form || !confirm) return;

    const style = d.createElement('style');
    style.id = 'ks-pin-wait-style';
    style.textContent = `
      #ks-pin-layer,#ks-pin-layer *,#ks-waiting-view,#ks-waiting-view *{box-sizing:border-box}
      #ks-pin-layer[hidden],#ks-waiting-view[hidden]{display:none!important}
      #ks-pin-layer{position:fixed;inset:0;z-index:2147480000;display:grid;align-items:end;justify-items:center;font-family:inherit}
      #ks-pin-layer .ksp-pin-backdrop{position:absolute;inset:0;background:rgba(30,8,47,.48);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
      #ks-pin-layer .ksp-pin-sheet{position:relative;width:min(100%,520px);max-height:min(92dvh,620px);overflow:auto;padding:22px 22px max(22px,env(safe-area-inset-bottom));border-radius:24px 24px 0 0;background:#fff;color:#4d2b61;box-shadow:0 -18px 55px rgba(49,16,70,.24);overscroll-behavior:contain}
      #ks-pin-layer .ksp-pin-grab{width:42px;height:4px;margin:0 auto 19px;border-radius:999px;background:#ded4e4}
      #ks-pin-layer .ksp-pin-kicker{display:block;margin-bottom:6px;color:#8a6998;font-size:10px;font-weight:750;letter-spacing:1.5px}
      #ks-pin-layer h3{margin:0;color:#512079;font-size:24px;line-height:1.25;letter-spacing:-.5px}
      #ks-pin-layer .ksp-pin-copy{margin:8px 0 18px;color:#816d8c;font-size:12px;line-height:1.7}
      #ks-pin-layer .ksp-pin-label{display:block;margin-bottom:7px;color:#58386a;font-size:12px;font-weight:700}
      #ks-pin-input{display:block;width:100%;min-height:58px;padding:13px 16px;border:1px solid #d9c9e4;border-radius:13px;background:#fbf8fd;color:#56246f;font:700 22px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.5em;text-align:center;caret-color:#7625bc;scroll-margin-bottom:180px}
      #ks-pin-input:focus{border-color:#9b65c6;box-shadow:0 0 0 3px rgba(139,83,181,.13);outline:0}
      #ks-pin-layer .ksp-pin-security{margin:10px 0 0;padding:11px 12px;border-radius:11px;background:#fff9e9;color:#816729;font-size:10.5px;line-height:1.65}
      #ks-pin-error{margin:10px 0 0;color:#a02f47;font-size:11px;line-height:1.6}
      #ks-pin-layer .ksp-pin-actions{display:grid;grid-template-columns:1fr 1.25fr;gap:10px;margin-top:18px}
      #ks-pin-layer .ksp-pin-button{min-height:48px;border:1px solid #e1d4e9;border-radius:12px;background:#fff;color:#734497;font:700 12px/1.4 inherit;cursor:pointer}
      #ks-pin-layer .ksp-pin-button.primary{border-color:#ffe500;background:#ffe500;color:#4c2e04}
      #ks-pin-layer .ksp-pin-button:disabled{cursor:not-allowed;opacity:.55}
      #ks-pin-layer .ksp-pin-button.is-loading{position:relative;color:transparent!important}
      #ks-pin-layer .ksp-pin-button.is-loading::after{content:"";position:absolute;width:18px;height:18px;border:2px solid rgba(76,46,4,.25);border-top-color:#4c2e04;border-radius:50%;animation:kspSpin .75s linear infinite}
      @keyframes kspSpin{to{transform:rotate(360deg)}}

      #ks-waiting-view{padding:28px 32px 34px;background:linear-gradient(150deg,#fbf8ff 0%,#fffdf3 100%);color:#4d2b61;font-family:inherit}
      #ks-waiting-view .ksw-shell{max-width:920px;margin:0 auto}
      #ks-waiting-view .ksw-hero{position:relative;overflow:hidden;min-height:310px;padding:34px 30px;border-radius:25px;background:radial-gradient(circle at 72% 35%,rgba(187,111,244,.28),transparent 31%),linear-gradient(135deg,#2b0d4b 0%,#562086 55%,#3a145f 100%);color:#fff;box-shadow:0 22px 55px rgba(58,20,95,.18);isolation:isolate}
      #ks-waiting-view .ksw-hero::before{content:"";position:absolute;inset:auto -12% -44% -12%;height:70%;border-radius:50%;border-top:2px solid rgba(255,225,66,.72);box-shadow:0 -8px 34px rgba(255,225,66,.22);transform:rotate(-4deg);animation:kswWave 5.5s ease-in-out infinite}
      #ks-waiting-view .ksw-hero::after{content:"";position:absolute;inset:-45%;background:linear-gradient(112deg,transparent 40%,rgba(255,242,181,.16) 49%,transparent 58%);transform:translateX(-48%);animation:kswSweep 6.8s ease-in-out infinite}
      #ks-waiting-view .ksw-copy{position:relative;z-index:3;max-width:540px}
      #ks-waiting-view .ksw-chip{display:inline-flex;align-items:center;gap:8px;padding:7px 11px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.09);font-size:10px;font-weight:750;letter-spacing:1px}
      #ks-waiting-view .ksw-dot{width:7px;height:7px;border-radius:50%;background:#ffe500;box-shadow:0 0 0 0 rgba(255,229,0,.55);animation:kswPulse 1.7s ease-out infinite}
      #ks-waiting-view h3{margin:19px 0 8px;color:#fff;font-size:clamp(25px,4vw,38px);line-height:1.15;letter-spacing:-1px}
      #ks-waiting-view .ksw-lead{max-width:530px;margin:0;color:rgba(255,255,255,.78);font-size:13px;line-height:1.75}
      #ks-waiting-view .ksw-timer-card{position:relative;z-index:3;display:inline-flex;align-items:center;gap:14px;margin-top:23px;padding:14px 17px;border:1px solid rgba(255,255,255,.16);border-radius:16px;background:rgba(17,4,31,.24);backdrop-filter:blur(7px)}
      #ks-waiting-time{min-width:84px;color:#ffe500;font:800 30px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:-1px;font-variant-numeric:tabular-nums}
      #ks-waiting-view .ksw-timer-label{display:block;color:rgba(255,255,255,.62);font-size:10px;line-height:1.4}
      #ks-waiting-view .ksw-orbit{position:absolute;right:8%;top:50%;z-index:2;width:170px;height:170px;transform:translateY(-50%)}
      #ks-waiting-view .ksw-ring{position:absolute;inset:0;border:1px solid rgba(255,229,0,.34);border-radius:50%;animation:kswRotate 7s linear infinite}
      #ks-waiting-view .ksw-ring.r2{inset:24px;border-color:rgba(229,196,255,.34);animation-duration:5s;animation-direction:reverse}
      #ks-waiting-view .ksw-core{position:absolute;inset:51px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(145deg,#ffe500,#ffbe1b);color:#54205d;box-shadow:0 0 35px rgba(255,229,0,.35)}
      #ks-waiting-view .ksw-core svg{width:34px;height:34px}
      #ks-waiting-view .ksw-progress{height:7px;margin:22px 0 0;overflow:hidden;border-radius:999px;background:#eee5f2}
      #ks-waiting-progress{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#7e2bbd,#ffe500);transition:width .5s linear}
      #ks-waiting-view .ksw-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:18px}
      #ks-waiting-view .ksw-step{min-width:0;padding:14px;border:1px solid #e7dbea;border-radius:14px;background:#fff;color:#8a7495;font-size:11px;line-height:1.55;transition:border-color .2s,background .2s,color .2s}
      #ks-waiting-view .ksw-step strong{display:block;margin-bottom:3px;color:#5b386d;font-size:11px}
      #ks-waiting-view .ksw-step.is-active{border-color:#d5b2ec;background:#faf3ff;color:#6e4f7d}
      #ks-waiting-view .ksw-step.is-done{border-color:#b9dfc8;background:#f3fbf6;color:#397451}
      #ks-waiting-note{margin:16px 0 0;padding:13px 15px;border-radius:12px;background:#fff9e8;color:#82682f;font-size:11px;line-height:1.7}
      @keyframes kswRotate{to{transform:rotate(360deg)}}
      @keyframes kswPulse{70%{box-shadow:0 0 0 9px rgba(255,229,0,0)}}
      @keyframes kswWave{50%{transform:rotate(-2deg) translateY(-7px)}}
      @keyframes kswSweep{0%,20%{transform:translateX(-55%);opacity:0}48%{opacity:.8}76%,100%{transform:translateX(55%);opacity:0}}
      @media(max-width:700px){#ks-waiting-view{padding:22px 16px 28px}#ks-waiting-view .ksw-hero{min-height:355px;padding:27px 20px}#ks-waiting-view .ksw-copy{max-width:72%}#ks-waiting-view .ksw-orbit{right:-10px;top:64%;width:132px;height:132px}#ks-waiting-view .ksw-core{inset:40px}#ks-waiting-view .ksw-steps{grid-template-columns:1fr 1fr}}
      @media(max-width:430px){#ks-pin-layer .ksp-pin-sheet{padding:19px 15px max(18px,env(safe-area-inset-bottom))}#ks-pin-layer .ksp-pin-actions{grid-template-columns:1fr}#ks-waiting-view{padding:18px 12px 25px}#ks-waiting-view .ksw-hero{min-height:390px;padding:24px 17px}#ks-waiting-view .ksw-copy{max-width:100%}#ks-waiting-view .ksw-lead{max-width:78%}#ks-waiting-view .ksw-orbit{right:-18px;top:70%;width:118px;height:118px}#ks-waiting-view .ksw-core{inset:36px}#ks-waiting-view .ksw-steps{grid-template-columns:1fr}#ks-waiting-view .ksw-timer-card{margin-top:18px}}
      @media(prefers-reduced-motion:reduce){#ks-pin-layer .ksp-pin-button.is-loading::after,#ks-waiting-view .ksw-dot,#ks-waiting-view .ksw-ring,#ks-waiting-view .ksw-hero::before,#ks-waiting-view .ksw-hero::after{animation:none!important}}
    `;
    d.head.appendChild(style);

    const waiting = d.createElement('section');
    waiting.id = 'ks-waiting-view';
    waiting.hidden = true;
    waiting.setAttribute('aria-labelledby','ks-waiting-title');
    waiting.innerHTML = `
      <div class="ksw-shell">
        <section class="ksw-hero">
          <div class="ksw-copy">
            <span class="ksw-chip" id="ks-waiting-chip"><i class="ksw-dot" aria-hidden="true"></i>PROSES PENGECEKAN</span>
            <h3 id="ks-waiting-title" tabindex="-1">Menunggu Persetujuan Pengajuan</h3>
            <p class="ksw-lead">Data pengajuan sedang melalui proses pengecekan hasil. Mohon tunggu hingga tahapan pemeriksaan selesai.</p>
            <div class="ksw-timer-card"><span id="ks-waiting-time">05:00</span><span class="ksw-timer-label">estimasi waktu tunggu<br>pada simulasi ini</span></div>
          </div>
          <div class="ksw-orbit" aria-hidden="true"><span class="ksw-ring"></span><span class="ksw-ring r2"></span><span class="ksw-core"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 1 0 9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m12 7 0 5 3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
        </section>
        <div class="ksw-progress" aria-hidden="true"><span id="ks-waiting-progress"></span></div>
        <div class="ksw-steps" id="ks-waiting-steps">
          <div class="ksw-step"><strong>01 · Validasi data</strong>Memastikan data pengajuan tetap konsisten.</div>
          <div class="ksw-step"><strong>02 · Rekening tujuan</strong>Memeriksa kelengkapan informasi rekening.</div>
          <div class="ksw-step"><strong>03 · Analisis pengajuan</strong>Memproses ringkasan dan parameter pengajuan.</div>
          <div class="ksw-step"><strong>04 · Penyusunan hasil</strong>Menyiapkan status hasil pengecekan.</div>
        </div>
        <p id="ks-waiting-note" role="status">Proses pengecekan sedang berjalan. Jangan menutup halaman selama countdown berlangsung.</p>
      </div>`;
    approval.insertAdjacentElement('afterend', waiting);

    const pinLayer = d.createElement('div');
    pinLayer.id = 'ks-pin-layer';
    pinLayer.hidden = true;
    pinLayer.innerHTML = `
      <div class="ksp-pin-backdrop" data-pin-close aria-hidden="true"></div>
      <section class="ksp-pin-sheet" role="dialog" aria-modal="true" aria-labelledby="ks-pin-title" aria-describedby="ks-pin-copy">
        <div class="ksp-pin-grab" aria-hidden="true"></div>
        <span class="ksp-pin-kicker">KONFIRMASI KEAMANAN</span>
        <h3 id="ks-pin-title">Konfirmasi PIN</h3>
        <p class="ksp-pin-copy" id="ks-pin-copy">Masukkan PIN 6 digit khusus aplikasi simulasi untuk melanjutkan proses pengecekan.</p>
        <form id="ks-pin-form" novalidate>
          <label class="ksp-pin-label" for="ks-pin-input">PIN aplikasi simulasi</label>
          <input id="ks-pin-input" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" autocorrect="off" spellcheck="false" aria-describedby="ks-pin-security ks-pin-error">
          <p class="ksp-pin-security" id="ks-pin-security">Gunakan PIN simulasi 6 digit. Jangan masukkan PIN ATM, PIN mobile banking resmi, password bank, atau OTP. PIN tidak disimpan atau dikirim ke layanan pihak ketiga.</p>
          <p id="ks-pin-error" role="alert" hidden></p>
          <div class="ksp-pin-actions"><button class="ksp-pin-button" id="ks-pin-cancel" type="button">Batal</button><button class="ksp-pin-button primary" id="ks-pin-confirm" type="submit" disabled>Konfirmasi PIN</button></div>
        </form>
      </section>`;
    d.body.appendChild(pinLayer);

    const pinForm = d.getElementById('ks-pin-form');
    const pinInput = d.getElementById('ks-pin-input');
    const pinConfirm = d.getElementById('ks-pin-confirm');
    const pinCancel = d.getElementById('ks-pin-cancel');
    const pinError = d.getElementById('ks-pin-error');
    const waitingTime = d.getElementById('ks-waiting-time');
    const waitingProgress = d.getElementById('ks-waiting-progress');
    const waitingSteps = Array.from(d.querySelectorAll('#ks-waiting-steps .ksw-step'));
    const waitingChip = d.getElementById('ks-waiting-chip');
    const waitingNote = d.getElementById('ks-waiting-note');
    const checks = Array.from(form.querySelectorAll('input[type="checkbox"]'));
    const title = d.querySelector('.ki-view-title');
    const status = root.querySelector('.ks-status');

    let pinOpen = false;
    let pinBusy = false;
    let validationTimer = 0;
    let waitingTimer = 0;
    let waitingStartedAt = 0;
    let waitingActive = false;
    let approvalStatus = 'pending';
    let previousFocus = null;
    let previousOverflow = '';

    function setConfirmLabel() {
      const textNode = Array.from(confirm.childNodes).find(node => node.nodeType === 3);
      if (textNode && !pinOpen && !approval.hidden) textNode.nodeValue = 'Setujui & Lanjutkan';
    }
    setConfirmLabel();
    const labelObserver = new w.MutationObserver(setConfirmLabel);
    labelObserver.observe(confirm,{childList:true});

    function setStatus(message) { if (status) status.textContent = message; }
    function hidePin(restoreFocus = true) {
      if (validationTimer) w.clearTimeout(validationTimer);
      validationTimer = 0;
      pinBusy = false;
      pinOpen = false;
      pinLayer.hidden = true;
      pinInput.value = '';
      pinInput.disabled = false;
      pinCancel.disabled = false;
      pinConfirm.disabled = true;
      pinConfirm.classList.remove('is-loading');
      pinConfirm.textContent = 'Konfirmasi PIN';
      pinError.hidden = true;
      pinError.textContent = '';
      d.documentElement.style.overflow = previousOverflow;
      setConfirmLabel();
      if (restoreFocus && previousFocus && previousFocus.isConnected) previousFocus.focus({preventScroll:true});
    }
    function openPin() {
      if (pinOpen || pinBusy || approval.hidden || confirm.disabled) return;
      pinOpen = true;
      previousFocus = d.activeElement;
      previousOverflow = d.documentElement.style.overflow;
      d.documentElement.style.overflow = 'hidden';
      pinInput.value = '';
      pinError.hidden = true;
      pinConfirm.disabled = true;
      confirm.disabled = true;
      pinLayer.hidden = false;
      w.setTimeout(() => pinInput.focus({preventScroll:true}),60);
      setStatus('Konfirmasi PIN aplikasi simulasi ditampilkan.');
    }
    function stopWaiting() {
      if (waitingTimer) w.clearInterval(waitingTimer);
      waitingTimer = 0;
      waitingStartedAt = 0;
      waitingActive = false;
      waiting.hidden = true;
      waiting.removeAttribute('data-wait-complete');
      waitingTime.textContent = '05:00';
      waitingProgress.style.width = '0%';
      waitingSteps.forEach(el => el.classList.remove('is-active','is-done'));
      waitingChip.innerHTML = '<i class="ksw-dot" aria-hidden="true"></i>PROSES PENGECEKAN';
      waitingNote.textContent = 'Proses pengecekan sedang berjalan. Jangan menutup halaman selama countdown berlangsung.';
    }
    function updateWaiting() {
      if (!waitingActive || !waitingStartedAt) return;
      const elapsed = Math.min(300,Math.floor((Date.now()-waitingStartedAt)/1000));
      const remaining = Math.max(0,300-elapsed);
      waitingTime.textContent = String(Math.floor(remaining/60)).padStart(2,'0') + ':' + String(remaining%60).padStart(2,'0');
      waitingProgress.style.width = ((elapsed/300)*100).toFixed(2) + '%';
      const stage = Math.min(waitingSteps.length-1,Math.floor(elapsed/75));
      waitingSteps.forEach((el,index) => {
        el.classList.toggle('is-done',index<stage || remaining===0);
        el.classList.toggle('is-active',remaining>0 && index===stage);
      });
      if (remaining===0) {
        if (waitingTimer) w.clearInterval(waitingTimer);
        waitingTimer=0;
        waiting.dataset.waitComplete='true';
        waitingChip.textContent='PENGECEKAN 5 MENIT SELESAI';
        waitingNote.textContent='Tahap pengecekan simulasi selama 5 menit telah selesai. Status pengajuan tetap menunggu hasil berikutnya dan tidak diarahkan ke Dashboard.';
        setStatus('Tahap pengecekan 5 menit selesai. Menunggu hasil pengajuan berikutnya.');
      }
    }
    function startWaiting() {
      waitingActive=true;
      approval.hidden=true;
      waiting.hidden=false;
      waitingStartedAt=Date.now();
      if (title) title.textContent='KBStar · Menunggu Persetujuan Pengajuan';
      updateWaiting();
      waitingTimer=w.setInterval(updateWaiting,1000);
      d.getElementById('ks-waiting-title').focus({preventScroll:true});
      root.querySelector('.ks-header')?.scrollIntoView({block:'start',behavior:'instant'});
      setStatus('Menunggu persetujuan pengajuan. Countdown 5 menit dimulai.');
    }

    form.addEventListener('submit', event => {
      if (approval.hidden) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (pinOpen || pinBusy) return;
      if (checks.some(el => !el.checked)) {
        d.getElementById('ks-approval-error').textContent='Baca dan centang semua pernyataan sebelum melanjutkan.';
        d.getElementById('ks-approval-error').hidden=false;
        checks.find(el=>!el.checked)?.focus({preventScroll:true});
        return;
      }
      openPin();
    },true);

    pinInput.addEventListener('input',() => {
      const clean=pinInput.value.replace(/\D/g,'').slice(0,6);
      if (pinInput.value!==clean) pinInput.value=clean;
      pinError.hidden=true;
      pinError.textContent='';
      pinConfirm.disabled=pinBusy || clean.length!==6;
    });
    pinForm.addEventListener('submit',event => {
      event.preventDefault();
      if (!pinOpen || pinBusy) return;
      if (!/^\d{6}$/.test(pinInput.value)) {
        pinError.textContent='PIN tidak valid. Masukkan tepat 6 digit angka.';
        pinError.hidden=false;
        pinInput.focus({preventScroll:true});
        return;
      }
      pinBusy=true;
      pinInput.disabled=true;
      pinCancel.disabled=true;
      pinConfirm.disabled=true;
      pinConfirm.classList.add('is-loading');
      pinConfirm.textContent='Memvalidasi';
      validationTimer=w.setTimeout(() => {
        validationTimer=0;
        if (!pinOpen || !pinBusy) return;
        approvalStatus='approved';
        approval.dataset.consentConfirmed='session-only';
        hidePin(false);
        startWaiting();
      },650);
    });
    pinCancel.addEventListener('click',() => { if (!pinBusy) { hidePin(true); if (checks.every(el=>el.checked)) confirm.disabled=false; } });
    pinLayer.querySelector('[data-pin-close]').addEventListener('click',() => { if (!pinBusy) { hidePin(true); if (checks.every(el=>el.checked)) confirm.disabled=false; } });
    pinLayer.addEventListener('keydown',event => { if (event.key==='Escape' && !pinBusy) { event.preventDefault(); hidePin(true); if (checks.every(el=>el.checked)) confirm.disabled=false; } });

    root.addEventListener('ks-reset-view',() => {
      approvalStatus='pending';
      hidePin(false);
      stopWaiting();
    });
    w.addEventListener('pagehide',() => {
      if (validationTimer) w.clearTimeout(validationTimer);
      if (waitingTimer) w.clearInterval(waitingTimer);
      labelObserver.disconnect();
    },{once:true});
  }

  frame.addEventListener('load',install);
  if (frame.contentDocument && frame.contentDocument.readyState==='complete') install();
})();
