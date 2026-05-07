from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json
import random
import os
import uuid
from huggingface_hub import HfApi, hf_hub_download

# Tentukan nama file penyimpanan
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "leaderboard_data.json")
waiting_random_room = None

HF_TOKEN = os.environ.get("HF_TOKEN")
REPO_ID = "Oyabb/arena-server"
def load_leaderboard():
    # 1. JURUS PAMUNGKAS: Selalu paksa download data terbaru dari Cloud (Internet)!
    if HF_TOKEN:
        try:
            # Ini akan mengabaikan amnesia hard disk dan langsung menarik dari repositori
            cloud_file = hf_hub_download(
                repo_id=REPO_ID, 
                filename="leaderboard_data.json", 
                repo_type="space", 
                token=HF_TOKEN,
                force_download=True # 👈 KUNCI UTAMA: Paksa ambil yang paling baru!
            )
            with open(cloud_file, "r") as f:
                data = json.load(f)
                # Migrasi otomatis jika diperlukan
                for k, v in data.items():
                    if isinstance(v, int):
                        data[k] = {"wins": v, "damage": 0}
                print("Berhasil memuat skor murni dari Cloud!")
                return data
        except Exception as e:
            print(f"Peringatan: Gagal memuat dari Cloud: {e}")

    # 2. Rencana Cadangan (Fallback) jika Cloud sedang bermasalah
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                data = json.load(f)
                for k, v in data.items():
                    if isinstance(v, int):
                        data[k] = {"wins": v, "damage": 0}
                print("Berhasil memuat skor dari memori lokal.")
                return data
        except Exception as e:
            print(f"Gagal membaca dari memori lokal: {e}")
            return {}
            
    return {}


def save_leaderboard(data):
    # 1. Simpan ke mesin lokal sementara
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)
        
    # 👇 2. TAMBAHKAN BLOK INI: Upload otomatis ke Repositori Hugging Face! 👇
    if HF_TOKEN:
        try:
            api = HfApi()
            api.upload_file(
                path_or_fileobj=DB_FILE,
                path_in_repo="leaderboard_data.json",
                repo_id=REPO_ID,
                repo_type="space",
                token=HF_TOKEN
            )
            print("Berhasil mem-backup skor ke repositori!")
        except Exception as e:
            print(f"Gagal backup: {e}")


# Inisialisasi leaderboard dari file saat server start
global_leaderboard = load_leaderboard()

app = FastAPI()

# Variabel Global untuk mencatat Peringkat dari seluruh ruangan
leaderboard = {}

# MENGUBAH SERVER MENJADI SISTEM KAMAR (ROOMS)
# rooms = { "KODE_RUANGAN": { data_pertandingan } }
rooms = {}
lobby_players = {}

CARD_DB = {
    # API / FIRE
    "Bola_Api": {"atk": 10, "pierce": True, "faction": "Api", "icon": "🔥"},
    "Hujan_Meteor": {"atk": 0, "aoe": 25, "faction": "Api", "icon": "☄️"},
    "Naga_Api": {"atk": 20, "steal_energy": 1, "faction": "Api", "icon": "🐉"},
    "Ledakan_Kecil": {"atk": 15, "unblockable": True, "faction": "Api", "icon": "💥"},
    "Percikan_Api": {"atk": 5, "faction": "Api", "icon": "✨"},
    # BUMI / EARTH
    "Dinding_Batu": {"def": 20, "faction": "Bumi", "icon": "🧱"},
    "Gunung_Kuat": {"def": 40, "faction": "Bumi", "icon": "⛰️"},
    "Pohon_Penyembuh": {"heal": 15, "faction": "Bumi", "icon": "🌳"},
    "Perisai_Duri": {"def": 20, "reflect": True, "faction": "Bumi", "icon": "🛡️"},
    "Akar_Bawah_Tanah": {"def": 15, "faction": "Bumi", "icon": "🌱"},
    # AIR / WATER
    "Ombak_Kecil": {"atk": 5, "faction": "Air", "icon": "🌊"},
    "Kloning_Air": {"buff_adj": 2, "faction": "Air", "icon": "💧"},
    "Tsunami": {"atk": 0, "aoe": 20, "faction": "Air", "icon": "🌊"},
    "Es_Pembeku": {"atk": 10, "bypass": 1, "faction": "Air", "icon": "🧊"},
    "Pusaran_Air": {"atk": 0, "steal_energy": 2, "faction": "Air", "icon": "🌀"},
    # PETIR / LIGHTNING
    "Sengatan_Listrik": {"atk": 10, "faction": "Petir", "icon": "⚡"},
    "Badai_Petir": {"buff_all": 2, "faction": "Petir", "icon": "🌩️"},
    "Kekuatan_Kilat": {"energy": 2, "faction": "Petir", "icon": "🔋"},
    "Sinar_Laser": {"atk": 15, "pierce": True, "faction": "Petir", "icon": "🔦"},
    "Awan_Gelap": {"clear_hazards": True, "faction": "Petir", "icon": "☁️"},
    # BESI / METAL
    "Pedang_Baja": {"atk": 15, "pierce": True, "faction": "Besi", "icon": "🗡️"},
    "Perisai_Titanium": {"def": 30, "faction": "Besi", "icon": "🛡️"},
    "Meriam_Besi": {"atk": 10, "aoe": 15, "faction": "Besi", "icon": "💣"},
    "Jarum_Nano": {"atk": 5, "pierce": True, "faction": "Besi", "icon": "🪡"},
    "Jangkar_Baja": {"atk": 20, "def": 10, "faction": "Besi", "icon": "⚓"},
    # GELAP / DARK
    "Pukulan_Bayangan": {
        "atk": 15,
        "unblockable": True,
        "faction": "Gelap",
        "icon": "👤",
    },
    "Hisapan_Jiwa": {"atk": 10, "heal": 10, "faction": "Gelap", "icon": "🧛"},
    "Lubang_Hitam": {
        "atk": 0,
        "aoe": 20,
        "steal_energy": 1,
        "faction": "Gelap",
        "icon": "🌌",
    },
    "Kutukan_Malam": {"atk": 25, "pierce": True, "faction": "Gelap", "icon": "👁️"},
    "Jubah_Kegelapan": {"def": 15, "reflect": True, "faction": "Gelap", "icon": "🧥"},
    # CAHAYA / LIGHT
    "Tombak_Suci": {"atk": 15, "pierce": True, "faction": "Cahaya", "icon": "🔱"},
    "Sayap_Pelindung": {"def": 20, "heal": 5, "faction": "Cahaya", "icon": "🕊️"},
    "Ledakan_Bintang": {"atk": 10, "aoe": 15, "faction": "Cahaya", "icon": "🌟"},
    "Berkat_Matahari": {"def": 15, "heal": 10, "faction": "Cahaya", "icon": "☀️"},
    "Penghakiman_Cahaya": {
        "atk": 25,
        "unblockable": True,
        "faction": "Cahaya",
        "icon": "⚖️",
    },
    # ANGIN / WIND
    "Bilah_Angin": {"atk": 10, "pierce": True, "faction": "Angin", "icon": "🍃"},
    "Tornado_Ganas": {"atk": 5, "aoe": 20, "faction": "Angin", "icon": "🌪️"},
    "Perisai_Udara": {"def": 15, "reflect": True, "faction": "Angin", "icon": "💨"},
    "Sedotan_Puyuh": {"atk": 10, "steal_energy": 1, "faction": "Angin", "icon": "🌪️"},
    "Tebasan_Badai": {"atk": 20, "pierce": True, "faction": "Angin", "icon": "🦅"},
}


def init_room():
    return {
        "active_sockets": {},  # TAMBAHAN: Menyimpan koneksi yang sedang aktif
        "connected_players": [],
        "player_moves": {},
        "player_names": {"Player_1": None, "Player_2": None},  # UBAH JADI DICTIONARY
        "player_heroes": {"Player_1": None, "Player_2": None},
        "player_hp": {"Player_1": 100, "Player_2": 100},
        "player_max_hp": {"Player_1": 100, "Player_2": 100},
        "player_overload": {"Player_1": 0, "Player_2": 0},
        "current_bad_sectors": [],
        "player_grids": {"Player_1": [None]*15, "Player_2": [None]*15},
        "player_bench": {"Player_1": [None]*5, "Player_2": [None]*5},
        "player_energy": {"Player_1": 15, "Player_2": 15},
        "player_shop": {"Player_1": [None]*5, "Player_2": [None]*5},
        "lane_status": {
            "Player_1": ["", "", "", "", ""],
            "Player_2": ["", "", "", "", ""],
        },
        "current_round": 1,  # TAMBAHAN: Server sekarang mengingat ronde ke berapa
        "is_first_round": True,
    }


def evaluate_grid(grid_data, hero_id):
    board = [[None for _ in range(5)] for _ in range(3)]
    for item in grid_data:
        board[item["row"]][item["col"]] = {
            "type": item["type"],
            "star": item.get("star", 1),
        }

    lane_stats = [
        {
            "attack": 0,
            "defense": 0,
            "pierce_dmg": 0,
            "aoe_dmg": 0,
            "heal": 0,
            "atk_faction": "",
            "has_card": False,  # Ditambahkan untuk mendeteksi kartu non-serangan
        }
        for _ in range(5)
    ]
    syntax_error_penalty = 0

    multipliers = [[1 for _ in range(5)] for _ in range(3)]
    for r in range(3):
        for c in range(5):
            cell = board[r][c]
            if cell and cell["type"] == "Kloning_Air":
                has_neighbor = False
                for nr, nc in [(r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)]:
                    if (
                        0 <= nr < 3
                        and 0 <= nc < 5
                        and board[nr][nc]
                        and board[nr][nc]["type"] != "Kloning_Air"
                    ):
                        multipliers[nr][nc] *= 2
                        has_neighbor = True
                if not has_neighbor:
                    syntax_error_penalty += 5

    for c in range(5):
        for r in range(3):
            cell = board[r][c]
            if not cell or cell["type"] not in CARD_DB:
                continue

            # Flag penanda bahwa di jalur ini ada kartu!
            lane_stats[c]["has_card"] = True
            card = CARD_DB[cell["type"]]
            star = cell["star"]
            star_multiplier = 1 if star == 1 else (2 if star == 2 else 4)
            mult = multipliers[r][c] * star_multiplier

            base_atk = card.get("atk", 0)
            base_def = card.get("def", 0)
            base_aoe = card.get("aoe", 0)

            if hero_id == "ignis" and card.get("faction") == "Api":
                base_atk += 5
            if hero_id == "terra" and card.get("faction") == "Bumi":
                base_def += 5
            if hero_id == "aegis" and card.get("faction") == "Besi":
                base_def += 5
            if hero_id == "noctis" and card.get("faction") == "Gelap":
                base_atk += 5
            # TAMBAHAN HERO CAHAYA & ANGIN
            if hero_id == "solomon" and card.get("faction") == "Cahaya":
                if "heal" in card:
                    card["heal"] += 5  # Bonus Heal untuk kartu Cahaya
                else:
                    base_def += 5  # Jika tidak ada heal, beri bonus pertahanan
            if hero_id == "zephyr" and card.get("faction") == "Angin":
                base_atk += 5  # Bonus serangan untuk kartu Angin

            atk_power = base_atk * mult
            lane_stats[c]["attack"] += atk_power
            lane_stats[c]["defense"] += base_def * mult
            lane_stats[c]["heal"] += card.get("heal", 0) * mult

            if atk_power > 0:
                lane_stats[c]["atk_faction"] = card.get("faction", "")

            if card.get("pierce", False):
                lane_stats[c]["pierce_dmg"] += atk_power
                lane_stats[c]["attack"] -= atk_power
            if base_aoe > 0:
                lane_stats[c]["aoe_dmg"] += base_aoe * mult
                lane_stats[c]["atk_faction"] = card.get("faction", "")

    return {"lanes": lane_stats, "penalty": syntax_error_penalty, "combo": False}

@app.delete("/admin/leaderboard/{player_name}")
def delete_player_score(player_name: str, password: str):
    # Ganti "KODE_RAHASIA" dengan kata sandi admin Anda
    if password != "KODE_RAHASIA":
        return {"error": "Akses Ditolak!"}
    
    if player_name in global_leaderboard:
        del global_leaderboard[player_name]
        save_leaderboard(global_leaderboard)
        return {"message": f"Data {player_name} berhasil dihapus!"}
    return {"error": "Pemain tidak ditemukan."}

@app.delete("/admin/leaderboard_reset_all")
def reset_all_scores(password: str):
    if password != "KODE_RAHASIA":
        return {"error": "Akses Ditolak!"}
    
    global_leaderboard.clear()
    save_leaderboard(global_leaderboard)
    return {"message": "Seluruh papan peringkat telah dikosongkan!"}

@app.websocket("/ws/{room_code}/{player_name}")
async def websocket_endpoint(websocket: WebSocket, room_code: str, player_name: str):
    global waiting_random_room
    await websocket.accept()

    actual_room_code = room_code
    
    if room_code == "LOBBY":
        lobby_players[player_name] = websocket
        
        # Fungsi untuk mengumumkan daftar orang di lobi ke semua orang
        async def broadcast_lobby():
            active_names = list(lobby_players.keys())
            for ws in list(lobby_players.values()):
                try:
                    await ws.send_text(json.dumps({
                        "event": "lobby_update",
                        "players": active_names
                    }))
                except:
                    pass

        await broadcast_lobby() # Beritahu semua orang bahwa kita masuk!
        
        ongoing_room = None
        opp_name = "Lawan"
        for r_code, r_data in rooms.items():
            if player_name in r_data["player_names"].values():
                ongoing_room = r_code
                for pid, n in r_data["player_names"].items():
                    if n and n != player_name:
                        opp_name = n
                break

        if ongoing_room:
            await websocket.send_text(json.dumps({
                "event": "unresolved_match",
                "room_code": ongoing_room,
                "opponent": opp_name
            }))

        try:
            while True:
                data = await websocket.receive_text()
                payload = json.loads(data)
                
                if payload.get("event") == "ping":
                    continue

                # Jika ada yang menekan tombol "Tantang"
                if payload.get("event") == "challenge":
                    target = payload.get("target")
                    if target in lobby_players:
                        # Kirim surat tantangan ke target
                        await lobby_players[target].send_text(json.dumps({
                            "event": "incoming_challenge",
                            "challenger": player_name
                        }))
                
                # Jika target menekan "Terima Tantangan"
                elif payload.get("event") == "accept_challenge":
                    challenger = payload.get("target")
                    # Buat kode ruangan rahasia untuk mereka berdua
                    new_battle_room = f"BATTLE_{uuid.uuid4().hex[:6].upper()}"
                    
                    # Kirim tiket VIP (kode ruangan) ke kedua pemain
                    move_cmd = json.dumps({
                        "event": "move_to_room", 
                        "room_code": new_battle_room
                    })
                    await websocket.send_text(move_cmd) # Ke penerima
                    if challenger in lobby_players:
                        await lobby_players[challenger].send_text(move_cmd) # Ke penantang
                
                elif payload.get("event") == "surrender_unresolved":
                    target_room = payload.get("room_code")
                    if target_room in rooms:
                        r = rooms[target_room]
                        pid = "Player_1" if r["player_names"].get("Player_1") == player_name else "Player_2"
                        opp_id = "Player_2" if pid == "Player_1" else "Player_1"
                        
                        r["player_hp"][pid] = 0
                        r["player_names"][pid] = None # Bebaskan nama agar tidak nyangkut
                        
                        winner_name = r["player_names"].get(opp_id)
                        
                        if winner_name:
                            if winner_name not in global_leaderboard:
                                global_leaderboard[winner_name] = {"wins": 0, "damage": 0}
                            global_leaderboard[winner_name]["wins"] += 1
                            save_leaderboard(global_leaderboard)
                        
                        sorted_lb = dict(sorted(global_leaderboard.items(), key=lambda item: (item[1].get("wins", 0), item[1].get("damage", 0)), reverse=True))
                        
                        # Buat hasil kekalahan instan
                        surrender_result = {
                            "event": "battle_sequence",
                            "p1_name": r["player_names"]["Player_1"], "p2_name": r["player_names"]["Player_2"], 
                            "logs": [{"type": "clash", "lane": 2, "p1_action": {"atk":0, "def":0, "pierce":0, "faction":""}, "p2_action": {"atk":0, "def":0, "pierce":0, "faction":""}, "p1_dmg_received": 0, "p2_dmg_received": 0, "p1_status_applied": "", "p2_status_applied": "", "reaction_triggered": f"{player_name} MENYERAH!"}],
                            "Player_1_Stats": {"attack": 0, "defense": 0, "penalty": 0}, "Player_2_Stats": {"attack": 0, "defense": 0, "penalty": 0},
                            "Player_1_HP": r["player_hp"]["Player_1"], "Player_2_HP": r["player_hp"]["Player_2"],
                            "P1_MaxHP": r["player_max_hp"]["Player_1"], "P2_MaxHP": r["player_max_hp"]["Player_2"],
                            "Player_1_Overload": r["player_overload"]["Player_1"], "Player_2_Overload": r["player_overload"]["Player_2"],
                            "P1_Lane_Status": r["lane_status"]["Player_1"], "P2_Lane_Status": r["lane_status"]["Player_2"],
                            "P1_Damage_Taken": 0, "P2_Damage_Taken": 0, "P1_Used_RootKit": False, "P2_Used_RootKit": False,
                            "Round_Winner": winner_name if winner_name else "Lawan", "Game_Over": True,
                            "Leaderboard": sorted_lb, "Next_Bad_Sectors": [],
                        }
                        
                        # Beritahu lawan yang (mungkin) masih menunggu di dalam arena bahwa dia menang!
                        for p in r["connected_players"]:
                            try:
                                await p.send_text(json.dumps(surrender_result))
                            except:
                                pass
                
        except WebSocketDisconnect:
            # 👇 TAMBAHKAN PENGECEKAN IDENTITAS (== websocket) DI BARIS INI 👇
            if player_name in lobby_players and lobby_players[player_name] == websocket:
                del lobby_players[player_name]
            await broadcast_lobby() # Beritahu semua orang bahwa kita keluar
        
        return # BERHENTI DI SINI. Jangan jalankan kode pertarungan di bawah!
    # ==========================================
    # AKHIR ATURAN LOBBY
    # ==========================================

    # (👇 Kode di bawah ini tetap sama seperti milik Anda sebelumnya 👇)
    actual_room_code = room_code

    if room_code == "RANDOM":
        if (
            waiting_random_room
            and waiting_random_room in rooms
            and len(rooms[waiting_random_room]["active_sockets"]) == 1
        ):
            actual_room_code = waiting_random_room
            waiting_random_room = None
        else:
            actual_room_code = f"RANDOM_{uuid.uuid4().hex[:8]}"
            waiting_random_room = actual_room_code

    if actual_room_code not in rooms:
        rooms[actual_room_code] = init_room()

    room = rooms[actual_room_code]

    # --- LOGIKA RECONNECT (SAMBUNG ULANG) ---
    player_id = None
    is_reconnect = False

    # 1. Cek apakah nama ini sudah ada di dalam ruangan (Dia sedang Reconnect!)
    for pid, name in room["player_names"].items():
        if name == player_name:
            player_id = pid
            is_reconnect = True
            break

    # 2. Jika pemain baru, cari kursi yang kosong (Player_1 atau Player_2)
    if not is_reconnect:
        if room["player_names"]["Player_1"] is None:
            player_id = "Player_1"
        elif room["player_names"]["Player_2"] is None:
            player_id = "Player_2"
        else:
            await websocket.send_text(
                json.dumps({"event": "error", "message": "Ruangan penuh!"})
            )
            await websocket.close(code=1008)
            return

    # Daftarkan koneksi dan nama pemain
    room["player_names"][player_id] = player_name
    room["active_sockets"][player_id] = websocket
    room["connected_players"] = list(room["active_sockets"].values())

    # JIKA KEDUA PEMAIN SUDAH AKTIF
    if len(room["active_sockets"]) == 2:
        if room["is_first_round"]:
            # PERTANDINGAN BARU
            if not room["current_bad_sectors"]:
                available_slots = [i for i in range(15)]
                if available_slots:
                    room["current_bad_sectors"].append(random.choice(available_slots))

            for player in room["connected_players"]:
                await player.send_text(
                    json.dumps(
                        {
                            "event": "match_start",
                            "room_code": actual_room_code,
                            "bad_sectors": room["current_bad_sectors"],
                            "p1_name": room["player_names"].get("Player_1"),
                            "p2_name": room["player_names"].get("Player_2"),
                            "Leaderboard": dict(
                                sorted(
                                    global_leaderboard.items(),
                                    key=lambda item: (
                                        item[1].get("wins", 0),
                                        item[1].get("damage", 0),
                                    ),
                                    reverse=True,
                                )
                            ),
                        }
                    )
                )
        else:
            # LANJUTKAN PERTANDINGAN (RECONNECT)
            for player in room["connected_players"]:
                    await player.send_text(
                        json.dumps(
                            {
                                "event": "match_resume",
                                "bad_sectors": room["current_bad_sectors"],
                                "p1_name": room["player_names"].get("Player_1"),
                                "p2_name": room["player_names"].get("Player_2"),
                                "P1_HP": room["player_hp"]["Player_1"],
                                "P2_HP": room["player_hp"]["Player_2"],
                                "P1_MaxHP": room["player_max_hp"]["Player_1"],
                                "P2_MaxHP": room["player_max_hp"]["Player_2"],
                                "P1_Overload": room["player_overload"]["Player_1"],
                                "P2_Overload": room["player_overload"]["Player_2"],
                                "current_round": room["current_round"],
                                
                                # ==========================================
                                # 🌟 TAMBAHAN UNTUK PEMULIHAN PENUH 🌟
                                # (Menggunakan .get() agar server tidak crash jika datanya kosong)
                                "P1_Hero": room.get("player_heroes", {}).get("Player_1"),
                                "P2_Hero": room.get("player_heroes", {}).get("Player_2"),
                                "P1_Board": room.get("player_grids", {}).get("Player_1"),
                                "P2_Board": room.get("player_grids", {}).get("Player_2"),
                                "P1_Bench": room.get("player_bench", {}).get("Player_1"),
                                "P2_Bench": room.get("player_bench", {}).get("Player_2"),
                                "P1_Energy": room.get("player_energy", {}).get("Player_1"),
                                "P2_Energy": room.get("player_energy", {}).get("Player_2"),
                                "P1_Shop": room.get("player_shop", {}).get("Player_1"),
                                "P2_Shop": room.get("player_shop", {}).get("Player_2"),
                                # ==========================================

                                "Leaderboard": dict(
                                    sorted(
                                        global_leaderboard.items(),
                                        key=lambda item: (
                                            item[1].get("wins", 0),
                                            item[1].get("damage", 0),
                                        ),
                                        reverse=True,
                                    )
                                ),
                            }
                        )
                    )

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            if payload.get("event") == "ping":
                continue
            
            # 1. TANGKAP PESAN SINKRONISASI (DIAM-DIAM)
            if payload.get("event") == "sync_state":
                room["player_grids"][player_id] = payload.get("board", [None]*15)
                room["player_bench"][player_id] = payload.get("bench", [None]*5)
                room["player_energy"][player_id] = payload.get("energy", 15)
                room["player_shop"][player_id] = payload.get("shop", [None]*5)
                continue
            
            # 2. TANGKAP TOMBOL "MAJU BERTARUNG"
            elif payload.get("event") == "lock_grid":
                room["player_heroes"][player_id] = payload.get("hero", "ignis")
                room["player_moves"][player_id] = {
                    "grid": payload.get("grid", []),
                    "root_kit": payload.get("root_kit", False),
                }

            # 👇 3. TAMBAHKAN ELIF INI: FITUR MENYERAH 👇
            elif payload.get("event") == "surrender":
                room["player_hp"][player_id] = 0 # HP disetel ke 0 secara instan
                opponent_id = "Player_2" if player_id == "Player_1" else "Player_1"
                
                # Update Papan Peringkat (Lawan Langsung Menang)
                winner_name = room["player_names"].get(opponent_id)
                if winner_name:
                    if winner_name not in global_leaderboard:
                        global_leaderboard[winner_name] = {"wins": 0, "damage": 0}
                    global_leaderboard[winner_name]["wins"] += 1
                    save_leaderboard(global_leaderboard)
                
                sorted_leaderboard = dict(
                    sorted(global_leaderboard.items(), key=lambda item: (item[1].get("wins", 0), item[1].get("damage", 0)), reverse=True)
                )
                
                # Buat hasil kekalahan palsu agar animasi Game Over terpicu
                surrender_result = {
                    "event": "battle_sequence",
                    "p1_name": room["player_names"]["Player_1"], 
                    "p2_name": room["player_names"]["Player_2"], 
                    "logs": [{"type": "clash", "lane": 2, "p1_action": {"atk":0, "def":0, "pierce":0, "faction":""}, "p2_action": {"atk":0, "def":0, "pierce":0, "faction":""}, "p1_dmg_received": 0, "p2_dmg_received": 0, "p1_status_applied": "", "p2_status_applied": "", "reaction_triggered": f"{room['player_names'][player_id]} MENYERAH!"}],
                    "Player_1_Stats": {"attack": 0, "defense": 0, "penalty": 0},
                    "Player_2_Stats": {"attack": 0, "defense": 0, "penalty": 0},
                    "Player_1_HP": room["player_hp"]["Player_1"],
                    "Player_2_HP": room["player_hp"]["Player_2"],
                    "P1_MaxHP": room["player_max_hp"]["Player_1"],
                    "P2_MaxHP": room["player_max_hp"]["Player_2"],
                    "Player_1_Overload": room["player_overload"]["Player_1"],
                    "Player_2_Overload": room["player_overload"]["Player_2"],
                    "P1_Lane_Status": room["lane_status"]["Player_1"],
                    "P2_Lane_Status": room["lane_status"]["Player_2"],
                    "P1_Damage_Taken": 0,
                    "P2_Damage_Taken": 0,
                    "P1_Used_RootKit": False,
                    "P2_Used_RootKit": False,
                    "Round_Winner": winner_name if winner_name else "Lawan",
                    "Game_Over": True,
                    "Leaderboard": sorted_leaderboard,
                    "Next_Bad_Sectors": [],
                }

                for player in room["connected_players"]:
                    try:
                        await player.send_text(json.dumps(surrender_result))
                    except:
                        pass
                
                # Reset ruang ganti untuk Rematch
                room["player_hp"]["Player_1"] = 100
                room["player_hp"]["Player_2"] = 100
                room["player_max_hp"] = {"Player_1": 100, "Player_2": 100}
                room["player_overload"] = {"Player_1": 0, "Player_2": 0}
                room["lane_status"] = {"Player_1": [""]*5, "Player_2": [""]*5}
                room["is_first_round"] = True
                room["current_round"] = 1
                room["current_bad_sectors"] = []
                room["player_moves"].clear()
                continue
            # 👆 SELESAI TAMBAH FITUR MENYERAH 👆
            
            # 👇 3. FITUR REMATCH & LEAVE MATCH 👇
            elif payload.get("event") == "vote_rematch":
                if "rematch_votes" not in room:
                    room["rematch_votes"] = []
                if player_id not in room["rematch_votes"]:
                    room["rematch_votes"].append(player_id)
                
                if len(room["rematch_votes"]) == 2: # Jika KEDUA pemain setuju Rematch
                    room["rematch_votes"].clear()
                    # Reset ruangan menjadi ronde 1
                    room["player_hp"]["Player_1"] = room.get("player_max_hp", {}).get("Player_1", 100)
                    room["player_hp"]["Player_2"] = room.get("player_max_hp", {}).get("Player_2", 100)
                    room["player_overload"] = {"Player_1": 0, "Player_2": 0}
                    room["lane_status"] = {"Player_1": [""]*5, "Player_2": [""]*5}
                    room["is_first_round"] = True
                    room["current_round"] = 1
                    room["current_bad_sectors"] = []
                    room["player_moves"].clear()
                    room["player_grids"] = {"Player_1": [None]*15, "Player_2": [None]*15}
                    room["player_bench"] = {"Player_1": [None]*5, "Player_2": [None]*5}
                    
                    for player in room["connected_players"]:
                        await player.send_text(json.dumps({
                            "event": "match_start",
                            "room_code": actual_room_code,
                            "bad_sectors": room["current_bad_sectors"],
                            "p1_name": room["player_names"].get("Player_1"),
                            "p2_name": room["player_names"].get("Player_2"),
                            "P1_MaxHP": room["player_max_hp"]["Player_1"],
                            "P2_MaxHP": room["player_max_hp"]["Player_2"],
                            "Leaderboard": dict(sorted(global_leaderboard.items(), key=lambda item: (item[1].get("wins", 0), item[1].get("damage", 0)), reverse=True))
                        }))
                else:
                    # Beritahu lawan bahwa kita mengajak Rematch
                    for p in room["connected_players"]:
                        if p != websocket:
                            try:
                                await p.send_text(json.dumps({"event": "incoming_rematch"}))
                            except:
                                pass
            
            elif payload.get("event") == "leave_match":
                # Bubarkan pertandingan dengan anggun (Lawan otomatis ditarik ke Lobi)
                for p in room["connected_players"]:
                    if p != websocket:
                        try:
                            await p.send_text(json.dumps({"event": "match_dissolved"}))
                        except:
                            pass
                if actual_room_code in rooms:
                    del rooms[actual_room_code]
            # 👆 SELESAI FITUR REMATCH 👆
            
            # 4. ABAIKAN SEMUA PESAN ISENG LAINNYA
            else:
                continue

            # JIKA KEDUA PEMAIN DI RUANGAN INI SUDAH MENGIRIM GERAKAN
            if len(room["player_moves"]) == 2:
                if room["is_first_round"]:
                    for p in ["Player_1", "Player_2"]:
                        if room["player_heroes"][p] == "terra":
                            room["player_hp"][p] = 150
                            room["player_max_hp"][p] = 150
                        elif room["player_heroes"][p] == "noctis":
                            room["player_hp"][p] = 80  # Hero gelap darahnya lebih tipis
                            room["player_max_hp"][p] = 80
                        elif room["player_heroes"][p] == "solomon":
                            room["player_hp"][p] = 110  # Hero cahaya sedikit lebih tebal
                            room["player_max_hp"][p] = 110
                        else:
                            room["player_hp"][p] = 100
                            room["player_max_hp"][p] = 100
                    room["is_first_round"] = False

                p1 = room["player_moves"]["Player_1"]
                p2 = room["player_moves"]["Player_2"]

                p1_board = evaluate_grid(p1["grid"], room["player_heroes"]["Player_1"])
                p2_board = evaluate_grid(p2["grid"], room["player_heroes"]["Player_2"])

                p1_total_dmg = 0
                p2_total_dmg = 0

                room["player_hp"]["Player_1"] = min(
                    room["player_max_hp"]["Player_1"],
                    room["player_hp"]["Player_1"]
                    + sum(l["heal"] for l in p1_board["lanes"]),
                )
                room["player_hp"]["Player_2"] = min(
                    room["player_max_hp"]["Player_2"],
                    room["player_hp"]["Player_2"]
                    + sum(l["heal"] for l in p2_board["lanes"]),
                )

                p1_used_root = (
                    p1["root_kit"] and room["player_overload"]["Player_1"] >= 100
                )
                p2_used_root = (
                    p2["root_kit"] and room["player_overload"]["Player_2"] >= 100
                )

                combat_logs = []

                if p1_used_root:
                    p2_total_dmg += 30
                    room["player_overload"]["Player_1"] = 0
                    combat_logs.append(
                        {"type": "ultimate", "source": "Player_1", "damage": 30}
                    )
                if p2_used_root:
                    p1_total_dmg += 30
                    room["player_overload"]["Player_2"] = 0
                    combat_logs.append(
                        {"type": "ultimate", "source": "Player_2", "damage": 30}
                    )

                for col in range(5):
                    p1_atk = p1_board["lanes"][col]["attack"]
                    p1_pierce = p1_board["lanes"][col]["pierce_dmg"]
                    p1_def = p1_board["lanes"][col]["defense"]
                    p1_faction = p1_board["lanes"][col]["atk_faction"]
                    p1_has_card = p1_board["lanes"][col]["has_card"]

                    p2_atk = p2_board["lanes"][col]["attack"]
                    p2_pierce = p2_board["lanes"][col]["pierce_dmg"]
                    p2_def = p2_board["lanes"][col]["defense"]
                    p2_faction = p2_board["lanes"][col]["atk_faction"]
                    p2_has_card = p2_board["lanes"][col]["has_card"]
                    
                    p1_factions = []
                    p2_factions = []
                    
                    # 1. Mengintip 3 baris di jalur (kolom) ini untuk melihat semua elemen
                    for row in range(3):
                        idx = row * 5 + col  # Rumus mengubah 2D ke 1D Array
                        
                        # Cek faksi Player 1
                        if room["player_grids"]["Player_1"] and len(room["player_grids"]["Player_1"]) == 15:
                            c1 = room["player_grids"]["Player_1"][idx]
                            if c1 and isinstance(c1, dict):
                                faksi_c1 = c1.get("faction") or CARD_DB.get(c1.get("name", ""), {}).get("faction")
                                if faksi_c1: p1_factions.append(faksi_c1)
                                
                        # Cek faksi Player 2
                        if room["player_grids"]["Player_2"] and len(room["player_grids"]["Player_2"]) == 15:
                            c2 = room["player_grids"]["Player_2"][idx]
                            if c2 and isinstance(c2, dict):
                                faksi_c2 = c2.get("faction") or CARD_DB.get(c2.get("name", ""), {}).get("faction")
                                if faksi_c2: p2_factions.append(faksi_c2)

                    # 2. EVALUASI SINERGI PLAYER 1
                    if "Api" in p1_factions and "Bumi" in p1_factions:
                        p1_atk += 15
                        
                    if "Air" in p1_factions and "Petir" in p1_factions:
                        p1_atk += 10
                        p2_def = max(0, p2_def - 10)
                        
                    if "Cahaya" in p1_factions and "Besi" in p1_factions:
                        p1_def += 20
                        
                    if "Angin" in p1_factions and "Gelap" in p1_factions:
                        # Curi 5 HP musuh langsung ke HP sendiri
                        room["player_hp"]["Player_1"] = min(room["player_max_hp"]["Player_1"], room["player_hp"]["Player_1"] + 5)
                        room["player_hp"]["Player_2"] -= 5

                    # 3. EVALUASI SINERGI PLAYER 2
                    if "Api" in p2_factions and "Bumi" in p2_factions:
                        p2_atk += 15
                        
                    if "Air" in p2_factions and "Petir" in p2_factions:
                        p2_atk += 10
                        p1_def = max(0, p1_def - 10)
                        
                    if "Cahaya" in p2_factions and "Besi" in p2_factions:
                        p2_def += 20
                        
                    if "Angin" in p2_factions and "Gelap" in p2_factions:
                        # Curi 5 HP musuh langsung ke HP sendiri
                        room["player_hp"]["Player_2"] = min(room["player_max_hp"]["Player_2"], room["player_hp"]["Player_2"] + 5)
                        room["player_hp"]["Player_1"] -= 5

                    # Perbaikan logika animasi: Lewati hanya jika BENAR-BENAR tidak ada kartu di kedua jalur
                    if not p1_has_card and not p2_has_card:
                        continue

                    lane_log = {
                        "type": "clash",
                        "lane": col,
                        "p1_action": {
                            "atk": p1_atk,
                            "def": p1_def,
                            "pierce": p1_pierce,
                            "faction": p1_faction,
                        },
                        "p2_action": {
                            "atk": p2_atk,
                            "def": p2_def,
                            "pierce": p2_pierce,
                            "faction": p2_faction,
                        },
                        "p1_dmg_received": 0,
                        "p2_dmg_received": 0,
                        "p1_status_applied": "",
                        "p2_status_applied": "",
                        "reaction_triggered": "",
                    }

                    # P1 Menyerang P2
                    if p1_atk > 0 or p1_pierce > 0:
                        target_status = room["lane_status"]["Player_2"][col]
                        if target_status == "TERBAKAR" and p1_faction == "Petir":
                            lane_log["reaction_triggered"] = "LEDAKAN SUPER!"
                            p2_total_dmg += 15
                            lane_log["p2_dmg_received"] += 15
                            room["lane_status"]["Player_2"][col] = ""
                        elif target_status == "BASAH" and p1_faction == "Petir":
                            lane_log["reaction_triggered"] = "KONSLETING!"
                            p2_def = 0
                            p2_total_dmg += 10
                            lane_log["p2_dmg_received"] += 10
                            room["lane_status"]["Player_2"][col] = ""
                        else:
                            if p1_faction == "Api":
                                room["lane_status"]["Player_2"][col] = "TERBAKAR"
                                lane_log["p2_status_applied"] = "TERBAKAR"
                            elif p1_faction == "Air":
                                room["lane_status"]["Player_2"][col] = "BASAH"
                                lane_log["p2_status_applied"] = "BASAH"
                            elif p1_faction == "Petir":
                                room["lane_status"]["Player_2"][col] = "TERSTRUM"
                                lane_log["p2_status_applied"] = "TERSTRUM"

                    # P2 Menyerang P1
                    if p2_atk > 0 or p2_pierce > 0:
                        target_status = room["lane_status"]["Player_1"][col]
                        if target_status == "TERBAKAR" and p2_faction == "Petir":
                            lane_log["reaction_triggered"] = "LEDAKAN SUPER!"
                            p1_total_dmg += 15
                            lane_log["p1_dmg_received"] += 15
                            room["lane_status"]["Player_1"][col] = ""
                        elif target_status == "BASAH" and p2_faction == "Petir":
                            lane_log["reaction_triggered"] = "KONSLETING!"
                            p1_def = 0
                            p1_total_dmg += 10
                            lane_log["p1_dmg_received"] += 10
                            room["lane_status"]["Player_1"][col] = ""
                        else:
                            if p2_faction == "Api":
                                room["lane_status"]["Player_1"][col] = "TERBAKAR"
                                lane_log["p1_status_applied"] = "TERBAKAR"
                            elif p2_faction == "Air":
                                room["lane_status"]["Player_1"][col] = "BASAH"
                                lane_log["p1_status_applied"] = "BASAH"
                            elif p2_faction == "Petir":
                                room["lane_status"]["Player_1"][col] = "TERSTRUM"
                                lane_log["p1_status_applied"] = "TERSTRUM"

                    p1_received_total = max(0, p2_atk - p1_def) + p2_pierce
                    p2_received_total = max(0, p1_atk - p2_def) + p1_pierce

                    p1_total_dmg += p1_received_total
                    p2_total_dmg += p2_received_total

                    lane_log["p1_dmg_received"] += p1_received_total
                    lane_log["p2_dmg_received"] += p2_received_total
                    combat_logs.append(lane_log)

                p1_aoe = sum(l["aoe_dmg"] for l in p2_board["lanes"])
                p2_aoe = sum(l["aoe_dmg"] for l in p1_board["lanes"])
                if p1_aoe > 0:
                    combat_logs.append(
                        {"type": "aoe", "source": "Player_2", "damage": p1_aoe}
                    )
                if p2_aoe > 0:
                    combat_logs.append(
                        {"type": "aoe", "source": "Player_1", "damage": p2_aoe}
                    )

                p1_total_dmg += p1_aoe + p1_board["penalty"]
                p2_total_dmg += p2_aoe + p2_board["penalty"]

                if p1_board["penalty"] > 0:
                    combat_logs.append(
                        {
                            "type": "penalty",
                            "player": "Player_1",
                            "damage": p1_board["penalty"],
                        }
                    )
                if p2_board["penalty"] > 0:
                    combat_logs.append(
                        {
                            "type": "penalty",
                            "player": "Player_2",
                            "damage": p2_board["penalty"],
                        }
                    )

                if not p1_used_root:
                    room["player_overload"]["Player_1"] = min(
                        100, room["player_overload"]["Player_1"] + (p1_total_dmg * 2)
                    )
                if not p2_used_root:
                    room["player_overload"]["Player_2"] = min(
                        100, room["player_overload"]["Player_2"] + (p2_total_dmg * 2)
                    )

                room["player_hp"]["Player_1"] -= p1_total_dmg
                room["player_hp"]["Player_2"] -= p2_total_dmg
                game_over = (
                    room["player_hp"]["Player_1"] <= 0
                    or room["player_hp"]["Player_2"] <= 0
                )

                # --- MENGHITUNG TOTAL DAMAGE KE LEADERBOARD SETIAP RONDE ---
                p1_name = room["player_names"].get("Player_1")
                p2_name = room["player_names"].get("Player_2")

                if p1_name:
                    if p1_name not in global_leaderboard:
                        global_leaderboard[p1_name] = {"wins": 0, "damage": 0}
                    global_leaderboard[p1_name][
                        "damage"
                    ] += p2_total_dmg  # P1 memberikan p2_total_dmg

                if p2_name:
                    if p2_name not in global_leaderboard:
                        global_leaderboard[p2_name] = {"wins": 0, "damage": 0}
                    global_leaderboard[p2_name][
                        "damage"
                    ] += p1_total_dmg  # P2 memberikan p1_total_dmg

                # UPDATE GLOBAL LEADERBOARD JIKA PERTANDINGAN SELESAI
                if game_over:
                    winner_name = None
                    if room["player_hp"]["Player_1"] > 0:
                        winner_name = room["player_names"]["Player_1"]
                    elif room["player_hp"]["Player_2"] > 0:
                        winner_name = room["player_names"]["Player_2"]

                    if winner_name:
                        # Tambah 1 kemenangan untuk yang menang
                        global_leaderboard[winner_name]["wins"] += 1

                    # Simpan data fisik agar damage dan skor tidak hilang
                    save_leaderboard(global_leaderboard)

                # Gunakan global_leaderboard untuk dikirim ke semua pemain (Urutkan: Wins, lalu Damage)
                sorted_leaderboard = dict(
                    sorted(
                        global_leaderboard.items(),
                        key=lambda item: (
                            item[1].get("wins", 0),
                            item[1].get("damage", 0),
                        ),
                        reverse=True,
                    )
                )

                p1_ui = {
                    "attack": sum(
                        l["attack"] + l["pierce_dmg"] + l["aoe_dmg"]
                        for l in p1_board["lanes"]
                    ),
                    "defense": sum(l["defense"] for l in p1_board["lanes"]),
                    "penalty": p1_board["penalty"],
                }
                p2_ui = {
                    "attack": sum(
                        l["attack"] + l["pierce_dmg"] + l["aoe_dmg"]
                        for l in p2_board["lanes"]
                    ),
                    "defense": sum(l["defense"] for l in p2_board["lanes"]),
                    "penalty": p2_board["penalty"],
                }

                room["current_bad_sectors"] = random.sample(
                    range(15), random.choice([1, 2])
                )

                result = {
                    "event": "battle_sequence",
                    "p1_name": room["player_names"]["Player_1"], 
                    "p2_name": room["player_names"]["Player_2"], 
                    "logs": combat_logs,
                    "Player_1_Stats": p1_ui,
                    "Player_2_Stats": p2_ui,
                    "Player_1_HP": room["player_hp"]["Player_1"],
                    "Player_2_HP": room["player_hp"]["Player_2"],
                    "P1_MaxHP": room["player_max_hp"]["Player_1"],
                    "P2_MaxHP": room["player_max_hp"]["Player_2"],
                    "Player_1_Overload": room["player_overload"]["Player_1"],
                    "Player_2_Overload": room["player_overload"]["Player_2"],
                    "P1_Lane_Status": room["lane_status"]["Player_1"],
                    "P2_Lane_Status": room["lane_status"]["Player_2"],
                    "P1_Damage_Taken": p1_total_dmg,
                    "P2_Damage_Taken": p2_total_dmg,
                    "P1_Used_RootKit": p1_used_root,
                    "P2_Used_RootKit": p2_used_root,
                    "Round_Winner": (
                        "Seri!"
                        if p1_total_dmg == p2_total_dmg
                        else (
                            room["player_names"]["Player_1"]
                            if p1_total_dmg < p2_total_dmg
                            else room["player_names"]["Player_2"]
                        )
                    ),
                    "Game_Over": game_over,
                    "Leaderboard": sorted_leaderboard,
                    "Next_Bad_Sectors": room["current_bad_sectors"],
                }

                for player in room["connected_players"]:
                    await player.send_text(json.dumps(result))

                room["player_moves"].clear()

                room["current_round"] += 1  # Naikkan memori ronde server

                if game_over:
                    room["player_hp"]["Player_1"] = 100
                    room["player_hp"]["Player_2"] = 100
                    room["player_max_hp"] = {"Player_1": 100, "Player_2": 100}
                    room["player_overload"] = {"Player_1": 0, "Player_2": 0}
                    room["lane_status"] = {
                        "Player_1": ["", "", "", "", ""],
                        "Player_2": ["", "", "", "", ""],
                    }
                    room["is_first_round"] = True
                    room["current_round"] = 1
                    room["current_bad_sectors"] = []

    except WebSocketDisconnect:
        # LOGIKA TERPUTUS YANG BARU
        if player_id in room["active_sockets"] and room["active_sockets"][player_id] == websocket:
            del room["active_sockets"][player_id]

        room["connected_players"] = list(room["active_sockets"].values())
        room["player_moves"].pop(player_id, None)
        # PERHATIKAN: Kita TIDAK menghapus "player_names" atau "player_hp" di sini!

        if actual_room_code == waiting_random_room and not room["active_sockets"]:
            waiting_random_room = None

        # Jika ruangan kosong melompong (dua-duanya kabur), hapus ruangan untuk menghemat RAM
        if not room["active_sockets"]:
            if actual_room_code in rooms:
                del rooms[actual_room_code]
        else:
            # Beritahu pemain yang masih di dalam bahwa musuhnya terputus
            for remaining in room["connected_players"]:
                try:
                    await remaining.send_text(
                        json.dumps({"event": "opponent_disconnected"})
                    )
                except:
                    pass
