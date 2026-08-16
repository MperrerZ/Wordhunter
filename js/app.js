/* ================= VISIBLE ERROR BANNER (for debugging silent failures) ================= */
function showFatalError(msg){
  let el = document.getElementById('fatalErrorBanner');
  if(!el){
    el = document.createElement('div');
    el.id = 'fatalErrorBanner';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#ff6b6b;'+
      'color:#2a0000;font-family:monospace;font-size:12.5px;padding:10px 14px;white-space:pre-wrap;'+
      'box-shadow:0 2px 10px rgba(0,0,0,0.4);';
    document.body.appendChild(el);
  }
  el.textContent = '⚠ เกิดข้อผิดพลาด: ' + msg;
}
window.addEventListener('error', (e)=>{
  showFatalError(e.message || 'unknown error');
});
window.addEventListener('unhandledrejection', (e)=>{
  const reason = e.reason;
  showFatalError((reason && reason.message) ? reason.message : String(reason));
});

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
"deliver","demand","depend","describe","deserve","design","desire","destroy","detail","determine",
"develop","device","devote","differ","difficult","dinner","direct","disagree","disappear","discover",
"discuss","disease","dismiss","distance","distant","distribute","district","disturb","divide","doubt",
"dozen","draft","dramatic","drown","dwell","eager","earn","earth","ease","edge",
"educate","effect","effort","either","elderly","element","embarrass","emerge","emotion","emphasis",
"employ","empty","enable","encourage","endless","engage","enormous","ensure","enter","entire",
"envy","equal","equip","escape","especial","essence","establish","estate","estimate","evaluate",
"eventual","evidence","evolve","exact","examine","example","exceed","excellent","except","excite",
"exclude","excuse","exhaust","exist","expand","expect","expense","experience","expert","explain",
"explore","expose","extend","extent","extra","extreme","facility","factor","failure","faint",
"fairly","faith","familiar","famous","fashion","fasten","fatal","fault","favor","fearful",
"feature","fierce","figure","finance","firm","flexible","flow","focus","forbid","force",
"forecast","forgive","formal","former","fortune","forward","frequent","fresh","friendly","frighten",
"frustrate","fulfil","function","fund","further","gain","gather","gender","general","generate",
"generous","gentle","genuine","gesture","glance","global","govern","gradual","grant","grasp",
"greet","grief","guarantee","guard","guilt","habit","handle","harm","harsh","hesitate",
"hidden","honest","honor","horrible","huge","humble","identify","ignore","illegal","image",
"imagine","immediate","impact","imply","import","impose","impress","improve","include","income",
"increase","incredible","indeed","indicate","industry","inevitable","inform","initial","injury","inquire",
"insist","inspect","inspire","install","instance","instant","instead","insult","intend","intense",
"interact","interest","interfere","internal","interpret","interrupt","interview","introduce","invade","invest",
"invite","involve","irritate","isolate","issue","judge","justice","justify","knowledge","landscape",
"lately","launch","leadership","legal","leisure","length","liberal","likely","limit","liquid",
"literal","local","locate","logical","loyal","luxury","maintain","major","manage","manner",
"manufacture","margin","material","matter","mature","maximum","mean","measure","medical","memory",
"mental","mention","merchant","mercy","merely","method","minimum","minor","minute","miserable",
"mission","mistake","modest","modify","moment","motive","mutual","narrow","native","nature",
"nearby","necessary","negative","neglect","negotiate","neither","nervous","neutral","normal","notable",
"notice","notion","numerous","obey","object","observe","obtain","obvious","occasion","occupy",
"occur","offend","offer","official","operate","opinion","opponent","opportunity","oppose","option",
"ordinary","organize","origin","otherwise","outcome","outline","overall","overcome","overlook","owner",
"pace","panic","parallel","partial","particular","passion","patient","pause","peculiar","perceive",
"perfect","perform","perhaps","period","permanent","permit","persist","personal","persuade","phase",
"phenomenon","physical","planet","pleasant","pledge","plenty","policy","polite","portion","position",
"positive","possess","possible","potential","poverty","practical","precise","predict","prefer","pregnant",
"preserve","pressure","pretend","prevent","previous","primary","principle","prior","priority","private",
"probable","proceed","process","produce","profit","progress","project","promise","promote","proper",
"property","proportion","propose","protect","protest","proud","prove","provide","publish","pursue",
"qualify","quality","quantity","quarter","random","range","rapid","rarely","rather","reaction",
"realize","reasonable","recall","receive","recent","recognize","recommend","record","recover","reduce",
"refer","reflect","refuse","regard","region","register","regret","regular","reject","relate",
"relative","relax","release","relevant","reliable","relief","remain","remark","remind","remote",
"remove","replace","reply","represent","request","require","rescue","resemble","reserve","resist",
"resource","respect","respond","restore","restrict","result","retain","retire","reveal","reverse",
"review","reward","rigid","rough","route","rural","sacrifice","satisfy","scale","scarce",
"scatter","scene","schedule","scope","secure","seek","select","senior","sensible","sensitive",
"separate","sequence","series","serious","settle","severe","shallow","shift","shortage","significant",
"similar","simple","sincere","situation","skill","slight","solid","solution","somehow","source",
"specific","spirit","spread","stable","standard","statement","steady","stimulate","strategy","strength",
"strict","structure","struggle","stubborn","submit","subsequent","substance","subtle","succeed","sudden",
"suffer","sufficient","suggest","suitable","summary","superior","supply","support","suppose","surface",
"surround","survive","suspect","sustain","sympathy","talent","target","technique","temporary","tend",
"tension","territory","theory","thorough","threat","tiny","tolerate","tough","trace","tradition",
"transfer","transform","tremendous","trend","trial","trigger","triumph","typical","ultimate","unique",
"universe","urgent","utilize","vague","valid","valuable","vanish","various","vast","vehicle",
"vertical","victim","violent","virtue","visible","vision","vital","volume","vulnerable","warn",
"wealth","weigh","whatever","whereas","whisper","widespread","willing","witness","worthwhile","yield"];

/* ================= STATE ================= */
const state = { words: [], quiz: null, view: 'catch', profileName: null };
const PROFILE_STORAGE_KEY = 'vocabOrbitProfileName';

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function todayKey(){
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

/* ================= PROFILE (name-only, no password) ================= */
function normalizeName(raw){
  return raw.trim().replace(/\s+/g,' ').toLowerCase();
}

function initAuthUI(){
  document.getElementById('authSubmit').addEventListener('click', handleNameSubmit);
  document.getElementById('authName').addEventListener('keydown', e=>{
    if(e.key==='Enter') handleNameSubmit();
  });
  document.getElementById('logoutBtn').addEventListener('click', ()=>{
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    state.profileName = null;
    document.getElementById('authName').value = '';
    showAuth();
  });
}

async function handleNameSubmit(){
  const raw = document.getElementById('authName').value;
  const msg = document.getElementById('authMsg');
  msg.className = 'auth-msg';
  const name = normalizeName(raw);
  if(!name){
    msg.textContent = 'พิมพ์ชื่ออย่างน้อย 1 ตัวอักษร';
    msg.classList.add('error');
    return;
  }
  if(typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('YOUR_SUPABASE') ||
     typeof SUPABASE_ANON_KEY === 'undefined' || SUPABASE_ANON_KEY.includes('YOUR_SUPABASE')){
    msg.textContent = 'ยังไม่ได้ใส่ Supabase URL/anon key ใน js/config.js ให้ครบ';
    msg.classList.add('error');
    return;
  }
  if(typeof sb === 'undefined'){
    msg.textContent = 'เชื่อมต่อ Supabase ไม่สำเร็จ (ตรวจสอบ js/config.js และ js/supabaseClient.js)';
    msg.classList.add('error');
    return;
  }
  msg.textContent = 'กำลังโหลด...';
  localStorage.setItem(PROFILE_STORAGE_KEY, name);
  state.profileName = name;
  try{
    await showApp();
  }catch(err){
    console.error('showApp failed', err);
    msg.textContent = 'เกิดข้อผิดพลาด: ' + (err && err.message ? err.message : String(err));
    msg.classList.add('error');
    showFatalError(err && err.message ? err.message : String(err));
  }
}

function showAuth(){
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('appRoot').style.display = 'none';
}
async function showApp(){
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('appRoot').style.display = 'block';
  document.getElementById('profileBadge').textContent = `👤 ${state.profileName}`;
  try{
    state.words = await loadWords();
  }catch(err){
    console.error('loadWords failed', err);
    showFatalError('โหลดคำศัพท์ไม่สำเร็จ: ' + (err && err.message ? err.message : String(err)));
    state.words = [];
  }
  updateBadge();
  renderSuggestions('');
  if(state.view==='quiz') initQuiz();
  if(state.view==='archive') renderArchive();
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', ()=>{
  initAuthUI();

  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> switchView(btn.dataset.view));
  });

  const input = document.getElementById('wordInput');
  input.addEventListener('input', ()=>{
    input.classList.remove('pulse'); void input.offsetWidth; input.classList.add('pulse');
    renderSuggestions(input.value);
  });
  input.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){ e.preventDefault(); handleEnter(); }
  });
  document.getElementById('sendBtn').addEventListener('click', handleEnter);
  document.getElementById('resSpeak').addEventListener('click', ()=>{
    const w = document.getElementById('resWord').textContent;
    if(w) speak(w);
  });
  document.getElementById('archiveSearch').addEventListener('input', renderArchive);

  const savedName = localStorage.getItem(PROFILE_STORAGE_KEY);
  if(savedName){
    state.profileName = savedName;
    showApp();
  } else {
    showAuth();
  }
});

function switchView(view){
  state.view = view;
  document.querySelectorAll('.tab-btn').forEach(b=> b.classList.toggle('active', b.dataset.view===view));
  document.querySelectorAll('.view').forEach(v=> v.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
  if(view==='quiz') initQuiz();
  if(view==='archive') renderArchive();
}

function updateBadge(){
  document.getElementById('wordCountBadge').textContent = `🗂 คลัง: ${state.words.length} คำ`;
}

/* ================= SUPABASE DATA LAYER ================= */
function rowToWord(r){
  const meaningsTh = Array.isArray(r.meanings_th) && r.meanings_th.length
    ? r.meanings_th
    : (r.meaning_th ? [r.meaning_th] : []);
  return {
    id: r.id,
    word: r.word,
    phonetic: r.phonetic || '',
    defEn: r.def_en || '',
    meaningTh: meaningsTh[0] || r.meaning_th || '',
    meaningsTh: meaningsTh,
    imageUrl: r.image_url || '',
    correctStreak: r.correct_streak || 0,
    wrongStreak: r.wrong_streak || 0,
    timesAsked: r.times_asked || 0,
    addedAt: r.added_at ? new Date(r.added_at).getTime() : Date.now()
  };
}

async function loadWords(){
  const {data, error} = await sb.from('words')
    .select('*')
    .eq('profile_name', state.profileName)
    .order('added_at', {ascending:false});
  if(error){ console.warn('loadWords', error); return []; }
  return (data||[]).map(rowToWord);
}

async function insertWord(entry){
  const {data, error} = await sb.from('words').insert({
    profile_name: state.profileName,
    word: entry.word,
    phonetic: entry.phonetic,
    def_en: entry.defEn,
    meaning_th: entry.meaningTh,
    meanings_th: entry.meaningsTh || [],
    image_url: entry.imageUrl || ''
  }).select().single();
  if(error){ console.warn('insertWord', error); return { word: null, error }; }
  return { word: rowToWord(data), error: null };
}

async function updateWordRow(id, patch){
  const dbPatch = {};
  if('correctStreak' in patch) dbPatch.correct_streak = patch.correctStreak;
  if('wrongStreak' in patch) dbPatch.wrong_streak = patch.wrongStreak;
  if('timesAsked' in patch) dbPatch.times_asked = patch.timesAsked;
  const {error} = await sb.from('words').update(dbPatch).eq('id', id).eq('profile_name', state.profileName);
  if(error) console.warn('updateWordRow', error);
}

async function editWordRow(id, patch){
  const dbPatch = {};
  if('word' in patch) dbPatch.word = patch.word;
  if('meaningTh' in patch) dbPatch.meaning_th = patch.meaningTh;
  if('meaningsTh' in patch) dbPatch.meanings_th = patch.meaningsTh;
  if('defEn' in patch) dbPatch.def_en = patch.defEn;
  const {error} = await sb.from('words').update(dbPatch).eq('id', id).eq('profile_name', state.profileName);
  if(error){ console.warn('editWordRow', error); return { ok:false, error }; }
  return { ok:true, error:null };
}

async function deleteWordRow(id){
  const {error} = await sb.from('words').delete().eq('id', id).eq('profile_name', state.profileName);
  if(error) console.warn('deleteWordRow', error);
}

async function loadQuizRow(dateKey){
  const {data, error} = await sb.from('daily_quizzes')
    .select('*')
    .eq('profile_name', state.profileName)
    .eq('quiz_date', dateKey)
    .maybeSingle();
  if(error){ console.warn('loadQuizRow', error); return null; }
  if(!data) return null;
  return {
    date: data.quiz_date,
    questions: data.questions || [],
    currentIndex: data.current_index || 0,
    score: data.score || 0,
    insufficient: !!data.insufficient
  };
}

async function saveQuizRow(){
  const q = state.quiz;
  if(!q) return;
  const {error} = await sb.from('daily_quizzes').upsert({
    profile_name: state.profileName,
    quiz_date: q.date,
    questions: q.questions,
    current_index: q.currentIndex,
    score: q.score,
    insufficient: !!q.insufficient
  }, {onConflict: 'profile_name,quiz_date'});
  if(error) console.warn('saveQuizRow', error);
}

/* ================= CATCH VIEW: suggestions ================= */
function renderSuggestions(prefix){
  const zone = document.getElementById('orbitZone');
  zone.innerHTML = '';
  const p = prefix.trim().toLowerCase();
  if(!p){ return; }
  const savedWords = state.words.map(w=>w.word).filter(Boolean);
  const pool = Array.from(new Set([...WORD_BANK, ...savedWords]));
  let matches = pool.filter(w => w.startsWith(p) && w !== p);
  matches = shuffle(matches).slice(0,5);

  matches.forEach((word, i)=>{
    const el = document.createElement('div');
    el.className = 'satellite';
    el.textContent = word;
    const top = 8 + Math.random()*70;
    const left = (i * (92/Math.max(matches.length,1))) + Math.random()*6;
    const dur = 4 + Math.random()*3;
    const delay = Math.random()*2;
    el.style.top = top+'%';
    el.style.left = left+'%';
    el.style.animationDuration = dur+'s, .3s';
    el.style.animationDelay = delay+'s, 0s';
    el.addEventListener('click', ()=>{
      const input = document.getElementById('wordInput');
      input.value = word;
      handleEnter();
    });
    zone.appendChild(el);
  });
}

/* ================= CATCH VIEW: submit word ================= */
async function handleEnter(){
  const input = document.getElementById('wordInput');
  const raw = input.value.trim();
  if(!raw) return;
  const word = raw.toLowerCase();
  document.getElementById('orbitZone').innerHTML = '';

  const existing = state.words.find(w => w.word === word);
  if(existing){
    showResultCard(existing, false);
    speak(existing.word);
    input.value = '';
    return;
  }

  showLoadingCard(word);
  const slowNoticeTimer = setTimeout(()=>{
    const el = document.getElementById('resMeaning');
    if(el) el.innerHTML = '<span class="loading-dots">🛰 เน็ตช้าหน่อย รอแป๊บนึงนะ...</span>';
  }, 3000);
  const data = await fetchWordData(word);
  clearTimeout(slowNoticeTimer);
  const meaningsTh = (data.meaningsTh && data.meaningsTh.length)
    ? data.meaningsTh
    : ['ไม่พบความหมาย ลองแก้ไขในคลังดาวภายหลัง'];
  const draft = {
    word: word,
    phonetic: data.phonetic || '',
    defEn: data.defEn || '',
    meaningTh: meaningsTh[0],
    meaningsTh: meaningsTh,
    imageUrl: data.imageUrl || ''
  };
  const result = await insertWord(draft);
  if(result.word){
    state.words.unshift(result.word);
    updateBadge();
    showResultCard(result.word, true);
    speak(result.word.word);
  } else {
    const errMsg = (result.error && result.error.message) ? result.error.message : 'ไม่ทราบสาเหตุ';
    showFatalError('บันทึกคำศัพท์ไม่สำเร็จ: ' + errMsg);
    showResultCard({...draft, correctStreak:0, wrongStreak:0}, false);
    const statusEl = document.getElementById('resStatus');
    statusEl.textContent = '⚠ บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง';
    statusEl.className = 'result-status';
    speak(draft.word);
  }
  input.value = '';
}

async function fetchImageUrl(word){
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), 6000);
  try{
    const res = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(word)}&page_size=1&mature=false`, {signal: controller.signal});
    clearTimeout(timer);
    if(!res.ok) return '';
    const json = await res.json();
    if(json.results && json.results[0]){
      return json.results[0].thumbnail || json.results[0].url || '';
    }
    return '';
  }catch(e){
    clearTimeout(timer);
    return '';
  }
}

async function fetchWordData(word){
  const dictController = new AbortController();
  const transController = new AbortController();
  const dictTimer = setTimeout(()=>dictController.abort(), 6000);
  const transTimer = setTimeout(()=>transController.abort(), 6000);

  const dictPromise = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {signal: dictController.signal})
    .then(res => res.ok ? res.json() : null)
    .catch(() => null);

  const transPromise = fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|th`, {signal: transController.signal})
    .then(res => res.ok ? res.json() : null)
    .catch(() => null);

  const imagePromise = fetchImageUrl(word);

  const [dictJson, transJson, imageUrl] = await Promise.all([dictPromise, transPromise, imagePromise]);
  clearTimeout(dictTimer);
  clearTimeout(transTimer);

  let phonetic='', defEn='';
  if(dictJson && dictJson[0]){
    const e = dictJson[0];
    phonetic = e.phonetic || (e.phonetics && (e.phonetics.find(p=>p.text)||{}).text) || '';
    const meaning = e.meanings && e.meanings[0];
    if(meaning && meaning.definitions && meaning.definitions[0]){
      defEn = meaning.definitions[0].definition;
    }
  }

  const meaningsTh = extractRankedThaiMeanings(transJson);
  return {phonetic, defEn, meaningsTh, imageUrl: imageUrl || ''};
}

// Pulls the primary translation plus alternate translations from MyMemory's
// "matches" array (community translation memory), ranks by match/quality
// score, dedupes, and returns up to 3 distinct Thai meanings — most
// commonly-used / highest-confidence first.
function cleanTranslationText(raw){
  if(!raw) return '';
  // strip any HTML/XML/SVG markup that sometimes leaks in from scraped
  // translation-memory sources (e.g. "<g id=\"2\">3</g>")
  let t = String(raw).replace(/<[^>]*>/g, '');
  // collapse repeated whitespace
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function containsThai(text){
  return /[\u0E00-\u0E7F]/.test(text);
}

function extractRankedThaiMeanings(transJson){
  if(!transJson) return [];
  const candidates = [];
  if(transJson.responseData && transJson.responseData.translatedText){
    candidates.push({ text: transJson.responseData.translatedText, score: 1 });
  }
  if(Array.isArray(transJson.matches)){
    transJson.matches.forEach(m=>{
      if(!m) return;
      const text = m.translation || '';
      if(!text) return;
      let score = 0.5;
      if(typeof m.match === 'number') score = m.match;
      else if(typeof m.quality === 'number') score = m.quality / 100;
      candidates.push({ text, score });
    });
  }
  candidates.sort((a,b) => b.score - a.score);
  const seen = new Set();
  const result = [];
  for(const c of candidates){
    const t = cleanTranslationText(c.text);
    if(!t) continue;
    if(!containsThai(t)) continue; // drop garbage/non-Thai noise (stray tags, source-language echoes, etc.)
    const key = t.toLowerCase();
    if(seen.has(key)) continue;
    seen.add(key);
    result.push(t);
    if(result.length >= 3) break;
  }
  return result;
}

function showLoadingCard(word){
  const card = document.getElementById('resultCard');
  card.classList.add('show');
  const img = document.getElementById('resImage');
  img.classList.remove('show');
  img.src = '';
  document.getElementById('resWord').textContent = word;
  document.getElementById('resPhonetic').textContent = '';
  document.getElementById('resStatus').textContent = '';
  document.getElementById('resMeaningList').innerHTML = '<li class="loading-dots">🛰 กำลังค้นหาความหมายจากอวกาศ...</li>';
  document.getElementById('resDef').textContent = '';
}

function showResultCard(entry, isNew){
  const card = document.getElementById('resultCard');
  card.classList.add('show');
  const img = document.getElementById('resImage');
  if(entry.imageUrl){
    img.onerror = () => img.classList.remove('show');
    img.src = entry.imageUrl;
    img.alt = entry.word;
    img.classList.add('show');
  } else {
    img.classList.remove('show');
    img.src = '';
  }
  document.getElementById('resWord').textContent = entry.word;
  document.getElementById('resPhonetic').textContent = entry.phonetic || '';
  const status = document.getElementById('resStatus');
  status.textContent = isNew ? '✓ บันทึกคำใหม่ลงคลังดาวแล้ว' : '📖 มีอยู่ในคลังดาวแล้ว';
  status.className = 'result-status' + (isNew ? ' new' : '');
  const meanings = (entry.meaningsTh && entry.meaningsTh.length) ? entry.meaningsTh : [entry.meaningTh];
  const list = document.getElementById('resMeaningList');
  list.innerHTML = '';
  meanings.forEach(m=>{
    const li = document.createElement('li');
    li.textContent = m;
    list.appendChild(li);
  });
  document.getElementById('resDef').textContent = entry.defEn ? entry.defEn : '';
}

function speak(word){
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }catch(e){ /* ignore */ }
}

/* ================= QUIZ VIEW ================= */
function computeWeight(w){
  if((w.wrongStreak||0) >= 1) return 4;
  if((w.correctStreak||0) >= 3) return 1;
  return 2;
}

// Picks `n` distinct items from `items`, weighted by `weights`, with no
// duplicates — so higher-weight (frequently-wrong) words are more LIKELY
// to be picked, but every picked word is still unique.
// (Efraimidis-Spirakis weighted reservoir sampling)
function weightedSampleWithoutReplacement(items, weights, n){
  const keyed = items.map((item, i) => ({
    item,
    key: Math.pow(Math.random(), 1 / Math.max(weights[i], 0.0001))
  }));
  keyed.sort((a,b) => b.key - a.key);
  return keyed.slice(0, n).map(x => x.item);
}

async function initQuiz(){
  const key = todayKey();
  let quiz = await loadQuizRow(key);
  if(!quiz){
    if(state.words.length < 4){
      state.quiz = {date:key, insufficient:true, questions:[], currentIndex:0, score:0};
      renderQuiz();
      return;
    }
    const questionCount = Math.min(5, state.words.length);
    const pickedWords = weightedSampleWithoutReplacement(
      state.words,
      state.words.map(computeWeight),
      questionCount
    );
    const questions = pickedWords.map(w=>{
      const distractorPool = state.words
        .filter(x=>x.id!==w.id && x.meaningTh)
        .map(x=>x.meaningTh)
        .filter(m => m !== w.meaningTh);
      const distractors = shuffle(Array.from(new Set(distractorPool))).slice(0,3);
      while(distractors.length < 3) distractors.push('— ไม่มีตัวเลือกเพิ่มเติม —');
      const choices = shuffle([w.meaningTh, ...distractors]);
      return { wordId:w.id, choices, correct:w.meaningTh, answered:false, selected:null };
    });
    quiz = {date:key, questions, currentIndex:0, score:0, insufficient:false};
    state.quiz = quiz;
    await saveQuizRow();
  } else {
    state.quiz = quiz;
  }
  renderQuiz();
}

function renderQuiz(){
  const container = document.getElementById('quizContainer');
  const quiz = state.quiz;
  if(!quiz || quiz.insufficient){
    container.innerHTML = `<div class="quiz-empty">
      🌌 ต้องมีคำศัพท์ในคลังอย่างน้อย 4 คำก่อนเริ่มภารกิจประจำวัน<br>
      ไปที่แท็บ "ส่งสัญญาณ" เพื่อจดคำศัพท์เพิ่มก่อนนะครับ
    </div>`;
    return;
  }
  const idx = quiz.currentIndex;
  if(idx >= quiz.questions.length){
    container.innerHTML = `<div class="quiz-done">
      🎉 ภารกิจวันนี้เสร็จสมบูรณ์
      <div class="score">${quiz.score} / ${quiz.questions.length}</div>
      กลับมาใหม่พรุ่งนี้เพื่อรับภารกิจชุดใหม่
    </div>`;
    return;
  }
  const q = quiz.questions[idx];
  const w = state.words.find(x=>x.id===q.wordId);
  const quizImg = (w && w.imageUrl)
    ? `<img class="q-image" src="${escapeHtml(w.imageUrl)}" alt="" onerror="this.style.display='none'">`
    : '';

  container.innerHTML = `
    <div class="quiz-head">
      <div class="quiz-title">ภารกิจวันนี้</div>
      <div class="quiz-progress">ข้อ ${idx+1} / ${quiz.questions.length} · คะแนน ${quiz.score}</div>
    </div>
    ${quizImg}
    <div class="q-word">${w ? w.word : ''}</div>
    <div class="q-sub">คำนี้แปลว่าอะไร?</div>
    <div class="choices" id="choicesWrap"></div>
    <button class="next-btn" id="nextBtn">ข้อถัดไป →</button>
  `;

  const wrap = document.getElementById('choicesWrap');
  q.choices.forEach(choice=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice;
    if(q.answered){
      btn.disabled = true;
      if(choice === q.correct) btn.classList.add('correct');
      else if(choice === q.selected) btn.classList.add('wrong');
    }
    btn.addEventListener('click', ()=> answerQuestion(idx, choice));
    wrap.appendChild(btn);
  });

  if(q.answered){
    if(w) speak(w.word);
    document.getElementById('nextBtn').classList.add('show');
  }
  document.getElementById('nextBtn').addEventListener('click', ()=>{
    quiz.currentIndex++;
    saveQuizRow();
    renderQuiz();
  });
}

async function answerQuestion(qIndex, choiceText){
  const quiz = state.quiz;
  const q = quiz.questions[qIndex];
  if(q.answered) return;
  q.answered = true;
  q.selected = choiceText;
  const isCorrect = choiceText === q.correct;
  if(isCorrect) quiz.score++;

  const w = state.words.find(x=>x.id===q.wordId);
  if(w){
    w.timesAsked = (w.timesAsked||0) + 1;
    if(isCorrect){ w.correctStreak = (w.correctStreak||0)+1; w.wrongStreak = 0; }
    else { w.wrongStreak = (w.wrongStreak||0)+1; w.correctStreak = 0; }
    await updateWordRow(w.id, {correctStreak:w.correctStreak, wrongStreak:w.wrongStreak, timesAsked:w.timesAsked});
  }
  await saveQuizRow();
  renderQuiz();
}

/* ================= ARCHIVE VIEW ================= */
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderArchive(){
  const list = document.getElementById('archiveList');
  const q = document.getElementById('archiveSearch').value.trim().toLowerCase();
  const words = state.words
    .filter(w => !q || w.word.includes(q) || (w.meaningTh||'').includes(q))
    .sort((a,b)=> b.addedAt - a.addedAt);

  if(words.length === 0){
    list.innerHTML = `<div class="archive-empty">ยังไม่มีคำศัพท์ในคลัง — ลองไปจดคำใหม่ที่แท็บ "ส่งสัญญาณ" ดูสิ 🚀</div>`;
    return;
  }

  list.innerHTML = '';
  words.forEach(w=>{
    const row = document.createElement('div');
    row.className = 'word-row';
    renderRowView(row, w);
    list.appendChild(row);
  });
}

function renderRowView(row, w){
  const meaningPreview = (w.meaningsTh && w.meaningsTh.length) ? w.meaningsTh.join(' / ') : (w.meaningTh || '-');
  const thumb = w.imageUrl
    ? `<img class="word-row-thumb" src="${escapeHtml(w.imageUrl)}" alt="" onerror="this.style.display='none'">`
    : '';
  row.innerHTML = `
    <div class="word-row-main">
      ${thumb}
      <div class="word-row-text">
        <div class="word-row-word">${escapeHtml(w.word)}</div>
        <div class="word-row-meaning">${escapeHtml(meaningPreview)}</div>
      </div>
    </div>
    <div class="word-row-stats">
      <span class="stat-good">✓${w.correctStreak||0}</span> &nbsp;
      <span class="stat-bad">✗${w.wrongStreak||0}</span>
    </div>
    <button class="edit-btn" title="แก้ไข">✏️</button>
    <button class="del-btn" title="ลบคำนี้">🗑</button>
  `;
  row.querySelector('.del-btn').addEventListener('click', async ()=>{
    await deleteWordRow(w.id);
    state.words = state.words.filter(x=>x.id!==w.id);
    updateBadge();
    renderArchive();
  });
  row.querySelector('.word-row-word').addEventListener('click', ()=> speak(w.word));
  row.querySelector('.edit-btn').addEventListener('click', ()=> renderRowEdit(row, w));
}

function renderRowEdit(row, w){
  const meaningsText = (w.meaningsTh && w.meaningsTh.length ? w.meaningsTh : [w.meaningTh || '']).join('\n');
  row.innerHTML = `
    <div class="word-row-edit-form">
      <input class="edit-word-input" type="text" value="${escapeHtml(w.word)}" placeholder="คำศัพท์ภาษาอังกฤษ">
      <textarea class="edit-meaning-input" rows="3" placeholder="ความหมาย (1 บรรทัด = 1 ความหมาย เรียงสำคัญสุดก่อน)">${escapeHtml(meaningsText)}</textarea>
      <div class="edit-actions">
        <button class="save-edit-btn">บันทึก</button>
        <button class="cancel-edit-btn">ยกเลิก</button>
      </div>
      <div class="edit-msg"></div>
    </div>
  `;
  row.querySelector('.cancel-edit-btn').addEventListener('click', ()=> renderRowView(row, w));
  row.querySelector('.save-edit-btn').addEventListener('click', async ()=>{
    const newWord = row.querySelector('.edit-word-input').value.trim().toLowerCase();
    const meaningsRaw = row.querySelector('.edit-meaning-input').value;
    const meaningsTh = meaningsRaw.split('\n').map(s=>s.trim()).filter(Boolean);
    const msgEl = row.querySelector('.edit-msg');
    msgEl.className = 'edit-msg';
    if(!newWord){ msgEl.textContent = 'กรอกคำศัพท์ด้วยครับ'; msgEl.classList.add('error'); return; }
    if(meaningsTh.length === 0){ msgEl.textContent = 'กรอกความหมายอย่างน้อย 1 อย่าง'; msgEl.classList.add('error'); return; }
    msgEl.textContent = 'กำลังบันทึก...';
    const res = await editWordRow(w.id, { word:newWord, meaningTh:meaningsTh[0], meaningsTh });
    if(!res.ok){
      const isDup = res.error && res.error.code === '23505';
      msgEl.textContent = isDup ? 'คำนี้มีอยู่ในคลังแล้ว ลองใช้คำอื่น' : ('บันทึกไม่สำเร็จ: ' + (res.error && res.error.message ? res.error.message : ''));
      msgEl.classList.add('error');
      return;
    }
    w.word = newWord;
    w.meaningTh = meaningsTh[0];
    w.meaningsTh = meaningsTh;
    renderRowView(row, w);
  });
}
