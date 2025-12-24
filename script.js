// بيانات الأذكار بنصوصها الكاملة
const azkarData = {
    morning: [
        { id: "m1", text: "أعوذ بالله من الشيطان الرجيم (آية الكرسي): اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ.", count: 1 },
        { id: "m2", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ (سورة الإخلاص): قُلْ هُوَ اللَّهُ أَحَدٌ (1) اللَّهُ الصَّمَدُ (2) لَمْ يَلِدْ وَلَمْ يُولَدْ (3) وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ (4).", count: 3 },
        { id: "m3", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ (سورة الفلق): قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (1) مِنْ شَرِّ مَا خَلَقَ (2) وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ (3) وَمِنْ شَرِّ النَّفَّاثَاتِ في الْعُقَدِ (4) وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ (5).", count: 3 },
        { id: "m4", text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ (سورة الناس): قُلْ أَعُوذُ بِرَبِّ النَّاسِ (1) مَلِكِ النَّاسِ (2) إِلَهِ النَّاسِ (3) مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (4) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (5) مِنَ الْجِنَّةِ وَالنَّاسِ (6).", count: 3 },
        { id: "m5", text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.", count: 1 },
        { id: "m6", text: "اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ ، خَلَقْتَنِي وَأَنَا عَبْدُكَ ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي ، فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ .", count: 1 },
        { id: "m7", text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ.", count: 100 }
    ],
    evening: [
        { id: "e1", text: "نص آية الكرسي كاملاً (كما في الصباح)...", count: 1 },
        { id: "e2", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1 },
        { id: "e3", text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ.", count: 100 }
    ],
    sleep: [
        { id: "s1", text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.", count: 1 },
        { id: "s2", text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.", count: 3 },
        { id: "s3", text: "سُبْحَانَ اللهِ (33 مرة)، الْحَمْدُ للهِ (33 مرة)، اللهُ أَكْبَرُ (34 مرة).", count: 1 }
    ]
};

let currentSection = "morning";

// تحميل الموقع والتحقق من الحفظ التلقائي
window.onload = () => {
    checkDailyReset();
    setInterval(updateResetTimer, 1000);
    loadSebha();
};

function loadAzkar(category) {
    currentSection = category;
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    const titleMap = { morning: 'أذكار الصباح', evening: 'أذكار المساء', sleep: 'أذكار النوم' };
    document.getElementById('azkar-title').innerText = titleMap[category];

    const list = document.getElementById('azkarList');
    list.innerHTML = azkarData[category].map((z) => {
        // استرجاع العدد المحفوظ من الذاكرة المحلية
        let saved = localStorage.getItem(`zekr_${z.id}`);
        let currentCount = saved !== null ? parseInt(saved) : z.count;
        let isDone = currentCount === 0 ? 'done' : '';

        return `
        <div class="zekr-card ${isDone}" id="card-${z.id}" onclick="countZekr('${z.id}', ${z.count})">
            <div class="zekr-text">${z.text}</div>
            <div class="zekr-counter">المتبقي: <span id="num-${z.id}">${currentCount}</span></div>
        </div>`;
    }).join('');
}

function countZekr(id, originalCount) {
    const el = document.getElementById(`num-${id}`);
    let c = parseInt(el.innerText);

    if (c > 0) {
        c--;
        el.innerText = c;
        localStorage.setItem(`zekr_${id}`, c); // حفظ التقدم فوراً

        if (c === 0) {
            document.getElementById(`card-${id}`).classList.add('done');
            if (navigator.vibrate) navigator.vibrate(100);
        }
    }
}

function resetAzkarProgress() {
    if (confirm("هل تريد تصفير تقدم الأذكار لهذه القائمة؟")) {
        azkarData[currentSection].forEach(z => {
            localStorage.removeItem(`zekr_${z.id}`);
        });
        loadAzkar(currentSection);
    }
}

// --- منطق السبحة والوقت (محفوظ) ---
let sebhaCount = parseInt(localStorage.getItem('sebhaCount')) || 0;
let sebhaGoal = parseInt(localStorage.getItem('sebhaGoal')) || 1000;

function incrementSebha() {
    sebhaCount++;
    localStorage.setItem('sebhaCount', sebhaCount);
    updateSebhaUI();
    if (navigator.vibrate) navigator.vibrate(40);
}

function updateSebhaUI() {
    document.getElementById('sebhaCounter').innerText = sebhaCount;
    document.getElementById('sebhaGoal').value = sebhaGoal;
    let p = Math.min((sebhaCount / sebhaGoal) * 100, 100);
    document.getElementById('sebhaProgress').style.width = p + "%";
    document.getElementById('goalText').innerText = `المتبقي للهدف: ${Math.max(sebhaGoal - sebhaCount, 0)}`;
}

function setSebhaGoal() {
    sebhaGoal = parseInt(document.getElementById('sebhaGoal').value);
    localStorage.setItem('sebhaGoal', sebhaGoal);
    updateSebhaUI();
}

function checkDailyReset() {
    const last = localStorage.getItem('lastResetDate');
    const today = new Date().toLocaleDateString();
    if (last !== today) {
        // تصفير السبحة يومياً
        sebhaCount = 0;
        localStorage.setItem('sebhaCount', 0);
        localStorage.setItem('lastResetDate', today);
        // ملاحظة: يمكنك تصفير الأذكار أيضاً هنا إذا أردت تصفيرها يومياً
    }
}

function updateResetTimer() {
    const now = new Date(), mid = new Date();
    mid.setHours(24, 0, 0, 0);
    const diff = mid - now;
    const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
    document.getElementById('resetTimer').innerText = `${h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
}

// دوال التنقل العامة
function switchMainTab(tab) {
    document.querySelectorAll('.main-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(tab+'Tab').classList.add('active');
    document.getElementById('quran-section').style.display = tab==='quran'?'block':'none';
    document.getElementById('azkar-section').style.display = tab==='azkar'?'block':'none';
    document.getElementById('sebha-section').style.display = tab==='sebha'?'block':'none';
}

function backToAzkarCats() {
    document.getElementById('azkarCats').style.display = 'grid';
    document.getElementById('azkar-content').style.display = 'none';
}

// (دوال القرآن والبحث كما هي في النسخة السابقة تماماً لضمان عملها)
function resetSebha() { sebhaCount = 0; localStorage.setItem('sebhaCount', 0); updateSebhaUI(); }
function loadSebha() { updateSebhaUI(); }
// ... (باقي كود القرآن والخط والبحث)
