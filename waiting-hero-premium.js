/* Premium visual enhancement for the existing Menunggu Hasil/Persetujuan hero only. */
(() => {
  'use strict';
  const frame = document.getElementById('app');
  if (!frame) return;

  function install() {
    let d;
    try { d = frame.contentDocument; } catch { return; }
    if (!d || !d.head || !d.body || d.getElementById('ks-waiting-premium-style')) return;

    const style = d.createElement('style');
    style.id = 'ks-waiting-premium-style';
    style.textContent = `
      #ks-waiting-view .ksw-hero{
        --ksw-gold:#ffe34d;
        --ksw-violet:#9f55ff;
        --ksw-deep:#160522;
        min-height:330px;
        border:1px solid rgba(255,225,92,.22);
        background:
          radial-gradient(circle at 78% 28%,rgba(185,102,255,.36),transparent 28%),
          radial-gradient(circle at 18% 88%,rgba(255,206,48,.13),transparent 34%),
          linear-gradient(132deg,#170522 0%,#2d0b50 38%,#56168e 70%,#26083d 100%);
        box-shadow:
          0 28px 70px rgba(37,6,64,.30),
          inset 0 1px 0 rgba(255,255,255,.13),
          inset 0 -28px 70px rgba(9,1,18,.20);
        transform:translateZ(0);
        backface-visibility:hidden;
        will-change:transform,box-shadow;
        animation:kswPremiumBreath 8s cubic-bezier(.4,0,.2,1) infinite;
      }
      #ks-waiting-view .ksw-hero::before{
        inset:auto -8% -46% -8%;
        height:76%;
        border-top:1px solid rgba(255,231,112,.88);
        box-shadow:
          0 -5px 18px rgba(255,218,61,.28),
          0 -20px 64px rgba(255,196,38,.12);
        animation:kswPremiumWave 7.5s cubic-bezier(.45,0,.2,1) infinite;
      }
      #ks-waiting-view .ksw-hero::after{
        inset:-60%;
        background:linear-gradient(112deg,transparent 43%,rgba(255,248,211,.08) 47%,rgba(255,226,111,.30) 50%,rgba(255,248,211,.08) 53%,transparent 57%);
        filter:blur(.2px);
        animation:kswPremiumSweep 9s cubic-bezier(.45,0,.15,1) infinite;
      }
      #ks-waiting-view .ksw-copy{
        text-shadow:0 1px 16px rgba(7,0,17,.24);
        animation:kswPremiumCopy 7s ease-in-out infinite;
      }
      #ks-waiting-view .ksw-chip{
        border-color:rgba(255,235,139,.26);
        background:linear-gradient(135deg,rgba(255,255,255,.13),rgba(255,255,255,.055));
        box-shadow:inset 0 1px 0 rgba(255,255,255,.13),0 8px 26px rgba(17,2,31,.12);
        backdrop-filter:blur(12px);
        -webkit-backdrop-filter:blur(12px);
      }
      #ks-waiting-view .ksw-dot{
        background:#ffe45a;
        box-shadow:0 0 16px rgba(255,228,90,.95);
        animation:kswPremiumPulse 2.4s ease-out infinite;
      }
      #ks-waiting-view h3{
        text-wrap:balance;
        text-shadow:0 5px 28px rgba(12,1,27,.35),0 0 32px rgba(175,89,255,.12);
      }
      #ks-waiting-view .ksw-timer-card{
        overflow:hidden;
        border-color:rgba(255,231,133,.22);
        background:linear-gradient(135deg,rgba(15,2,29,.46),rgba(70,17,105,.28));
        box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 18px 36px rgba(10,1,22,.18);
        backdrop-filter:blur(14px) saturate(125%);
        -webkit-backdrop-filter:blur(14px) saturate(125%);
      }
      #ks-waiting-view .ksw-timer-card::after{
        content:"";
        position:absolute;
        inset:-80% -30%;
        pointer-events:none;
        background:linear-gradient(105deg,transparent 44%,rgba(255,239,163,.18) 50%,transparent 56%);
        transform:translateX(-55%);
        animation:kswTimerShine 6.8s ease-in-out infinite;
      }
      #ks-waiting-time{
        text-shadow:0 0 18px rgba(255,226,63,.42);
      }
      #ks-waiting-view .ksw-orbit{
        filter:drop-shadow(0 16px 30px rgba(10,1,22,.18));
        animation:kswPremiumFloat 6.5s ease-in-out infinite;
        will-change:transform;
      }
      #ks-waiting-view .ksw-ring{
        border-color:rgba(255,229,79,.50);
        box-shadow:inset 0 0 24px rgba(255,223,62,.05),0 0 22px rgba(255,217,46,.08);
        animation-duration:13s;
      }
      #ks-waiting-view .ksw-ring::before,
      #ks-waiting-view .ksw-ring::after{
        content:"";
        position:absolute;
        width:7px;
        height:7px;
        border-radius:50%;
        background:#ffe760;
        box-shadow:0 0 14px rgba(255,231,96,.95);
      }
      #ks-waiting-view .ksw-ring::before{top:-4px;left:50%;transform:translateX(-50%)}
      #ks-waiting-view .ksw-ring::after{bottom:10%;right:8%}
      #ks-waiting-view .ksw-ring.r2{
        border-color:rgba(222,183,255,.44);
        animation-duration:9s;
      }
      #ks-waiting-view .ksw-core{
        background:radial-gradient(circle at 34% 28%,#fff5b6 0%,#ffe457 28%,#ffbf25 72%,#e99a09 100%);
        box-shadow:0 0 0 1px rgba(255,248,197,.35),0 0 28px rgba(255,224,71,.42),0 0 70px rgba(255,185,24,.18);
        animation:kswCoreGlow 3.6s ease-in-out infinite;
      }
      #ks-waiting-view .ksw-progress{
        box-shadow:inset 0 1px 2px rgba(69,32,82,.08);
      }
      #ks-waiting-progress{
        position:relative;
        overflow:hidden;
        box-shadow:0 0 15px rgba(126,43,189,.16);
      }
      #ks-waiting-progress::after{
        content:"";
        position:absolute;
        inset:0;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,.52),transparent);
        transform:translateX(-100%);
        animation:kswProgressShine 3.2s ease-in-out infinite;
      }
      @keyframes kswPremiumBreath{
        0%,100%{transform:translateZ(0) scale(1);box-shadow:0 28px 70px rgba(37,6,64,.30),inset 0 1px 0 rgba(255,255,255,.13),inset 0 -28px 70px rgba(9,1,18,.20)}
        50%{transform:translateZ(0) scale(1.006);box-shadow:0 34px 82px rgba(37,6,64,.36),0 0 48px rgba(135,55,205,.08),inset 0 1px 0 rgba(255,255,255,.15),inset 0 -28px 70px rgba(9,1,18,.20)}
      }
      @keyframes kswPremiumWave{
        0%,100%{transform:rotate(-4deg) translate3d(0,0,0)}
        50%{transform:rotate(-2.5deg) translate3d(1.5%, -9px,0)}
      }
      @keyframes kswPremiumSweep{
        0%,17%{transform:translate3d(-42%,0,0) rotate(0.001deg);opacity:0}
        42%{opacity:.85}
        72%,100%{transform:translate3d(42%,0,0) rotate(0.001deg);opacity:0}
      }
      @keyframes kswPremiumCopy{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-2px,0)}}
      @keyframes kswPremiumPulse{0%{box-shadow:0 0 0 0 rgba(255,228,90,.48),0 0 15px rgba(255,228,90,.85)}70%,100%{box-shadow:0 0 0 11px rgba(255,228,90,0),0 0 18px rgba(255,228,90,.65)}}
      @keyframes kswPremiumFloat{0%,100%{transform:translate3d(0,-50%,0) rotate(.001deg)}50%{transform:translate3d(0,calc(-50% - 7px),0) rotate(.001deg)}}
      @keyframes kswCoreGlow{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.045);filter:brightness(1.08)}}
      @keyframes kswTimerShine{0%,30%{transform:translateX(-58%);opacity:0}52%{opacity:.8}75%,100%{transform:translateX(58%);opacity:0}}
      @keyframes kswProgressShine{0%,30%{transform:translateX(-100%)}70%,100%{transform:translateX(100%)}}
      @media(max-width:700px){
        #ks-waiting-view .ksw-hero{min-height:365px}
        #ks-waiting-view .ksw-orbit{animation-duration:7.5s}
      }
      @media(max-width:430px){
        #ks-waiting-view .ksw-hero{min-height:395px;border-radius:22px;animation-duration:9s}
        #ks-waiting-view .ksw-copy{animation:none}
        #ks-waiting-view .ksw-orbit{filter:drop-shadow(0 12px 22px rgba(10,1,22,.16))}
      }
      @media(prefers-reduced-motion:reduce){
        #ks-waiting-view .ksw-hero,
        #ks-waiting-view .ksw-hero::before,
        #ks-waiting-view .ksw-hero::after,
        #ks-waiting-view .ksw-copy,
        #ks-waiting-view .ksw-dot,
        #ks-waiting-view .ksw-timer-card::after,
        #ks-waiting-view .ksw-orbit,
        #ks-waiting-view .ksw-core,
        #ks-waiting-progress::after{animation:none!important}
      }
    `;
    d.head.appendChild(style);
  }

  frame.addEventListener('load', install);
  if (frame.contentDocument && frame.contentDocument.readyState === 'complete') install();
})();
