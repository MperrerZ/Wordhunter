/* ================= STARFIELD ================= */
(function(){
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let w,h,stars=[];
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = [];
    const count = Math.floor((w*h)/9000);
    for(let i=0;i<count;i++){
      stars.push({
        x:Math.random()*w, y:Math.random()*h,
        r:Math.random()*1.4+0.3,
        baseA:Math.random()*0.6+0.3,
        speed:Math.random()*0.02+0.005,
        phase:Math.random()*Math.PI*2
      });
    }
  }
  function tick(t){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#eae8f7';
    for(const s of stars){
      const a = s.baseA + Math.sin(t*s.speed + s.phase)*0.3;
      ctx.globalAlpha = Math.max(0,Math.min(1,a));
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(tick);
})();

/* ================= WORD BANK (for floating suggestions) ================= */
const WORD_BANK = ["ability","absent","accept","accident","account","achieve","acquire","across","action","active",
"actual","address","admire","admit","adopt","advance","advantage","adventure","advice","affect",
"afford","afraid","agree","aim","alarm","allow","almost","alone","along","already",
"although","among","amount","amuse","ancient","anger","angle","announce","annoy","answer",
"anxious","apologize","appear","apple","apply","appoint","approach","approve","argue","arrange",
"arrive","article","artist","ashamed","aside","aspect","assist","assume","assure","attach",
"attack","attempt","attend","attention","attitude","attract","author","available","average","avoid",
"aware","awful","balance","barely","battle","beauty","become","before","begin","behave",
"behind","belief","believe","belong","benefit","beside","between","beyond","bitter","blame",
"blank","blend","block","boast","border","borrow","bother","bottom","boundary","brave",
"breathe","brief","bright","brilliant","broad","budget","build","burden","burst","business",
"calm","campaign","capable","capture","career","careful","careless","cause","celebrate","century",
"certain","challenge","chance","change","character","charge","charm","chase","cheap","cheer",
"chief","choice","choose","circle","claim","clarify","classic","clever","climate","climb",
"closely","collapse","collect","combine","comfort","command","comment","common","compare","compete",
"complain","complete","complex","concern","conclude","condition","confident","confuse","connect","consider",
"consist","constant","contain","content","contest","context","continue","contract","contrast","contribute",
"control","convince","correct","couple","courage","course","cover","create","crisis","criticize",
"crowd","crucial","cruel","culture","curious","current","custom","damage","danger","decade",
"decide","declare","decline","decrease","deep","defeat","defend","define","degree","delay",
"deliver","demand","depend","describe","deserve","design","desire"
