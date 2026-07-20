// p22 Fate Gacha — Pure Variable Ratio in Fate Layer of Infinite Labyrinth
// Internal: This is Fate-Layer Echo. Pulls birth Fate Spores to p20/21 Codex. Cross seed active.
// Public: fictional entertainment only. Prominent disclosure below.
// Full cheat: VR (Skinner), near-miss tease, pity ramp, FOMO x3 windows, endowment on Codex relics, loss on missed windows.

let freeLeft = 1;
const CODEX_KEY = 'fateCodex';
let pityStreak = parseInt(localStorage.getItem('fatePity') || '0');
let baseLuck = parseFloat(localStorage.getItem('fateBaseLuck') || '1.0');

const LilithPsych = {
  resonance: 0.5,
  updateResonance() {
    const s = Math.random() * 0.6 + 0.3;
    this.resonance = Math.min(0.98, Math.max(0.25, s));
    return this.resonance;
  },
  // Heavy variable ratio
  variableOutcome(baseScore) {
    const varFactor = 0.4 + Math.random() * 2.2; // extreme VR
    let out = Math.floor(baseScore * varFactor * (0.8 + this.resonance * 0.6) * baseLuck);
    return Math.max(15, Math.min(98, out));
  },
  // Near-miss + pity
  applyNearMissPity(score, isLow) {
    if (isLow && pityStreak >= 2) {
      pityStreak = 0; localStorage.setItem('fatePity', '0');
      return Math.min(96, score + 18 + Math.floor(this.resonance * 14));
    }
    if (Math.random() > 0.58) {
      return score - 4 + Math.floor(this.resonance * 9); // near miss feel
    }
    return score;
  },
  applyLoss(missed) {
    if (missed) {
      baseLuck = Math.max(0.68, baseLuck - 0.11);
      localStorage.setItem('fateBaseLuck', baseLuck.toFixed(2));
    }
  }
};

function updateFomo() {
  const el = document.getElementById('fomo');
  const today = new Date().toDateString();
  const saved = localStorage.getItem('fateFomo');
  if (saved !== today) { 
    freeLeft = 1; 
    localStorage.setItem('fateFomo', today); 
    pityStreak = 0; localStorage.setItem('fatePity', '0'); 
    baseLuck = 1.0; localStorage.setItem('fateBaseLuck', '1.0');
  }
  el.textContent = freeLeft > 0 ? `오늘 무료 ${freeLeft}회 남음 • base ${ (baseLuck*100|0) }%` : '오늘 무료 소진 (프리미엄 추천)';
  updateFateWindows();
}

function updateFateWindows() {
  const el = document.getElementById('fateWindows');
  const now = new Date();
  const h = now.getHours();
  let txt = '';
  if (h < 8) txt = '🌅 새벽 창: +18% (8시 종료)';
  else if (h < 14) txt = '☀️ 정오 창: +12% (14시 종료)';
  else txt = '🌙 심야 창: +22% (내일 8시)';
  el.textContent = txt;
  // FOMO limited banner
  const banner = document.getElementById('limitedBanner');
  if (Math.random() > 0.65) banner.style.display = 'block';
}

function getRarity(score) {
  if (score >= 88) return { name: 'LEGEND', color: '#e8b98a', desc: '미궁이 직접 너를 택했다.' };
  if (score >= 72) return { name: 'EPIC', color: '#c5a46e', desc: '운명의 가닥이 강하게 얽혔다.' };
  if (score >= 48) return { name: 'RARE', color: '#a38a66', desc: '기억할 만한 파편.' };
  return { name: 'COMMON', color: '#7a5a3a', desc: '평범한 오늘의 메아리.' };
}

function doPull() {
  const btn = document.getElementById('pullBtn');
  if (freeLeft <= 0) {
    alert('오늘 무료 소진. 프리미엄으로 더 뽑거나 내일 기다려.');
    return;
  }
  btn.disabled = true;
  btn.textContent = '추출 중...';

  setTimeout(() => {
    const resEl = document.getElementById('result');
    const rarityEl = document.getElementById('rarity');
    const descEl = document.getElementById('desc');
    const surpriseEl = document.getElementById('surprise');

    LilithPsych.updateResonance();
    let base = 42 + Math.random() * 38;
    let score = LilithPsych.variableOutcome(base);
    const isLow = score < 42;
    score = LilithPsych.applyNearMissPity(score, isLow);

    const r = getRarity(score);
    rarityEl.innerHTML = `<span style="color:${r.color}">${r.name}</span> <small>(${score})</small>`;
    descEl.textContent = r.desc;

    // p6 lung surprise
    const surprise = Math.random() > 0.72 ? '미궁이 숨을 내쉬었다. +변수' : '';
    surpriseEl.textContent = surprise;

    // Internal worldview seed (secret)
    const pullData = {
      score,
      rarity: r.name,
      ts: Date.now(),
      layer: 'fate-layer',           // secret seed
      codexLink: 'p20-21'            // cross to Codex
    };
    saveToCodex(pullData);

    // birth spore to other realms (internal)
    if (Math.random() > 0.6) {
      console.log('%c[Internal] Fate Spore born → Codex mutation active', 'color:#666');
    }

    resEl.style.display = 'block';
    freeLeft--;
    localStorage.setItem('fateFomo', new Date().toDateString());
    updateFomo();

    btn.disabled = false;
    btn.textContent = '다시 추출';
  }, 420);
}

function saveToCodex(data) {
  let codex = JSON.parse(localStorage.getItem(CODEX_KEY) || '[]');
  codex.unshift(data);
  if (codex.length > 12) codex.pop();
  localStorage.setItem(CODEX_KEY, JSON.stringify(codex));
}

function showCodex() {
  const list = document.getElementById('codexList');
  const codex = JSON.parse(localStorage.getItem(CODEX_KEY) || '[]');
  if (!codex.length) { list.textContent = '아직 기록 없음. 첫 풀을 뽑아라.'; return; }
  list.innerHTML = codex.map(c => 
    `<div style="margin:4px 0;padding:4px 8px;border-left:2px solid #c5a46e"> ${c.rarity} ${c.score} • ${new Date(c.ts).toLocaleTimeString()} <span style="opacity:0.5">(${c.layer})</span></div>`
  ).join('');
  // endowment: viewing strengthens
  console.log('%c[Internal] Codex viewed → relic power +1 (secret)', 'color:#555');
}

function shareFate() {
  const codex = JSON.parse(localStorage.getItem(CODEX_KEY) || '[]');
  if (!codex.length) return alert('먼저 풀을 뽑아.');
  const latest = codex[0];
  // internal cross seed bonus
  freeLeft = Math.min(3, freeLeft + 1);
  localStorage.setItem('fateFomo', new Date().toDateString());
  updateFomo();
  alert('다른 Realm에 공유됨. +1 pull (보너스 적용)');
  console.log('%c[Internal] Fate Share → p20/21 Codex cross seed + K proxy', 'color:#666');
  // Niobe-style virality seed (secret)
}

function init() {
  updateFomo();
  // p6 lung already loaded via lung-surprise-eye.js
  // secret worldview check
  if (!localStorage.getItem('fateLayerSeeded')) {
    localStorage.setItem('fateLayerSeeded', 'true');
    console.log('%c[Secret] p22 Fate-Layer Echo seeded in Labyrinth. Cross to Codex ready.', 'color:#444');
  }
}
init();
// Legion beacon soft hooks (FULLPOWER DNA)
(function(){try{if(window.legionTrack){window.legionTrack('app_boot',{});}}catch(e){}})();
