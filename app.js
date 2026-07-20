
/* LEGION_WAVE_14_today_counter */
try{var _dk=new Date().toDateString();var _o=JSON.parse(localStorage.getItem('lw_p22_fate_gac_today_counter')||'{}');if(_o.d!==_dk)_o={d:_dk,n:0};_o.n=(_o.n||0)+1;localStorage.setItem('lw_p22_fate_gac_today_counter',JSON.stringify(_o));}catch(e){}
(function(){
  var rates=[['LEGEND',5,'#fbbf24'],['EPIC',15,'#c4b5fd'],['RARE',30,'#67e8f9'],['COMMON',50,'#94a3b8']];
  var root=document.getElementById('app');
  var pity=+localStorage.getItem('fp_pity')||0;
  var pulls=+(localStorage.getItem('fp_pulls')||0);
  var hist=JSON.parse(localStorage.getItem('fp_hist')||'[]'); var todayP=0; try{var td=JSON.parse(localStorage.getItem('fp_today')||'{}'); if(td.d===new Date().toDateString()) todayP=td.n||0;}catch(e){}
  var legends=+(localStorage.getItem('fp_legends')||0);
  function dayKey(off){
    var d=new Date(); d.setDate(d.getDate()+(off||0));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function fomoLeft(){
    var end=new Date(); end.setHours(24,0,0,0);
    var ms=Math.max(0,end-Date.now());
    return Math.floor(ms/3600000)+'h '+Math.floor((ms%3600000)/60000)+'m';
  }
  function bumpStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('fp_streak')||'{}');
      var t=dayKey(0);
      if(st.last===t) return st;
      var y=dayKey(-1),y2=dayKey(-2),froze=false;
      if(st.last && st.last!==y && st.last===y2 && (st.count||0)>=3){
        var ready=!st.shieldLast||((new Date(t)-new Date(st.shieldLast))/86400000)>=7;
        if(ready){st.shieldLast=t;st.last=y;froze=true;try{legionTrack('streak_freeze',{count:st.count})}catch(e){}}
      }
      st.count=(st.last===y)?(st.count||0)+1:1;
      st.last=t;
      localStorage.setItem('fp_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count,froze:froze})}catch(e){}
      return st;
    }catch(e){return {count:0};}
  }
  function kId(){
    try{
      var id=localStorage.getItem('fp_k_id');
      if(!id){id='f'+Math.random().toString(36).slice(2,8);localStorage.setItem('fp_k_id',id);}
      return id;
    }catch(e){return 'share';}
  }
  function shareBase(){
    return 'https://hosuman08-netizen.github.io/fate-gacha/?utm_source=share&ref='+encodeURIComponent(kId());
  }
  function todayPulls(){
    try{return +(localStorage.getItem('fp_day_'+dayKey(0))||0);}catch(e){return 0;}
  }
  function bumpToday(){
    try{
      var k='fp_day_'+dayKey(0);
      localStorage.setItem(k,String(todayPulls()+1));
    }catch(e){}
  }
  function freeLeft(){
    // 1 free fictional pull/day then continue (entertainment)
    return todayPulls()===0;
  }
  function renderShell(){
    var st=JSON.parse(localStorage.getItem('fp_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast||0))/86400000)>=7;
    var free=freeLeft();
    root.innerHTML='<div class="card" style="border-color:#fbbf2444"><b>18+</b> Fictional gacha · 실금 아님 · 컴프/세트강제 아님</div>'
      +'<div class="card"><span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' 🛡️':'')+'</span> <span class="chip">오늘 '+todayPulls()+'회</span> <span class="chip">LEGEND '+legends+'</span> <span class="chip">리셋 '+fomoLeft()+'</span>'
      +'<p class="sub" id="pityBar" style="margin-top:8px">soft pity '+pity+'/20 · 총 '+pulls+'회 · '+(free?'🎁 일일 첫 추출 보너스 창':'이어서 추출')+'</p>'
      +'<p class="sub">확률 고지: L5% · E15% · R30% · C50% (코드 일치)</p>'
      +'<div style="height:8px;background:#1c1826;border-radius:6px;overflow:hidden;margin:8px 0"><i style="display:block;height:100%;width:'+(pity/20*100)+'%;background:linear-gradient(90deg,#67e8f9,#fbbf24)"></i></div>'
      +'<button id="go">'+(free?'운명 추출 (일일 첫)':'운명 추출')+'</button> <button class="sec" id="x5">5연</button> <button class="sec" id="undoPull">↩ 직전</button> '
      +'<button class="sec" id="share">공유</button> '
      +'<button class="sec" id="ratesCopy">확률 고지 복사</button>'
      +'<div id="res" style="margin-top:14px"></div>'
      +'<div class="sub" id="histStrip" style="margin-top:10px"></div></div>'
      +'<div id="sharePeak" style="display:none;margin:10px 0;padding:10px;border:1px solid #fbbf2444;border-radius:12px;text-align:center">'
      +'<p style="margin:0 0 6px;font-size:13px">✨ 지금 공유 타이밍</p>'
      +'<button class="sec" id="sharePeakBtn">결과 공유</button></div>'
      +'<div id="moneyPipe" style="margin-top:12px;padding:10px;border:1px solid #c5a46e44;border-radius:12px;background:#16121c;text-align:center;font-size:12px">'
      +'<div style="color:#e0b552;font-weight:700;margin-bottom:4px">💎 가상 엔터 · 크로스</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/tarot-oracle/?utm_source=fate">🃏 Tarot</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/echo-squad/?utm_source=fate">💥 Echo</a>'
      +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=fate">🎮 Arcade</a></div>';
    paintHist();
    wire();
  }
  function paintHist(){
    var el=document.getElementById('histStrip');
    if(!el)return;
    el.innerHTML=hist.length?'최근: '+hist.map(function(h){return '<span class="chip" style="margin:2px">'+h+'</span>';}).join(' '):'아직 추출 없음 — 첫 뽑기로 루프 시작';
  }
  function undoPull(){
    try{
      var st=JSON.parse(localStorage.getItem('fp_last')||'null');
      if(!st||!hist.length)return;
      hist.shift(); localStorage.setItem('fp_hist',JSON.stringify(hist));
      pity=st.pity; pulls=Math.max(0,pulls-1);
      localStorage.setItem('fp_pity',pity); localStorage.setItem('fp_pulls',pulls);
      if(st.legend){ legends=Math.max(0,legends-1); localStorage.setItem('fp_legends',legends); }
      localStorage.removeItem('fp_last');
      renderShell();
      try{legionTrack('undo',{})}catch(e){}
    }catch(e){}
  }
  function pull(){
    try{if(window.p10Skim)p10Skim(1);}catch(e){}
    var prevPity=pity;
    var r=Math.random()*100, acc=0, got=rates[3];
    if(pity>=20){got=rates[0];pity=0;}
    else{
      for(var i=0;i<rates.length;i++){acc+=rates[i][1];if(r<acc){got=rates[i];break;}}
      if(got[0]==='LEGEND'){pity=0; try{if(navigator.vibrate)navigator.vibrate(40);}catch(e){}}
      else pity++;
    }
    if(got[0]==='LEGEND'){legends++; localStorage.setItem('fp_legends',legends);}
    try{localStorage.setItem('fp_last',JSON.stringify({pity: prevPity, legend: got[0]==='LEGEND'}));}catch(e){}
    localStorage.setItem('fp_pity',pity);
    pulls++; localStorage.setItem('fp_pulls',pulls); try{var td=JSON.parse(localStorage.getItem('fp_today')||'{}'); if(td.d!==new Date().toDateString()) td={d:new Date().toDateString(),n:0}; td.n=(td.n||0)+1; todayP=td.n; localStorage.setItem('fp_today',JSON.stringify(td));}catch(e){}
    hist.unshift(got[0]); hist=hist.slice(0,12); localStorage.setItem('fp_hist',JSON.stringify(hist));
    bumpToday(); bumpStreak();
    var peak=got[0]==='LEGEND'||got[0]==='EPIC';
    document.getElementById('res').innerHTML='<div style="font-size:28px;color:'+got[2]+';font-weight:800">'+got[0]+'</div>'
      +'<p class="sub">soft pity 20=LEGEND 보정(컴프 아님) · pity '+pity+'/20 · 가상</p>';
    var pb=document.getElementById('pityBar');
    if(pb) pb.textContent='soft pity '+pity+'/20 · 총 '+pulls+'회 · 오늘 '+todayPulls()+'회';
    paintHist();
    var bar=root.querySelector('.card i'); if(bar) bar.style.width=(pity/20*100)+'%';
    var sp=document.getElementById('sharePeak');
    if(sp) sp.style.display=peak?'block':'none';
    try{legionTrack('activate',{r:got[0],pity:pity})}catch(e){}
    if(peak) try{legionTrack('share_peak_shown',{r:got[0]})}catch(e){}
  }
  function doShare(){
    var last=hist[0]||'—';
    var text='Fate Pull '+last+' · pity '+pity+'/20 · L'+legends+' · fictional\n'+shareBase();
    if(navigator.share) navigator.share({text:text,url:shareBase()}).catch(function(){});
    else if(navigator.clipboard) navigator.clipboard.writeText(text);
    try{legionTrack('share_peak',{last:last})}catch(e){}
  }
  function wire(){
    document.getElementById('go').onclick=pull;
    var x5=document.getElementById('x5');
    if(x5) x5.onclick=function(){
      var got=[];
      for(var n=0;n<5;n++){
        // inline one pull without full re-render until end
        try{if(window.p10Skim)p10Skim(1);}catch(e){}
        var prevPity=pity;
        var r=Math.random()*100, acc=0, g=rates[3];
        if(pity>=20){g=rates[0];pity=0;}
        else{
          for(var i=0;i<rates.length;i++){acc+=rates[i][1];if(r<acc){g=rates[i];break;}}
          if(g[0]==='LEGEND'){pity=0;} else pity++;
        }
        if(g[0]==='LEGEND'){legends++; localStorage.setItem('fp_legends',legends);}
        try{localStorage.setItem('fp_last',JSON.stringify({pity: prevPity, legend: g[0]==='LEGEND'}));}catch(e){}
        localStorage.setItem('fp_pity',pity);
        pulls++; localStorage.setItem('fp_pulls',pulls);
        hist.unshift(g[0]); got.push(g[0]);
        bumpToday();
      }
      hist=hist.slice(0,12); localStorage.setItem('fp_hist',JSON.stringify(hist));
      bumpStreak();
      renderShell();
      document.getElementById('res').innerHTML='<div style="font-size:18px;font-weight:700">5연: '+got.join(' · ')+'</div>'
        +'<p class="sub">soft pity '+pity+'/20 · 가상 · 확률 고지 L5 E15 R30 C50</p>';
      try{legionTrack('activate',{multi:5,got:got})}catch(e){}
      if(got.indexOf('LEGEND')>=0||got.indexOf('EPIC')>=0){
        var sp=document.getElementById('sharePeak'); if(sp) sp.style.display='block';
        try{legionTrack('share_peak_shown',{multi:5})}catch(e){}
      }
    };
    var up=document.getElementById('undoPull'); if(up) up.onclick=undoPull;
    document.getElementById('share').onclick=doShare;
    var sp=document.getElementById('sharePeakBtn'); if(sp) sp.onclick=doShare;
    document.getElementById('ratesCopy').onclick=function(){
      var text='Fate rates L5% E15% R30% C50% · soft pity 20=LEGEND 보정 · fictional · no kompu · '+shareBase();
      if(navigator.clipboard) navigator.clipboard.writeText(text);
    };
  }
  try{
    var q=new URLSearchParams(location.search||'');
    var ref=q.get('ref');
    if(ref && ref!==kId() && !localStorage.getItem('fp_k_from')){
      localStorage.setItem('fp_k_from',ref);
      try{legionTrack('k_link',{from:ref})}catch(e){}
    }
  }catch(e){}
  try{legionTrack('session_start',{})}catch(e){}
  renderShell();

/* LEGION_WAVE_59_fomo_chip */
setTimeout(function(){try{if(document.getElementById('lw_fomo_59'))return;var end=new Date(); end.setHours(24,0,0,0);var ms=Math.max(0,end-Date.now());var h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);var d=document.createElement('div'); d.id='lw_fomo_59';d.style.cssText='font-size:11px;opacity:.75;margin:6px 0;color:#e0b552';d.textContent='window '+h+'h '+m+'m · W59';var app=document.getElementById('app')||document.body; app.insertBefore(d, app.firstChild);}catch(e){}},40);
})();