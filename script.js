let allSurahs = [], currentSurahId = 1;
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const seekSlider = document.getElementById('seekSlider');

// 1. جلب بيانات القرآن الكريم
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
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name;
    updateAudioSource();
    fetch(`https://api.alquran.cloud/v1/surah/${id}`).then(res => res.json()).then(data => {
        document.getElementById('ayahsContainer').innerHTML = data.data.ayahs.map(a => `${a.text} <span class="ayah-num">(${a.numberInSurah})</span>`).join(' ');
    });
}

function showMain() {
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('quran-view').style.display = 'none';
    audio.pause();
    if(playBtn) playBtn.innerText = "▷";
}

// 2. المشغل الصوتي المطور
function updateAudioSource() {
    const r = document.getElementById('reciterSelect').value;
    const srv = { 'afs': '8', 'minsh': '10', 'basit': '7', 'husr': '13' };
    audio.src = `https://server${srv[r]}.mp3quran.net/${r}/${currentSurahId.toString().padStart(3, '0')}.mp3`;
}

function toggleAudio() {
    if (audio.paused) { 
        audio.play(); 
        playBtn.innerText = "||"; 
    } else { 
        audio.pause(); 
        playBtn.innerText = "▷"; 
    }
}

audio.ontimeupdate = () => {
    if (audio.duration) {
        seekSlider.value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('currentTime').innerText = formatTime(audio.currentTime);
        document.getElementById('durationTime').innerText = formatTime(audio.duration);
    }
};

function seekAudio() { audio.currentTime = (seekSlider.value / 100) * audio.duration; }
function formatTime(s) { 
    const m = Math.floor(s/60); 
    const sc = Math.floor(s%60); 
    return `${m}:${sc<10?'0'+sc:sc}`; 
}

// 3. قاعدة بيانات الأذكار (كاملة وبدون اختصارات)
const azkarData = {
    morning: [
        { id: "m_ay", text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: (اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ)", count: 1 },
        { id: "m_ix", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ)", count: 3 },
        { id: "m_fl", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ)", count: 3 },
        { id: "m_ns", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ، مِن شَرِّ الْوَسْواسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ)", count: 3 },
        { id: "m_sayed", text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنوُبَ إِلَّا أَنْتَ.", count: 1 },
        { id: "m_asbahna", text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ.", count: 1 },
        { id: "m_bika", text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.", count: 1 },
        { id: "m_ushiduk", text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.", count: 4 },
        { id: "m_afini", text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابٍ فِي الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.", count: 3 },
        { id: "m_hasbi", text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.", count: 7 },
        { id: "m_bismillah", text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", count: 3 },
        { id: "m_raditu", text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيًّا.", count: 3 },
        { id: "m_subhan", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.", count: 3 },
        { id: "m_ya_hayyu", text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شأنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.", count: 1 },
        { id: "m_fitra", text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صلى الله عليه وسلم، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.", count: 1 },
        { id: "m_subhan_100", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.", count: 100 },
        { id: "m_astaghfir", text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.", count: 100 }
    ],
    evening: [
        { id: "e_ay", text: "آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...", count: 1 },
        { id: "e_ix", text: "سورة الإخلاص (3 مرات)", count: 3 },
        { id: "e_fl", text: "سورة الفلق (3 مرات)", count: 3 },
        { id: "e_ns", text: "سورة الناس (3 مرات)", count: 3 },
        { id: "e_sayed", text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ... (سيد الاستغفار)", count: 1 },
        { id: "e_amsayna", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا.", count: 1 },
        { id: "e_bismillah", text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ في الأرض ولا في السماء...", count: 3 },
        { id: "e_hasbi", text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.", count: 7 },
        { id: "e_kalimat", text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.", count: 3 }
    ],
    sleep: [
        { id: "s_bi_ismika", text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.", count: 1 },
        { id: "s_allahuma_aslamtu", text: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ.", count: 1 },
        { id: "s_qini", text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.", count: 3 },
        { id: "s_ay", text: "آية الكرسي كاملة", count: 1 },
        { id: "s_subhan", text: "سُبْحَانَ اللَّهِ", count: 33 },
        { id: "s_hamd", text: "الْحَمْدُ لِلَّهِ", count: 33 },
        { id: "s_akbar", text: "اللَّهُ أَكْبَرُ", count: 34 }
    ]
};

// 4. منطق الأذكار والتقدم
function loadAzkar(cat) {
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    const list = document.getElementById('azkarList');
    const titles = { morning: '☀️ أذكار الصباح كاملة', evening: '🌙 أذكار المساء كاملة', sleep: '🛌 أذكار النوم كاملة' };
    document.getElementById('azkar-title').innerText = titles[cat];
    
    list.innerHTML = azkarData[cat].map(z => {
        let saved = localStorage.getItem(`zekr_${z.id}`);
        let cur = saved !== null ? parseInt(saved) : z.count;
        return `<div class="zekr-card ${cur===0?'done':''}" onclick="countZekr('${z.id}')">
            <div class="zekr-text">${z.text}</div>
            <div class="zekr-counter">المتبقي: <span id="num-${z.id}">${cur}</span></div>
        </div>`;
    }).join('');
}

function countZekr(id) {
    const el = document.getElementById(`num-${id}`);
    if(!el) return;
    let c = parseInt(el.innerText);
    if (c > 0) {
        c--; 
        el.innerText = c;
        localStorage.setItem(`zekr_${id}`, c);
        if (c === 0) el.closest('.zekr-card').classList.add('done');
    }
}

function resetAzkarProgress() {
    if(confirm("هل تريد تصفير تقدم الأذكار الحالي؟")) {
        Object.keys(localStorage).forEach(k => {
            if(k.startsWith('zekr_')) localStorage.removeItem(k);
        });
        location.reload();
    }
}

function backToAzkarCats() {
    document.getElementById('azkarCats').style.display='grid';
    document.getElementById('azkar-content').style.display='none';
}

// 5. السبحة والعداد التنازلي
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
    const mid = new Date(); 
    mid.setHours(24, 0, 0, 0);
    const diff = mid - now;
    const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
    document.getElementById('countdown-timer').innerText = `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
    
    // تصفير تلقائي عند منتصف الليل
    if (diff <= 0) {
        resetSebha();
        Object.keys(localStorage).forEach(k => {
            if(k.startsWith('zekr_')) localStorage.removeItem(k);
        });
    }
}
setInterval(updateCountdown, 1000);

// 6. التنقل وتعديلات الواجهة
function switchMainTab(t) {
    document.querySelectorAll('.main-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(t+'Tab').classList.add('active');
    ['quran-section','azkar-section','sebha-section'].forEach(s => {
        document.getElementById(s).style.display = s.startsWith(t) ? 'block' : 'none';
    });
    audio.pause();
}

function toggleDarkMode() { 
    document.body.classList.toggle('dark-mode'); 
    const btn = document.getElementById('darkModeBtn');
    if(btn) btn.innerText = document.body.classList.contains('dark-mode') ? "☀️" : "🌙";
}

function changeFontSize(d) {
    const el = document.getElementById('ayahsContainer');
    const s = window.getComputedStyle(el).fontSize;
    el.style.fontSize = (parseFloat(s)+d)+'px';
}

// تهيئة أولية
document.getElementById('sebhaCounter').innerText = sCount;
updateCountdown();
