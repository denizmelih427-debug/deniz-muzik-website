/**
 * Deniz Müzik - Ürün Kataloğu Veri Tabanı
 * Sakarya Arifiye Mağazası & Online Koleksiyon
 */

const PRODUCTS_DATA = [
  // --- PİYANOLAR ---
  {
    id: "p-1",
    title: "Yamaha Clavinova CLP-745 Dijital Piyano (Siyah Parlak)",
    brand: "Yamaha",
    category: "piyano",
    categoryLabel: "Piyanolar",
    subCategory: "Dijital Piyano",
    price: 94500,
    originalPrice: 105000,
    rating: 5.0,
    reviewsCount: 38,
    inStock: true,
    stockCount: 2,
    badge: "Peşin Fiyatına 3 Taksit",
    image: "https://images.unsplash.com/photo-1520523839898-507128fc549a?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1520523839898-507128fc549a?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=900&q=85"
    ],
    description: "GrandTouch-S ahşap tuş teknolojisi, Yamaha CFX ve Bösendorfer Imperial kuyruklu piyano ses örneklemeleriyle konser salonu zarafetini salonunuza taşır. Sakarya Arifiye mağazamızda uzmanlarımızca teslimat öncesi son testleri yapılarak özenle kargolanır.",
    specs: {
      "Tuş Sayısı": "88 Tuş (Ahşap GrandTouch-S)",
      "Polifoni": "256 Nota",
      "Ses Sayısı": "38 Özel Seçilmiş Enstrüman Sesi",
      "Hoparlör": "2 x (50W + 50W) Çift Yollu Amfi",
      "Bluetooth": "Ses & MIDI Entegre",
      "Ağırlık": "60 kg"
    },
    soundType: "piano"
  },
  {
    id: "p-2",
    title: "Kawai K-300 Akustik Duvar Piyanosu (Cilalı Abanoz)",
    brand: "Kawai",
    category: "piyano",
    categoryLabel: "Piyanolar",
    subCategory: "Akustik Piyano",
    price: 245000,
    originalPrice: 268000,
    rating: 4.9,
    reviewsCount: 19,
    inStock: true,
    stockCount: 1,
    badge: "Özel Konservatuar Serisi",
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1520523839898-507128fc549a?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Yıllardır ödüllere doymayan Millennium III Karbon fiber mekanizması ve masif ladin rezonans tahtası ile eşsiz tuşe hassasiyeti ve derin bas tonları sunan bir şaheser. Deniz Müzik güvencesiyle ilk akordu ücretsizdir.",
    specs: {
      "Yükseklik": "122 cm",
      "Mekanizma": "Millennium III Karbon Fiber ABS",
      "Rezonans Tahtası": "Masif Dar Halka Dağ Ladini",
      "Pedallar": "3 Pedal (Soft, Sostenuto/Mute, Damper)",
      "Üretim Yeri": "Japonya"
    },
    soundType: "piano"
  },
  {
    id: "p-3",
    title: "Roland FP-30X Taşınabilir Sahne Piyanosu & Sehpa Seti",
    brand: "Roland",
    category: "piyano",
    categoryLabel: "Piyanolar",
    subCategory: "Sahne & Taşınabilir",
    price: 36900,
    originalPrice: 41000,
    rating: 4.9,
    reviewsCount: 44,
    inStock: true,
    stockCount: 5,
    badge: "En Çok Satan",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=85"
    ],
    description: "PHA-4 Standard klavye ve SuperNATURAL piyano modellemesi ile hem stüdyoda hem sahnede profesyonellerin ilk tercihi. Bluetooth Audio bağlantısıyla eşlik parçalarını anında çalabilirsiniz.",
    specs: {
      "Klavye": "88 Tuş Fildişi Hissiyatlı PHA-4",
      "Ses Motoru": "SuperNATURAL Piano",
      "Kulaklık Çıkışı": "Çift Giriş (3D Ambience)",
      "Ağırlık": "14.8 kg"
    },
    soundType: "piano"
  },

  // --- GİTARLAR ---
  {
    id: "g-1",
    title: "Fender American Professional II Stratocaster (Olympic White)",
    brand: "Fender",
    category: "gitar",
    categoryLabel: "Gitarlar",
    subCategory: "Elektro Gitar",
    price: 89500,
    originalPrice: 98000,
    rating: 5.0,
    reviewsCount: 52,
    inStock: true,
    stockCount: 3,
    badge: "%5 Peşin İndirimi",
    image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&w=900&q=85"
    ],
    description: "V-Mod II Single-Coil manyetikler, derin 'C' sap profili, parmak dostu yuvarlatılmış klavye kenarları ve yenilenmiş 2-noktalı tremolo sistemi. Amerika Corona fabrikası üretimi, orijinal Deluxe Hardcase dahildir.",
    specs: {
      "Gövde": "Seçilmiş Kızılağaç (Alder)",
      "Sap": "Akçaağaç 'Deep C' Satin Urethane",
      "Klavye": "Gül Ağacı (Rosewood) 9.5 Radius",
      "Manyetikler": "3 x V-Mod II Single-Coil Strat",
      "Köprü": "Pop-in Kollu Çelik Blok Tremolo",
      "Aksesuar": "Fender Orijinal Hardcase Dahil"
    },
    soundType: "electric-guitar"
  },
  {
    id: "g-2",
    title: "Gibson Les Paul Standard '60s (Bourbon Burst)",
    brand: "Gibson",
    category: "gitar",
    categoryLabel: "Gitarlar",
    subCategory: "Elektro Gitar",
    price: 129000,
    originalPrice: 142000,
    rating: 4.9,
    reviewsCount: 29,
    inStock: true,
    stockCount: 1,
    badge: "Nadir Koleksiyon",
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Masif maun gövde, AA desenli akçaağaç kapak ve 60'lar SlimTaper sap profili. 60s Burstbucker Alnico V manyetikler ile sıcak, dolgun ve efsanevi Les Paul sustain'i sunar.",
    specs: {
      "Gövde": "Ağırlık Azaltmasız Masif Maun",
      "Üst Kapak": "AA Figured Maple",
      "Sap": "SlimTaper Maun",
      "Manyetikler": "60s Burstbucker (Alnico V)",
      "Elektronik": "Orange Drop Kondansatörlü El Lehimli Devre"
    },
    soundType: "electric-guitar"
  },
  {
    id: "g-3",
    title: "Martin D-28 Standard Dreadnought Akustik Gitar",
    brand: "Martin",
    category: "gitar",
    categoryLabel: "Gitarlar",
    subCategory: "Akustik Gitar",
    price: 135000,
    originalPrice: 149000,
    rating: 5.0,
    reviewsCount: 31,
    inStock: true,
    stockCount: 2,
    badge: "Efsanevi Dreadnought",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Bob Dylan'dan John Lennon'a müziğin tarihini yazan akustik gitar. Masif Doğu Hindistan Gülağacı arka ve yanlar, Sitka ladini üst kapak ve Forward-Shifted X-bracing ile zamansız tını.",
    specs: {
      "Üst Kapak": "Masif Sitka Ladini",
      "Arka & Yan": "Masif Doğu Hindistan Gülağacı",
      "Balkon": "Non-Scalloped Forward-Shifted X",
      "Sap": "Seçilmiş Sert Ağaç Modified Low Oval",
      "Klavye": "Abanoz (Ebony)"
    },
    soundType: "acoustic-guitar"
  },
  {
    id: "g-4",
    title: "Alhambra 7P Classic İspanyol Klasik Gitar",
    brand: "Alhambra",
    category: "gitar",
    categoryLabel: "Gitarlar",
    subCategory: "Klasik Gitar",
    price: 52000,
    originalPrice: 58500,
    rating: 4.8,
    reviewsCount: 21,
    inStock: true,
    stockCount: 4,
    badge: "El Yapımı İspanyol",
    image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Geleneksel İspanyol topuğu birleşimi, masif sedir üst kapak ve masif gül ağacı gövdesiyle flamenko ve klasik müzik icralarında benzersiz projeksiyon ve sıcak harmonikler sağlar.",
    specs: {
      "Üst Kapak": "Masif Kırmızı Sedir (Red Cedar)",
      "Gövde": "Masif Hint Gülağacı",
      "Sap": "Abanoz Takviyeli Maun",
      "Klavye": "Doğal Abanoz",
      "Burgular": "Altın Kaplama Lüks Mekanizma"
    },
    soundType: "acoustic-guitar"
  },
  {
    id: "g-5",
    title: "Ibanez SR500E-BM 4 Telli Bas Gitar (Brown Mahogany)",
    brand: "Ibanez",
    category: "gitar",
    categoryLabel: "Gitarlar",
    subCategory: "Bas Gitar",
    price: 34500,
    originalPrice: 38900,
    rating: 4.9,
    reviewsCount: 17,
    inStock: true,
    stockCount: 3,
    badge: "Aktif EQ & Bartolini",
    image: "https://images.unsplash.com/photo-1556449895-a33c9dba33dd?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1556449895-a33c9dba33dd?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Ultra ergonomik okoume gövde, 5 parçalı Jatoba/Ceviz SR4 sap ve Bartolini BH2 manyetikler. 3-bant Ibanez Custom EQ ve orta frekans seçici anahtar ile her tarza uyumlu zengin bas tonları.",
    specs: {
      "Gövde": "Okoume Gövde",
      "Sap": "5 Parça Jatoba / Ceviz",
      "Manyetikler": "Bartolini BH2 Pasif",
      "Preamp": "Ibanez Custom Electronics 3-Band EQ",
      "Köprü": "Accu-cast B500 (19mm tel aralığı)"
    },
    soundType: "electric-guitar"
  },

  // --- YAYLILAR ---
  {
    id: "y-1",
    title: "Klaus Heffler No.600 Master El Yapımı Keman 4/4 (Almanya)",
    brand: "Klaus Heffler",
    category: "yaylilar",
    categoryLabel: "Yaylılar",
    subCategory: "Keman",
    price: 68000,
    originalPrice: 76000,
    rating: 5.0,
    reviewsCount: 16,
    inStock: true,
    stockCount: 2,
    badge: "Konservatuar Özel",
    image: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Bavyera ormanlarından en az 10 yıl doğal kurutulmuş masif dağ ladini ve alevli akçaağaçtan Almanya'da luthier eliyle oyulmuştur. El cilalı antik vernik, Evah Pirazzi teller ve karbon yay dahildir.",
    specs: {
      "Ön Kapak": "10 Yıl Bekletilmiş Masif Bavyera Ladini",
      "Sırt & Yan": "Derin Alevli Kelebek Akçaağaç",
      "Burgu & Kuyruk": "Doğal Madagaskar Abanozu",
      "Teller": "Pirastro Evah Pirazzi Gold",
      "Set": "Karbon Fiber Arşe & Dikdörtgen Isı Yalıtımlı Kutu"
    },
    soundType: "violin"
  },
  {
    id: "y-2",
    title: "Strunal Schönbach 4/4 Konser Çellosunu (Çek Cumhuriyeti)",
    brand: "Strunal Schönbach",
    category: "yaylilar",
    categoryLabel: "Yaylılar",
    subCategory: "Çello / Viyolonsel",
    price: 84000,
    originalPrice: 94000,
    rating: 4.9,
    reviewsCount: 11,
    inStock: true,
    stockCount: 1,
    badge: "Ücretsiz Kargo",
    image: "https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Bohemya ton ağaçlarıyla üretilmiş rezonansı yüksek, derin bas ve parlak tiz dengesine sahip konser viyolonseli. Deniz Müzik luthier atölyemizde eşik ve can direği ayarları yapılmıştır.",
    specs: {
      "Boyut": "4/4 Tam Boy Çello",
      "Ön Kapak": "Masif Bohemya Ladini",
      "Klavye": "Hakiki Abanoz",
      "Kuyruk": "4 Entegre Fiksli Karbon Alaşım",
      "Pik": "Titanyum Çekirdekli Ayarlanabilir Pik"
    },
    soundType: "violin"
  },
  {
    id: "y-3",
    title: "Yamaha Silent Violin SV-250 Elektro Keman (Profesyonel)",
    brand: "Yamaha",
    category: "yaylilar",
    categoryLabel: "Yaylılar",
    subCategory: "Elektro Keman",
    price: 62500,
    originalPrice: 69000,
    rating: 4.9,
    reviewsCount: 18,
    inStock: true,
    stockCount: 3,
    badge: "Sessiz Pratik & Sahne",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Çift piezo manyetik sistemi ve bağımsız kontrol kutusuyla hem akustik keman rezonansını hem de saf elektro tonları gecikmesiz sunar. Kulaklıkla gece sessiz çalışma veya stüdyo kaydı için idealdir.",
    specs: {
      "Gövde": "Ladin Üst, Akçaağaç Gövde",
      "Manyetik": "Gövde Piezo + Köprü Piezo (Blend Kontrollü)",
      "Çıkış": "XLR Balanslı + 1/4 Jak + Kulaklık",
      "Ağırlık": "Sadece 500 gr"
    },
    soundType: "violin"
  },

  // --- GELENEKSEL ENSTRÜMANLAR ---
  {
    id: "t-1",
    title: "Usta İşi Özel Yapım Uzun Sap Dut Ağacı Bağlama",
    brand: "Deniz Luthier Atölyesi",
    category: "geleneksel",
    categoryLabel: "Geleneksel Enstrümanlar",
    subCategory: "Bağlama & Saz",
    price: 28500,
    originalPrice: 32000,
    rating: 5.0,
    reviewsCount: 63,
    inStock: true,
    stockCount: 4,
    badge: "Özel Yapım / 8 Yıl Kurutulmuş",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Sakarya atölyemizde 8 yıl doğal fırınsız kurutulmuş yaprak dut teknesinden oyulmuştur. Kanada sediri ses tahtası, kelebek akçaağaç klavye takviyesi ve sedef işlemeli abanoz burguları ile türkülerimize can katan berrak ve doygun bir tını verir.",
    specs: {
      "Tekne Boyu": "41 cm Yaprak Dut",
      "Sap": "Akçaağaç & Maun Çift Şerit Takviyeli",
      "Kapak": "Kanada Kızıl Sediri (İnce Halka)",
      "Burgular": "Sedef Kakmalı Abanoz",
      "Perde Sayısı": "23 Perde (Misina Örgü)",
      "Aksesuar": "Korumalı Kalın Softcase + Yedek Pyramid Takım Tel + Tezeneler"
    },
    soundType: "baglama"
  },
  {
    id: "t-2",
    title: "Profesyonel Kısa Sap Ardıç Ağacı Bağlama (Fishman Ekolayzerlı)",
    brand: "Deniz Luthier Atölyesi",
    category: "geleneksel",
    categoryLabel: "Geleneksel Enstrümanlar",
    subCategory: "Elektro / Akustik Bağlama",
    price: 34000,
    originalPrice: 38500,
    rating: 4.9,
    reviewsCount: 42,
    inStock: true,
    stockCount: 3,
    badge: "Sahnede Sıfır Dip Gürültü",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Anadolu ardıç ağacının mistik rezonansı orijinal Fishman Presys Blend eşikaltı mikrofon sistemiyle buluştu. Sahne amfilerinde dip gürültüsüz, doğal ve tok tını.",
    specs: {
      "Tekne": "39 cm Oyma/Yaprak Ardıç Ağacı",
      "Elektronik": "Orijinal Fishman Presys Blend Ekolayzer & Dahili Tuner",
      "Kapak": "Seçilmiş Masif Ladin",
      "Sap": "Fırınlanmış Gürgen / Akçaağaç",
      "Perde Sayısı": "19 Perde Kısa Sap"
    },
    soundType: "baglama"
  },
  {
    id: "t-3",
    title: "Usta Yapımı Ceviz & Maun Profesyonel Türk Udu",
    brand: "Luthier Faruk Özel Serisi",
    category: "geleneksel",
    categoryLabel: "Geleneksel Enstrümanlar",
    subCategory: "Ud",
    price: 31500,
    originalPrice: 35000,
    rating: 4.9,
    reviewsCount: 27,
    inStock: true,
    stockCount: 2,
    badge: "%5 Peşin İndirimi",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=900&q=85"
    ],
    description: "19 dilim Amerikan cevizi ve maun gövde, İsviçre ladini ses kapağı. Türk makam müziğinin tüm mikrotonal inceliklerini hissettiren taze ve lirik bir ses rengi.",
    specs: {
      "Tekne": "19 Dilim Amerikan Cevizi & Maun",
      "Göğüs": "1. Sınıf İsviçre Ladini",
      "Klavye": "Doğal Abanoz",
      "Burgular": "Pelesenk Ağacı",
      "Tel Takımı": "Kurschner Profesyonel Ud Telleri"
    },
    soundType: "baglama"
  },
  {
    id: "t-4",
    title: "Açılmış Profesyonel Kız Ney (Gümüş Başpareli & Parazvanalı)",
    brand: "Neyzen Atölyesi",
    category: "geleneksel",
    categoryLabel: "Geleneksel Enstrümanlar",
    subCategory: "Ney",
    price: 9500,
    originalPrice: 11000,
    rating: 5.0,
    reviewsCount: 35,
    inStock: true,
    stockCount: 6,
    badge: "Gümüş Başpare Dahil",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Hatay Samandağ bölgesinin 9 boğum sık etli kamışlarından seçilerek ses kutusu usta neyzenler tarafından açılmıştır. Orijinal boynuz/delrin gümüş sargılı başpare ve 925 ayar gümüş parazvanalar.",
    specs: {
      "Ahenk": "Kız Ney (Rast perdesi LA notasını verir)",
      "Kamış": "Seçilmiş Samandağ Kamışı 9 Boğum",
      "Başpare": "Özel Torna Mandallı Delrin/Gümüş",
      "Parazvana": "925 Ayar Telkari İşlemeli Gümüş"
    },
    soundType: "acoustic-guitar"
  },
  {
    id: "t-5",
    title: "Emin Percussion Sedef Kakmalı Profesyonel Döküm Darbuka",
    brand: "Emin Percussion",
    category: "geleneksel",
    categoryLabel: "Geleneksel Enstrümanlar",
    subCategory: "Vurmalılar & Ritim",
    price: 8800,
    originalPrice: 10200,
    rating: 4.8,
    reviewsCount: 40,
    inStock: true,
    stockCount: 5,
    badge: "Orijinal Sedef İşleme",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Masif döküm alüminyum gövde üzerine el işçiliği doğal deniz kabuğu sedef kakması. Keskin 'tek' sesleri ve dolgun 'düm' basları ile hem stüdyoda hem sahnede mükemmel akustik tepki.",
    specs: {
      "Çap": "22 cm Deri Çapı (Dış Çap 28.5 cm)",
      "Yükseklik": "44 cm",
      "Gövde": "Döküm Alüminyum & El Yapımı Gerçek Sedef Kakma",
      "Deri": "Power Beat Profesyonel Şeffaf Deri",
      "Ağırlık": "5.4 kg",
      "Paket": "Lüks Dolgulu Taşıma Çantası & Akort Anahtarı"
    },
    soundType: "percussion"
  },

  // --- AKSESUARLAR ---
  {
    id: "a-1",
    title: "Elixir Optiweb 19052 Elektro Gitar Teli (10-46 Light)",
    brand: "Elixir",
    category: "aksesuar",
    categoryLabel: "Aksesuarlar",
    subCategory: "Teller",
    price: 950,
    originalPrice: 1100,
    rating: 4.9,
    reviewsCount: 88,
    inStock: true,
    stockCount: 30,
    badge: "En Çok Satan Tel",
    image: "https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Özel Optiweb polimer kaplaması ile kaplamasız tellerin canlı çıtırtılı sesini 3 ila 5 kat daha uzun süre korur. Paslanmaya ve ter korozyonuna karşı en üst düzey dayanıklılık.",
    specs: {
      "Tel Kalınlıkları": ".010, .013, .017, .026, .036, .046",
      "Kaplama": "Optiweb Ultra İnce Koruma",
      "Çekirdek": "Nikel Kaplı Çelik Yuvarlak Çekirdek"
    },
    soundType: "electric-guitar"
  },
  {
    id: "a-2",
    title: "K&M 14085 Ayarlanabilir Masif Ahşap Lüks Piyano Taburesi",
    brand: "König & Meyer",
    category: "aksesuar",
    categoryLabel: "Aksesuarlar",
    subCategory: "Sehpalar & Tabureler",
    price: 8900,
    originalPrice: 9900,
    rating: 5.0,
    reviewsCount: 15,
    inStock: true,
    stockCount: 7,
    badge: "Alman Kalitesi",
    image: "https://images.unsplash.com/photo-1520523839898-507128fc549a?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1520523839898-507128fc549a?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Masif kayın ağacından gövde, hakiki İtalyan deri döşeme ve hassas mil dişli ikili yükseklik ayar mekanizması. Uzun süreli konser ve çalışma saatlerinde kusursuz omurga desteği.",
    specs: {
      "Yükseklik Ayarı": "46 - 55 cm Arası Hassas Çift Vidalı Mekanizma",
      "Oturma Alanı": "55 x 33 cm",
      "Döşeme": "Hakiki Siyah Sırçalı Deri",
      "Malzeme": "Masif Avrupa Kayın Ağacı"
    },
    soundType: "piano"
  },
  {
    id: "a-3",
    title: "Hercules GS414B PLUS Otomatik Kilitli Akıllı Gitar Sehpası",
    brand: "Hercules",
    category: "aksesuar",
    categoryLabel: "Aksesuarlar",
    subCategory: "Sehpalar",
    price: 2450,
    originalPrice: 2850,
    rating: 4.9,
    reviewsCount: 73,
    inStock: true,
    stockCount: 14,
    badge: "Auto Grip Sistemi",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Gitarı yuvaya bıraktığınız anda yerçekimiyle kendiliğinden kilitlenen patentli AGS (Auto Grip System). Nitro selüloz cilaya zarar vermeyen özel kauçuk kaplamalar.",
    specs: {
      "Kapasite": "15 kg Taşıma Gücü",
      "Yükseklik": "95 - 115 cm Kolay Mandal Ayarlı",
      "Uyum": "Elektro, Akustik, Klasik ve Bas Gitarlar"
    },
    soundType: "acoustic-guitar"
  },
  {
    id: "a-4",
    title: "Mogami Gold Studio 6 Metre Oksijensiz Bakır Enstrüman Jak Kablosu",
    brand: "Mogami",
    category: "aksesuar",
    categoryLabel: "Aksesuarlar",
    subCategory: "Kablolar",
    price: 3200,
    originalPrice: 3600,
    rating: 5.0,
    reviewsCount: 29,
    inStock: true,
    stockCount: 10,
    badge: "Ömür Boyu Garanti",
    image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Dünya standartlarındaki Abbey Road ve Capitol Records stüdyolarının vazgeçilmezi. Altın kaplama Neutrik jaklar ve ultra saf OFC bakır ile sıfır sinyal kaybı.",
    specs: {
      "Uzunluk": "6.0 Metre (20 ft)",
      "Konektörler": "Altın Kaplama Neutrik 1/4 Düz - Düz Jak",
      "İletken": "OFC (Oksijensiz Yüksek İletken Bakır)",
      "Ekranlama": "Spiral Karbon Takviyeli %100 Yalıtım"
    },
    soundType: "electric-guitar"
  }
];

// Helper to get currency format
function formatTL(amount) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Calculate 5% cash discount price
function calculateCashPrice(price) {
  return Math.round(price * 0.95);
}
