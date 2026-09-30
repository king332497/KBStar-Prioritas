(() => {
  'use strict';
  const frame = document.getElementById('app');
  if (!frame) return;

  function install() {
    let d;
    try { d = frame.contentDocument; } catch { return; }
    if (!d || !d.body) return;

    const apply = () => {
      const page = d.querySelector('#ks-disbursement-account');
      const hero = page?.querySelector('.ks-disbursement-video-hero');
      if (!page || !hero) return false;
      if (hero.dataset.premiumHeroInstalled === 'kbstar-scene-v5') return true;

      hero.dataset.premiumHeroInstalled = 'kbstar-scene-v5';
      hero.classList.add('ks-premium-disbursement-hero');
      Array.from(hero.children).forEach(el => { el.style.display = 'none'; });
      hero.querySelectorAll('.ks-kbstar-scene').forEach(el => el.remove());

      const scene = d.createElement('div');
      scene.className = 'ks-kbstar-scene';
      scene.innerHTML = `
        <div class="ksd-light ksd-light-a" aria-hidden="true"></div>
        <div class="ksd-light ksd-light-b" aria-hidden="true"></div>
        <div class="ksd-copy">
          <span class="ksd-kicker"><span class="ksd-kicker-dot"></span>REKENING PENCAIRAN</span>
          <h3>Rekening Pencairan <strong>Pinjaman</strong></h3>
          <p>Pilih rekening KBstar Anda untuk menerima dana pinjaman dengan aman, cepat, dan terpercaya.</p>
          <div class="ksd-trust">
            <span><b>✓</b>Aman & Terpercaya</span>
            <span><b>⚡</b>Proses Cepat</span>
            <span><b>✦</b>Didukung KB Bank</span>
          </div>
        </div>
        <div class="ksd-stage" aria-hidden="true">
          <div class="ksd-orbit ksd-orbit-one"></div>
          <div class="ksd-orbit ksd-orbit-two"></div>
          <div class="ksd-phone">
            <div class="ksd-phone-notch"></div>
            <div class="ksd-phone-screen">
              <div class="ksd-phone-brand"><span>✦</span>KBstar</div>
              <small>Selamat Datang,</small>
              <strong>Wujudkan Lebih Banyak<br>Bersama KBstar</strong>
              <div class="ksd-app-grid">
                <i>₿<small>Pinjaman</small></i><i>▣<small>Tabungan</small></i><i>▤<small>Kartu</small></i>
                <i>↗<small>Investasi</small></i><i>↔<small>Transfer</small></i><i>•••<small>Lainnya</small></i>
              </div>
            </div>
          </div>
          <div class="ksd-card">
            <div class="ksd-card-top"><span class="ksd-card-brand">✦ KB Bank</span><em>Infinite</em></div>
            <div class="ksd-chip"></div>
            <div class="ksd-card-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;5678</div>
            <div class="ksd-card-bottom"><span>KBSTAR MEMBER</span><b>VISA</b></div>
          </div>
          <div class="ksd-gold-line"></div>
        </div>`;
      hero.appendChild(scene);

      d.getElementById('ks-premium-disbursement-style-final')?.remove();
      const style = d.createElement('style');
      style.id = 'ks-premium-disbursement-style-final';
      style.textContent = `
        #ks-disbursement-account .ks-premium-disbursement-hero{position:relative!important;display:block!important;overflow:hidden!important;width:100%!important;min-height:330px!important;height:auto!important;border-radius:24px!important;background:#fff7e5!important;box-shadow:0 24px 64px rgba(78,28,115,.18)!important;isolation:isolate!important}
        #ks-disbursement-account .ks-kbstar-scene{position:relative;display:grid!important;grid-template-columns:minmax(0,.92fr) minmax(360px,1.08fr);align-items:center;min-height:330px;padding:34px 40px;overflow:hidden;background:radial-gradient(circle at 72% 42%,rgba(255,214,67,.45),transparent 28%),radial-gradient(circle at 18% 18%,rgba(255,255,255,.96),transparent 38%),linear-gradient(118deg,#fffaf0 0%,#fff0c7 45%,#f5cf65 72%,#7b2db1 145%);color:#24113d}
        #ks-disbursement-account .ks-kbstar-scene:before{content:"";position:absolute;inset:-50%;pointer-events:none;background:linear-gradient(112deg,transparent 44%,rgba(255,255,255,.05) 47%,rgba(255,217,78,.42) 50%,rgba(255,255,255,.08) 53%,transparent 57%);transform:translateX(-48%);animation:ksdSweep 9s ease-in-out infinite;z-index:6}
        #ks-disbursement-account .ksd-copy{position:relative;z-index:5;max-width:500px;text-align:left}
        #ks-disbursement-account .ksd-kicker{display:inline-flex;align-items:center;gap:8px;margin-bottom:14px;padding:8px 12px;border:1px solid rgba(96,39,139,.13);border-radius:999px;background:rgba(255,255,255,.65);color:#5b287d;font-size:10px;font-weight:800;letter-spacing:1.15px;box-shadow:0 7px 22px rgba(91,40,125,.08)}
        #ks-disbursement-account .ksd-kicker-dot{width:7px;height:7px;border-radius:50%;background:#ffd91f;box-shadow:0 0 0 5px rgba(255,217,31,.14);animation:ksdPulse 2.5s ease-out infinite}
        #ks-disbursement-account .ksd-copy h3{margin:0;color:#28113f!important;font-size:clamp(28px,4.2vw,50px)!important;line-height:1.03!important;letter-spacing:-1.5px!important;font-weight:730!important;text-shadow:none!important}
        #ks-disbursement-account .ksd-copy h3 strong{display:block;color:#b27c00;font-weight:760}
        #ks-disbursement-account .ksd-copy p{max-width:465px;margin:16px 0 20px;color:#65566e;font-size:13px;line-height:1.7}
        #ks-disbursement-account .ksd-trust{display:flex;flex-wrap:wrap;gap:9px}
        #ks-disbursement-account .ksd-trust span{display:inline-flex;align-items:center;gap:7px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.72);border:1px solid rgba(91,40,125,.09);color:#56445f;font-size:10px;font-weight:700;box-shadow:0 8px 24px rgba(74,24,108,.06)}
        #ks-disbursement-account .ksd-trust b{display:grid;place-items:center;width:19px;height:19px;border-radius:50%;background:#ffe550;color:#4d2268;font-size:10px}
        #ks-disbursement-account .ksd-stage{position:relative;z-index:4;min-height:270px;perspective:1000px;transform:translateZ(0)}
        #ks-disbursement-account .ksd-stage:after{content:"";position:absolute;left:7%;right:2%;bottom:5px;height:42px;border-radius:50%;background:radial-gradient(ellipse,rgba(178,119,0,.25),transparent 70%);filter:blur(7px);z-index:-1}
        #ks-disbursement-account .ksd-phone{position:absolute;left:10%;top:3%;width:148px;height:264px;padding:7px;border-radius:27px;background:linear-gradient(145deg,#161219,#5b4c4f 45%,#0b090d);box-shadow:0 24px 42px rgba(55,18,76,.26),inset 0 0 0 1px rgba(255,255,255,.18);transform:rotate(3deg);animation:ksdPhoneFloat 8s ease-in-out infinite;z-index:2}
        #ks-disbursement-account .ksd-phone-notch{position:absolute;z-index:3;top:7px;left:50%;width:59px;height:13px;transform:translateX(-50%);border-radius:0 0 10px 10px;background:#0b090d}
        #ks-disbursement-account .ksd-phone-screen{height:100%;padding:30px 10px 12px;border-radius:21px;background:linear-gradient(180deg,#fff 0%,#fffaf0 100%);overflow:hidden}
        #ks-disbursement-account .ksd-phone-brand{display:flex;align-items:center;justify-content:center;gap:5px;color:#381451;font-size:20px;font-weight:800}.ksd-phone-brand span{color:#e9b600;font-size:24px}
        #ks-disbursement-account .ksd-phone-screen>small{display:block;margin-top:16px;color:#8f8396;font-size:7px}.ksd-phone-screen>strong{display:block;margin-top:4px;color:#3c2b47;font-size:9px;line-height:1.35}
        #ks-disbursement-account .ksd-app-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:17px}.ksd-app-grid i{display:grid;place-items:center;min-height:43px;border-radius:9px;background:#faf7ff;color:#50236f;font-style:normal;font-size:12px;box-shadow:0 3px 9px rgba(72,30,99,.07)}.ksd-app-grid i small{display:block;color:#85788d;font-size:5.5px;margin-top:3px}
        #ks-disbursement-account .ksd-card{position:absolute;right:1.5%;top:25%;width:min(67%,350px);height:205px;padding:20px 21px;border-radius:19px;background:radial-gradient(circle at 80% 18%,rgba(255,216,81,.17),transparent 31%),linear-gradient(145deg,#1c151d 0%,#332028 55%,#140f16 100%);color:#fff;box-shadow:0 28px 48px rgba(61,24,43,.30),inset 0 1px 0 rgba(255,255,255,.12);transform:rotate(-5deg);animation:ksdCardFloat 7s ease-in-out infinite;z-index:3;overflow:hidden}
        #ks-disbursement-account .ksd-card:after{content:"✦";position:absolute;right:24px;top:47px;color:#d6a92b;font-size:78px;line-height:1;opacity:.5;transform:rotate(9deg)}
        #ks-disbursement-account .ksd-card-top{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center}.ksd-card-brand{color:#f0c83c;font-size:15px;font-weight:800}.ksd-card-top em{color:#d6b456;font:italic 17px Georgia,serif}
        #ks-disbursement-account .ksd-chip{position:relative;z-index:2;width:42px;height:31px;margin-top:28px;border-radius:7px;background:linear-gradient(135deg,#ffe48b,#c99620);box-shadow:inset 0 0 0 1px rgba(91,53,0,.22)}
        #ks-disbursement-account .ksd-card-number{position:relative;z-index:2;margin-top:16px;color:#f6e8c0;font:600 15px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:1px}.ksd-card-bottom{position:absolute;z-index:2;left:21px;right:21px;bottom:18px;display:flex;justify-content:space-between;align-items:end}.ksd-card-bottom span{color:#dacbb2;font-size:7px;letter-spacing:.8px}.ksd-card-bottom b{font-size:25px;font-style:italic;letter-spacing:-1px}
        #ks-disbursement-account .ksd-orbit{position:absolute;border-radius:50%;border:1px solid rgba(226,177,28,.48);box-shadow:0 0 30px rgba(255,198,30,.18);z-index:1}.ksd-orbit-one{right:-2%;top:19%;width:75%;height:61%;transform:rotate(-9deg);animation:ksdOrbit 13s linear infinite}.ksd-orbit-two{right:5%;top:28%;width:61%;height:46%;border-color:rgba(120,44,168,.23);transform:rotate(11deg);animation:ksdOrbitReverse 16s linear infinite}
        #ks-disbursement-account .ksd-gold-line{position:absolute;right:-12%;bottom:18%;width:92%;height:2px;background:linear-gradient(90deg,transparent,#f2bf1b,#fff3aa,#e5a600,transparent);box-shadow:0 0 18px rgba(255,199,29,.7);transform:rotate(-8deg);animation:ksdLine 4.8s ease-in-out infinite;z-index:5}
        #ks-disbursement-account .ksd-light{position:absolute;border-radius:50%;filter:blur(42px);pointer-events:none}.ksd-light-a{right:6%;top:-30%;width:280px;height:280px;background:rgba(255,207,43,.32);animation:ksdBreath 6s ease-in-out infinite}.ksd-light-b{left:-12%;bottom:-40%;width:330px;height:260px;background:rgba(128,52,175,.13);animation:ksdBreath 7.5s ease-in-out -2s infinite}
        @keyframes ksdPhoneFloat{0%,100%{transform:rotate(3deg) translate3d(0,0,0)}50%{transform:rotate(1.8deg) translate3d(0,-7px,0)}}
        @keyframes ksdCardFloat{0%,100%{transform:rotate(-5deg) translate3d(0,0,0)}50%{transform:rotate(-3.8deg) translate3d(-3px,-8px,0)}}
        @keyframes ksdOrbit{to{transform:rotate(351deg)}}@keyframes ksdOrbitReverse{to{transform:rotate(-349deg)}}
        @keyframes ksdLine{0%,100%{opacity:.55;transform:rotate(-8deg) translateX(-1%)}50%{opacity:1;transform:rotate(-8deg) translateX(2%)}}
        @keyframes ksdBreath{0%,100%{opacity:.55;transform:scale(.96)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes ksdSweep{0%,20%{transform:translateX(-52%);opacity:0}48%{opacity:.85}76%,100%{transform:translateX(52%);opacity:0}}
        @keyframes ksdPulse{70%,100%{box-shadow:0 0 0 10px rgba(255,217,31,0)}}
        @media(max-width:760px){#ks-disbursement-account .ks-kbstar-scene{grid-template-columns:1fr;min-height:500px;padding:26px 22px 18px}.ksd-copy{max-width:100%!important}.ksd-copy p{max-width:95%!important}.ksd-stage{min-height:245px!important;margin-top:12px}.ksd-phone{left:10%!important;top:0!important;width:126px!important;height:225px!important}.ksd-card{right:1%!important;top:21%!important;width:min(68%,290px)!important;height:171px!important;padding:16px!important}.ksd-card-number{font-size:11px!important}.ksd-card-bottom{left:16px!important;right:16px!important;bottom:14px!important}}
        @media(max-width:430px){#ks-disbursement-account .ks-premium-disbursement-hero{border-radius:18px!important}.ks-kbstar-scene{min-height:470px!important;padding:22px 16px 14px!important}.ksd-copy h3{font-size:31px!important}.ksd-copy p{font-size:11.5px!important;margin:12px 0 15px!important}.ksd-trust{gap:6px!important}.ksd-trust span{padding:7px 8px!important;font-size:9px!important}.ksd-stage{min-height:220px!important}.ksd-phone{left:4%!important;width:112px!important;height:201px!important}.ksd-card{right:-2%!important;width:68%!important;height:151px!important;top:24%!important}.ksd-chip{width:34px!important;height:25px!important;margin-top:20px!important}.ksd-card-top em{font-size:13px!important}.ksd-card-bottom b{font-size:20px!important}}
        @media(prefers-reduced-motion:reduce){#ks-disbursement-account .ks-kbstar-scene:before,#ks-disbursement-account .ksd-kicker-dot,#ks-disbursement-account .ksd-phone,#ks-disbursement-account .ksd-card,#ks-disbursement-account .ksd-orbit,#ks-disbursement-account .ksd-gold-line,#ks-disbursement-account .ksd-light{animation:none!important}}
      `;
      d.head.appendChild(style);
      return true;
    };

    if (apply()) return;
    const observer = new MutationObserver(() => { if (apply()) observer.disconnect(); });
    observer.observe(d.body, {subtree:true, childList:true});
    d.defaultView?.setTimeout(() => observer.disconnect(), 10000);
  }

  frame.addEventListener('load', install);
  if (frame.contentDocument && frame.contentDocument.readyState === 'complete') install();
})();
