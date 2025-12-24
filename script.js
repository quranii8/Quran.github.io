let allSurahs = [];
let currentSurahId = 1;
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const seekSlider = document.getElementById('seekSlider');
const currentTimeText = document.getElementById('currentTime');
const durationTimeText = document.getElementById('durationTime');

// تحديث شريط التقدم والوقت
audio.ontimeupdate = () => {
    if (audio.duration) {
        const value = (audio.currentTime / audio.duration) * 100;
        seekSlider.value = value;
        currentTimeText.innerText = formatTime(audio.currentTime);
        durationTimeText.innerText = formatTime(audio.duration);
    }
};

function seekAudio() {
    const seekTo = audio.duration * (seekSlider.value / 100);
    audio.currentTime = seekTo;
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
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

function switchMainTab(tab) {
    document.getElementById('quranTab').classList.toggle('active', tab === 'quran');
    document.getElementById('azkarTab').classList.toggle('active', tab === 'azkar');
    document.getElementById('quran-section').style.display = tab === 'quran' ? 'block' : 'none';
    document.getElementById('azkar-section').style.display = tab === 'azkar' ? 'block' : 'none';
    audio.pause();
    playBtn.innerText = "▷";
}

// جلب السور
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
    playBtn.innerText = "▷";
    seekSlider.value = 0;
}

function showMain() {
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('quran-view').style.display = 'none';
    audio.pause();
}

// --- قسم الأذكار المحدث بالنصوص الكاملة ---
const azkarData = {
    morning: [
        { text: "أعوذ بالله من الشيطان الرجيم: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ)", count: 1 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ)", count: 3 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِن شَرِّ مَا خَلَقَ، وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ)", count: 3 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ، مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ)", count: 3 },
        { text: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير. رب أسألك خير ما في هذا اليوم وخير ما بعده، وأعوذ بك من شر ما في هذا اليوم وشر ما بعده", count: 1 },
        { text: "اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور", count: 1 },
        { text: "رضيت بالله ربًا وبالإسلام دينًا وبمحمد ﷺ نبيًا", count: 3 },
        { text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت", count: 3 },
        { text: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم", count: 7 },
        { text: "سبحان الله وبحمده", count: 100 }
    ],
    evening: [
        { text: "أعوذ بالله من الشيطان الرجيم: (آية الكرسي)", count: 1 },
        { text: "سورة الإخلاص (3 مرات)", count: 3 },
        { text: "سورة الفلق (3 مرات)", count: 3 },
        { text: "سورة الناس (3 مرات)", count: 3 },
        { text: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير", count: 1 },
        { text: "اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير", count: 1 },
        { text: "رضيت بالله ربًا وبالإسلام دينًا وبمحمد ﷺ نبيًا", count: 3 },
        { text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت", count: 3 },
        { text: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم", count: 7 },
        { text: "سبحان الله وبحمده", count: 100 }
    ],
    sleep: [
        { text: "باسمك اللهم أموت وأحيا", count: 1 },
        { text: "اللهم قِني عذابك يوم تبعث عبادك", count: 3 },
        { text: "جمع الكفين والنفث فيهما وقراءة (الإخلاص، الفلق، الناس) ثم مسح ما استطاع من الجسد", count: 3 },
        { text: "آية الكرسي: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)", count: 1 },
        { text: "سبحان الله", count: 33 },
        { text: "الحمد لله", count: 33 },
        { text: "الله أكبر", count: 34 },
        { text: "اللهم أسلمت نفسي إليك، وفوضت أمري إليك، ووجهت وجهي إليك، وألجأت ظهري إليك، رغبةً ورهبةً إليك، لا ملجأ ولا منجى منك إلا إليك، آمنت بكتابك الذي أنزلت، وبنبيك الذي أرسلت", count: 1 }
    ]
};

function loadAzkar(type) {
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    const titles = { morning: '☀️ أذكار الصباح', evening: '🌙 أذكار المساء', sleep: '🛌 أذكار النوم' };
    document.getElementById('azkar-title').innerText = titles[type];
    const list = document.getElementById('azkarList');
    list.innerHTML = azkarData[type].map((z, i) => `
        <div class="zekr-card" id="zekr-${i}" onclick="countZekr(${i})">
            <div class="zekr-text">${z.text}</div>
            <div class="zekr-counter">بقي: <span id="count-${i}">${z.count}</span></div>
        </div>
    `).join('');
}

function countZekr(i) {
    const el = document.getElementById(`count-${i}`);
    let c = parseInt(el.innerText);
    if (c > 0) { el.innerText = --c; if (c === 0) document.getElementById(`zekr-${i}`).classList.add('done'); }
}

function backToAzkarCats() {
    document.getElementById('azkarCats').style.display = 'grid';
    document.getElementById('azkar-content').style.display = 'none';
}

function changeReciter() { audio.pause(); updateAudioSource(); }
