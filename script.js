let allSurahs = [], currentSurahId = 1;
const audio = document.getElementById('audioPlayer'), playBtn = document.getElementById('playBtn'), seekSlider = document.getElementById('seekSlider');

// بيانات الأذكار مفصلة (كل ذكر لحاله)
const azkarData = {
    morning: [
        { id: "m_ay", text: "أعوذ بالله من الشيطان الرجيم: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ)", count: 1 },
        { id: "m_ix", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ: (قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ)", count: 3 },
        { id: "m_fl", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ)", count: 3 },
        { id: "m_ns", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ، مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ)", count: 3 },
        { id: "m_sub", text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", count: 100 }
    ],
    evening: [
        { id: "e_ay", text: "آية الكرسي: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)", count: 1 },
        { id: "e_ix", text: "سورة الإخلاص", count: 3 },
        { id: "e_fl", text: "سورة الفلق", count: 3 },
        { id: "e_ns", text: "سورة الناس", count: 3 },
        { id: "e_ams", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 1 },
        { id: "e_sub", text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", count: 100 }
    ],
    sleep: [
        { id: "s_bas", text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1 },
        { id: "s_sub", text: "سُبْحَانَ اللهِ", count: 33 },
        { id: "s_ham", text: "الْحَمْدُ للهِ", count: 33 },
        { id: "s_akb", text: "اللهُ أَكْبَرُ", count: 34 }
    ]
};

window.onload = () => {
    checkDailyReset();
    setInterval(updateResetTimer, 1000);
    updateSebhaUI();
};

// تحميل الأذكار مع الحفظ التلقائي
function loadAzkar(cat) {
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    document.getElementById('azkar-title').innerText = cat==='morning'?'☀️ أذكار الصباح':cat==='evening'?'🌙 أذكار المساء':'🛌 أذكار النوم';
    
    document.getElementById('azkarList').innerHTML = azkarData[cat].map(z => {
        let saved = localStorage.getItem(`zekr_${z.id}`);
        let cur = saved !== null ? parseInt(saved) : z.count;
        return `
            <div class="zekr-card ${cur===0?'done':''}" id="card-${z.id}" onclick="countZekr('${z.id}', ${z.count})">
                <div class="zekr-text">${z.text}</div>
                <div class="zekr-counter">المتبقي: <span id="num-${z.id}">${cur}</span></div>
            </div>`;
    }).join('');
}

function countZekr(id, total) {
    let el = document.getElementById(`num-${id}`);
    let c = parseInt(el.innerText);
    if (c > 0) {
        c--;
        el.innerText = c;
        localStorage.setItem(`zekr_${id}`, c);
        if (c === 0) {
            document.getElementById(`card-${id}`).classList.add('done');
            if (navigator.vibrate) navigator.vibrate(80);
        }
    }
}

function resetAzkarProgress() {
    if(confirm("تصفير العدادات؟")) {
        Object.keys(localStorage).forEach(k => { if(k.startsWith('zekr_')) localStorage.removeItem(k); });
        location.reload();
    }
}

// القرآن والسبحة
let sebhaCount = parseInt(localStorage.getItem('sebhaCount')) || 0;
let sebhaGoal = parseInt(localStorage.getItem('sebhaGoal')) || 1000;

function incrementSebha() { sebhaCount++; localStorage.setItem('sebhaCount', sebhaCount); updateSebhaUI(); if(navigator.vibrate) navigator.vibrate(40); }
function updateSebhaUI() {
    document.getElementById('sebhaCounter').innerText = sebhaCount;
    let p = Math.min((sebhaCount/sebhaGoal)*100, 100);
    document.getElementById('sebhaProgress').style.width = p + "%";
    document.getElementById('goalText').innerText = `المتبقي للهدف: ${Math.max(sebhaGoal-sebhaCount, 0)}`;
}

function checkDailyReset() {
    const today = new Date().toLocaleDateString();
    if(localStorage.getItem('lastDate') !== today) {
        sebhaCount = 0; localStorage.setItem('sebhaCount', 0);
        localStorage.setItem('lastDate', today);
    }
}

function updateResetTimer() {
    const now = new Date(), mid = new Date(); mid.setHours(24,0,0,0);
    const diff = mid - now;
    const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
    document.getElementById('resetTimer').innerText = `${h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
}

// دوال التنقل والقرآن
function switchMainTab(t) {
    document.querySelectorAll('.main-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(t+'Tab').classList.add('active');
    document.getElementById('quran-section').style.display = t==='quran'?'block':'none';
    document.getElementById('azkar-section').style.display = t==='azkar'?'block':'none';
    document.getElementById('sebha-section').style.display = t==='sebha'?'block':'none';
    audio.pause();
}

fetch('https://api.alquran.cloud/v1/surah').then(r => r.json()).then(d => { allSurahs = d.data; displaySurahs(allSurahs); });
function displaySurahs(s) { document.getElementById('surahList').innerHTML = s.map(x => `<div class="surah-card" onclick="openSurah(${x.number},'${x.name}')">${x.number}. ${x.name}</div>`).join(''); }
function openSurah(id, name) {
    currentSurahId = id; document.getElementById('main-view').style.display = 'none'; document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name; updateAudioSource();
    fetch(`https://api.alquran.cloud/v1/surah/${id}`).then(r => r.json()).then(d => {
        document.getElementById('ayahsContainer').innerHTML = d.data.ayahs.map(a => `${a.text} <span class="ayah-num">(${a.numberInSurah})</span>`).join(' ');
    });
}
function updateAudioSource() {
    const r = document.getElementById('reciterSelect').value; const srv = { 'afs':'8', 'minsh':'10', 'basit':'7', 'husr':'13' };
    audio.src = `https://server${srv[r]}.mp3quran.net/${r}/${currentSurahId.toString().padStart(3,'0')}.mp3`;
}
function toggleAudio() { if(audio.paused) { audio.play(); playBtn.innerText="||"; } else { audio.pause(); playBtn.innerText="▷"; } }
function backToAzkarCats() { document.getElementById('azkarCats').style.display='grid'; document.getElementById('azkar-content').style.display='none'; }
function filterSurahs() { let t = document.getElementById('searchInput').value; displaySurahs(allSurahs.filter(s => s.name.includes(t))); }
function resetSebha() { sebhaCount=0; updateSebhaUI(); }
function setSebhaGoal() { sebhaGoal = document.getElementById('sebhaGoal').value; updateSebhaUI(); }
