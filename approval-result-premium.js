(() => {
  'use strict';
  const frame = document.getElementById('app');
  if (!frame) return;

  function install() {
    let d;
    try { d = frame.contentDocument; } catch { return; }
    if (!d || !d.defaultView || d.getElementById('ks-approved-result')) return;

    const approval = d.getElementById('ks-approval-view');
    const form = d.getElementById('ks-approval-form');
    const confirm = d.getElementById('ks-approval-confirm');
    const title = d.querySelector('.ki-view-title');
    const status = d.querySelector('#kbstar-loan-hero .ks-status');
    const w = d.defaultView;
    const root = d.getElementById('kbstar-loan-hero');
    const actions = approval?.querySelector('.ksp-actions');
    if (!approval || !form || !confirm || !actions || !root) return;

    const style = d.createElement('style');
    style.id = 'ks-approved-result-style';
    style.textContent = `
      #ks-approved-result{display:none;margin:24px 0 0;padding:0;border-radius:30px;overflow:hidden;background:linear-gradient(145deg,#25053f 0%,#43106d 34%,#6e1cab 70%,#351052 100%);color:#fff;box-shadow:0 30px 80px rgba(54,14,83,.30),0 10px 28px rgba(113,32,164,.18);position:relative;isolation:isolate;border:1px solid rgba(255,239,126,.20)}
      #ks-approved-result.is-visible{display:block;animation:ksaEnter .52s cubic-bezier(.2,.8,.2,1)}
      #ks-approved-result:before{content:"";position:absolute;inset:-45% -16%;background:linear-gradient(112deg,transparent 40%,rgba(255,255,255,.03) 45%,rgba(255,225,59,.24) 50%,rgba(255,255,255,.05) 55%,transparent 60%);animation:ksaSweep 7.5s ease-in-out infinite;pointer-events:none}
      #ks-approved-result:after{content:"";position:absolute;width:310px;height:310px;right:-120px;top:-130px;border-radius:50%;background:radial-gradient(circle,rgba(255,229,0,.19),rgba(255,229,0,.04) 42%,transparent 70%);box-shadow:0 0 100px rgba(255,229,0,.08);pointer-events:none}
      #ks-approved-result .ksa-brandbar{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 22px;border-bottom:1px solid rgba(255,255,255,.09);background:rgba(21,4,35,.22);backdrop-filter:blur(10px)}
      #ks-approved-result .ksa-brand{display:flex;align-items:center;gap:9px;font-size:15px;font-weight:800;letter-spacing:-.2px}.ksa-brand .kb{color:#ffe500}.ksa-brand .star{color:#fff}
      #ks-approved-result .ksa-secure{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border:1px solid rgba(255,235,116,.25);border-radius:999px;color:#ffe77a;background:rgba(255,229,0,.06);font-size:9px;font-weight:800;letter-spacing:1.05px}
      #ks-approved-result .ksa-inner{position:relative;z-index:2;padding:30px 26px 24px;display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center}
      #ks-approved-result .ksa-icon-wrap{position:relative;width:96px;height:96px;flex:none;display:grid;place-items:center;isolation:isolate}
      #ks-approved-result .ksa-icon-wrap:before{content:"";position:absolute;inset:-16px;border-radius:50%;background:radial-gradient(circle,rgba(255,235,94,.34) 0%,rgba(255,213,0,.16) 34%,rgba(255,229,0,.05) 54%,transparent 72%);filter:blur(4px);opacity:.95;animation:ksaHeroGlow 2.8s ease-in-out infinite}
      #ks-approved-result .ksa-icon-wrap:after{content:"";position:absolute;inset:2px;border-radius:50%;border:1px solid rgba(255,244,169,.58);box-shadow:0 0 0 7px rgba(255,229,0,.06),0 0 30px rgba(255,221,0,.15);animation:ksaHeroRing 4.8s linear infinite;z-index:-1}
      #ks-approved-result .ksa-icon{position:relative;width:82px;height:82px;border-radius:28px;display:grid;place-items:center;overflow:hidden;background:radial-gradient(circle at 30% 20%,#fffbd8 0%,#fff07b 26%,#ffe31a 57%,#eeb800 100%);color:#501573;border:1px solid rgba(255,255,255,.82);box-shadow:0 22px 46px rgba(255,194,0,.30),0 0 0 1px rgba(255,229,0,.28),inset 0 2px 1px rgba(255,255,255,.92),inset 0 -10px 24px rgba(184,121,0,.12)}
      #ks-approved-result .ksa-icon:before{content:"";position:absolute;width:64px;height:32px;left:-8px;top:-7px;border-radius:50%;background:linear-gradient(180deg,rgba(255,255,255,.74),rgba(255,255,255,0));transform:rotate(-20deg);filter:blur(.2px);pointer-events:none}
      #ks-approved-result .ksa-icon:after{content:"";position:absolute;inset:8px;border-radius:22px;border:1px solid rgba(93,26,124,.13);box-shadow:inset 0 0 22px rgba(255,255,255,.28);pointer-events:none}
      #ks-approved-result .ksa-icon svg{position:relative;z-index:2;width:47px;height:47px;filter:drop-shadow(0 2px 0 rgba(255,255,255,.52)) drop-shadow(0 5px 10px rgba(80,21,115,.12))}
      #ks-approved-result .ksa-kicker{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:900;letter-spacing:2px;color:#ffeb8b;margin-bottom:7px;text-transform:uppercase}
      #ks-approved-result .ksa-kicker:before{content:"";width:22px;height:2px;border-radius:999px;background:#ffe500;box-shadow:0 0 14px rgba(255,229,0,.55)}
      #ks-approved-result h3{margin:0;color:#fff;font-size:clamp(29px,5vw,42px);line-height:1.02;letter-spacing:-1.4px;font-weight:850;text-wrap:balance}
      #ks-approved-result p{margin:12px 0 0;max-width:640px;color:rgba(255,255,255,.78);font-size:12.5px;line-height:1.75}
      #ks-approved-result .ksa-statusline{position:relative;z-index:2;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:0 26px 22px}
      #ks-approved-result .ksa-approved-data{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;padding:0 26px 24px}
      #ks-approved-result .ksa-approved-data>div{min-width:0;padding:15px 16px;border:1px solid rgba(255,241,141,.18);border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.035));box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}
      #ks-approved-result .ksa-approved-data span{display:block;margin-bottom:6px;color:rgba(255,255,255,.55);font-size:9px;font-weight:700;letter-spacing:.35px;text-transform:uppercase}
      #ks-approved-result .ksa-approved-data strong{display:block;color:#fff;font-size:15px;line-height:1.35;font-weight:850;overflow-wrap:anywhere}
      #ks-approved-result .ksa-approved-data .ksa-approved-amount strong{color:#ffed55;font-size:21px;letter-spacing:-.35px;text-shadow:0 0 22px rgba(255,229,0,.12)}
      #ks-approved-result .ksa-chip{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:#f7edff;font-size:9px;font-weight:800;letter-spacing:.65px}
      #ks-approved-result .ksa-chip:before{content:"";width:6px;height:6px;border-radius:50%;background:#ffe500;box-shadow:0 0 10px rgba(255,229,0,.8)}
      #ks-approved-result .ksa-meta{position:relative;z-index:2;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:rgba(255,255,255,.09);border-top:1px solid rgba(255,255,255,.10);border-bottom:1px solid rgba(255,255,255,.08)}
      #ks-approved-result .ksa-meta>div{padding:17px 19px;background:rgba(22,4,37,.22);min-width:0}
      #ks-approved-result .ksa-meta span{display:block;color:rgba(255,255,255,.48);font-size:9px;margin-bottom:5px;letter-spacing:.25px}
      #ks-approved-result .ksa-meta strong{display:block;font-size:11.5px;color:#fff;font-weight:750;line-height:1.4}
      #ks-approved-result .ksa-actions{position:relative;z-index:2;display:flex;align-items:center;gap:12px;padding:18px 18px 20px;background:linear-gradient(180deg,rgba(255,255,255,.015),rgba(19,3,32,.12))}
      #ks-approved-result .ksa-action-note{flex:1;min-width:0;color:rgba(255,255,255,.50);font-size:9.5px;line-height:1.45;padding-left:4px}
      #ks-approved-dashboard{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:13px 20px;border:1px solid rgba(255,248,190,.55);border-radius:15px;background:linear-gradient(180deg,#ffed41 0%,#ffe000 100%);color:#3c2500;font:850 12.5px/1.4 inherit;text-decoration:none;box-shadow:0 14px 30px rgba(255,214,30,.24),inset 0 1px 0 rgba(255,255,255,.85);transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
      #ks-approved-dashboard:hover{background:linear-gradient(180deg,#fff06b,#ffe500);transform:translateY(-1px);box-shadow:0 18px 34px rgba(255,214,30,.30)}
      #ks-approved-dashboard span{font-size:18px;line-height:1;transition:transform .2s ease}#ks-approved-dashboard:hover span{transform:translateX(3px)}
      @keyframes ksaEnter{from{opacity:0;transform:translateY(10px) scale(.988)}to{opacity:1;transform:none}}
      @keyframes ksaSweep{0%,20%{transform:translateX(-52%);opacity:0}46%{opacity:.75}72%,100%{transform:translateX(52%);opacity:0}}
      @keyframes ksaHeroGlow{0%,100%{transform:scale(.94);opacity:.68}50%{transform:scale(1.08);opacity:1}}
      @keyframes ksaHeroRing{0%{transform:rotate(0deg) scale(.98)}50%{transform:rotate(180deg) scale(1.04)}100%{transform:rotate(360deg) scale(.98)}}
      @media(max-width:700px){#ks-approved-result{border-radius:25px}#ks-approved-result .ksa-brandbar{padding:13px 18px}#ks-approved-result .ksa-inner{grid-template-columns:auto 1fr;padding:25px 18px 20px;gap:14px}#ks-approved-result .ksa-icon-wrap{width:80px;height:80px}#ks-approved-result .ksa-icon{width:68px;height:68px;border-radius:23px}#ks-approved-result .ksa-icon svg{width:39px;height:39px}#ks-approved-result h3{font-size:31px}#ks-approved-result p{font-size:12px;line-height:1.68}#ks-approved-result .ksa-approved-data{grid-template-columns:1fr;padding:0 18px 18px}#ks-approved-result .ksa-statusline{padding:0 18px 18px}#ks-approved-result .ksa-meta{grid-template-columns:1fr}#ks-approved-result .ksa-meta>div{display:grid;grid-template-columns:88px 1fr;align-items:center;gap:10px;padding:14px 18px}#ks-approved-result .ksa-meta span{margin:0}#ks-approved-result .ksa-actions{display:block;padding:15px}#ks-approved-result .ksa-action-note{display:none}#ks-approved-dashboard{width:100%;min-height:54px;border-radius:16px}}
      @media(max-width:430px){#ks-approved-result{border-radius:22px;margin-top:20px}#ks-approved-result .ksa-brand{font-size:14px}#ks-approved-result .ksa-secure{font-size:8px;padding:5px 8px}#ks-approved-result .ksa-inner{grid-template-columns:1fr;padding-top:23px}#ks-approved-result .ksa-icon-wrap{width:76px;height:76px}#ks-approved-result .ksa-icon{width:64px;height:64px;border-radius:22px}#ks-approved-result h3{font-size:30px;max-width:290px}#ks-approved-result .ksa-kicker{font-size:9px;letter-spacing:1.7px}#ks-approved-result .ksa-chip{font-size:8.5px}}
      @media(prefers-reduced-motion:reduce){#ks-approved-result,#ks-approved-result:before,#ks-approved-result .ksa-icon-wrap:before,#ks-approved-result .ksa-icon-wrap:after,#ks-approved-dashboard,#ks-approved-dashboard span{animation:none!important;transition:none!important}}
      #ks-approved-result[hidden],#ks-approval-countdown[hidden]{display:none!important}
      #ks-approved-result .ksa-inner>div{min-width:0}
      #ks-approved-result h3{overflow-wrap:anywhere}
      #ks-approval-countdown{box-sizing:border-box;margin:22px 0 0;padding:24px;border:1px solid #d7b9ee;border-radius:22px;background:linear-gradient(135deg,#faf5ff,#fff9e5);color:#512079}
      #ks-approval-countdown .ksa-wait-head{display:flex;align-items:center;justify-content:space-between;gap:16px}
      #ks-approval-countdown .ksa-wait-head>div{min-width:0}
      #ks-approval-countdown h4{margin:0 0 5px;font-size:16px;line-height:1.4;color:#512079}
      #ks-approval-countdown p{margin:0;font-size:12px;line-height:1.65;color:#755b83}
      #ks-approval-countdown-time{flex:none;font:800 34px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#6e23a9;font-variant-numeric:tabular-nums}
      #ks-approval-countdown-progress{height:7px;margin:18px 0 12px;border-radius:999px;overflow:hidden;background:#e9dff0}
      #ks-approval-countdown-progress i{display:block;height:100%;background:linear-gradient(90deg,#7627bc,#efbb28);transform:scaleX(0);transform-origin:left center;transition:transform .3s linear}
      #ks-approval-countdown .ksa-wait-note{font-size:11px}
      @media(max-width:430px){#ks-approval-countdown{padding:18px 16px;border-radius:18px}#ks-approval-countdown h4{font-size:14px}#ks-approval-countdown-time{font-size:28px}}
      @media(prefers-reduced-motion:reduce){#ks-approval-countdown-progress i{transition:none}}

      #ks-approval-pin-dialog,#ks-approval-pin-dialog *{box-sizing:border-box}
      #ks-approval-pin-dialog{width:min(440px,calc(100% - 28px));max-height:calc(100dvh - 28px);margin:auto;padding:0;border:1px solid #e5d4f5;border-radius:28px;background:#fff;color:#472164;font-family:inherit;overflow:auto;overscroll-behavior:contain;box-shadow:0 28px 90px #2c0a4a40}
      #ks-approval-pin-dialog:not([open]){display:none}
      #ks-approval-pin-dialog[open]{animation:ksaPinEnter .28s ease-out}
      #ks-approval-pin-dialog::backdrop{background:rgba(32,10,52,.48);backdrop-filter:blur(5px)}
      #ks-approval-pin-dialog .ksa-pin-head{position:relative;overflow:hidden;padding:24px 26px 22px;color:#fff;background:linear-gradient(125deg,#6319a3,#8025c4 70%,#963acb)}
      #ks-approval-pin-dialog .ksa-pin-head::after{content:"";position:absolute;width:190px;height:190px;right:-95px;top:-65px;border:24px solid #ffffff0c;border-radius:50%;pointer-events:none}
      #ks-approval-pin-dialog .ksa-pin-brand{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px}
      #ks-approval-pin-dialog .ksa-pin-brand strong{font-size:26px;letter-spacing:-1px;font-weight:650}
      #ks-approval-pin-dialog .ksa-pin-brand b{color:#ffe500;font-size:18px}
      #ks-approval-pin-dialog .ksa-pin-badge{border:1px solid #ffffff55;padding:5px 9px;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:1px}
      #ks-approval-pin-dialog .ksa-pin-lock{display:grid;place-items:center;width:48px;height:48px;border-radius:16px;background:#ffe500;color:#5b2084;box-shadow:0 6px 18px #2d0d3b22}
      #ks-approval-pin-dialog svg{display:block;width:25px;height:25px}
      #ks-approval-pin-dialog h2{margin:13px 0 6px;font-size:27px;line-height:1.2;letter-spacing:-.6px;color:#fff}
      #ks-approval-pin-dialog .ksa-pin-head p{margin:0;color:#f1e6fb;font-size:13px;line-height:1.6}
      #ks-approval-pin-dialog .ksa-pin-body{padding:24px 26px 26px}
      #ks-approval-pin-dialog .ksa-pin-label{display:flex;justify-content:space-between;gap:10px;margin-bottom:10px;font-size:12px;font-weight:700;color:#50246e}
      #ks-approval-pin-dialog .ksa-pin-count{font-weight:400;color:#796387}
      #ks-approval-pin-input{display:block;width:100%;height:64px;padding:12px 12px 12px 24px;border:1.5px solid #d9c2eb;border-radius:16px;background:#faf6fe;color:#6622a0;font:700 26px/1.2 ui-monospace,monospace;letter-spacing:.55em;text-align:center;caret-color:#8025c4;box-shadow:inset 0 2px 5px #48215f03;scroll-margin:20px}
      #ks-approval-pin-input:focus{outline:3px solid #8b37c722;outline-offset:2px;border-color:#8b37c7;background:#fff}
      #ks-approval-pin-dialog .ksa-pin-safety{margin:16px 0 0;padding:12px 14px;border:1px solid #f2e3b3;border-radius:13px;background:#fffaf0;color:#755b20;font-size:11px;line-height:1.65}
      #ks-approval-pin-dialog .ksa-pin-safety strong{display:block;margin-bottom:3px}
      #ks-approval-pin-error{margin:12px 0 0;color:#a22a43;font-size:12px;line-height:1.5}
      #ks-approval-pin-dialog .ksa-pin-actions{display:grid;grid-template-columns:.8fr 1.4fr;gap:10px;margin-top:20px}
      #ks-approval-pin-dialog button{display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px;border:1px solid #e2d4ec;border-radius:13px;background:#fff;color:#6a368c;font-family:inherit;font-size:13px;font-weight:700;line-height:1.3;cursor:pointer}
      #ks-approval-pin-dialog button:focus-visible{outline:3px solid #a66ece;outline-offset:2px}
      #ks-approval-pin-dialog button.ksa-pin-primary{background:#ffe500;border-color:#ffe500;color:#482801;font-weight:750}
      #ks-approval-pin-dialog button:disabled{opacity:.48;cursor:not-allowed}
      #ks-approval-pin-dialog button.is-loading{opacity:1}
      #ks-approval-pin-dialog button.is-loading::before{content:"";width:14px;height:14px;flex:none;border:2px solid #73451033;border-top-color:#734510;border-radius:50%;animation:ksaPinSpin .7s linear infinite}
      #ks-approval-pin-dialog .ksa-pin-next{margin:16px 0 0;text-align:center;color:#887093;font-size:10px;line-height:1.6}
      #ks-approval-pin-dialog [hidden]{display:none!important}
      @keyframes ksaPinEnter{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
      @keyframes ksaPinSpin{to{transform:rotate(360deg)}}
      @media(max-width:360px){#ks-approval-pin-dialog{border-radius:22px}#ks-approval-pin-dialog .ksa-pin-head{padding:20px}#ks-approval-pin-dialog .ksa-pin-body{padding:20px}#ks-approval-pin-dialog h2{font-size:25px}}
      @media(max-height:580px){#ks-approval-pin-dialog .ksa-pin-head{padding:16px 20px}#ks-approval-pin-dialog .ksa-pin-brand{margin-bottom:12px}#ks-approval-pin-dialog .ksa-pin-lock{display:none}#ks-approval-pin-dialog .ksa-pin-body{padding:18px 20px}}
      @media(prefers-reduced-motion:reduce){#ks-approval-pin-dialog[open],#ks-approval-pin-dialog button.is-loading::before{animation:none}}
    `;
    d.head.appendChild(style);

    const result = d.createElement('section');
    result.id = 'ks-approved-result';
    result.hidden = true;
    result.setAttribute('role','status');
    result.setAttribute('aria-live','polite');
    result.innerHTML = `
      <div class="ksa-brandbar">
        <div class="ksa-brand"><span class="kb">KB</span><span class="star">star</span></div>
        <div class="ksa-secure">STATUS TERVERIFIKASI</div>
      </div>
      <div class="ksa-inner">
        <div class="ksa-icon-wrap"><div class="ksa-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="m7.8 12.2 2.6 2.6 5.8-6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
        <div><div class="ksa-kicker">HASIL PENGAJUAN</div><h3>PINJAMAN DISETUJUI!</h3><p>Waktu tunggu simulasi 5 menit telah selesai. Status ini bukan keputusan kredit bank. Anda tetap berada di halaman Persetujuan dan dapat membuka Dashboard melalui tombol di bawah.</p></div>
      </div>
      <div class="ksa-approved-data"><div><span>Nama Lengkap</span><strong id="ks-approved-name">Nasabah</strong></div><div class="ksa-approved-amount"><span>Nominal Pinjaman Disetujui</span><strong id="ks-approved-amount">—</strong></div></div>
      <div class="ksa-statusline"><span class="ksa-chip">STATUS SIMULASI</span><span class="ksa-chip">PROSES SELESAI</span></div>
      <div class="ksa-meta"><div><span>Status</span><strong>Disetujui</strong></div><div><span>Tahap</span><strong>Persetujuan selesai</strong></div><div><span>Berikutnya</span><strong>Dashboard KBstar-style</strong></div></div>
      <div class="ksa-actions"><div class="ksa-action-note">Lanjutkan ke dashboard untuk melihat ringkasan pengajuan.</div><a id="ks-approved-dashboard" href="dashboard-kbstar-premium.html">Buka Dashboard <span aria-hidden="true">→</span></a></div>`;

    actions.insertAdjacentElement('beforebegin', result);

    const approvedName = result.querySelector('#ks-approved-name');
    const approvedAmount = result.querySelector('#ks-approved-amount');

    function refreshApprovedData() {
      try {
        const identity = w.KBFlow?.get?.('identity', {}) || {};
        const applicant = w.KBFlow?.get?.('applicant', {}) || {};
        const loan = w.KBFlow?.get?.('loanDetail', {}) || {};
        const liveName = d.getElementById('ks-app-fullname')?.value?.trim() || '';
        const liveAmount = Number(d.getElementById('ks-loan-amount')?.value || 0);
        const fullName = String(liveName || applicant.fullName || identity.fullName || w.sessionStorage?.getItem('kbFullName') || 'Nasabah').trim() || 'Nasabah';
        const rawAmount = liveAmount > 0 ? liveAmount : Number(loan.loanAmount || 0);
        approvedName.textContent = fullName;
        approvedAmount.textContent = rawAmount > 0
          ? new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(rawAmount)
          : '—';
      } catch (_) {
        approvedName.textContent = 'Nasabah';
        approvedAmount.textContent = '—';
      }
    }

    refreshApprovedData();

    const countdown = d.createElement('section');
    countdown.id = 'ks-approval-countdown';
    countdown.hidden = true;
    countdown.setAttribute('aria-labelledby','ks-approval-countdown-title');
    countdown.innerHTML = `
      <div class="ksa-wait-head">
        <div><h4 id="ks-approval-countdown-title">Menunggu hasil persetujuan</h4><p>Tetap di halaman Persetujuan selama waktu tunggu berjalan.</p></div>
        <span id="ks-approval-countdown-time" role="timer" aria-live="off" aria-label="Sisa waktu tunggu">05:00</span>
      </div>
      <div id="ks-approval-countdown-progress" role="progressbar" aria-label="Waktu tunggu berlalu" aria-valuemin="0" aria-valuemax="300" aria-valuenow="0"><i></i></div>
      <p class="ksa-wait-note">Waktu tunggu simulasi: 5 menit. Notifikasi hasil baru muncul setelah 00:00. Ini bukan proses keputusan kredit bank.</p>`;
    result.insertAdjacentElement('beforebegin', countdown);


    // Standalone simulation PIN dialog; never stores or transmits a credential.
    const pinDialog = d.createElement('dialog');
    pinDialog.id = 'ks-approval-pin-dialog';
    pinDialog.setAttribute('aria-labelledby','ks-approval-pin-title');
    pinDialog.setAttribute('aria-describedby','ks-approval-pin-copy ks-approval-pin-safety');
    pinDialog.innerHTML = `
      <header class="ksa-pin-head">
        <div class="ksa-pin-brand"><strong><b>KB</b>star</strong><span class="ksa-pin-badge">SIMULASI</span></div>
        <span class="ksa-pin-lock" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="11" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
        <h2 id="ks-approval-pin-title">Konfirmasi PIN</h2>
        <p id="ks-approval-pin-copy">Masukkan PIN simulasi 6 digit untuk melanjutkan ke tahap menunggu hasil.</p>
      </header>
      <form id="ks-approval-pin-form" class="ksa-pin-body" novalidate autocomplete="off">
        <div class="ksa-pin-label"><label for="ks-approval-pin-input">PIN khusus simulasi</label><span id="ks-approval-pin-count" class="ksa-pin-count">0 / 6 digit</span></div>
        <input id="ks-approval-pin-input" type="password" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="off" spellcheck="false" autocapitalize="off" aria-describedby="ks-approval-pin-safety ks-approval-pin-error" required autofocus>
        <div id="ks-approval-pin-safety" class="ksa-pin-safety"><strong>Jangan gunakan PIN bank Anda.</strong>Gunakan angka fiktif, bukan PIN ATM, PIN KBstar resmi, password, atau OTP. PIN tidak disimpan atau dikirim.</div>
        <p id="ks-approval-pin-error" role="alert" hidden></p>
        <div class="ksa-pin-actions"><button id="ks-approval-pin-cancel" type="button">Batal</button><button id="ks-approval-pin-confirm" class="ksa-pin-primary" type="submit" disabled>Konfirmasi PIN</button></div>
        <p class="ksa-pin-next">Konfirmasi PIN → Menunggu 5 menit → Hasil persetujuan</p>
      </form>`;
    d.body.appendChild(pinDialog);
    const pinForm = d.getElementById('ks-approval-pin-form');
    const pinInput = d.getElementById('ks-approval-pin-input');
    const pinConfirm = d.getElementById('ks-approval-pin-confirm');
    const pinCount = d.getElementById('ks-approval-pin-count');
    const pinError = d.getElementById('ks-approval-pin-error');

    const checks = Array.from(form.querySelectorAll('input[type="checkbox"]'));
    const time = d.getElementById('ks-approval-countdown-time');
    const progress = d.getElementById('ks-approval-countdown-progress');
    const bar = progress.querySelector('i');
    const waitMs = 5 * 60 * 1000;
    let phase = 'idle';
    let deadline = 0;
    let interval = 0;
    let pinTimer = 0;
    let previousOverflow = null;
    let originalConfirmHTML = confirm.innerHTML;
    let buttonLabel = null;

    function clearTimer() {
      if (interval) w.clearInterval(interval);
      interval = 0;
    }

    function closePin() {
      if (pinTimer) w.clearTimeout(pinTimer);
      pinTimer = 0;
      pinInput.value = '';
      pinInput.disabled = false;
      pinConfirm.disabled = true;
      pinConfirm.classList.remove('is-loading');
      pinConfirm.textContent = 'Konfirmasi PIN';
      pinCount.textContent = '0 / 6 digit';
      pinError.hidden = true;
      pinError.textContent = '';
      pinInput.removeAttribute('aria-invalid');
      pinForm.removeAttribute('aria-busy');
      if (pinDialog.open) pinDialog.close();
      if (previousOverflow !== null) d.documentElement.style.overflow = previousOverflow;
      previousOverflow = null;
    }

    function reset({preserveChecks = false, restoreFocus = false} = {}) {
      if (phase === 'idle') return;
      phase = 'idle';
      deadline = 0;
      clearTimer();
      closePin();
      countdown.hidden = true;
      time.textContent = '05:00';
      progress.setAttribute('aria-valuenow','0');
      bar.style.transform = 'scaleX(0)';
      result.hidden = true;
      result.classList.remove('is-visible');
      approval.removeAttribute('aria-busy');
      approval.removeAttribute('data-approval-phase');
      approval.removeAttribute('data-consent-confirmed');
      checks.forEach(el => { if (!preserveChecks) el.checked = false; el.disabled = false; });
      confirm.innerHTML = originalConfirmHTML;
      confirm.disabled = true;
      // Let the existing consent validator decide whether the button can be re-enabled.
      checks[0]?.dispatchEvent(new w.Event('change',{bubbles:true}));
      const consentProgress = d.getElementById('ks-approval-progress');
      if (consentProgress) consentProgress.textContent = checks.filter(el=>el.checked).length + ' dari ' + checks.length + ' pernyataan disetujui';
      if (!approval.hidden && title) title.textContent = 'KBStar · Persetujuan Pengajuan';
      if (status) status.textContent = 'Proses dibatalkan. Periksa data dan konfirmasi persetujuan kembali.';
      if (restoreFocus && !approval.hidden && !confirm.disabled) confirm.focus({preventScroll:true});
    }

    function consentIsCurrent() {
      return !approval.hidden && approval.dataset.consentConfirmed === 'session-only' && checks.every(el => el.checked);
    }

    function openPin() {
      originalConfirmHTML = confirm.innerHTML;
      phase = 'pin';
      checks.forEach(el => { el.disabled = true; });
      approval.dataset.consentConfirmed = 'session-only';
      approval.dataset.approvalPhase = 'pin';
      confirm.disabled = true;
      // A child span avoids the legacy PIN script's direct-text label observer.
      buttonLabel = d.createElement('span');
      buttonLabel.textContent = 'Konfirmasi PIN';
      confirm.replaceChildren(buttonLabel);
      result.hidden = true;
      result.classList.remove('is-visible');
      countdown.hidden = true;
      const existingSuccess = d.getElementById('ks-approval-success');
      if (existingSuccess) existingSuccess.hidden = true;
      const existingError = d.getElementById('ks-approval-error');
      if (existingError) existingError.hidden = true;
      previousOverflow = d.documentElement.style.overflow;
      d.documentElement.style.overflow = 'hidden';
      try {
        pinDialog.showModal();
        pinInput.focus({preventScroll:true});
      } catch {
        reset({preserveChecks:true});
        if (status) status.textContent = 'Dialog PIN tidak dapat dibuka. Coba muat ulang halaman.';
        return;
      }
      if (status) status.textContent = 'Konfirmasi PIN simulasi terlebih dahulu. Waktu tunggu belum dimulai.';
    }

    function startCountdown() {
      if (phase !== 'pin-validating' || !consentIsCurrent()) { reset(); return; }
      phase = 'waiting';
      closePin();
      deadline = w.performance.now() + waitMs;
      approval.dataset.approvalPhase = 'waiting';
      approval.setAttribute('aria-busy','true');
      countdown.hidden = false;
      tick();
      interval = w.setInterval(tick,1000);
      countdown.scrollIntoView({block:'nearest',behavior:w.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      const heading = d.getElementById('ks-approval-countdown-title');
      heading.tabIndex = -1;
      heading.focus({preventScroll:true});
      if (title) title.textContent = 'KBStar · Persetujuan Pengajuan';
      if (status) status.textContent = 'PIN simulasi dikonfirmasi. Waktu tunggu 5 menit dimulai. Tetap di halaman Persetujuan.';
    }

    function tick() {
      if (phase !== 'waiting') return;
      if (!consentIsCurrent()) { reset(); return; }
      // Monotonic deadline: tab throttling or a wall-clock change cannot skip the wait.
      const remainingMs = Math.max(0, deadline - w.performance.now());
      const remaining = Math.ceil(remainingMs / 1000);
      const label = String(Math.floor(remaining / 60)).padStart(2,'0') + ':' + String(remaining % 60).padStart(2,'0');
      if (time.textContent !== label) time.textContent = label;
      buttonLabel.textContent = 'Menunggu ' + label;
      const elapsed = waitMs - remainingMs;
      progress.setAttribute('aria-valuenow',String(Math.floor(elapsed / 1000)));
      bar.style.transform = 'scaleX(' + Math.min(1, elapsed / waitMs) + ')';
      if (remainingMs > 0) return;

      phase = 'complete';
      clearTimer();
      approval.dataset.approvalPhase = 'complete';
      approval.removeAttribute('aria-busy');
      countdown.hidden = true;
      buttonLabel.textContent = '✓ Persetujuan Selesai';
      refreshApprovedData();
      try { w.localStorage?.setItem('kbCompletedApplication','1'); } catch (_) {}
      result.hidden = false;
      result.classList.add('is-visible');
      result.scrollIntoView({block:'nearest',behavior:w.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      if (title) title.textContent = 'KBStar · Persetujuan Disetujui';
      if (status) status.textContent = 'Waktu tunggu simulasi 5 menit selesai. Status simulasi: pinjaman disetujui. Tetap di halaman Persetujuan.';
    }

    d.addEventListener('submit', event => {
      if (event.target !== form || approval.hidden) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (phase !== 'idle' || !checks.length || checks.some(el => !el.checked) || confirm.disabled) return;
      openPin();
    }, true);

    pinInput.addEventListener('input', () => {
      pinInput.value = pinInput.value.replace(/\D/g,'').slice(0,6);
      pinCount.textContent = pinInput.value.length + ' / 6 digit';
      pinError.hidden = true;
      pinInput.removeAttribute('aria-invalid');
      pinConfirm.disabled = phase !== 'pin' || pinInput.value.length !== 6;
    });
    pinForm.addEventListener('submit', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (phase !== 'pin' || !pinDialog.open) return;
      if (!consentIsCurrent()) { reset(); return; }
      if (!/^[0-9]{6}$/.test(pinInput.value)) {
        pinError.textContent = 'Masukkan tepat 6 digit angka khusus simulasi.';
        pinError.hidden = false;
        pinInput.setAttribute('aria-invalid','true');
        pinInput.focus();
        return;
      }
      // Format check only, not bank authentication. Discard the input immediately.
      pinInput.value = '';
      pinCount.textContent = 'PIN simulasi diterima';
      phase = 'pin-validating';
      approval.dataset.approvalPhase = 'pin-validating';
      pinInput.disabled = true;
      pinConfirm.disabled = true;
      pinConfirm.classList.add('is-loading');
      pinConfirm.textContent = 'Memproses';
      pinForm.setAttribute('aria-busy','true');
      pinTimer = w.setTimeout(startCountdown,500);
    });
    function cancelPin() { reset({preserveChecks:true,restoreFocus:true}); }
    d.getElementById('ks-approval-pin-cancel').addEventListener('click',cancelPin);
    pinDialog.addEventListener('cancel', event => { event.preventDefault(); cancelPin(); });
    // Keep keyboard focus in the dialog even when it is hosted inside an iframe.
    pinDialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const items = Array.from(pinDialog.querySelectorAll('input:not(:disabled),button:not(:disabled)'));
      const first = items[0], last = items[items.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && d.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && d.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    pinDialog.addEventListener('close', () => {
      if (!pinDialog.open && (phase === 'pin' || phase === 'pin-validating')) cancelPin();
    });
    d.getElementById('ks-approved-dashboard').addEventListener('click', event => {
      if (phase !== 'complete') event.preventDefault();
    });

    // Leaving, changing the application, or resetting must invalidate a pending/result state.
    const observer = new w.MutationObserver(() => {
      if (phase !== 'idle' && (approval.hidden || approval.dataset.consentConfirmed !== 'session-only')) reset();
    });
    observer.observe(approval,{attributes:true,attributeFilter:['hidden','data-consent-confirmed']});
    root.addEventListener('ks-reset-view',reset);
    d.getElementById('ks-approval-back')?.addEventListener('click',reset,true);
    d.addEventListener('visibilitychange',() => { if (!d.hidden) tick(); });
    w.addEventListener('pagehide',reset);

  }

  frame.addEventListener('load', install);
  if (frame.contentDocument && frame.contentDocument.readyState === 'complete') install();
})();