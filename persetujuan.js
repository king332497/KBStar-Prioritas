/* Additive consent step for the existing local simulation. No network or persistent storage. */
(() => {
  'use strict';
  const frame = document.getElementById('app');
  if (!frame) return;

  function install() {
    let d;
    try { d = frame.contentDocument; } catch { return; }
    if (!d || !d.defaultView || d.getElementById('ks-approval-view')) return;
    const w = d.defaultView;
    const root = d.getElementById('kbstar-loan-hero');
    const account = d.getElementById('ks-disbursement-account');
    const actions = account && account.querySelector('.ks-disbursement-actions');
    const bank = d.getElementById('ks-disbursement-bank');
    const number = d.getElementById('ks-disbursement-number');
    const owner = d.getElementById('ks-disbursement-name');
    const loan = d.getElementById('ks-loan-information');
    if (!root || !account || !actions || !bank || !number || !owner || !loan) return;

    const tick = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 12 4 4 8-9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const style = d.createElement('style');
    style.id = 'ks-approval-style';
    style.textContent = `
      #ks-approval-view,#ks-approval-view *{box-sizing:border-box}
      #ks-approval-view{padding:26px 32px 30px;color:#48215f;background:linear-gradient(155deg,#fcfaff,#fffcf3);font-family:inherit}
      #ks-approval-view[hidden],#ks-approval-view [hidden],#ks-approval-entry-error[hidden]{display:none!important}
      #ks-approval-view svg,.ks-approval-button svg{display:block;width:20px;height:20px;flex:none}
      #ks-approval-view .ksp-head{display:flex;gap:18px;align-items:center;margin-bottom:23px}
      #ks-approval-view .ksp-icon{display:grid;place-items:center;flex:0 0 56px;height:56px;border-radius:18px;color:#7125b8;background:linear-gradient(145deg,#f0e3ff,#fff8d5);border:1px solid #e4d4f2;box-shadow:0 8px 22px #52206c0c}
      #ks-approval-view .ksp-icon svg{width:28px;height:28px}
      #ks-approval-view .ksp-kicker{display:block;font-size:10px;letter-spacing:1.6px;font-weight:750;color:#886393;margin-bottom:7px}
      #ks-approval-view h3{font-size:clamp(22px,3vw,30px);font-weight:750;line-height:1.22;letter-spacing:-.7px;margin:0;color:#512079}
      #ks-approval-view .ksp-lead{font-size:13px;line-height:1.65;margin:8px 0 0;color:#806b8d}
      #ks-approval-view .ksp-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:start}
      #ks-approval-view .ksp-card{min-width:0;padding:22px;background:#fff;border:1px solid #e9def1;border-radius:18px;box-shadow:0 10px 26px #51206b05}
      #ks-approval-view h4{display:flex;align-items:center;gap:9px;font-size:14px;line-height:1.5;margin:0 0 17px;color:#512079}
      #ks-approval-view .ksp-step{display:grid;place-items:center;width:26px;height:26px;flex:none;border-radius:8px;background:#f3eafa;font-size:10px;color:#7c3baf}
      #ks-approval-view dl{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:15px 16px;margin:0}
      #ks-approval-view dl>div{min-width:0}
      #ks-approval-view dt{font-size:11px;line-height:1.5;color:#8c7897;margin-bottom:4px}
      #ks-approval-view dd{font-size:13px;line-height:1.55;font-weight:650;margin:0;color:#4d2b61;overflow-wrap:anywhere}
      #ks-approval-view .ksp-wide{grid-column:1/-1}
      #ks-approval-view .ksp-payment{padding:14px 15px;border-radius:12px;background:#f0faf5;border:1px solid #d7eedf}
      #ks-approval-view .ksp-payment dd{font-size:19px;color:#137544;letter-spacing:-.4px}
      #ks-approval-view .ksp-account{margin-top:18px;padding-top:17px;border-top:1px solid #f0e7f4}
      #ks-approval-view .ksp-note{font-size:11px;line-height:1.75;color:#8c7897;margin:13px 0 0}
      #ks-approval-view fieldset{padding:0;margin:0;border:0;min-width:0}
      #ks-approval-view legend{padding:0;font-size:12px;color:#806b8d;line-height:1.6;margin-bottom:13px}
      #ks-approval-view .ksp-choice{display:flex;align-items:flex-start;gap:11px;min-height:60px;padding:14px;margin-bottom:10px;border:1px solid #e8ddee;border-radius:12px;font-size:12px;line-height:1.7;color:#755d83;background:#fff;cursor:pointer;transition:background .15s,border-color .15s}
      #ks-approval-view .ksp-choice input{flex:0 0 19px;width:19px;height:19px;margin:2px 0 0;accent-color:#7725bc;cursor:pointer}
      #ks-approval-view .ksp-choice:has(input:checked){border-color:#b7ddc6;background:#f7fcf9}
      #ks-approval-view .ksp-choice strong{display:block;font-size:12px;color:#4d2b61;font-weight:700;margin-bottom:2px}
      #ks-approval-view .ksp-progress{margin:13px 0 0;font-size:11px;color:#8c7897}
      #ks-approval-view .ksp-notice{margin-top:18px;padding:13px 15px;background:#fffaf0;border:1px solid #f0e4c7;border-radius:12px;font-size:11px;color:#8a7138;line-height:1.75}
      #ks-approval-view .ksp-actions{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-top:22px}
      .ks-approval-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:46px;padding:12px 19px;border:1px solid transparent;border-radius:11px;background:#ffe500;color:#4c2e04;font-family:inherit;font-size:12px;font-weight:750;line-height:1.5;cursor:pointer;max-width:100%;white-space:normal}
      .ks-approval-button:hover:not(:disabled){background:#ffed62}
      .ks-approval-button:disabled{background:#f0edf2;color:#9b8ca4;cursor:not-allowed;border-color:#e6dfea;box-shadow:none}
      .ks-approval-button:focus-visible,#ks-approval-view input:focus-visible,#ks-approval-view h3:focus-visible{outline:3px solid #a977d5;outline-offset:3px}
      #ks-approval-view .ksp-secondary{background:#fff;border-color:#e1d2eb;color:#734497}
      #ks-approval-view .ksp-secondary svg{transform:rotate(180deg)}
      #ks-approval-next{margin-left:auto}
      #ks-approval-entry-error,#ks-approval-view .ksp-error{font-size:12px;line-height:1.7;color:#a02f47;margin:12px 0 0}
      #ks-approval-view .ksp-success{display:flex;align-items:flex-start;gap:12px;margin-top:18px;padding:16px;border:1px solid #b7dfc7;border-radius:13px;background:#effaf4;font-size:12px;line-height:1.65;color:#267447}
      #ks-approval-view .ksp-success strong{display:block;color:#116638;font-size:14px;margin-bottom:3px}
      #ks-approval-view .ksp-check{display:grid;place-items:center;width:32px;height:32px;flex:none;border-radius:50%;color:#fff;background:#199b5c;animation:kspCheck .32s ease-out}
      #ks-approval-view .ksp-time{display:block;margin-top:5px;font-size:10px;color:#648774}
      @keyframes kspCheck{from{transform:scale(.8);opacity:.5}to{transform:scale(1);opacity:1}}
      @media(max-width:760px){#ks-approval-view{padding:22px 18px}#ks-approval-view .ksp-layout{grid-template-columns:1fr}#ks-approval-view .ksp-head{gap:12px}#ks-approval-view .ksp-card{padding:19px}}
      @media(max-width:430px){#ks-approval-view{padding:20px 13px}#ks-approval-view .ksp-icon{flex-basis:44px;height:44px;border-radius:14px}#ks-approval-view .ksp-card{padding:16px}#ks-approval-view .ksp-actions{display:grid;grid-template-columns:1fr}#ks-approval-view .ks-approval-button{width:100%}#ks-approval-next{width:100%;margin:0}#ks-approval-view dl{gap:13px 10px}#ks-approval-view .ksp-choice{padding:12px}}
      @media(prefers-reduced-motion:reduce){#ks-approval-view .ksp-check{animation:none}#ks-approval-view .ksp-choice{transition:none}}
    `;

    const panel = d.createElement('section');
    panel.id = 'ks-approval-view';
    panel.hidden = true;
    panel.setAttribute('aria-labelledby', 'ks-approval-title');
    panel.innerHTML = `
      <header class="ksp-head">
        <span class="ksp-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" stroke="currentColor" stroke-width="1.6"/><path d="M14 3v6h6m-12 6 2 2 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <div><span class="ksp-kicker">TINJAU & KONFIRMASI</span><h3 id="ks-approval-title" tabindex="-1">Persetujuan Pengajuan</h3><p class="ksp-lead">Periksa kembali ringkasan Anda sebelum memberikan persetujuan.</p></div>
      </header>
      <div class="ksp-layout">
        <section class="ksp-card" aria-labelledby="ks-approval-summary-title">
          <h4 id="ks-approval-summary-title"><span class="ksp-step">01</span>Ringkasan pengajuan</h4>
          <dl>
            <div class="ksp-wide"><dt>Nama lengkap pemohon</dt><dd data-ksp="applicant">—</dd></div>
            <div class="ksp-wide"><dt>Jenis produk pinjaman</dt><dd data-ksp="product">—</dd></div>
            <div><dt>Nominal pinjaman</dt><dd data-ksp="amount">—</dd></div>
            <div><dt>Tenor</dt><dd data-ksp="tenor">—</dd></div>
            <div class="ksp-wide"><dt>Suku bunga</dt><dd data-ksp="interest">—</dd></div>
            <div class="ksp-wide ksp-payment"><dt>Estimasi cicilan</dt><dd data-ksp="installment">—</dd></div>
            <div><dt>Estimasi total bunga</dt><dd data-ksp="totalInterest">—</dd></div>
            <div><dt>Estimasi total pembayaran</dt><dd data-ksp="totalPayment">—</dd></div>
          </dl>
          <dl class="ksp-account">
            <div><dt>Bank tujuan</dt><dd data-ksp="bank">—</dd></div>
            <div><dt>Nomor rekening</dt><dd data-ksp="account">—</dd></div>
            <div class="ksp-wide"><dt>Nama pemilik rekening</dt><dd data-ksp="owner">—</dd></div>
          </dl>
          <p class="ksp-note">Nomor rekening disamarkan. Gunakan tombol kembali untuk memperbaiki data rekening.</p>
        </section>
        <section class="ksp-card" aria-labelledby="ks-approval-statements-title">
          <h4 id="ks-approval-statements-title"><span class="ksp-step">02</span>Pernyataan persetujuan</h4>
          <form id="ks-approval-form" novalidate>
            <fieldset><legend>Centang setiap pernyataan setelah Anda membacanya.</legend>
              <label class="ksp-choice"><input id="ks-approval-data" type="checkbox" required><span><strong>Data telah saya periksa</strong>Saya telah meninjau nama pemohon, rekening tujuan, dan seluruh rincian pengajuan pada ringkasan ini.</span></label>
              <label class="ksp-choice"><input id="ks-approval-estimate" type="checkbox" required><span><strong>Memahami estimasi pinjaman</strong>Saya memahami bahwa cicilan dan total pembayaran merupakan estimasi, belum termasuk biaya lain dan ketentuan khusus produk.</span></label>
              <label class="ksp-choice"><input id="ks-approval-simulation" type="checkbox" required><span><strong>Memahami status pengajuan</strong>Saya memahami bahwa halaman ini adalah simulasi independen, bukan persetujuan kredit, perjanjian bank, atau jaminan pencairan dana.</span></label>
            </fieldset>
            <p class="ksp-progress" id="ks-approval-progress" role="status">0 dari 3 pernyataan disetujui</p>
            <p class="ksp-error" id="ks-approval-error" role="alert" hidden></p>
          </form>
          <div class="ksp-notice"><strong>Persetujuan untuk sesi ini saja.</strong><br>Data tidak dikirim ke bank. Persetujuan tidak disimpan permanen dan akan diulang jika halaman dimuat ulang atau data pengajuan berubah.</div>
          <div class="ksp-success" id="ks-approval-success" role="status" hidden><span class="ksp-check">${tick}</span><div><strong>Persetujuan dicatat untuk sesi ini</strong>Belum ada pengiriman pengajuan ke bank atau keputusan kredit.<span class="ksp-time" id="ks-approval-time"></span></div></div>
        </section>
      </div>
      <div class="ksp-actions"><button class="ks-approval-button ksp-secondary" id="ks-approval-back" type="button">${arrow}Kembali ke Rekening</button><button class="ks-approval-button" id="ks-approval-confirm" type="submit" form="ks-approval-form" disabled>Konfirmasi Persetujuan${arrow}</button></div>
    `;
    const next = d.createElement('button');
    next.id = 'ks-approval-next';
    next.type = 'button';
    next.className = 'ks-approval-button';
    next.setAttribute('aria-controls', panel.id);
    next.innerHTML = 'Lanjut ke Persetujuan' + arrow;
    const entryError = d.createElement('p');
    entryError.id = 'ks-approval-entry-error';
    entryError.setAttribute('role', 'alert');
    entryError.hidden = true;
    next.setAttribute('aria-describedby', entryError.id);
    d.head.appendChild(style);
    account.insertAdjacentElement('afterend', panel);
    actions.appendChild(next);
    actions.insertAdjacentElement('afterend', entryError);

    const form = panel.querySelector('form');
    const checks = Array.from(form.querySelectorAll('input[type="checkbox"]'));
    const confirm = d.getElementById('ks-approval-confirm');
    const success = d.getElementById('ks-approval-success');
    const error = d.getElementById('ks-approval-error');
    const progress = d.getElementById('ks-approval-progress');
    const title = d.querySelector('.ki-view-title');
    const status = root.querySelector('.ks-status');
    const value = id => (d.getElementById(id)?.value || '').trim();
    const text = id => d.getElementById(id)?.textContent.trim() || '—';
    const fields = Array.from(root.querySelectorAll('.ks-application-form input,.ks-application-form select,.ks-application-form textarea,#ks-verification-view input,.ks-document-input,.ks-loan-information input,.ks-loan-information select,.ks-disbursement-form input'));
    let snapshot = '';
    let accepted = false;
    let active = false;

    function fingerprint() {
      return JSON.stringify(fields.map(el => [el.id, el.type === 'file' ? Array.from(el.files || []).map(f => [f.name, f.size, f.lastModified]) : el.value]));
    }
    function selected(id) {
      const el = d.getElementById(id);
      return Boolean(el && el.value && el.selectedOptions[0] && !el.selectedOptions[0].disabled);
    }
    function validation() {
      if (!selected('ks-loan-product') || !selected('ks-loan-amount') || !selected('ks-loan-tenor')) return { message:'Lengkapi pilihan produk, nominal, dan tenor pada Informasi Pinjaman.', target:d.getElementById('ks-back-to-loan-information') };
      if (bank.value !== 'KB BANK') return { message:'Bank tujuan harus KB BANK.', target:bank };
      if (!/^\d{12}$/.test(number.value)) return { message:'Nomor rekening harus terdiri dari tepat 12 digit angka.', target:number };
      if (owner.value.trim().length < 2) return { message:'Lengkapi nama pemilik rekening terlebih dahulu.', target:owner };
      return null;
    }
    function renderSummary() {
      const summary = {
        applicant:value('ks-app-fullname') || value('ks-demo-fullname') || 'Belum diisi',
        product:text('ks-summary-product'), amount:text('ks-summary-amount'),
        tenor:text('ks-summary-tenor'), interest:text('ks-summary-interest'),
        installment:text('ks-summary-installment'), totalInterest:text('ks-summary-total-interest'),
        totalPayment:text('ks-summary-total-payment'), bank:bank.value,
        account:/^\d{12}$/.test(number.value) ? '•••• •••• ' + number.value.slice(-4) : 'Belum lengkap',
        owner:owner.value.trim() || 'Belum diisi'
      };
      panel.querySelectorAll('[data-ksp]').forEach(el => { el.textContent = summary[el.dataset.ksp]; });
    }
    function updateControls() {
      const count = checks.filter(el => el.checked).length;
      progress.textContent = count + ' dari ' + checks.length + ' pernyataan disetujui';
      confirm.disabled = accepted || count !== checks.length || Boolean(validation());
    }
    function clearConsent() {
      accepted = false;
      checks.forEach(el => { el.checked = false; el.disabled = false; });
      success.hidden = true;
      panel.removeAttribute('data-consent-confirmed');
      d.getElementById('ks-approval-time').textContent = '';
      error.hidden = true;
      error.textContent = '';
      confirm.innerHTML = 'Konfirmasi Persetujuan' + arrow;
      updateControls();
    }
    function changed() {
      if (!active) return;
      const current = fingerprint();
      if (current === snapshot) return;
      snapshot = current;
      clearConsent();
      renderSummary();
      error.textContent = 'Data pengajuan berubah. Periksa ringkasan terbaru dan berikan persetujuan kembali.';
      error.hidden = false;
    }
    function focusView() {
      d.getElementById('ks-approval-title').focus({preventScroll:true});
      root.querySelector('.ks-header')?.scrollIntoView({block:'start', behavior:'instant'});
    }
    next.addEventListener('click', () => {
      if (account.hidden || !account.getClientRects().length || active) return;
      const issue = validation();
      entryError.hidden = !issue;
      if (issue) {
        entryError.textContent = issue.message;
        issue.target.focus({preventScroll:true});
        issue.target.scrollIntoView({block:'center', behavior:'instant'});
        return;
      }
      clearConsent();
      snapshot = fingerprint();
      renderSummary();
      active = true;
      account.hidden = true;
      panel.hidden = false;
      if (title) title.textContent = 'KBStar · Persetujuan Pengajuan';
      if (status) status.textContent = 'Halaman Persetujuan Pengajuan dibuka.';
      focusView();
    });
    d.getElementById('ks-approval-back').addEventListener('click', () => {
      active = false;
      panel.hidden = true;
      clearConsent();
      account.hidden = false;
      if (title) title.textContent = 'KBStar · Rekening Pencairan';
      next.focus({preventScroll:true});
      if (status) status.textContent = 'Kembali ke Rekening Pencairan. Data isian tetap tersimpan pada sesi ini.';
    });
    checks.forEach(el => el.addEventListener('change', updateControls));
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!active || accepted) return;
      if (fingerprint() !== snapshot) { changed(); return; }
      const issue = validation();
      if (issue || checks.some(el => !el.checked)) {
        error.textContent = issue ? issue.message : 'Baca dan centang semua pernyataan sebelum mengonfirmasi.';
        error.hidden = false;
        checks.find(el => !el.checked)?.focus();
        updateControls();
        return;
      }
      accepted = true;
      checks.forEach(el => { el.disabled = true; });
      panel.dataset.consentConfirmed = 'session-only';
      confirm.innerHTML = tick + 'Persetujuan Dicatat';
      success.hidden = false;
      error.hidden = true;
      d.getElementById('ks-approval-time').textContent = 'Waktu perangkat: ' + new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeStyle:'short'}).format(new Date());
      updateControls();
      success.scrollIntoView({block:'nearest', behavior:'instant'});
      if (status) status.textContent = 'Persetujuan dicatat untuk sesi browser ini. Belum dikirim ke bank.';
    });
    fields.forEach(el => {
      el.addEventListener('input', changed);
      el.addEventListener('change', changed);
    });
    function reset() {
      active = false;
      panel.hidden = true;
      entryError.hidden = true;
      snapshot = '';
      clearConsent();
    }
    root.addEventListener('ks-reset-view', reset);
    // Existing navigation owns the original views; close the additive step when it opens one.
    const originalViews = Array.from(root.querySelectorAll('.ks-hero,#ks-application-login,#ks-verification-view,#ks-code-view,#ks-loan-calculator,#ks-supporting-documents,#ks-loan-information,#ks-disbursement-account'));
    const routeObserver = new w.MutationObserver(() => {
      if (active && originalViews.some(el => !el.hidden)) reset();
    });
    originalViews.forEach(el => routeObserver.observe(el,{attributes:true,attributeFilter:['hidden']}));
    const summaryObserver = new w.MutationObserver(() => { if (active) { changed(); renderSummary(); } });
    const sourceSummary = loan.querySelector('.ks-loan-summary');
    if (sourceSummary) summaryObserver.observe(sourceSummary,{subtree:true,childList:true,characterData:true});
    w.addEventListener('pagehide', () => { routeObserver.disconnect(); summaryObserver.disconnect(); },{once:true});
    updateControls();
  }
  frame.addEventListener('load', install);
  if (frame.contentDocument && frame.contentDocument.readyState === 'complete') install();
})();
