// data.js
// Sadece statik veri listelerini içerir.

export const perfumeFacts = [
    "Tarihteki ilk modern alkol bazlı parfüm, 14. yüzyılda Macaristan Kraliçesi Elizabeth için yapılan 'Macar Suyu' olarak bilinir.",
    "Bir parfümün kokusu, sıkıldığı kişinin cilt kimyasına, diyetine ve hatta ruh halinize göre farklılık gösterebilir.",
    "'Silaj' kelimesi, Fransızca'da bir teknenin suda ilerlerken arkasında bıraktığı iz anlamına gelir ve parfümün yayılım gücünü ifade eder.",
    "Dünyanın en pahalı parfüm içeriklerinden biri, Iris çiçeğinin kökünden elde edilen 'Orris Tereyağı'dır. 1 kg üretmek için yaklaşık 500 kg iris kökü gerekir ve süreç yıllar sürer.",
    "Oud (Ud), Agar ağacının bir tür mantarla enfekte olduğunda ürettiği değerli ve koyu renkli bir reçinedir. Bu yüzden 'sıvı altın' olarak da bilinir.",
    "Fransa'nın Grasse şehri, 18. yüzyıldan beri dünya parfümerisinin başkenti olarak kabul edilir ve birçok ünlü markanın çiçekleri burada yetiştirilir.",
    "Koku duyumuz, hafıza ve duygularla en yakından bağlantılı olan duyudur. Bu yüzden bir koku, sizi anında bir anıya veya bir duyguya götürebilir.",
    "Bazı parfümler, kalıcılıklarını artırmak için 'ambergris' adı verilen ve ispermeçet balinasının sindirim sistemi salgılarından oluşan bir madde içerir.",
    "Yasemin çiçeği, en yoğun kokusunu gece yaydığı için, parfüm yapımında kullanılacak en kaliteli yasemin esansı genellikle gece toplanan çiçeklerden elde edilir.",
    "Koku piramidi (üst, orta, alt notalar), bir parfümün zamanla nasıl bir koku evrimi geçireceğini tanımlar. Üst notalar ilk duyulanlardır, alt notalar ise en kalıcı olanlardır.",
    "Aynı parfümün EDT (Eau de Toilette) ve EDP (Eau de Parfum) versiyonları arasındaki fark sadece esans yoğunluğu değil, bazen nota dengeleri de farklı olabilir.",
    "Orta Çağ'da Avrupalılar, kötü kokuları ve hastalıkları uzaklaştırdığına inandıkları için içinde aromatik bitkiler olan 'pomander' adı verilen metal toplar taşırlardı.",
    "Koku yorgunluğu (olfactory fatigue), burnumuzun bir kokuya alışıp bir süre sonra onu algılamaması durumudur. Burnunuzu 'sıfırlamak' için kahve çekirdekleri koklamak yaygın bir yöntemdir.",
    "Sentetik notaların icadı, parfümeride bir devrim yaratmıştır. Chanel No. 5, 'aldehit' adı verilen sentetik moleküllerin belirgin olarak kullanıldığı ilk parfümlerden biridir.",
    "Deri (leather) notası genellikle huş ağacı katranı, laden veya sentetik moleküller gibi malzemelerin işlenmesiyle elde edilir, gerçek hayvan derisi kullanılmaz."
];

export const quizQuestions = [
    // Kişilik & Ruh Hali
    { question: "Kendinizi üç kelimeyle nasıl tanımlarsınız?", answers: [ { text: "Enerjik, sosyal ve neşeli", tags: ['meyveli', 'narenciye'] }, { text: "Gizemli, entelektüel ve sakin", tags: ['odunsu', 'tütsü', 'deri'] }, { text: "Romantik, zarif ve hayalperest", tags: ['çiçeksi', 'pudralı'] }, { text: "Cesur, tutkulu ve iddialı", tags: ['baharatlı', 'oryantal'] } ] },
    { question: "İdeal bir hafta sonu kaçamağı sizin için neresi olurdu?", answers: [ { text: "Akdeniz'de lüks bir sahil kasabası", tags: ['akuatik', 'narenciye', 'yaz'] }, { text: "Dağlarda ahşap bir kulübe", tags: ['odunsu', 'yeşil', 'kış'] }, { text: "Paris gibi tarihi ve romantik bir şehir", tags: ['çiçeksi', 'şipre', 'sonbahar'] }, { text: "Marakeş'te egzotik bir pazar", tags: ['baharatlı', 'oryantal'] } ] },
    { question: "Hangi içkiyi tercih edersiniz?", answers: [ { text: "Buz gibi bir narenciyeli kokteyl", tags: ['narenciye', 'yaz', 'fresh'] }, { text: "Sıcak ve baharatlı bir kahve", tags: ['gurme', 'kış'] }, { text: "Kaliteli bir kırmızı şarap veya viski", tags: ['odunsu', 'deri', 'gece'] }, { text: "Papatya veya yeşil çay", tags: ['aromatik', 'yeşil', 'gündüz'] } ] },
    
    // Zevkler & Tercihler
    { question: "Gardırobunuzda en çok hangi doku bulunur?", answers: [ { text: "Keten ve pamuk gibi hafif kumaşlar", tags: ['fresh', 'akuatik', 'yaz'] }, { text: "Deri ceketler ve botlar", tags: ['deri', 'odunsu'] }, { text: "Kaşmir ve yün kazaklar", tags: ['oryantal', 'gurme', 'kış'] }, { text: "İpek ve saten gömlekler", tags: ['çiçeksi', 'pudralı'] } ] },
    { question: "Nasıl bir ortamda daha üretken olursunuz?", answers: [ { text: "Açık ve havadar, bol pencereli bir ofis", tags: ['narenciye', 'yeşil', 'gündüz'] }, { text: "Ahşap ve loş ışıklı bir kütüphane", tags: ['odunsu', 'oryantal', 'gece'] }, { text: "Kalabalık ve enerjik bir kafe", tags: ['gurme', 'meyveli'] }, { text: "Sakin ve minimalist bir çalışma odası", tags: ['misk', 'pudralı'] } ] },
    { question: "Bir tatlı seçecek olsanız, hangisi olurdu?", answers: [ { text: "Limonlu ve hafif bir cheesecake", tags: ['narenciye', 'fresh'] }, { text: "Bol çikolatalı ve yoğun bir sufle", tags: ['gurme'] }, { text: "Kırmızı meyvelerle süslenmiş bir pavlova", tags: ['meyveli', 'çiçeksi'] }, { text: "Vanilyalı ve tarçınlı bir dondurma", tags: ['gurme', 'baharatlı'] } ] },

    // Durumsal
    { question: "Bu parfümü en çok hangi mevsimde kullanmak istersiniz?", answers: [ { text: "Sıcak yaz günlerinde ferahlamak için", tags: ['yaz'] }, { text: "Soğuk kış akşamlarında ısınmak için", tags: ['kış'] }, { text: "İlkbaharın canlandığı o ilk günlerde", tags: ['ilkbahar'] }, { text: "Sonbaharın romantik atmosferinde", tags: ['sonbahar'] } ] },
    { question: "Parfümünüzün size nasıl hissettirmesini istersiniz?", answers: [ { text: "Temiz, taze ve enerjik", tags: ['akuatik', 'narenciye', 'gündüz'] }, { text: "Çekici, gizemli ve unutulmaz", tags: ['oryantal', 'deri', 'gece'] }, { text: "Profesyonel, güçlü ve kendinden emin", tags: ['odunsu', 'şipre'] }, { text: "Sıcak, samimi ve rahatlatıcı", tags: ['gurme', 'amber'] } ] }
];