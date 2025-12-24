// --- كود حقيبة المؤمن الكامل (بدون أي اختصار) ---

let allSurahs = [], currentSurahId = 1;
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const seekSlider = document.getElementById('seekSlider');

// 1. جلب بيانات السور والبحث
fetch('https://api.alquran.cloud/v1/surah')
    .then(res => res.json())
    .then(data => {
        allSurahs = data.data;
        displaySurahs(allSurahs);
    });

function displaySurahs(surahs) {
    const list = document.getElementById('surahList');
    list.innerHTML = surahs.map(s => `
        <div class="surah-card" onclick="openSurah(${s.number}, '${s.name}')">
            ${s.number}. ${s.name}
        </div>
    `).join('');
}

function filterSurahs() {
    const term = document.getElementById('searchInput').value;
    const filtered = allSurahs.filter(s => s.name.includes(term));
    displaySurahs(filtered);
}

// 2. عرض السورة والآيات
function openSurah(id, name) {
    currentSurahId = id;
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name;
    updateAudioSource();
    
    fetch(`https://api.alquran.cloud/v1/surah/${id}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('ayahsContainer');
            container.innerHTML = data.data.ayahs.map(a => 
                `${a.text} <span class="ayah-num">(${a.numberInSurah})</span>`
            ).join(' ');
        });
}

function showMain() {
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('quran-view').style.display = 'none';
    audio.pause();
    playBtn.innerText = "▷";
}

// 3. المشغل الصوتي الاحترافي
function updateAudioSource() {
    const reciter = document.getElementById('reciterSelect').value;
    const servers = { 'afs': '8', 'minsh': '10', 'basit': '7', 'husr': '13' };
    audio.src = `https://server${servers[reciter]}.mp3quran.net/${reciter}/${currentSurahId.toString().padStart(3, '0')}.mp3`;
    playBtn.innerText = "▷";
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
        const progress = (audio.currentTime / audio.duration) * 100;
        seekSlider.value = progress;
        document.getElementById('currentTime').innerText = formatTime(audio.currentTime);
        document.getElementById('durationTime').innerText = formatTime(audio.duration);
    }
};

function seekAudio() {
    audio.currentTime = (seekSlider.value / 100) * audio.duration;
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
}

// ==========================================
// 4. قاعدة بيانات الأذكار (النسخة العملاقة)
// ==========================================

const azkarData = {
    morning: [
        { id: "m1", text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: (اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ)", count: 1 },
        { id: "m2_1", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ) - المرة الأولى", count: 1 },
        { id: "m2_2", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ) - المرة الثانية", count: 1 },
        { id: "m2_3", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ) - المرة الثالثة", count: 1 },
        { id: "m3_1", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ) - المرة الأولى", count: 1 },
        { id: "m3_2", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...) - المرة الثانية", count: 1 },
        { id: "m3_3", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...) - المرة الثالثة", count: 1 },
        { id: "m4_1", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ، مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ) - المرة الأولى", count: 1 },
        { id: "m4_2", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ...) - المرة الثانية", count: 1 },
        { id: "m4_3", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ...) - المرة الثالثة", count: 1 },
        { id: "m5", text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.", count: 1 },
        { id: "m6", text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.", count: 1 },
        { id: "m7", text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.", count: 4 },
        { id: "m8", text: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.", count: 1 },
        { id: "m9", text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. (3 مرات)", count: 3 },
        { id: "m10", text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ. (7 مرات)", count: 7 },
        { id: "m11", text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ: فِي دِينِي وَدُنْيَايَ وَأَهْلِي، وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.", count: 1 },
        { id: "m12", text: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا، أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ.", count: 1 },
        { id: "m13", text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ. (3 مرات)", count: 3 },
        { id: "m14", text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيًّا. (3 مرات)", count: 3 },
        { id: "m15", text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شأنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.", count: 1 },
        { id: "m16", text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صلى الله عليه وسلم، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.", count: 1 },
        { id: "m17", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ. (3 مرات)", count: 3 },
        { id: "m18", text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ. (100 مرة)", count: 100 },
        { id: "m19", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. (100 مرة)", count: 100 },
        { id: "m20", text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ. (100 مرة)", count: 100 },
        { id: "m21", text: "اللَّهُمَّ صَلِّ وَسَلَّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ. (10 مرات)", count: 10 }
    ],
    evening: [
        { id: "e1", text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: (آية الكرسي)", count: 1 },
        { id: "e2", text: "المعوذات (الإخلاص، الفلق، الناس) - 3 مرات لكل سورة", count: 3 },
        { id: "e3", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1 },
        { id: "e4", text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.", count: 1 },
        { id: "e5", text: "سيد الاستغفار: اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ...", count: 1 },
        { id: "e6", text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ. (3 مرات)", count: 3 },
        { id: "e7", text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ...", count: 3 },
        { id: "e8", text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ...", count: 1 }
    ],
    sleep: [
        { id: "s1", text: "يجمع كفيه ثم ينفث فيهما فيقرأ: الإخلاص، الفلق، الناس. ثم يمسح بهما ما استطاع من جسده.", count: 3 },
        { id: "s2", text: "آية الكرسي كاملة لن يزال عليك من الله حافظ.", count: 1 },
        { id: "s3", text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.", count: 1 },
        { id: "s4", text: "اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَتَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا.", count: 1 },
        { id: "s5", text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ. (3 مرات)", count: 3 },
        { id: "s6", text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.", count: 1 },
        { id: "s7_1", text: "سُبْحَانَ اللَّهِ - المرة (1) إلى (33)", count: 33 },
        { id: "s7_2", text: "الْحَمْدُ لِلَّهِ - المرة (1) إلى (33)", count: 33 },
        { id: "s7_3", text: "اللَّهُ أَكْبَرُ - المرة (1) إلى (34)", count: 34 },
        { id: "s8", text: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.", count: 1 }
    ]
};

// 5. منطق الأذكار والحفظ التلقائي
function loadAzkar(cat) {
    const list = document.getElementById('azkarList');
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    const titles = { morning: 'أذكار الصباح', evening: 'أذكار المساء', sleep: 'أذكار النوم' };
    document.getElementById('azkar-title').innerText = titles[cat];

    list.innerHTML = azkarData[cat].map(z => {
        let savedValue = localStorage.getItem(`zekr_${z.id}`);
        let currentCount = (savedValue !== null) ? parseInt(savedValue) : z.count;
        let isDoneClass = currentCount === 0 ? 'done' : '';

        return `
            <div class="zekr-card ${isDoneClass}" id="card-${z.id}" onclick="countZekr('${z.id}')">
                <div class="zekr-text">${z.text}</div>
                <div class="zekr-counter">المتبقي: <span id="num-${z.id}">${currentCount}</span></div>
            </div>`;
    }).join('');
}

function countZekr(id) {
    const el = document.getElementById(`num-${id}`);
    let c = parseInt(el.innerText);
    if (c > 0) {
        c--;
        el.innerText = c;
        localStorage.setItem(`zekr_${id}`, c); // حفظ فوري في الذاكرة
        if (c === 0) {
            document.getElementById(`card-${id}`).classList.add('done');
            if (navigator.vibrate) navigator.vibrate(60);
        }
    }
}

function resetAzkarProgress() {
    if (confirm("هل تود تصفير عدادات الأذكار والبدء من جديد؟")) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('zekr_')) localStorage.removeItem(key);
        });
        location.reload();
    }
}

function backToAzkarCats() {
    document.getElementById('azkarCats').style.display = 'grid';
    document.getElementById('azkar-content').style.display = 'none';
}

// 6. السبحة والتنقل العام
let sCount = parseInt(localStorage.getItem('sebhaCount')) || 0;
function incrementSebha() {
    sCount++;
    document.getElementById('sebhaCounter').innerText = sCount;
    localStorage.setItem('sebhaCount', sCount);
    if (navigator.vibrate) navigator.vibrate(30);
}
function resetSebha() {
    sCount = 0;
    document.getElementById('sebhaCounter').innerText = 0;
    localStorage.setItem('sebhaCount', 0);
}

function switchMainTab(tab) {
    document.querySelectorAll('.main-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
    document.getElementById('quran-section').style.display = tab === 'quran' ? 'block' : 'none';
    document.getElementById('azkar-section').style.display = tab === 'azkar' ? 'block' : 'none';
    document.getElementById('sebha-section').style.display = tab === 'sebha' ? 'block' : 'none';
    audio.pause();
    playBtn.innerText = "▷";
}

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function changeFontSize(d) {
    const el = document.getElementById('ayahsContainer');
    const cur = window.getComputedStyle(el).fontSize;
    el.style.fontSize = (parseFloat(cur) + d) + 'px';
}

// تهيئة أولية
document.getElementById('sebhaCounter').innerText = sCount;
