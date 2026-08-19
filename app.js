
/* LEGION_WAVE_14_today_counter */
try{var _dk=new Date().toDateString();var _o=JSON.parse(localStorage.getItem('lw_p22_fate_gac_today_counter')||'{}');if(_o.d!==_dk)_o={d:_dk,n:0};_o.n=(_o.n||0)+1;localStorage.setItem('lw_p22_fate_gac_today_counter',JSON.stringify(_o));}catch(e){}
(function(){
  var rates=[['LEGEND',5,'#fbbf24'],['EPIC',15,'#c4b5fd'],['RARE',30,'#67e8f9'],['COMMON',50,'#94a3b8']];
  var REALMS=[
    {id:'ash',name:'Ashfall Coast',line:'Tide relics whisper. Walk, then leave — no set to finish.'},
    {id:'veil',name:'Veil Orchard',line:'Leaves remember a pull you have not taken.'},
    {id:'well',name:'Echo Well',line:'A coin-shaped ripple. Odds stay L5 / E15 / R30 / C50.'},
    {id:'ridge',name:'Star Ridge',line:'Wind counts pity without promising a collection.'},
    {id:'marsh',name:'Lantern Marsh',line:'Lights blink. Collection is optional, never required.'},
    {id:'gate',name:'Unfinished Gate',line:'Kompu is forbidden here. A beat, then you go.'}
  ];
  var RELICS=[
    {id:'ash-ember',name:'Ash Ember',shape:'ember'},
    {id:'veil-seed',name:'Veil Seed',shape:'seed'},
    {id:'well-coin',name:'Well Coin',shape:'coin'},
    {id:'ridge-shard',name:'Ridge Shard',shape:'shard'},
    {id:'marsh-wick',name:'Marsh Wick',shape:'wick'},
    {id:'gate-hinge',name:'Gate Hinge',shape:'hinge'},
    {id:'night-thread',name:'Night Thread',shape:'thread'},
    {id:'tide-glass',name:'Tide Glass',shape:'glass'}
  ];
  var fpView='pull';
  var journal=[];
  try{journal=JSON.parse(localStorage.getItem('fp_journal')||'[]');}catch(e){journal=[];}
  var root=document.getElementById('app');
  var pity=+localStorage.getItem('fp_pity')||0;
  var pulls=+(localStorage.getItem('fp_pulls')||0);
  var hist=JSON.parse(localStorage.getItem('fp_hist')||'[]'); var todayP=0; try{var td=JSON.parse(localStorage.getItem('fp_today')||'{}'); if(td.d===new Date().toDateString()) todayP=td.n||0;}catch(e){}
  var legends=+(localStorage.getItem('fp_legends')||0);
  function dayKey(off){
    var d=new Date(); d.setDate(d.getDate()+(off||0));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function resetLeft(now){
    var t=now||Date.now();
    var end=new Date(t); end.setHours(24,0,0,0);
    var ms=Math.max(0,end-t);
    return {ms:ms, h:Math.floor(ms/3600000), m:Math.floor((ms%3600000)/60000)};
  }
  function fomoLeft(now){
    var r=resetLeft(now);
    return r.h+'h '+r.m+'m';
  }
  function resetCountText(now){
    return '3틱 자정 리셋 '+fomoLeft(now)+' · 추가뽑기 0 · 보상 0 · 세트강제 0';
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
      st.best=Math.max(st.best||0, st.count||0);
      localStorage.setItem('fp_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count,best:st.best,froze:froze})}catch(e){}
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
  function bannerRealm(){
    var d=new Date();
    var i=(d.getFullYear()*372+d.getMonth()*31+d.getDate())%REALMS.length;
    return REALMS[i];
  }
  function loadStamps(){
    try{return JSON.parse(localStorage.getItem('fp_stamps')||'[]');}catch(e){return [];}
  }
  function stampBanner(rarity){
    if(rarity!=='LEGEND'&&rarity!=='EPIC') return;
    var b=bannerRealm();
    var stamps=loadStamps();
    stamps.unshift({id:b.id,name:b.name,r:rarity,d:dayKey(0),t:Date.now()});
    stamps=stamps.slice(0,12);
    try{localStorage.setItem('fp_stamps',JSON.stringify(stamps));}catch(e){}
  }
  function loadAlbum(){
    try{
      var a=JSON.parse(localStorage.getItem('fp_album')||'{}');
      return a&&typeof a==='object'&&!Array.isArray(a)?a:{};
    }catch(e){return {};}
  }
  function grantRelic(rarity){
    if(rarity!=='LEGEND'&&rarity!=='EPIC') return null;
    var r=RELICS[pulls%RELICS.length];
    var a=loadAlbum();
    if(!a[r.id]) a[r.id]={n:0,t:0};
    a[r.id].n+=1;
    a[r.id].t=Date.now();
    a[r.id].r=rarity;
    try{localStorage.setItem('fp_album',JSON.stringify(a));}catch(e){}
    return r.id;
  }
  function unggrantRelic(id){
    if(!id) return;
    var a=loadAlbum();
    if(!a[id]) return;
    a[id].n=Math.max(0,(a[id].n||0)-1);
    if(!a[id].n) delete a[id];
    try{localStorage.setItem('fp_album',JSON.stringify(a));}catch(e){}
  }
  function loadDailyOff(off){
    try{
      var o=JSON.parse(localStorage.getItem('fp_daily_'+dayKey(off||0))||'{}');
      return {walk:!!o.walk, rates:!!o.rates, album:!!o.album};
    }catch(e){return {walk:false, rates:false, album:false};}
  }
  function loadDaily(){ return loadDailyOff(0); }
  function saveDaily(d){
    try{localStorage.setItem('fp_daily_'+dayKey(0),JSON.stringify({walk:!!d.walk, rates:!!d.rates, album:!!d.album}));}catch(e){}
  }
  function markDaily(k){
    var d=loadDaily();
    if(d[k]) return d;
    d[k]=true;
    saveDaily(d);
    try{legionTrack('daily_out',{k:k})}catch(e){}
    return d;
  }
  function dailyDone(d){ return (d.walk?1:0)+(d.rates?1:0)+(d.album?1:0); }
  function dailyStrip(d, id, label){
    var keys=[['walk','산책'],['rates','확률'],['album','각인']];
    var segs=keys.map(function(k){
      return '<span class="dseg'+(d[k[0]]?' on':'')+'">'+k[1]+'</span>';
    }).join('');
    id=id||'dailyStrip';
    label=label||('오늘 3틱 '+dailyDone(d)+'/3');
    return '<div class="dstrip" id="'+id+'" aria-label="'+label+'">'+segs+'</div>';
  }
  function yestHtml(){
    var d=loadDailyOff(-1);
    var n=dailyDone(d);
    return '<div class="yest-out" id="yestOut">'
      +'<p class="sub">어제 '+n+'/3 · 보기만 · 추가뽑기 0 · 보상 0 · 세트강제 0</p>'
      +dailyStrip(d,'yestStrip','어제 3틱 '+n+'/3')
      +'</div>';
  }
  function dailyHtml(){
    var d=loadDaily();
    var n=dailyDone(d);
    var b=bannerRealm();
    return '<div class="card daily-out" id="dailyOut">'
      +'<b>뽑기 밖 오늘 창</b>'
      +'<p class="sub">로그인 패스형 3틱. 뽑기 아님. 완성 보상 0. 세트강제 0. 확률 L5 E15 R30 C50 불변.</p>'
      +dailyStrip(d)
      +'<p class="sub" id="resetCount">'+resetCountText()+'</p>'
      +yestHtml()
      +'<div class="drow">'
      +'<button class="sec tick'+(d.walk?' on':'')+'" id="dWalk">'+(d.walk?'✓ ':'')+'오늘 렐름 산책 · '+b.name+'</button>'
      +'<button class="sec tick'+(d.rates?' on':'')+'" id="dRates">'+(d.rates?'✓ ':'')+'확률고지 확인 L5 / E15 / R30 / C50</button>'
      +'<button class="sec tick'+(d.album?' on':'')+'" id="dAlbum">'+(d.album?'✓ ':'')+'각인 한 장 보기 (수집강제 아님)</button>'
      +'</div>'
      +'<p class="sub">오늘 '+n+'/3 · 보상 없음 · 컴프 아님 · 추가뽑기 0 · 18+ 허구</p></div>';
  }
  var resetTimer=null;
  function tickResetCount(){
    var el=document.getElementById('resetCount');
    if(!el) return;
    el.textContent=resetCountText();
  }
  function armResetTick(){
    if(resetTimer) return;
    resetTimer=setInterval(tickResetCount, 30000);
  }
  function wireDaily(){
    var w=document.getElementById('dWalk');
    var r=document.getElementById('dRates');
    var a=document.getElementById('dAlbum');
    if(w) w.onclick=function(){ markDaily('walk'); walkRealm(bannerRealm().id); };
    if(r) r.onclick=function(){
      markDaily('rates');
      var text='Fate rates L5% E15% R30% C50% · soft pity 20=LEGEND 보정 · fictional · no kompu · '+shareBase();
      if(navigator.clipboard) navigator.clipboard.writeText(text);
      renderShell();
    };
    if(a) a.onclick=function(){ markDaily('album'); fpView='album'; renderShell(); };
    tickResetCount();
    armResetTick();
  }
  function albumHtml(){
    var a=loadAlbum();
    var cards=RELICS.map(function(r){
      var own=a[r.id];
      var on=own&&own.n>0;
      return '<div class="relic'+(on?' on':'')+'">'
        +'<div class="relic-art '+r.shape+'" aria-hidden="true"></div>'
        +'<b>'+r.name+'</b>'
        +(on?'<span class="chip">'+(own.r||'')+'</span>':'<span class="chip">잠김</span>')
        +'</div>';
    }).join('');
    return '<div class="card" id="album">'
      +'<b>각인 아트 · 내 것</b>'
      +'<p class="sub">8장은 보기용 아트. 세트 완성 보상 없음. 컴프/수집강제 아님. 확률 L5 E15 R30 C50 불변.</p>'
      +'<div class="relic-grid">'+cards+'</div></div>';
  }
  function bannerHtml(){
    var b=bannerRealm();
    var stamps=loadStamps();
    var todayN=0;
    for(var i=0;i<stamps.length;i++) if(stamps[i].d===dayKey(0)) todayN++;
    var chips=stamps.slice(0,4).map(function(s){return '<span class="chip">'+s.name+' · '+s.r+'</span>';}).join(' ');
    return '<div class="card" style="border-color:#fbbf2466">'
      +'<b>오늘 창 · '+b.name+' 각인</b>'
      +'<p class="sub">자정 리셋 · 확률 변동 없음 L5 / E15 / R30 / C50 · 컴프/세트강제 아님</p>'
      +'<p class="sub">'+b.line+'</p>'
      +'<p class="sub">LEGEND·EPIC이면 이 렐름 각인(수집 강제 없음)'+(todayN?' · 오늘 각인 '+todayN:'')+'</p>'
      +(chips?'<div style="margin-top:6px">'+chips+'</div>':'')
      +'</div>';
  }
  function navHtml(){
    return '<div class="row" style="margin:0 0 10px">'+
      '<button class="'+(fpView==='pull'?'':'sec')+'" id="tabPull">추출</button>'+
      '<button class="'+(fpView==='explore'?'':'sec')+'" id="tabExplore">탐험</button>'+
      '<button class="'+(fpView==='album'?'':'sec')+'" id="tabAlbum">각인</button></div>';
  }
  function wireNav(){
    var a=document.getElementById('tabPull');
    var b=document.getElementById('tabExplore');
    var c=document.getElementById('tabAlbum');
    if(a) a.onclick=function(){ fpView='pull'; renderShell(); };
    if(b) b.onclick=function(){ fpView='explore'; renderShell(); };
    if(c) c.onclick=function(){ fpView='album'; renderShell(); };
  }
  function renderAlbum(){
    root.innerHTML='<div class="card" style="border-color:#fbbf2444"><b>18+</b> Fictional gacha · 실금 아님 · 컴프/세트강제 아님 · 가상크레딧 only</div>'
      +navHtml()
      +albumHtml()
      +'<p class="sub">확률 고지(추출과 동일): L5% · E15% · R30% · C50% · soft pity 20 · 완성 보상 0</p>';
    markDaily('album');
    wireNav();
  }
  function walkRealm(id){
    var r=null;
    for(var i=0;i<REALMS.length;i++) if(REALMS[i].id===id) r=REALMS[i];
    if(!r) return;
    journal.unshift({id:r.id,name:r.name,line:r.line,t:Date.now()});
    journal=journal.slice(0,8);
    try{localStorage.setItem('fp_journal',JSON.stringify(journal));}catch(e){}
    if(r.id===bannerRealm().id) markDaily('walk');
    bumpStreak();
    try{legionTrack('explore',{id:r.id})}catch(e){}
    renderShell();
  }
  function renderExplore(){
    var walks=journal.map(function(j){return '<span class="chip">'+j.name+'</span>';}).join(' ')||'<span class="chip">아직 발자국 없음</span>';
    root.innerHTML='<div class="card" style="border-color:#fbbf2444"><b>18+</b> Fictional gacha · 실금 아님 · 컴프/세트강제 아님 · 가상크레딧 only</div>'
      +navHtml()
      +'<div class="card"><p class="sub">세계 비트 · 뽑기 아닌 산책. 세트 완성 없음. 확률은 추출 탭에 고정.</p>'
      +REALMS.map(function(r){
        return '<div class="card" style="margin:8px 0"><b>'+r.name+'</b><p class="sub">'+r.line+'</p>'+
          '<button class="sec" data-walk="'+r.id+'">들어가기</button></div>';
      }).join('')
      +'<p class="sub" style="margin-top:8px">최근 산책: '+walks+'</p></div>'
      +'<p class="sub">확률 고지(추출과 동일): L5% · E15% · R30% · C50% · soft pity 20 · 컴프 아님</p>';
    wireNav();
    root.querySelectorAll('[data-walk]').forEach(function(btn){
      btn.onclick=function(){ walkRealm(btn.getAttribute('data-walk')); };
    });
  }
  function renderShell(){
    if(fpView==='explore'){ renderExplore(); return; }
    if(fpView==='album'){ renderAlbum(); return; }
    var st=JSON.parse(localStorage.getItem('fp_streak')||'{}');
    var sc=st.count||0;
    var best=Math.max(st.best||0, sc);
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast||0))/86400000)>=7;
    var free=freeLeft();
    var p10c='';
    try{ if(window.p10Bal) p10c=' <span class="chip">💳 p10 <b>'+p10Bal()+'</b></span>'; }catch(e){}
    var near=pity>=15&&pity<20?' · 거의 LEGEND':'';
    root.innerHTML='<div class="card" style="border-color:#fbbf2444"><b>18+</b> Fictional gacha · 실금 아님 · 컴프/세트강제 아님 · 가상크레딧 only</div>'
      +navHtml()
      +bannerHtml()
      +dailyHtml()
      +'<div class="card"><span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' 🛡️':'')+'</span>'+(best>sc?' <span class="chip">최장 <b>'+best+'</b>일</span>':'')+' <span class="chip">오늘 '+todayPulls()+'회</span> <span class="chip">LEGEND '+legends+'</span> <span class="chip">리셋 '+fomoLeft()+'</span>'+p10c
      +'<p class="sub" id="pityBar" style="margin-top:8px">soft pity '+pity+'/20'+near+' · 총 '+pulls+'회 · '+(free?'🎁 일일 첫 추출 보너스 창':'이어서 추출')+'</p>'
      +'<p class="sub">확률 고지: L5% · E15% · R30% · C50% (코드 일치)</p>'
      +'<div style="height:8px;background:#1c1826;border-radius:6px;overflow:hidden;margin:8px 0"><i style="display:block;height:100%;width:'+(pity/20*100)+'%;background:linear-gradient(90deg,#67e8f9,#fbbf24)"></i></div>'
      +'<button id="go">'+(free?'운명 추출 (일일 첫)':'운명 추출')+'</button> <button class="sec" id="x5">5연</button> <button class="sec" id="x10">10연</button> <button class="sec" id="undoPull">↩ 직전</button> '
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
    wireNav();
    wireDaily();
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
      if(st.relic) unggrantRelic(st.relic);
      localStorage.removeItem('fp_last');
      renderShell();
      try{legionTrack('undo',{})}catch(e){}
    }catch(e){}
  }
  function drawOne(){
    try{if(window.p10Skim)p10Skim(1);}catch(e){}
    var prevPity=pity;
    var r=Math.random()*100, acc=0, got=rates[3];
    if(pity>=20){got=rates[0];pity=0;}
    else{
      for(var i=0;i<rates.length;i++){acc+=rates[i][1];if(r<acc){got=rates[i];break;}}
      if(got[0]==='LEGEND') pity=0;
      else pity++;
    }
    if(got[0]==='LEGEND'){legends++; localStorage.setItem('fp_legends',legends);}
    stampBanner(got[0]);
    pulls++; localStorage.setItem('fp_pulls',pulls);
    var relic=grantRelic(got[0]);
    try{localStorage.setItem('fp_last',JSON.stringify({pity: prevPity, legend: got[0]==='LEGEND', relic: relic||null}));}catch(e){}
    localStorage.setItem('fp_pity',pity);
    hist.unshift(got[0]);
    bumpToday();
    return got;
  }
  function prefersReduce(){
    try{return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){return false;}
  }
  function cinemaReveal(got){
    var box=document.getElementById('res');
    if(!box) return;
    var names=got.map(function(g){return g[0];}).join(' · ');
    var foot='<p class="sub">10연도 같은 확률 L5 E15 R30 C50 · soft pity '+pity+'/20 · 세트 강제 없음 · 가상</p>';
    if(prefersReduce()){
      box.innerHTML='<div style="font-size:18px;font-weight:700">10연: '+names+'</div>'+foot;
      return;
    }
    box.innerHTML='<div class="cine"><div class="cine-door" id="cineDoor">…</div><div class="cine-row" id="cineRow"></div></div>'+foot;
    var door=document.getElementById('cineDoor');
    var row=document.getElementById('cineRow');
    var i=0;
    function step(){
      if(i>=got.length) return;
      var g=got[i];
      if(door){
        door.textContent=g[0];
        door.style.color=g[2];
        door.className='cine-door'+(g[0]==='LEGEND'?' gold':'');
      }
      if(row){
        var chip=document.createElement('span');
        chip.className='chip';
        chip.style.color=g[2];
        chip.textContent=g[0];
        row.appendChild(chip);
      }
      if(g[0]==='LEGEND'){ try{if(navigator.vibrate)navigator.vibrate(40);}catch(e){} }
      i++;
      if(i<got.length) setTimeout(step, g[0]==='LEGEND'?420:160);
    }
    step();
  }
  function persistHist(){
    hist=hist.slice(0,12);
    try{localStorage.setItem('fp_hist',JSON.stringify(hist));}catch(e){}
  }
  function pull(){
    var got=drawOne();
    persistHist();
    bumpStreak();
    if(got[0]==='LEGEND'){ try{if(navigator.vibrate)navigator.vibrate(40);}catch(e){} }
    var peak=got[0]==='LEGEND'||got[0]==='EPIC';
    renderShell();
    document.getElementById('res').innerHTML='<div style="font-size:28px;color:'+got[2]+';font-weight:800">'+got[0]+'</div>'
      +'<p class="sub">soft pity 20=LEGEND 보정(컴프 아님) · pity '+pity+'/20 · 가상</p>';
    var sp=document.getElementById('sharePeak');
    if(sp) sp.style.display=peak?'block':'none';
    try{legionTrack('activate',{r:got[0],pity:pity})}catch(e){}
    if(peak) try{legionTrack('share_peak_shown',{r:got[0]})}catch(e){}
  }
  function multiPull(n, cine){
    var got=[];
    for(var i=0;i<n;i++) got.push(drawOne());
    persistHist();
    bumpStreak();
    renderShell();
    if(cine) cinemaReveal(got);
    else {
      document.getElementById('res').innerHTML='<div style="font-size:18px;font-weight:700">'+n+'연: '+got.map(function(g){return g[0];}).join(' · ')+'</div>'
        +'<p class="sub">soft pity '+pity+'/20 · 가상 · 확률 고지 L5 E15 R30 C50</p>';
    }
    var names=got.map(function(g){return g[0];});
    try{legionTrack('activate',{multi:n,got:names})}catch(e){}
    if(names.indexOf('LEGEND')>=0||names.indexOf('EPIC')>=0){
      var sp=document.getElementById('sharePeak'); if(sp) sp.style.display='block';
      try{legionTrack('share_peak_shown',{multi:n})}catch(e){}
    }
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
    if(x5) x5.onclick=function(){ multiPull(5, false); };
    var x10=document.getElementById('x10');
    if(x10) x10.onclick=function(){ multiPull(10, true); };
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
  window.fpResetLeft=resetLeft;
  window.fpResetCountText=resetCountText;
  renderShell();

/* LEGION_WAVE_59_fomo_chip */
setTimeout(function(){try{if(document.getElementById('lw_fomo_59'))return;var end=new Date(); end.setHours(24,0,0,0);var ms=Math.max(0,end-Date.now());var h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);var d=document.createElement('div'); d.id='lw_fomo_59';d.style.cssText='font-size:11px;opacity:.75;margin:6px 0;color:#e0b552';d.textContent='window '+h+'h '+m+'m · W59';var app=document.getElementById('app')||document.body; app.insertBefore(d, app.firstChild);}catch(e){}},40);
})();