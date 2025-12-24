let allSurahs = [], currentSurahId = 1;
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const seekSlider = document.getElementById('seekSlider');

// --- 1. إعدادات القائمة الجانبية ---
function toggleMenu() { 
    document.getElementById('sideMenu').classList.toggle('open'); 
}

// --- 2. نظام القرآن الكريم ---
fetch('https://api.alquran.cloud/v1/surah')
    .then(res => res.json())
    .then(data => {
        allSurahs = data.data;
        displaySurahs(allSurahs);
    });

function displaySurahs(surahs) {
    const list = document.getElementById('surahList');
    list.innerHTML = surahs.map(s => `<div class="surah-card" onclick="openSurah(${s.number}, '${s.name}')">${s.number}. ${s.name}</div>`).join('');
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
    
    fetch(`https://api.alquran.cloud/v1/surah/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('ayahsContainer').innerHTML = data.data.ayahs.map(a => 
                `${a.text} <span style="color:var(--gold); font-family: sans-serif; font-size: 1rem;">(${a.numberInSurah})</span>`
            ).join(' ');
        });
}

function showMain() {
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('quran-view').style.display = 'none';
    audio.pause();
    if(playBtn) playBtn.innerText = "▷";
}

// --- 3. المشغل الصوتي المطور ---
function updateAudioSource() {
    const r = document.getElementById('reciterSelect').value;
    
    // خريطة السيرفرات لكل قارئ (لكي يعمل الرابط بشكل صحيح)
    const srv = { 
        'afs': '8',     // العفاسي
        'minsh': '10',   // المنشاوي
        'basit': '7',    // عبد الباسط
        'husr': '13',    // الحصري
        'maher': '12',   // ماهر المعيقلي
        'qtm': '11',     // ناصر القطامي
        'yasser': '11'   // ياسر الدوسري
    };

    // تحديث رابط الصوت بناءً على القارئ المختار والسورة الحالية
    audio.src = `https://server${srv[r]}.mp3quran.net/${r}/${currentSurahId.toString().padStart(3, '0')}.mp3`;
    
    // إذا كان المشغل يعمل، قم بتشغيل القارئ الجديد فوراً
    if (!audio.paused) {
        audio.play();
    }
}


function toggleAudio() {
    if (audio.paused) { audio.play(); playBtn.innerText = "||"; }
    else { audio.pause(); playBtn.innerText = "▷"; }
}

audio.ontimeupdate = () => {
    if (audio.duration) {
        seekSlider.value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('currentTime').innerText = formatTime(audio.currentTime);
        document.getElementById('durationTime').innerText = formatTime(audio.duration);
    }
};

function seekAudio() { audio.currentTime = (seekSlider.value / 100) * audio.duration; }
function formatTime(s) { const m = Math.floor(s/60); const sc = Math.floor(s%60); return `${m}:${sc<10?'0'+sc:sc}`; }

// --- 4. قاعدة بيانات الأذكار الشاملة (بدون أي اختصار) ---
const azkarData = {
    morning: [
        { id: "m1", text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: {اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ}", count: 1 },
        { id: "m2", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: {قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ}", count: 3 },
        { id: "m3", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: {قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِنْ شَرِّ مَا خَلَقَ * وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ}", count: 3 },
        { id: "m4", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: {قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَهِ النَّاسِ * مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ}", count: 3 },
        { id: "m5", text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.", count: 1 },
        { id: "m6", text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.", count: 1 },
        { id: "m7", text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.", count: 3 },
        { id: "m8", text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.", count: 4 },
        { id: "m9", text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", count: 3 },
        { id: "m10", text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.", count: 1 },
        { id: "m11", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.", count: 3 },
        { id: "m12", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.", count: 100 },
        { id: "m13", text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.", count: 100 }
    ],
    evening: [
        { id: "e1", text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ (آية الكرسي)", count: 1 },
        { id: "e2", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1 },
        { id: "e3", text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.", count: 1 },
        { id: "e4", text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.", count: 3 },
        { id: "e5", text: "اللَّهُمَّ إِنَّا نَعُوذُ بِكَ مِنْ أَنْ نُشْرِكَ بِكَ شَيْئًا نَعْلَمُهُ، وَنَسْتَغْفِرُكَ لِمَا لَا نَعْلَمُهُ.", count: 3 }
    ],
    sleep: [
        { id: "s1", text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.", count: 1 },
        { id: "s2", text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.", count: 3 },
        { id: "s3", text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.", count: 1 },
        { id: "s4", text: "سُبْحَانَ اللَّهِ (33)، الْحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (34)", count: 1 }
    ],
    afterPrayer: [
        { id: "p1", text: "أَسْتَغْفِرُ اللَّهَ (ثلاثاً) .. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.", count: 1 },
        { id: "p2", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1 },
        { id: "p3", text: "سُبْحَانَ اللَّهِ", count: 33 },
        { id: "p4", text: "الْحَمْدُ لِلَّهِ", count: 33 },
        { id: "p5", text: "اللَّهُ أَكْبَرُ", count: 33 }
    ]
};

// --- 5. وظائف الأذكار ---
function loadAzkar(cat) {
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    const list = document.getElementById('azkarList');
    const titles = { morning: '☀️ أذكار الصباح', evening: '🌙 أذكار المساء', sleep: '🛌 أذكار النوم', afterPrayer: '📿 بعد الصلاة' };
    document.getElementById('azkar-title').innerText = titles[cat];

    list.innerHTML = azkarData[cat].map(z => {
        let saved = localStorage.getItem(`zekr_${z.id}`);
        let cur = saved !== null ? parseInt(saved) : z.count;
        return `
            <div class="zekr-card ${cur === 0 ? 'done' : ''}" onclick="countZekr('${z.id}')">
                <div class="zekr-text">${z.text}</div>
                <div class="zekr-counter">بقي: <span id="num-${z.id}">${cur}</span></div>
            </div>`;
    }).join('');
}

function countZekr(id) {
    const el = document.getElementById(`num-${id}`);
    if (!el) return;
    
    let c = parseInt(el.innerText);
    if (c > 0) {
        c--; 
        el.innerText = c;
        localStorage.setItem(`zekr_${id}`, c);
        
        // أول ما يوصل الصفر، نغير الألوان فوراً
        if (c === 0) {
            const card = el.closest('.zekr-card');
            card.classList.add('completed');
            card.classList.add('done'); // للمحافظة على الشفافية القديمة إذا كنت تبيها
        }
    }
}

}

function backToAzkarCats() {
    document.getElementById('azkarCats').style.display = 'grid';
    document.getElementById('azkar-content').style.display = 'none';
}

function resetAzkarProgress() {
    if (confirm("تصفير جميع عدادات الأذكار؟")) {
        Object.keys(localStorage).forEach(k => { if (k.startsWith('zekr_')) localStorage.removeItem(k); });
        location.reload();
    }
}

// --- 6. السبحة والعداد ---
let sCount = parseInt(localStorage.getItem('sebhaCount')) || 0;
function incrementSebha() {
    sCount++;
    document.getElementById('sebhaCounter').innerText = sCount;
    localStorage.setItem('sebhaCount', sCount);
}
function resetSebha() {
    sCount = 0;
    document.getElementById('sebhaCounter').innerText = 0;
    localStorage.setItem('sebhaCount', 0);
}

function updateCountdown() {
    const now = new Date();
    const mid = new Date(); mid.setHours(24, 0, 0, 0);
    const diff = mid - now;
    const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
    document.getElementById('countdown-timer').innerText = `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
    if (diff <= 0) resetSebha();
}
setInterval(updateCountdown, 1000);

// --- 7. التبديل العام ---
function switchMainTab(t) {
    document.querySelectorAll('.main-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(t + 'Tab').classList.add('active');
    ['quran-section', 'azkar-section', 'sebha-section'].forEach(s => {
        document.getElementById(s).style.display = s.startsWith(t) ? 'block' : 'none';
    });
    audio.pause();
    document.getElementById('sideMenu').classList.remove('open');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.getElementById('darkModeBtn').innerText = document.body.classList.contains('dark-mode') ? "☀️" : "🌙";
}

function changeFontSize(d) {
    const el = document.getElementById('ayahsContainer');
    let s = window.getComputedStyle(el).fontSize;
    el.style.fontSize = (parseFloat(s) + d) + 'px';
}

// البدء
document.getElementById('sebhaCounter').innerText = sCount;
updateCountdown();
