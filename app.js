
(function(){
  var rates=[['LEGEND',5,'#fbbf24'],['EPIC',15,'#c4b5fd'],['RARE',30,'#67e8f9'],['COMMON',50,'#94a3b8']];
  var root=document.getElementById('app');
  var pity=+localStorage.getItem('fp_pity')||0; var pulls=+(localStorage.getItem('fp_pulls')||0); var hist=JSON.parse(localStorage.getItem('fp_hist')||'[]');
  function dayKey(off){var d=new Date();d.setDate(d.getDate()+(off||0));return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function fomoLeft(){var e=new Date();e.setHours(24,0,0,0);var ms=Math.max(0,e-Date.now());return Math.floor(ms/3600000)+'h '+Math.floor((ms%3600000)/60000)+'m';}
  function todayN(){try{return +(localStorage.getItem('fp_day_'+dayKey(0))||0);}catch(e){return 0;}}
  function bumpToday(){try{localStorage.setItem('fp_day_'+dayKey(0),String(todayN()+1));}catch(e){}}
  function bumpStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('fp_streak')||'{}');
      var t=dayKey(0); if(st.last===t) return st.count||0;
      st.count=(st.last===dayKey(-1))?(st.count||0)+1:1; st.last=t;
      localStorage.setItem('fp_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count})}catch(e){}
      return st.count;
    }catch(e){return 0;}
  }
  function bag(){
    var b={LEGEND:0,EPIC:0,RARE:0,COMMON:0};
    hist.forEach(function(x){if(b[x]!=null)b[x]++;});
    return b;
  }
  function pull(){ try{if(window.p10Skim)p10Skim(1);}catch(e){}
    var r=Math.random()*100, acc=0, got=rates[3];
    if(pity>=20){got=rates[0];pity=0;}
    else{for(var i=0;i<rates.length;i++){acc+=rates[i][1];if(r<acc){got=rates[i];break;}} if(got[0]==='LEGEND'){pity=0; try{if(navigator.vibrate)navigator.vibrate(40);}catch(e){}} else pity++;}
    localStorage.setItem('fp_pity',pity); pulls++; localStorage.setItem('fp_pulls',pulls); hist.unshift(got[0]); hist=hist.slice(0,12); localStorage.setItem('fp_hist',JSON.stringify(hist));
    bumpToday(); bumpStreak();
    paint(got);
    try{legionTrack('activate',{r:got[0]})}catch(e){}
    try{legionTrack('share_peak_shown',{r:got[0]})}catch(e){}
  }
  function paint(got){
    var st=JSON.parse(localStorage.getItem('fp_streak')||'{}');
    var sc=st.count||0;
    var b=bag();
    var res=document.getElementById('res');
    if(res) res.innerHTML=(got?'<div style="font-size:28px;color:'+got[2]+';font-weight:800">'+got[0]+'</div>':'')
      +'<p class="sub">soft pity '+pity+'/20 · 오늘 '+todayN()+'회 · 🔥'+sc+'일 · 창 '+fomoLeft()+'</p>'
      +'<p class="sub">최근 '+(hist.join(' · ')||'-')+' · bag L'+b.LEGEND+' E'+b.EPIC+' R'+b.RARE+' C'+b.COMMON+' · 가상</p>';
    var pb=document.getElementById('pityBar');
    if(pb) pb.textContent='soft pity '+pity+'/20 · 총 '+pulls+'회 · 오늘 '+todayN()+' · 🔥'+sc+'일 · 창 '+fomoLeft();
  }
  root.innerHTML='<div class="card" style="border-color:#c4b5fd"><b>18+</b> Fictional gacha · 실결제 아님 · 컴프 금지</div>'
    +'<div class="card"><p class="sub" id="pityBar">soft pity '+pity+'/20 · 총 '+pulls+'회</p>'
    +'<p class="sub">확률 고지: LEGEND 5% · EPIC 15% · RARE 30% · COMMON 50% · soft pity 20=LEGEND 1회 보정(세트강제 아님) · 가상</p>'
    +'<button id="go">운명 추출</button> <button class="sec" id="share">공유</button> <button class="sec" id="ratesCopy">확률 고지 복사</button>'
    +'<div id="res" style="margin-top:14px"></div>'
    +'<div id="moneyPipe" style="margin-top:12px;padding:10px;border:1px solid #c5a46e44;border-radius:12px;background:#16121c;text-align:center;font-size:12px">'
    +'<div style="color:#e0b552;font-weight:700;margin-bottom:4px">💎 후원 · 파이프 (엔터 18+)</div>'
    +'<a style="color:#ece8f1;margin:0 6px" href="mailto:hoyashi95@gmail.com?subject=%5BFate%5D%20support">☕ 후원 문의</a>'
    +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/tarot-oracle/?utm_source=fate&utm_medium=pipe">🔮 Tarot</a>'
    +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=fate&utm_medium=pipe">🎮 Arcade</a></div></div>';
  document.getElementById('go').onclick=pull;
  document.getElementById('ratesCopy').onclick=function(){
    var text='Fate rates L5% E15% R30% C50% · soft pity 20 · fictional · https://hosuman08-netizen.github.io/fate-gacha/';
    if(navigator.clipboard)navigator.clipboard.writeText(text);
  };
  document.getElementById('share').onclick=function(){
    var t='Fate Pull · rates L5/E15/R30/C50 · https://hosuman08-netizen.github.io/fate-gacha/';
    if(navigator.clipboard)navigator.clipboard.writeText(t); try{legionTrack('share_peak',{})}catch(e){}
  };
  paint(null);
  try{legionTrack('session_start',{})}catch(e){}
})();
