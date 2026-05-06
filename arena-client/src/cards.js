export const CARD_DATABASE = [
  // --- ELEMEN API (Fokus Serangan & Kerusakan) ---
  { 
    name: "Bola_Api", faction: "Api", cost: 2, icon: "🔥", desc: "Serangan panas, tembus pelindung.", bgColor: "bg-red-900", border: "border-red-500",
    description: {
      action: "Memberikan 10 DMG dan memiliki efek 'Pierce' (tembus pertahanan).",
      howToPlay: "Gunakan untuk menyerang musuh yang memiliki pertahanan (DEF) tinggi namun HP rendah.",
      placement: "Efektif di Baris Depan untuk tekanan langsung.",
      synergy: "Sangat kuat jika digabung dengan elemen Petir untuk memicu reaksi Ledakan."
    }
  },
  { 
    name: "Hujan_Meteor", faction: "Api", cost: 4, icon: "☄️", desc: "Kerusakan menyebar ke area luas.", bgColor: "bg-red-900", border: "border-red-500",
    description: {
      action: "Serangan area (AoE) yang memberikan kerusakan ke beberapa kolom sekaligus.",
      howToPlay: "Simpan kartu ini untuk menghancurkan formasi musuh yang memenuhi semua jalur.",
      placement: "Bisa diletakkan di Baris Belakang agar aman sambil tetap menyerang.",
      synergy: "Gunakan pahlawan Ignis untuk mendapatkan bonus serangan tambahan pada setiap meteor."
    }
  },
  { 
    name: "Naga_Api", faction: "Api", cost: 5, icon: "🐉", desc: "Serangan besar, membakar 1 Koin musuh.", bgColor: "bg-red-900", border: "border-red-500",
    description: {
      action: "Serangan tunggal yang sangat masif dan mengurangi 1 koin lawan.",
      howToPlay: "Kartu penentu kemenangan. Gunakan saat lawan memiliki sedikit koin agar mereka tidak bisa membalas.",
      placement: "Baris Tengah untuk menjaga keseimbangan serangan.",
      synergy: "Minta bantuan Kloning Air untuk menggandakan serangan naga ini menjadi dua kali lipat."
    }
  },
  { 
    name: "Ledakan_Kecil", faction: "Api", cost: 3, icon: "💥", desc: "Serangan pasti kena, tak bisa ditahan.", bgColor: "bg-red-900", border: "border-red-500",
    description: {
      action: "Serangan 'Unblockable' yang mengabaikan semua angka pertahanan musuh.",
      howToPlay: "Gunakan di jalur yang dijaga ketat oleh Gunung Kuat musuh.",
      placement: "Letakkan di kolom yang paling sulit ditembus.",
      synergy: "Cocok untuk menghabiskan HP lawan yang tersisa sedikit."
    }
  },
  { 
    name: "Percikan_Api", faction: "Api", cost: 1, icon: "✨", desc: "Serangan api dasar yang murah.", bgColor: "bg-red-900", border: "border-red-500",
    description: {
      action: "Serangan ringan dengan biaya koin yang sangat rendah.",
      howToPlay: "Gunakan di ronde awal untuk memberikan tekanan tanpa menghabiskan tabungan koin.",
      placement: "Mana saja sesuai kebutuhan taktik.",
      synergy: "Bagus untuk memicu status 'Terbakar' sebelum mengeluarkan kartu api yang lebih besar."
    }
  },

  // --- ELEMEN BUMI (Fokus Pertahanan & Penyembuhan) ---
  { 
    name: "Dinding_Batu", faction: "Bumi", cost: 2, icon: "🧱", desc: "Pertahanan standar yang sangat solid.", bgColor: "bg-emerald-900", border: "border-emerald-500",
    description: {
      action: "Memberikan angka pertahanan (DEF) yang stabil untuk satu kolom.",
      howToPlay: "Gunakan untuk menahan serangan dasar seperti Percikan Api atau Sengatan Listrik.",
      placement: "WAJIB di Baris Depan sebagai pelapis HP kamu.",
      synergy: "Bonus +5 DEF jika kamu menggunakan pahlawan Terra."
    }
  },
  { 
    name: "Gunung_Kuat", faction: "Bumi", cost: 4, icon: "⛰️", desc: "Pertahanan super tebal dan kokoh.", bgColor: "bg-emerald-900", border: "border-emerald-500",
    description: {
      action: "Memberikan 40 DEF, merupakan angka pertahanan tertinggi dalam permainan.",
      howToPlay: "Gunakan untuk membendung Naga Api atau Tsunami musuh.",
      placement: "Garis Depan (Frontline) agar kolom tersebut tidak bisa ditembus.",
      synergy: "Sangat baik diletakkan di jalur yang memiliki 'Bad Sector' untuk menutup celah."
    }
  },
  { 
    name: "Pohon_Penyembuh", faction: "Bumi", cost: 3, icon: "🌳", desc: "Memulihkan HP kamu secara perlahan.", bgColor: "bg-emerald-900", border: "border-emerald-500",
    description: {
      action: "Memulihkan HP pemain setiap kali ronde pertarungan berakhir.",
      howToPlay: "Kartu kunci jika kamu bermain bertahan (Defensive). Semakin lama ia di arena, semakin banyak HP yang dipulihkan.",
      placement: "Baris Belakang agar tidak mudah hancur oleh serangan musuh.",
      synergy: "Kombinasikan dengan Dinding Batu untuk melindunginya agar terus menyembuhkan."
    }
  },
  { 
    name: "Perisai_Duri", faction: "Bumi", cost: 3, icon: "🛡️", desc: "Memantulkan kerusakan kembali ke lawan.", bgColor: "bg-emerald-900", border: "border-emerald-500",
    description: {
      action: "Menahan serangan dan mengembalikan sebagian kerusakan kepada penyerang.",
      howToPlay: "Taruh di depan kartu musuh yang memiliki serangan tinggi.",
      placement: "Garis Depan untuk efek pantulan maksimal.",
      synergy: "Efektif melawan kartu Api yang agresif."
    }
  },
  { 
    name: "Akar_Bawah_Tanah", faction: "Bumi", cost: 2, icon: "🌱", desc: "Pertahanan ringan penahan benturan.", bgColor: "bg-emerald-900", border: "border-emerald-500",
    description: {
      action: "Pertahanan murah yang bisa menahan serangan kejutan.",
      howToPlay: "Gunakan jika koinmu terbatas namun butuh perlindungan segera.",
      placement: "Baris Depan atau Tengah.",
      synergy: "Bisa digabung (fused) menjadi bintang 2 untuk pertahanan yang lebih awet."
    }
  },

  // --- ELEMEN AIR (Fokus Manipulasi & Taktik) ---
  { 
    name: "Ombak_Kecil", faction: "Air", cost: 1, icon: "🌊", desc: "Serangan air ringan untuk pancingan.", bgColor: "bg-blue-900", border: "border-blue-500",
    description: {
      action: "Serangan dasar berelemen air dengan biaya sangat hemat.",
      howToPlay: "Gunakan untuk memicu status 'Basah' pada lawan sebelum menyerang dengan Petir.",
      placement: "Mana saja.",
      synergy: "Sangat murah, cocok untuk mengisi slot kosong agar tidak terkena penalti penempatan."
    }
  },
  { 
    name: "Kloning_Air", faction: "Air", cost: 3, icon: "💧", desc: "Menggandakan kekuatan kartu di sebelahnya.", bgColor: "bg-blue-900", border: "border-blue-500",
    description: {
      action: "Meniru dan menjumlahkan kekuatan kartu yang ada di kiri dan kanannya.",
      howToPlay: "Taruh di tengah-tengah antara dua kartu kuat (misal: diapit Naga Api dan Gunung Kuat).",
      placement: "Baris Tengah agar bisa mengapit kartu di depan dan belakangnya.",
      synergy: "Kartu taktis terbaik. Jika ditaruh sendirian, kartu ini akan lemah."
    }
  },
  { 
    name: "Tsunami", faction: "Air", cost: 5, icon: "🌊", desc: "Menyapu arena, area kerusakan tinggi.", bgColor: "bg-blue-900", border: "border-blue-500",
    description: {
      action: "Serangan ombak besar yang mengenai seluruh baris musuh.",
      howToPlay: "Gunakan saat musuh tidak memiliki pertahanan Bumi yang kuat.",
      placement: "Baris Tengah untuk jangkauan visual yang pas.",
      synergy: "Gunakan pahlawan Aqua untuk mencari kartu ini lebih cepat lewat reroll gratis."
    }
  },
  { 
    name: "Es_Pembeku", faction: "Air", cost: 3, icon: "🧊", desc: "Membekukan musuh, tembus pertahanan.", bgColor: "bg-blue-900", border: "border-blue-500",
    description: {
      action: "Membekukan lawan (Stun) sehingga mereka tidak bisa menyerang di ronde berikutnya.",
      howToPlay: "Gunakan pada kolom di mana musuh menaruh kartu penyerang terkuatnya.",
      placement: "Mana saja, fokuskan pada jalur berbahaya.",
      synergy: "Cocok dipadukan dengan strategi kontrol untuk mengulur waktu ronde."
    }
  },
  { 
    name: "Pusaran_Air", faction: "Air", cost: 4, icon: "🌀", desc: "Menyedot 2 Koin lawan ke kantongmu.", bgColor: "bg-blue-900", border: "border-blue-500",
    description: {
      action: "Mencuri koin lawan dan menambahkannya ke total koin kamu.",
      howToPlay: "Mainkan kartu ini jika kamu butuh koin ekstra untuk membeli kartu bintang 3.",
      placement: "Baris Belakang agar aman.",
      synergy: "Sangat menyebalkan bagi lawan yang sedang menabung koin untuk Ultimate."
    }
  },

  // --- ELEMEN PETIR (Fokus Kecepatan & Efek Area) ---
  { 
    name: "Sengatan_Listrik", faction: "Petir", cost: 2, icon: "⚡", desc: "Serangan kilat yang mengejutkan.", bgColor: "bg-yellow-900", border: "border-yellow-400",
    description: {
      action: "Serangan cepat yang memberikan kerusakan instan.",
      howToPlay: "Gunakan untuk menghancurkan pertahanan musuh yang sudah mulai retak.",
      placement: "Mana saja.",
      synergy: "Gunakan pada musuh yang terkena status 'Basah' (Air) untuk memicu Konsleting (DEF musuh jadi 0)."
    }
  },
  { 
    name: "Badai_Petir", faction: "Petir", cost: 4, icon: "🌩️", desc: "Meningkatkan kekuatan semua kartumu.", bgColor: "bg-yellow-900", border: "border-yellow-400",
    description: {
      action: "Memberikan 'Buff' serangan kepada semua kartu kawan yang ada di arena.",
      howToPlay: "Gunakan saat kamu memiliki banyak kartu di arena untuk hasil maksimal.",
      placement: "Baris Belakang agar terlindungi.",
      synergy: "Luar biasa jika digabung dengan pahlawan Volta untuk ekonomi koin yang kuat."
    }
  },
  { 
    name: "Kekuatan_Kilat", faction: "Petir", cost: 2, icon: "🔋", desc: "Memberikan +2 Koin di ronde berikutnya.", bgColor: "bg-yellow-900", border: "border-yellow-400",
    description: {
      action: "Kartu investasi yang akan memberikan bonus koin di awal ronde depan.",
      howToPlay: "Mainkan di akhir ronde saat kamu merasa posisi pertahananmu sudah cukup aman.",
      placement: "Baris Belakang.",
      synergy: "Investasi cerdas untuk mempercepat munculnya kartu legendaris bintang 3."
    }
  },
  { 
    name: "Sinar_Laser", faction: "Petir", cost: 3, icon: "🔦", desc: "Serangan fokus, menembus dinding.", bgColor: "bg-yellow-900", border: "border-yellow-400",
    description: {
      action: "Serangan lurus yang menembus pertahanan musuh (Pierce).",
      howToPlay: "Gunakan untuk menembak langsung ke arah HP lawan meskipun dijaga kartu Bumi.",
      placement: "Baris Tengah atau Depan.",
      synergy: "Efektif melawan pemain yang terlalu banyak menggunakan kartu Dinding Batu."
    }
  },
  { 
    name: "Awan_Gelap", faction: "Petir", cost: 3, icon: "☁️", desc: "Menghapus efek buruk dari arenamu.", bgColor: "bg-yellow-900", border: "border-yellow-400",
    description: {
      action: "Membersihkan (Cleanse) semua status negatif (seperti Terbakar atau Beku) dari arenamu.",
      howToPlay: "Gunakan segera setelah musuh melancarkan serangan elemen yang memberikan status buruk.",
      placement: "Baris Belakang.",
      synergy: "Menjaga agar formasi menyerangmu tetap berjalan lancar tanpa hambatan."
    }
  },
  // --- ELEMEN BESI / METAL (Fokus Ketahanan & Tembusan Fisik) ---
  {
    name: "Pedang_Baja", cost: 3, faction: "Besi", icon: "🗡️",
    desc: "Menembus sebagian pertahanan lawan.",
    border: "border-gray-500", bgColor: "bg-gray-800",
    description: { 
      action: "Memberikan 15 DMG mematikan yang menembus pertahanan fisik (Pierce) lawan secara langsung.", 
      howToPlay: "Gunakan sebagai senjata utama pembuka jalan untuk menghancurkan musuh yang berlindung di balik benteng tebal.", 
      placement: "Fleksibel di mana saja, namun paling mematikan jika diletakkan di Baris Depan.", 
      synergy: "Sangat cocok untuk meruntuhkan pertahanan pemain elemen Bumi atau menjebol Perisai Duri." 
    }
  },
  {
    name: "Perisai_Titanium", cost: 4, faction: "Besi", icon: "🛡️",
    desc: "Pertahanan fisik super tebal tak tertembus.",
    border: "border-gray-400", bgColor: "bg-gray-700",
    description: { 
      action: "Menciptakan dinding logam kokoh yang memberikan 30 DEF tanpa kompromi.", 
      howToPlay: "Mainkan kartu ini di jalur masuk utama untuk memblokir serangan-serangan fatal dari lawan (seperti Naga Api).", 
      placement: "Wajib diletakkan di Baris Depan sebagai tameng utama arenamu.", 
      synergy: "Daya tahannya melonjak menjadi 35 DEF jika kamu berada di bawah kepemimpinan pahlawan Aegis." 
    }
  },
  {
    name: "Meriam_Besi", cost: 5, faction: "Besi", icon: "💣",
    desc: "Serangan artileri ledakan area lebar.",
    border: "border-gray-600", bgColor: "bg-gray-900",
    description: { 
      action: "Menembakkan peluru peledak yang memberikan 10 DMG di titik pusat ditambah 15 DMG menyebar ke area sekitarnya (AoE).", 
      howToPlay: "Luncurkan serangan ini ketika musuh menumpuk banyak kartu pertahanan di garis depan untuk menghancurkan formasi mereka sekaligus.", 
      placement: "Paling aman diletakkan di Baris Belakang sebagai artileri jarak jauh.", 
      synergy: "Sapu bersih sisa-sisa kartu musuh yang sebelumnya sudah dilemahkan oleh serangan elemen Api." 
    }
  },
  {
    name: "Jarum_Nano", cost: 2, faction: "Besi", icon: "🪡",
    desc: "Serangan tak terlihat penyedot darah.",
    border: "border-gray-500", bgColor: "bg-gray-800",
    description: { 
      action: "Menyuntikkan serangan mikro berbiaya rendah dengan 5 DMG yang menembus perlindungan mutlak musuh (Pierce).", 
      howToPlay: "Gunakan untuk terus mencicil HP lawan perlahan-lahan atau memberikan pukulan penyelesaian (finisher) saat musuh sekarat.", 
      placement: "Bisa diletakkan di baris mana saja untuk melancarkan serangan diam-diam.", 
      synergy: "Bagus digunakan beramai-ramai di akhir pertarungan karena biayanya yang sangat murah." 
    }
  },
  {
    name: "Jangkar_Baja", cost: 5, faction: "Besi", icon: "⚓",
    desc: "Menyerang kuat sekaligus menahan benturan.",
    border: "border-gray-400", bgColor: "bg-gray-800",
    description: { 
      action: "Senjata berat serbaguna yang menghantam lawan dengan 20 DMG sekaligus menyediakan 10 DEF pelindung.", 
      howToPlay: "Kartu mandiri yang sangat epik untuk mendominasi satu jalur secara utuh; menyerang dan bertahan di waktu yang sama.", 
      placement: "Sangat ideal di Baris Tengah untuk menjaga keseimbangan dan stabilitas papan.", 
      synergy: "Menjadi fondasi dinding yang kokoh untuk melindungi kartu elemen Gelap yang biasanya rapuh di belakangnya." 
    }
  },

  // --- ELEMEN GELAP / DARK (Fokus Risiko Tinggi, Lifesteal & Sabotase) ---
  {
    name: "Pukulan_Bayangan", cost: 4, faction: "Gelap", icon: "👤",
    desc: "Serangan gaib mutlak tak tertangkis.",
    border: "border-purple-800", bgColor: "bg-purple-950",
    description: { 
      action: "Melancarkan hantaman gaib sebesar 15 DMG yang tidak bisa ditahan (Unblockable) oleh jenis perisai apa pun.", 
      howToPlay: "Gunakan sebagai kartu eksekutor. Sangat mematikan untuk menghukum pemain yang gemar menumpuk dinding pertahanan tebal.", 
      placement: "Di mana saja, namun sangat sulit ditebak oleh musuh jika diluncurkan tiba-tiba dari Baris Belakang.", 
      synergy: "Manfaatkan pahlawan Noctis untuk meningkatkan daya rusak pukulan ini menjadi senjata pembunuh instan." 
    }
  },
  {
    name: "Hisapan_Jiwa", cost: 4, faction: "Gelap", icon: "🧛",
    desc: "Menyerang sekaligus mencuri HP lawan.",
    border: "border-purple-700", bgColor: "bg-purple-900",
    description: { 
      action: "Mencuri energi kehidupan lawan; memberikan 10 DMG ke musuh dan menyembuhkan (Heal) 10 HP untuk dirimu sendiri.", 
      howToPlay: "Segera gunakan kartu ini saat HP kamu mulai kritis untuk membalikkan keadaan dan meruntuhkan mental lawan.", 
      placement: "Baris Tengah untuk menjaga jangkauan serangan sekaligus mendapatkan perlindungan.", 
      synergy: "Kartu penyelamat mutlak bagi pahlawan Noctis yang memulai pertarungan dengan sisa HP yang lebih rendah (80 HP)." 
    }
  },
  {
    name: "Lubang_Hitam", cost: 6, faction: "Gelap", icon: "🌌",
    desc: "Meluluhlantakkan area & melahap Koin.",
    border: "border-purple-900", bgColor: "bg-black",
    description: { 
      action: "Menciptakan singularitas mematikan yang memberikan 20 DMG Area (AoE) sekaligus melenyapkan 1 Koin energi musuh.", 
      howToPlay: "Kartu termahal yang bertindak sebagai pembalik keadaan (game-changer). Mainkan untuk merusak formasi dan membuat musuh jatuh miskin.", 
      placement: "Wajib diletakkan di Baris Belakang agar singularitas ini terlindungi sebelum meledak.", 
      synergy: "Kombinasikan dengan kartu Pusaran Air (Elemen Air) untuk benar-benar mengeringkan cadangan ekonomi lawan." 
    }
  },
  {
    name: "Kutukan_Malam", cost: 5, faction: "Gelap", icon: "👁️",
    desc: "Serangan murni menembus pertahanan terdalam.",
    border: "border-fuchsia-900", bgColor: "bg-fuchsia-950",
    description: { 
      action: "Mengirimkan kutukan pekat yang memberikan 25 DMG secara langsung menembus perlindungan keras lawan (Pierce).", 
      howToPlay: "Senjata penembus pertahanan paling destruktif di dalam game. Targetkan ke jalur musuh yang paling tebal bentengnya.", 
      placement: "Efektif diletakkan di mana pun, bergantung pada di mana kelemahan terbesar formasi lawan berada.", 
      synergy: "Sangat mengerikan jika dipakai pahlawan Noctis (Total 30 Pierce DMG) yang mampu menghabisi HP musuh utuh hanya dalam 3 ronde." 
    }
  },
  {
    name: "Jubah_Kegelapan", cost: 3, faction: "Gelap", icon: "🧥",
    desc: "Bertahan dan memantulkan DMG ke penyerang.",
    border: "border-indigo-900", bgColor: "bg-indigo-950",
    description: { 
      action: "Membungkus jalur dengan 15 DEF misterius yang akan memantulkan (Reflect) hantaman serangan kembali ke arah musuh.", 
      howToPlay: "Jangan repot menyerang, biarkan lawan yang menghancurkan dirinya sendiri. Pasang kartu ini tepat di depan penyerang terkuat musuh.", 
      placement: "Wajib di Baris Depan sebagai ranjau jebakan untuk musuh.", 
      synergy: "Taktik serangan balik (Counter) paling brilian untuk membuat frustrasi pemain elemen Api atau Besi yang agresif." 
    }
  },
  // --- ELEMEN CAHAYA / LIGHT (Fokus Pemulihan & Keseimbangan Suci) ---
  {
    name: "Tombak_Suci", cost: 3, faction: "Cahaya", icon: "🔱",
    desc: "Serangan cahaya menembus armor.",
    border: "border-yellow-200", bgColor: "bg-yellow-800",
    description: { action: "15 DMG Pierce", howToPlay: "Lemparkan untuk menembus dinding pertahanan musuh (Pierce) tanpa ampun.", placement: "Baris Depan untuk tekanan maksimal.", synergy: "Sangat ampuh menembus pemain yang menggunakan elemen Bumi atau Besi." }
  },
  {
    name: "Sayap_Pelindung", cost: 4, faction: "Cahaya", icon: "🕊️",
    desc: "Bertahan sekaligus memulihkan HP.",
    border: "border-yellow-100", bgColor: "bg-yellow-700",
    description: { action: "20 DEF + Memulihkan 5 HP", howToPlay: "Kartu penyelamat sejati. Menahan serangan keras sekaligus memulihkan luka.", placement: "Garis Depan sebagai pelindung mutlak.", synergy: "Gunakan pahlawan Solomon untuk meningkatkan efek penyembuhannya menjadi 10 HP." }
  },
  {
    name: "Ledakan_Bintang", cost: 5, faction: "Cahaya", icon: "🌟",
    desc: "Menyilaukan dan melukai area luas.",
    border: "border-yellow-300", bgColor: "bg-yellow-900",
    description: { action: "10 DMG + 15 DMG Area (AoE)", howToPlay: "Pecahkan bintang ini untuk menghancurkan barisan musuh secara merata.", placement: "Baris Belakang agar cahayanya menyebar sempurna.", synergy: "Kombinasikan dengan Badai Petir untuk area kerusakan yang sangat destruktif." }
  },
  {
    name: "Berkat_Matahari", cost: 4, faction: "Cahaya", icon: "☀️",
    desc: "Energi hangat yang sangat memulihkan.",
    border: "border-orange-300", bgColor: "bg-orange-800",
    description: { action: "15 DEF + Memulihkan 10 HP", howToPlay: "Fokus pada penyembuhan. Gunakan saat kamu butuh mengulur waktu dari serangan lawan.", placement: "Tengah atau Belakang untuk keamanan.", synergy: "Sangat menjengkelkan jika dipakai saat melawan deck elemen Api yang mencoba mencicil HP." }
  },
  {
    name: "Penghakiman_Cahaya", cost: 6, faction: "Cahaya", icon: "⚖️",
    desc: "Hukuman mutlak yang tak bisa diblokir.",
    border: "border-yellow-400", bgColor: "bg-amber-900",
    description: { action: "25 DMG Unblockable", howToPlay: "Serangan pamungkas (Ultimate) suci. Akan langsung menghantam HP musuh tanpa memedulikan perisai.", placement: "Bebas di mana saja.", synergy: "Kartu penentu kemenangan di akhir ronde (Late Game)." }
  },

  // --- ELEMEN ANGIN / WIND (Fokus Kelincahan & Efek Menyapu) ---
  {
    name: "Bilah_Angin", cost: 2, faction: "Angin", icon: "🍃",
    desc: "Tebasan tajam yang ringan dan murah.",
    border: "border-teal-400", bgColor: "bg-teal-900",
    description: { action: "10 DMG Pierce", howToPlay: "Serangan pembuka yang sangat efisien untuk merobek perisai musuh di awal ronde.", placement: "Sangat dinamis, cocok di semua baris.", synergy: "Manfaatkan pahlawan Zephyr untuk menjadikannya 15 DMG murni dengan harga hanya 2 koin!" }
  },
  {
    name: "Tornado_Ganas", cost: 5, faction: "Angin", icon: "🌪️",
    desc: "Menyapu bersih seluruh area lawan.",
    border: "border-teal-500", bgColor: "bg-teal-950",
    description: { action: "5 DMG Pusat + 20 DMG Area (AoE)", howToPlay: "Ciptakan pusaran angin raksasa yang merusak seluruh formasi kartu musuh.", placement: "Baris Belakang agar anginnya membesar.", synergy: "Sapu bersih kartu-kartu lemah seperti Pohon Penyembuh milik elemen Bumi." }
  },
  {
    name: "Perisai_Udara", cost: 3, faction: "Angin", icon: "💨",
    desc: "Memantulkan serangan kembali ke lawan.",
    border: "border-emerald-300", bgColor: "bg-emerald-900",
    description: { action: "15 DEF + Reflect", howToPlay: "Dinding udara transparan yang akan memantulkan kerusakan kepada penyerangnya.", placement: "Letakkan tepat di depan kartu penyerang terbesar musuh.", synergy: "Ranjau darat yang sempurna untuk menghukum pahlawan elemen Api." }
  },
  {
    name: "Sedotan_Puyuh", cost: 4, faction: "Angin", icon: "🌀",
    desc: "Menyerang sekaligus mencuri Koin.",
    border: "border-cyan-400", bgColor: "bg-cyan-900",
    description: { action: "10 DMG + Mencuri 1 Koin", howToPlay: "Serangan yang mengganggu ekonomi. Melukai musuh sambil menyedot kekayaan mereka.", placement: "Baris Tengah untuk menjaga jangkauan.", synergy: "Kunci pergerakan musuh yang sedang menabung Koin untuk serangan pamungkas." }
  },
  {
    name: "Tebasan_Badai", cost: 4, faction: "Angin", icon: "🦅",
    desc: "Serangan udara yang sangat mematikan.",
    border: "border-sky-400", bgColor: "bg-sky-900",
    description: { action: "20 DMG Pierce", howToPlay: "Burung pemangsa dari elemen udara yang akan menukik dan menembus tameng lawan.", placement: "Baris Depan untuk akurasi maksimal.", synergy: "Senjata utama (Core) elemen angin untuk menghabisi pahlawan yang berlindung di balik armor." }
  }
];