
(function(){
  var rates=[['LEGEND',5,'#fbbf24'] /* 전설 */,['EPIC',15,'#c4b5fd'],['RARE',30,'#67e8f9'],['COMMON',50,'#94a3b8']];
  var root=document.getElementById('app');
  var pity=+localStorage.getItem('fp_pity')||0; var pulls=+(localStorage.getItem('fp_pulls')||0); var hist=JSON.parse(localStorage.getItem('fp_hist')||'[]');
  function pull(){
    var r=Math.random()*100, acc=0, got=rates[3];
    if(pity>=20){got=rates[0];pity=0;}
    else{for(var i=0;i<rates.length;i++){acc+=rates[i][1];if(r<acc){got=rates[i];break;}} if(got[0]==='LEGEND'){pity=0; try{if(navigator.vibrate)navigator.vibrate(40);}catch(e){}} else pity++;}
    localStorage.setItem('fp_pity',pity); pulls++; localStorage.setItem('fp_pulls',pulls); hist.unshift(got[0]); hist=hist.slice(0,8); localStorage.setItem('fp_hist',JSON.stringify(hist)); var pb=document.getElementById('pityBar'); if(pb) pb.textContent='soft pity '+pity+'/20 (천장 보장 없음·컴프금지)';
    root.querySelector('#res').innerHTML='<div style="font-size:28px;color:'+got[2]+';font-weight:800">'+got[0]+'</div><p class="sub">천장 없음(컴프 금지) · 소프트 pity '+pity+'/20 · 최근 '+(hist.join(' · ')||'-')+' · 가상</p>';
    try{legionTrack('activate',{r:got[0]})}catch(e){}
  }
  root.innerHTML='<div class="card"><p class="sub" id="pityBar">soft pity '+pity+'/20 · 총 '+pulls+'회</p><p class="sub">확률 고지: L5% E15% R30% C50% · 가상 엔터</p><button id="go">운명 추출</button> <button class="sec" id="share">공유</button><div id="res" style="margin-top:14px"></div></div>';
  document.getElementById('go').onclick=pull;
  if(!document.getElementById('ratesCopy')){var r=document.createElement('button');r.id='ratesCopy';r.className='sec';r.textContent='확률 고지 복사';r.onclick=function(){var text='Fate rates L5 E15 R30 C50 · fictional · https://hosuman08-netizen.github.io/fate-gacha/';if(navigator.clipboard)navigator.clipboard.writeText(text);};document.querySelector('.card').appendChild(r);}
  document.getElementById('share').onclick=function(){var t='Fate Pull · https://hosuman08-netizen.github.io/fate-gacha/';if(navigator.clipboard)navigator.clipboard.writeText(t);try{legionTrack('share_peak',{})}catch(e){}};
  try{legionTrack('session_start',{})}catch(e){}
})();
