let allSurahs = [], currentSurahId = 1;
let isMuted = localStorage.getItem('isMuted') === 'true';
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const seekSlider = document.getElementById('seekSlider');
const notifySound = document.getElementById('notificationSound');

// --- 1. الإعدادات العامة ---
function toggleMenu() { document.getElementById('sideMenu').classList.toggle('open'); }
function toggleMute() { 
    isMuted = !isMuted; 
    localStorage.setItem('isMuted', isMuted); 
    document.getElementById('muteBtn').innerText = isMuted ? "🔇" : "🔊"; 
}
function playNotify() { 
    if (!isMuted && notifySound) { notifySound.currentTime = 0; notifySound.play().catch(e => {}); } 
}

// --- 2. القرآن الكريم والقراء ---
fetch('https://api.alquran.cloud/v1/surah').then(res => res.json()).then(data => { 
    allSurahs = data.data; 
    displaySurahs(allSurahs); 
});

function displaySurahs(surahs) { 
    const list = document.getElementById('surahList');
    if(list) list.innerHTML = surahs.map(s => `<div class="surah-card" onclick="openSurah(${s.number}, '${s.name}')">${s.number}. ${s.name}</div>`).join(''); 
}

function filterSurahs() { 
    const term = document.getElementById('searchInput').value; 
    displaySurahs(allSurahs.filter(s => s.name.includes(term))); 
}

function openSurah(id, name) {
    currentSurahId = id;
    document.getElementById('sideMenu').classList.remove('open');
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name;
    updateAudioSource();
    fetch(`https://api.alquran.cloud/v1/surah/${id}`).then(res => res.json()).then(data => {
        document.getElementById('ayahsContainer').innerHTML = data.data.ayahs.map(a => `${a.text} (${a.numberInSurah})`).join(' ');
    });
}

function showMain() { 
    document.getElementById('main-view').style.display = 'block'; 
    document.getElementById('quran-view').style.display = 'none'; 
    if(audio) audio.pause(); 
}

function updateAudioSource() {
    const r = document.getElementById('reciterSelect').value;
    const srv = { 
        'afs': '8', 'minsh': '10', 'basit': '7', 'husr': '13', 'maher': '12', 
        'qtm': '11', 'yasser': '11', 'shat': '11', 'ajm': '8', 'saud': '11',
        'shur': '11', 'fares': '8', 'hazz': '11', 'duss': '6', 'mansor': '11', 'khan': '8'
    };
    audio.src = `https://server${srv[r] || '11'}.mp3quran.net/${r}/${currentSurahId.toString().padStart(3, '0')}.mp3`;
    if (!audio.paused) audio.play();
}

function toggleAudio() { 
    if (audio.paused) { audio.play(); playBtn.innerText = "||"; } 
    else { audio.pause(); playBtn.innerText = "▷"; } 
}

// --- 3. قاعدة الأذكار الشاملة (النسخة الكاملة) ---
const azkarData = {
    morning: [
        { id: "m1", text: "أعوذ بالله من الشيطان الرجيم: (اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ)", count: 1 },
        { id: "m2", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ)", count: 3 },
        { id: "m3", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ)", count: 3 },
        { id: "m4", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ)", count: 3 },
        { id: "m5", text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ", count: 1 },
        { id: "m6", text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", count: 1 },
        { id: "m7", text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3 },
        { id: "m8", text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", count: 4 },
        { id: "m9", text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7 },
        { id: "m10", text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
        { id: "m11", text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", count: 1 },
        { id: "m12", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ", count: 3 },
        { id: "m13", text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 1 },
        { id: "m14", text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ", count: 3 },
        { id: "m15", text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", count: 100 },
        { id: "m16", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
        { id: "m17", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 100 },
        { id: "m18", text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: 10 }
    ],
    evening: [
        { id: "e1", text: "أعوذ بالله من الشيطان الرجيم (آية الكرسي)", count: 1 },
        { id: "e2", text: "سورة الإخلاص والفلق والناس", count: 3 },
        { id: "e3", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 1 },
        { id: "e4", text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
        { id: "e5", text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: 10 }
    ],
    sleep: [
        { id: "s1", text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا", count: 1 },
        { id: "s2", text: "سُبْحَانَ اللَّهِ (33)، الْحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (34)", count: 1 },
        { id: "s3", text: "قراءة آية الكرسي"، count: 1 }
    ],
    afterPrayer: [
        { id: "p1", text: "أَسْتَغْفِرُ اللَّهَ", count: 3 },
        { id: "p2", text: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجلالِ وَالْإِكْرَامِ", count: 1 },
        { id: "p3", text: "سُبْحَانَ اللَّهِ (33)، الْحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (33)", count: 1 }
    ],
    generalDuas: [
        { id: "d1", text: "اللهم صل وسلم على نبينا محمد", count: 10 },
        { id: "d2", text: "لا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", count: 1 }
    ]
};

// --- 4. تشغيل الأذكار والسبحة ---
function loadAzkar(cat) {
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    const list = document.getElementById('azkarList');
    const titles = { morning: 'أذكار الصباح', evening: 'أذكار المساء', sleep: 'أذكار النوم', afterPrayer: 'بعد الصلاة', generalDuas: 'أدعية نبوية' };
    document.getElementById('azkar-title').innerText = titles[cat];
    list.innerHTML = azkarData[cat].map(z => {
        let saved = localStorage.getItem(`zekr_${z.id}`);
        let cur = saved !== null ? parseInt(saved) : z.count;
        return `<div class="zekr-card ${cur === 0 ? 'completed' : ''}" onclick="countZekr('${z.id}')">
            <div class="zekr-text">${z.text}</div>
            <div style="text-align:center">المتبقي: <span id="num-${z.id}">${cur}</span></div>
        </div>`;
    }).join('');
}

function countZekr(id) {
    const el = document.getElementById(`num-${id}`);
    let c = parseInt(el.innerText);
    if (c > 0) {
        c--; el.innerText = c;
        localStorage.setItem(`zekr_${id}`, c);
        if (c === 0) { el.closest('.zekr-card').classList.add('completed'); playNotify(); }
    }
}

function backToAzkarCats() { 
    document.getElementById('azkarCats').style.display = 'grid'; 
    document.getElementById('azkar-content').style.display = 'none'; 
}

function resetAzkarProgress() { 
    if (confirm("تصفير الأذكار؟")) { 
        Object.keys(localStorage).forEach(k => { if(k.startsWith('zekr_')) localStorage.removeItem(k); });
        location.reload();
    }
}

// --- 5. السبحة والعدادات ---
let sCount = parseInt(localStorage.getItem('sebhaCount')) || 0;
let sGoal = parseInt(localStorage.getItem('sebhaGoal')) || 100;

function updateGoal() {
    sGoal = parseInt(document.getElementById('sebhaGoal').value) || 100;
    localStorage.setItem('sebhaGoal', sGoal);
    const msg = document.getElementById('goalStatus');
    msg.style.opacity = 1; setTimeout(() => msg.style.opacity = 0, 2000);
    updateProgress();
}

function incrementSebha() {
    sCount++; document.getElementById('sebhaCounter').innerText = sCount;
    localStorage.setItem('sebhaCount', sCount);
    updateProgress();
    if(sCount == sGoal) playNotify();
}

function updateProgress() {
    const bar = document.getElementById('sebhaBar');
    if(bar) bar.style.width = Math.min((sCount/sGoal)*100, 100) + "%";
}

function resetSebha() {
    if(confirm("تصفير؟")) { sCount = 0; document.getElementById('sebhaCounter').innerText = 0; localStorage.setItem('sebhaCount', 0); updateProgress(); }
}

function switchMainTab(t) {
    document.querySelectorAll('.main-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(t + 'Tab').classList.add('active');
    ['quran-section', 'azkar-section', 'sebha-section'].forEach(s => {
        document.getElementById(s).style.display = s.startsWith(t) ? 'block' : 'none';
    });
}

function updateCountdown() {
    const now = new Date(); const t = new Date(); t.setHours(24,0,0,0);
    const diff = t - now;
    const h = Math.floor(diff/3600000); const m = Math.floor((diff%3600000)/60000); const s = Math.floor((diff%60000)/1000);
    document.getElementById('countdown-timer').innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

setInterval(updateCountdown, 1000);
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function changeFontSize(d) { let el = document.getElementById('ayahsContainer'); let s = window.getComputedStyle(el).fontSize; el.style.fontSize = (parseFloat(s)+d)+'px'; }

// تهيئة
document.getElementById('sebhaCounter').innerText = sCount;
document.getElementById('sebhaGoal').value = sGoal;
updateProgress();
