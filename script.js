let allSurahs = [];
let currentSurahId = 1;
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');

// تبديل الأقسام
function switchMainTab(tab) {
    document.getElementById('quranTab').classList.remove('active');
    document.getElementById('azkarTab').classList.remove('active');
    if (tab === 'quran') {
        document.getElementById('quranTab').classList.add('active');
        document.getElementById('quran-section').style.display = 'block';
        document.getElementById('azkar-section').style.display = 'none';
        audio.pause();
    } else {
        document.getElementById('azkarTab').classList.add('active');
        document.getElementById('quran-section').style.display = 'none';
        document.getElementById('azkar-section').style.display = 'block';
        audio.pause();
    }
}

// --- القرآن الكريم ---
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
    fetch(`https://api.alquran.cloud/v1/surah/${id}`)
        .then(res => res.json())
        .then(data => {
            let ayahs = data.data.ayahs;
            let bismillahHtml = "";
            if (id !== 1 && id !== 9 && ayahs[0].text.includes("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")) {
                bismillahHtml = `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
                ayahs[0].text = ayahs[0].text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "");
            }
            const textHtml = ayahs.map(a => `${a.text} <span class="ayah-num">(${a.numberInSurah})</span>`).join(' ');
            document.getElementById('ayahsContainer').innerHTML = bismillahHtml + textHtml;
        });
}

function updateAudioSource() {
    const reciter = document.getElementById('reciterSelect').value;
    const formattedId = currentSurahId.toString().padStart(3, '0');
    const servers = {
        'afs': `https://server8.mp3quran.net/afs/${formattedId}.mp3`,
        'minsh': `https://server10.mp3quran.net/minsh/${formattedId}.mp3`,
        'basit': `https://server7.mp3quran.net/basit/${formattedId}.mp3`,
        'husr': `https://server13.mp3quran.net/husr/${formattedId}.mp3`
    };
    audio.src = servers[reciter];
    playBtn.innerText = "تشغيل السورة ▷";
}

function toggleAudio() {
    if (audio.paused) { audio.play(); playBtn.innerText = "إيقاف مؤقت ||"; }
    else { audio.pause(); playBtn.innerText = "تشغيل السورة ▷"; }
}

function showMain() {
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('quran-view').style.display = 'none';
    audio.pause();
}

// --- قسم الأذكار المحدث ---
const azkarData = {
    morning: [
        { text: "أعوذ بالله من الشيطان الرجيم: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)", count: 1 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ هُوَ اللَّهُ أَحَدٌ...)", count: 3 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...)", count: 3 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ...)", count: 3 },
        { text: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.", count: 1 },
        { text: "اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.", count: 1 },
        { text: "رضيت بالله ربًا وبالإسلام دينًا وبمحمد ﷺ نبيًا.", count: 3 },
        { text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري.", count: 3 },
        { text: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.", count: 7 },
        { text: "سبحان الله وبحمده.", count: 100 }
    ],
    evening: [
        { text: "أعوذ بالله من الشيطان الرجيم: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)", count: 1 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ هُوَ اللَّهُ أَحَدٌ...)", count: 3 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...)", count: 3 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ...)", count: 3 },
        { text: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.", count: 1 },
        { text: "اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير.", count: 1 },
        { text: "رضيت بالله ربًا وبالإسلام دينًا وبمحمد ﷺ نبيًا.", count: 3 },
        { text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري.", count: 3 },
        { text: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.", count: 7 },
        { text: "سبحان الله وبحمده.", count: 100 }
    ],
    sleep: [
        { text: "باسمك اللهم أموت وأحيا.", count: 1 },
        { text: "اللهم قِني عذابك يوم تبعث عبادك.", count: 3 },
        { text: "جمع الكفين والنفث فيهما وقراءة (الإخلاص، الفلق، الناس) ثم مسح الجسد.", count: 3 },
        { text: "آية الكرسي: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)", count: 1 },
        { text: "سبحان الله", count: 33 },
        { text: "الحمد لله", count: 33 },
        { text: "الله أكبر", count: 34 },
        { text: "اللهم أسلمت نفسي إليك، وفوضت أمري إليك، ووجهت وجهي إليك، وألجأت ظهري إليك، رغبةً ورهبةً إليك، لا ملجأ ولا منجى منك إلا إليك، آمنت بكتابك الذي أنزلت، وبنبيك الذي أرسلت.", count: 1 }
    ]
};

function loadAzkar(type) {
    const titles = { morning: '☀️ أذكار الصباح', evening: '🌙 أذكار المساء', sleep: '🛌 أذكار النوم' };
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    document.getElementById('azkar-title').innerText = titles[type];
    const list = document.getElementById('azkarList');
    list.innerHTML = azkarData[type].map((z, index) => `
        <div class="zekr-card" id="zekr-${index}" onclick="countZekr(${index})">
            <div class="zekr-text">${z.text}</div>
            <div class="zekr-counter">المرات: <span id="count-${index}">${z.count}</span></div>
        </div>
    `).join('');
}

function countZekr(index) {
    const countEl = document.getElementById(`count-${index}`);
    let current = parseInt(countEl.innerText);
    if (current > 0) {
        current--;
        countEl.innerText = current;
        if (current === 0) document.getElementById(`zekr-${index}`).classList.add('done');
    }
}

function backToAzkarCats() {
    document.getElementById('azkarCats').style.display = 'grid';
    document.getElementById('azkar-content').style.display = 'none';
}

function changeReciter() { audio.pause(); updateAudioSource(); }
