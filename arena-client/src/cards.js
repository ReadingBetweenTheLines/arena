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
  }
];