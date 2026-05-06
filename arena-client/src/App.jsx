import { useState, useEffect, useRef, useCallback } from 'react';
import { CARD_DATABASE } from './cards';
import ignisImg from './assets/ignis.png';
import aquaImg from './assets/aqua.png';
import terraImg from './assets/terra.png';
import voltaImg from './assets/volta.png';
import aegisImg from './assets/aegis.png';
import noctisImg from './assets/noctis.png';
import solomonImg from './assets/solomon.png';
import zephyrImg from './assets/zephyr.png';
import slash1Img from './assets/slash1.png';
import slash2Img from './assets/slash2.png';
import slash3Img from './assets/slash3.png';
import slash4Img from './assets/slash4.png';
import slash5Img from './assets/slash5.png';

const INJECTED_STYLES = `
  @keyframes clashAttack {
    0% { transform: translateY(0) scale(1); filter: brightness(1); }
    20% { transform: translateY(-10px) scale(1.05); filter: brightness(1.2); }
    40% { transform: translateY(-50px) scale(1.2); z-index: 50; filter: brightness(1.5); }
    50% { transform: translateY(-45px) scale(1.2); }
    100% { transform: translateY(0) scale(1); filter: brightness(1); }
  }
  .animate-clashAttack { animation: clashAttack 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

  @keyframes shootFireballP1 {
    0% { transform: translate(-10vw, 20vh) scale(0.5); opacity: 0; }
    10% { opacity: 1; transform: translate(-5vw, 15vh) scale(2); filter: drop-shadow(0 0 20px #ef4444); }
    100% { transform: translate(25vw, -25vh) scale(3); opacity: 0; filter: drop-shadow(0 0 40px #ef4444); }
  }
  @keyframes shootFireballP2 {
    0% { transform: translate(25vw, -25vh) scale(0.5); opacity: 0; }
    10% { opacity: 1; transform: translate(15vw, -25vh) scale(2); filter: drop-shadow(0 0 20px #a855f7); }
    100% { transform: translate(-25vw, -25vh) scale(3); opacity: 0; filter: drop-shadow(0 0 40px #a855f7); }
  }
  .animate-fireball-p1 { animation: shootFireballP1 0.4s ease-in forwards; }
  .animate-fireball-p2 { animation: shootFireballP2 0.4s ease-in forwards; }

  @keyframes floatUpFade {
    0% { opacity: 1; transform: translate(-50%, 0) scale(1.5); }
    100% { opacity: 0; transform: translate(-50%, -60px) scale(1); }
  }
  .animate-floatUpFade { animation: floatUpFade 1.5s ease-out forwards; }

  @keyframes legendaryGlow {
    0% { box-shadow: 0 0 10px #facc15, inset 0 0 5px #facc15; border-color: #eab308; }
    50% { box-shadow: 0 0 30px #facc15, inset 0 0 15px #facc15; border-color: #fef08a; }
    100% { box-shadow: 0 0 10px #facc15, inset 0 0 5px #facc15; border-color: #eab308; }
  }
  @keyframes epicGlow {
    0% { box-shadow: 0 0 5px #c084fc; border-color: #a855f7; }
    50% { box-shadow: 0 0 20px #c084fc; border-color: #d8b4fe; }
    100% { box-shadow: 0 0 5px #c084fc; border-color: #a855f7; }
  }
  @keyframes idleBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  .idle-breathe { animation: idleBreathe 2.5s ease-in-out infinite; }
  @keyframes idleFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
  .idle-float { animation: idleFloat 3s ease-in-out infinite; }
`;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = AudioContext ? new AudioContext() : null;

const playSound = (type) => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === 'buy') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'clash') {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.5);
    gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now); osc.stop(now + 0.5);
  } else if (type === 'error') {
    osc.type = 'square'; osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(100, now + 0.1);
    gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'ultimate') {
    osc.type = 'square'; osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.5);
    osc.frequency.linearRampToValueAtTime(100, now + 1.5);
    gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.linearRampToValueAtTime(0.01, now + 1.5);
    osc.start(now); osc.stop(now + 1.5);
  } else if (type === 'reroll') {
    osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(400, now + 0.1);
    gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.linearRampToValueAtTime(0.01, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'levelup') {
    osc.type = 'square'; osc.frequency.setValueAtTime(300, now);
    osc.frequency.setValueAtTime(400, now + 0.1); osc.frequency.setValueAtTime(500, now + 0.2);
    osc.frequency.setValueAtTime(800, now + 0.3); gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.linearRampToValueAtTime(0.01, now + 0.6); osc.start(now); osc.stop(now + 0.6);
  }
};

const UI_ICONS = { HP: "❤️", Energy: "🪙" };

const HERO_DATABASE = [
  { id: 'ignis', name: 'Ignis', title: 'Ksatria Api', icon: '🔥', image: ignisImg, desc: 'Kartu Api +5 Serangan.', color: 'border-red-500 bg-red-900/30 text-red-400' },
  { id: 'terra', name: 'Terra', title: 'Pelindung Bumi', icon: '⛰️', image: terraImg, desc: 'Mulai 150 HP & Kartu Bumi +5 Pertahanan.', color: 'border-emerald-500 bg-emerald-900/30 text-emerald-400' },
  { id: 'aqua', name: 'Aqua', title: 'Ahli Taktik Air', icon: '💧', image: aquaImg, desc: 'Ganti Kartu (Reroll) GRATIS (0 Koin).', color: 'border-blue-500 bg-blue-900/30 text-blue-400' },
  { id: 'volta', name: 'Volta', title: 'Pencuri Petir', icon: '⚡', image: voltaImg, desc: 'Ekstra +2 Koin tiap ronde.', color: 'border-yellow-500 bg-yellow-900/30 text-yellow-400' },
  { id: 'aegis', name: 'Aegis', title: 'Ksatria Baja', icon: '⚙️', image: aegisImg, desc: 'Kartu Besi +5 Pertahanan.', color: 'border-gray-400 bg-gray-900/30 text-gray-300' },
  { id: 'noctis', name: 'Noctis', title: 'Penguasa Bayangan', icon: '🌌', image: noctisImg, desc: 'Mulai 80 HP. Kartu Gelap +5 Serangan.', color: 'border-purple-900 bg-black/60 text-purple-400' },
  { id: 'solomon', name: 'Solomon', title: 'Paladin Matahari', icon: '☀️', image: solomonImg, desc: 'Mulai 110 HP. Kartu Cahaya +5 Pertahanan atau +5 Heal.', color: 'border-yellow-200 bg-yellow-900/40 text-yellow-100' },
  { id: 'zephyr', name: 'Zephyr', title: 'Pengembara Angin', icon: '🌪️', image: zephyrImg, desc: 'Kartu Angin +5 Serangan instan.', color: 'border-teal-400 bg-teal-900/30 text-teal-300' }
];

// GANTI baris yang lama menjadi ini:
const SLASH_FRAMES = [slash1Img, slash2Img, slash3Img, slash4Img, slash5Img];

const SlashEffect = ({ onComplete }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  useEffect(() => {
    if (currentFrame >= SLASH_FRAMES.length - 1) {
      const cleanup = setTimeout(() => { if (onComplete) onComplete(); }, 50);
      return () => clearTimeout(cleanup);
    }
    const timer = setTimeout(() => { setCurrentFrame((prev) => prev + 1); }, 50);
    return () => clearTimeout(timer);
  }, [currentFrame, onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <img src={SLASH_FRAMES[currentFrame]} alt="Slash VFX" className="w-48 h-48 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
    </div>
  );
};

const PlayerHP = ({ label, hp, maxHp = 100, overload, isOpponent, isShaking, floatText, isSlashing, onSlashComplete }) => {
  const healthPercent = Math.max(0, (hp / maxHp) * 100);
  const barColor = healthPercent > 30 ? "bg-green-500" : "bg-red-600 animate-pulse";
  const isOverloaded = overload >= 100;

  return (
    <div className={`relative w-[48%] bg-[#1a1c23] p-3 rounded-lg border-2 ${isOpponent ? 'border-purple-800' : 'border-blue-800'} shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] ${isShaking ? 'animate-headShake' : 'transition-all duration-300'}`}>
      {isSlashing && <SlashEffect onComplete={onSlashComplete} />}
      {floatText && (
        <div className={`absolute top-0 left-1/2 text-5xl font-black z-50 pointer-events-none [animation:floatUpFade_1.5s_ease-out_forwards] ${floatText.includes('-') ? 'text-red-500 drop-shadow-[0_0_15px_red]' : 'text-green-400 drop-shadow-[0_0_15px_green]'}`}>
          {floatText}
        </div>
      )}
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-bold ${isOpponent ? 'text-purple-400' : 'text-blue-400'}`}>{label}</span>
        <span className="text-xl font-black text-white">{UI_ICONS.HP} {Math.max(0, hp)}/{maxHp}</span>
      </div>
      <div className="w-full bg-black/60 h-4 rounded-full overflow-hidden border border-white/10 mb-2 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]">
        <div className={`${barColor} h-full rounded-full transition-all duration-300 ease-out`} style={{ width: `${healthPercent}%` }} />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className={`text-xs font-black tracking-widest ${isOverloaded ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}`}>METERAN ULTIMATE</span>
        <span className="text-xs text-gray-400">{Math.floor(overload)}%</span>
      </div>
      <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]">
        <div className={`h-full transition-all duration-300 ${isOverloaded ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' : 'bg-orange-600'}`} style={{ width: `${Math.min(100, overload)}%` }} />
      </div>
    </div>
  );
};

const BlockCard = ({ item, onClick, onDragStart, onHover, onLeave, isInteractive, isSelected, isCompact, isClashingPhase }) => {
  const glowClass = item.star === 3 ? '[animation:legendaryGlow_2s_infinite]' : item.star === 2 ? '[animation:epicGlow_2s_infinite]' : '';
  const lungeClass = isClashingPhase && isCompact ? 'animate-clashAttack' : '';

  const pressTimer = useRef(null);
  const isLongPress = useRef(false);
  const isTouch = useRef(false);

  const handleTouchStart = () => {
    isTouch.current = true;
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      if (onHover) onHover(item);
    }, 400);
  };

  const handleTouchEndOrMove = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <div
      draggable={isInteractive}
      onDragStart={onDragStart}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchEndOrMove}
      onTouchEnd={handleTouchEndOrMove}
      onTouchCancel={handleTouchEndOrMove}
      onClick={(e) => {
        if (isLongPress.current) {
          e.preventDefault();
          return;
        }
        if (onClick) onClick(e);
      }}
      onMouseEnter={() => {
        if (!isTouch.current && onHover) onHover(item);
      }}
      onMouseLeave={() => {
        if (!isTouch.current && onLeave) onLeave(null);
      }}
      className={`relative ${item.bgColor} ${item.border} border-2 rounded-sm text-white shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex flex-col justify-between select-none ${isInteractive ? 'cursor-grab hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-150' : ''} ${isSelected ? 'ring-2 ring-yellow-400 scale-105 z-10' : ''} ${isCompact ? 'p-2 w-full h-full' : 'p-3 w-full h-full'} ${glowClass} ${lungeClass}`}
    >
      {item.star && item.star > 1 && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex drop-shadow-md z-20 bg-black/80 border border-yellow-500/50 rounded-full px-1.5">
          {Array.from({ length: item.star }).map((_, i) => (<span key={i} className="text-yellow-400 text-[10px] animate-pulseFast">⭐</span>))}
        </div>
      )}
      <div className="flex items-center justify-between gap-1 mb-1 mt-1">
        <span className="text-xs font-mono opacity-60 hidden sm:inline">{isCompact ? "" : item.faction}</span>
        <span className={isCompact ? "text-2xl mx-auto" : "text-2xl drop-shadow-lg"}>{item.icon}</span>
      </div>
      <div className={`font-extrabold leading-tight tracking-tight truncate drop-shadow-md ${isCompact ? 'text-[10px] text-center' : 'text-lg mb-0.5'}`}>
        {item.name.replace(/_/g, ' ')}
      </div>
      {!isCompact && <div className="text-xs text-gray-200 font-medium mb-2 opacity-90">{item.desc}</div>}
      <div className={`font-bold text-center text-yellow-300 py-0.5 bg-black/60 border border-white/10 rounded-sm shadow-inner ${isCompact ? 'text-[10px] mt-1' : 'text-base mt-auto'}`}>
        {UI_ICONS.Energy} {item.cost}
      </div>
    </div>
  );
};

const ResultStats = ({ title, stats, dmgTaken, usedRootKit }) => (
  <div className={`w-1/3 p-6 rounded-sm border-4 relative overflow-hidden flex flex-col h-full shadow-2xl ${usedRootKit ? 'bg-[#3e2723] border-yellow-600' : 'bg-[#1a1c23] border-[#2d3748]'}`}>
    <h3 className="text-2xl font-extrabold mb-5 pb-2 border-b border-white/10 text-gray-200">{title}</h3>
    {usedRootKit && (<div className="absolute top-0 left-0 w-full bg-yellow-500 text-black font-black text-sm py-1 animate-pulse text-center">ULTIMATE DIGUNAKAN!</div>)}
    <div className="text-center space-y-4 mb-6 relative z-10 flex-grow">
      <div className="text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">⚔️ {usedRootKit ? 'MAKS' : (stats?.attack || 0)}</div>
      <div className="text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">🛡️ {stats?.defense || 0}</div>
    </div>
    <div className={`p-4 rounded-sm text-3xl font-black mt-auto shadow-inner ${dmgTaken > 0 ? 'bg-red-900/60 border border-red-500 text-red-200 animate-headShake' : 'bg-black/50 text-gray-500 border border-white/10'}`}>Kena -{dmgTaken} DMG</div>
  </div>
);

function App() {
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('arena_playerName') || "");
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [roomCode, setRoomCode] = useState(() => localStorage.getItem('arena_roomCode') || "");
  const [opponentName, setOpponentName] = useState("Lawan");
  const [selectedHero, setSelectedHero] = useState(() => {
    const savedHeroId = localStorage.getItem('arena_hero');
    return savedHeroId ? HERO_DATABASE.find(h => h.id === savedHeroId) || null : null;
  });
  const [isJoined, setIsJoined] = useState(() => {
    // Otomatis lewati layar awal jika nama dan hero sudah tersimpan di memori
    return !!localStorage.getItem('arena_playerName') && !!localStorage.getItem('arena_hero');
  });
  const [isInRoom, setIsInRoom] = useState(() => !!localStorage.getItem('arena_roomCode'));
  const [shopCards, setShopCards] = useState([]);
  const [bench, setBench] = useState(Array(5).fill(null));
  const [energy, setEnergy] = useState(15);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedBenchItem, setSelectedBenchItem] = useState(null);
  const [board, setBoard] = useState(Array(15).fill(null));
  const [badSectors, setBadSectors] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [lastShopState, setLastShopState] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMatchStarted, setIsMatchStarted] = useState(false);

  const [battleResult, setBattleResult] = useState(null);
  const [reactionText, setReactionText] = useState("");
  const [floatingDamage, setFloatingDamage] = useState({ p1: null, p2: null });

  const [myHP, setMyHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [myMaxHP, setMyMaxHP] = useState(100);
  const [opponentMaxHP, setOpponentMaxHP] = useState(100);

  const [myOverload, setMyOverload] = useState(0);
  const [opponentOverload, setOpponentOverload] = useState(0);
  const [isRootKitArmed, setIsRootKitArmed] = useState(false);

  const [shakePlayer, setShakePlayer] = useState(null);
  const [slashPlayers, setSlashPlayers] = useState({ p1: false, p2: false });
  const [battlePhase, setBattlePhase] = useState('idle');
  const [activeLane, setActiveLane] = useState(null);
  const [combatLogText, setCombatLogText] = useState(null);

  const [globalLeaderboard, setGlobalLeaderboard] = useState({});
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState(false);

  // 2. SIMPAN NAMA PEMAIN SECARA OTOMATIS
  useEffect(() => {
    if (playerName) {
      localStorage.setItem('arena_playerName', playerName);
    }
  }, [playerName]);

  // 3. SIMPAN KODE RUANGAN SAAT BERTANDING, & HAPUS SAAT KELUAR
  useEffect(() => {
    if (isInRoom && roomCode) {
      localStorage.setItem('arena_roomCode', roomCode);
    } else if (!isInRoom) {
      // Jika pemain sengaja keluar (klik tombol Keluar), hapus ingatan ruangannya
      localStorage.removeItem('arena_roomCode');
    }
  }, [isInRoom, roomCode]);

  // 4. SINKRONISASI KARTU KE SERVER SETIAP KALI BERUBAH
  useEffect(() => {
    // Hanya laporkan ke server jika pemain sedang di dalam ruangan dan di fase meracik kartu
    if (ws.current && ws.current.readyState === WebSocket.OPEN && isInRoom && battlePhase === 'idle') {
      ws.current.send(JSON.stringify({
        event: "sync_state",
        board: board,
        bench: bench,
        energy: energy,
        shop: shopCards
      }));
    }
  }, [board, bench, energy, shopCards, battlePhase, isInRoom]);

  useEffect(() => {
    if (selectedHero) {
      localStorage.setItem('arena_hero', selectedHero.id);
    } else {
      localStorage.removeItem('arena_hero');
    }
  }, [selectedHero]);

  const handleHeroSelection = (hero) => {
    setSelectedHero(hero);
    if (hero.id === 'terra') { setMyHP(150); setMyMaxHP(150); }
    else { setMyHP(100); setMyMaxHP(100); }
  };

  const ws = useRef(null);
  const rollShop = () => {
    const newShop = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * CARD_DATABASE.length);
      newShop.push({ ...CARD_DATABASE[randomIndex], star: 1 });
    }
    setShopCards(newShop);
    setLastShopState([...newShop]);
  };

  const triggerDamageVisual = useCallback((player) => {
    setShakePlayer(player);
    setTimeout(() => setShakePlayer(null), 500);
  }, []);

  const runBattleSequence = useCallback(async (data) => {
    setBattlePhase('clashing');

    let currentSimP1HP = data.Player_1_HP + data.P1_Damage_Taken;
    let currentSimP2HP = data.Player_2_HP + data.P2_Damage_Taken;

    const ultimates = data.logs.filter(log => log.type === 'ultimate');
    if (ultimates.length > 0) {
      playSound('ultimate');
      setReactionText("ULTIMATE DIGUNAKAN!");
      await new Promise(r => setTimeout(r, 1500));
      setReactionText("");

      ultimates.forEach(ult => {
        if (ult.source === 'Player_1') currentSimP2HP -= ult.damage;
        if (ult.source === 'Player_2') currentSimP1HP -= ult.damage;
      });
      setMyHP(currentSimP1HP); setOpponentHP(currentSimP2HP);
    }

    const clashLogs = data.logs.filter(log => log.type === 'clash');

    for (let col = 0; col < 5; col++) {
      const log = clashLogs.find(l => l.lane === col);
      if (!log) continue;

      setActiveLane(col);
      playSound('clash');

      let clashMessage = `⚔️ BENTURAN!`;
      if (log.p1_dmg_received === 0 && log.p2_dmg_received === 0) {
        if (log.p1_action.atk === 0 && log.p2_action.atk === 0) clashMessage = "✨ EFEK AKTIF!";
        else clashMessage = "🛡️ TERTANGKIS!";
      }
      else if (log.p1_action.atk > 0 && log.p2_action.def === 0) clashMessage = "💥 DIRECT HIT!";
      else if (log.p2_action.atk > 0 && log.p1_action.def === 0) clashMessage = "💥 DIRECT HIT!";

      setCombatLogText({ lane: col, text: clashMessage, type: (log.p1_dmg_received > 0 || log.p2_dmg_received > 0) ? 'hit' : 'blocked' });
      await new Promise(r => setTimeout(r, 600));

      if (log.reaction_triggered) {
        setReactionText(log.reaction_triggered);
        playSound('ultimate');
        await new Promise(r => setTimeout(r, 1000));
        setReactionText("");
      }

      if (log.p1_dmg_received > 0 || log.p2_dmg_received > 0) {
        if (log.p1_dmg_received > 0) {
          triggerDamageVisual("p1"); setSlashPlayers(prev => ({ ...prev, p1: true }));
          currentSimP1HP -= log.p1_dmg_received;
        }
        if (log.p2_dmg_received > 0) {
          triggerDamageVisual("p2"); setSlashPlayers(prev => ({ ...prev, p2: true }));
          currentSimP2HP -= log.p2_dmg_received;
        }

        setMyHP(currentSimP1HP); setOpponentHP(currentSimP2HP);
        setFloatingDamage({
          p1: log.p1_dmg_received > 0 ? `-${log.p1_dmg_received}` : null,
          p2: log.p2_dmg_received > 0 ? `-${log.p2_dmg_received}` : null
        });
        playSound('error');

        await new Promise(r => setTimeout(r, 800));
        setSlashPlayers({ p1: false, p2: false });
        setFloatingDamage({ p1: null, p2: null });
      } else {
        await new Promise(r => setTimeout(r, 600));
      }

      setCombatLogText(null);
      setActiveLane(null);
      await new Promise(r => setTimeout(r, 200));
    }

    setMyHP(data.Player_1_HP); setOpponentHP(data.Player_2_HP);
    setMyOverload(data.Player_1_Overload); setOpponentOverload(data.Player_2_Overload);

    setBattlePhase('result');
    setBattleResult(data);
    if (data.Leaderboard) setGlobalLeaderboard(data.Leaderboard);
    if (data.Next_Bad_Sectors) setBadSectors(data.Next_Bad_Sectors);

  }, [setFloatingDamage, setOpponentOverload, setReactionText, setSlashPlayers, triggerDamageVisual]);

  useEffect(() => {
    // 1. GEMBOK KEAMANAN: Jangan menelepon server jika nama atau kode ruangan belum siap!
    if (!isJoined || !isInRoom || !roomCode || !playerName) return;

    const socketUrl = `ws://localhost:8000/ws/${roomCode}/${playerName}`;
    const socket = new WebSocket(socketUrl);

    // eslint-disable-next-line
    ws.current = socket;

    // 2. Ganti ws.current.onmessage menjadi socket.onmessage agar lebih stabil
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "opponent_disconnected") {
        playSound('error');
        setIsOpponentDisconnected(true);
      }

      if (data.event === "match_start" || data.event === "match_resume") {
        setIsMatchStarted(true);
        setBadSectors(data.bad_sectors);
        if (data.P1_MaxHP) setMyMaxHP(data.P1_MaxHP);
        if (data.P2_MaxHP) setOpponentMaxHP(data.P2_MaxHP);
        if (data.P1_HP) setMyHP(data.P1_HP);
        if (data.P2_HP) setOpponentHP(data.P2_HP);
        if (data.Leaderboard) setGlobalLeaderboard(data.Leaderboard);
        if (data.p1_name && data.p2_name) {
          const opponent = data.p1_name === playerName ? data.p2_name : data.p1_name;
          setOpponentName(opponent);
        }
        if (data.room_code) {
          setRoomCode(data.room_code);
        }

        if (data.event === "match_resume") {
          // 1. Pulihkan Ronde dan Status dasar
          setCurrentRound(data.current_round);
          const isP1 = data.p1_name === playerName;
          setMyOverload(isP1 ? data.P1_Overload : data.P2_Overload);
          setOpponentOverload(isP1 ? data.P2_Overload : data.P1_Overload);
          setIsOpponentDisconnected(false);
          setBattlePhase('idle');

          // ==========================================
          // 🌟 2. PEMULIHAN KEADAAN PENUH (FULL RECOVERY) 🌟
          // ==========================================

          // A. Memulihkan Hero
          const myHeroId = isP1 ? data.P1_Hero : data.P2_Hero;
          if (myHeroId) {
            const recoveredHero = HERO_DATABASE.find(h => h.id === myHeroId);
            if (recoveredHero) setSelectedHero(recoveredHero);
          }

          // B. Memulihkan Koin Energi
          const myEnergy = isP1 ? data.P1_Energy : data.P2_Energy;
          if (myEnergy !== undefined && myEnergy !== null) {
            setEnergy(myEnergy);
          }

          // C. Memulihkan Kartu di Tangan (Bench)
          const myBench = isP1 ? data.P1_Bench : data.P2_Bench;
          if (myBench) {
            setBench(myBench);
          }

          // D. Memulihkan Kartu di Arena (Board)
          const myBoard = isP1 ? data.P1_Board : data.P2_Board;
          if (myBoard) {
            setBoard(myBoard);
          }
          const myShop = isP1 ? data.P1_Shop : data.P2_Shop;
          if (myShop) {
            setShopCards(myShop);
            setLastShopState([...myShop]); // Sangat penting agar kartu tetap bisa di-drag!
          }
          // ==========================================
        } else {
          // Jika ini match_start (bukan resume)
          setCurrentRound(1);
          setIsOpponentDisconnected(false);
          setBattleResult(null);
          setBattlePhase('idle');
        }
      }

      if (data.event === "battle_sequence") {
        runBattleSequence(data);
      }
    };

    // 3. Tangkap error jika koneksi bermasalah agar layar tidak blank
    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      if (socket.readyState === 1 || socket.readyState === 0) socket.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJoined, isInRoom, roomCode, playerName]);

  const handleDragStart = (e, item, source, index) => {
    if (battlePhase !== 'idle') return;
    setDraggingItem({ item, source, index });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData('text/plain', index !== null ? index.toString() : 'new');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetSource, targetIndex) => {
    e.preventDefault();
    if (!draggingItem || battlePhase !== 'idle') return;

    const { item, source, index } = draggingItem;
    let newBoard = [...board];
    let newBench = [...bench];
    let newShop = [...shopCards];

    if (targetSource === 'shop') {
      const originalIndex = lastShopState.findIndex((s, i) =>
        s && s.name === item.name && item.star === 1 && newShop[i] === null
      );

      if (originalIndex !== -1) {
        newShop[originalIndex] = { ...item };
        setEnergy(prev => prev + item.cost);
        if (source === 'board') newBoard[index] = null;
        if (source === 'bench') newBench[index] = null;
        playSound('buy');
      } else {
        playSound('error');
      }
    }
    else if (source === 'shop') {
      if (energy >= item.cost) {
        if (targetSource === 'board' && !newBoard[targetIndex] && !badSectors.includes(targetIndex)) {
          newBoard[targetIndex] = item;
          newShop[index] = null;
          setEnergy(prev => prev - item.cost);
          playSound('buy');
        } else if (targetSource === 'bench' && !newBench[targetIndex]) {
          newBench[targetIndex] = item;
          newShop[index] = null;
          setEnergy(prev => prev - item.cost);
          playSound('buy');
        }
      } else { playSound('error'); }
    }
    else {
      if (source === 'board') newBoard[index] = null;
      else if (source === 'bench') newBench[index] = null;

      if (targetSource === 'board' && !badSectors.includes(targetIndex)) {
        const temp = newBoard[targetIndex];
        newBoard[targetIndex] = item;
        if (source === 'board') newBoard[index] = temp;
        else if (source === 'bench') newBench[index] = temp;
      } else if (targetSource === 'bench') {
        const temp = newBench[targetIndex];
        newBench[targetIndex] = item;
        if (source === 'board') newBoard[index] = temp;
        else if (source === 'bench') newBench[index] = temp;
      }
      playSound('buy');
    }

    setBoard(newBoard);
    setBench(newBench);
    setShopCards(newShop);
    setDraggingItem(null);
    updateGameState(newBoard, newBench);
  };

  const handleTouchOrClick = (item, source, index) => {
    if (battlePhase !== 'idle') return;

    if (draggingItem && draggingItem.index === index && draggingItem.source === source) {
      setDraggingItem(null);
      return;
    }

    if (draggingItem) {
      handleDrop({ preventDefault: () => { } }, source, index);
    }
    else if (item) {
      setDraggingItem({ item, source, index });
    }
  };

  const updateGameState = (newBoard, newBench) => {
    let boardState = [...newBoard]; let benchState = [...newBench];
    let didFuseAny = false; let keepChecking = true;
    while (keepChecking) {
      keepChecking = false;
      for (let targetStar = 1; targetStar <= 2; targetStar++) {
        const counts = {};
        boardState.forEach((item, idx) => {
          if (item && item.star === targetStar) {
            if (!counts[item.name]) counts[item.name] = [];
            counts[item.name].push({ loc: 'board', idx });
          }
        });
        benchState.forEach((item, idx) => {
          if (item && item.star === targetStar) {
            if (!counts[item.name]) counts[item.name] = [];
            counts[item.name].push({ loc: 'bench', idx });
          }
        });
        for (const [name, locations] of Object.entries(counts)) {
          if (locations.length >= 3) {
            keepChecking = true; didFuseAny = true;
            const toMerge = locations.slice(0, 3);
            const spawnPoint = toMerge[2];
            toMerge.forEach(({ loc, idx }) => {
              if (loc === 'board') boardState[idx] = null;
              if (loc === 'bench') benchState[idx] = null;
            });
            const upgradedItem = { ...CARD_DATABASE.find(c => c.name === name), star: targetStar + 1 };
            if (spawnPoint.loc === 'board') boardState[spawnPoint.idx] = upgradedItem;
            if (spawnPoint.loc === 'bench') benchState[spawnPoint.idx] = upgradedItem;
          }
        }
      }
    }
    if (didFuseAny) playSound('levelup');
    setBoard(boardState); setBench(benchState);
  };

  const handleReroll = () => {
    const rerollCost = selectedHero?.id === 'aqua' ? 0 : 1;
    if (energy >= rerollCost) { playSound('reroll'); setEnergy(energy - rerollCost); rollShop(); }
    else playSound('error');
  };

  const handleBenchClick = (item, index) => {
    if (battlePhase !== 'idle') return;
    if (draggingItem) {
      handleDrop({ preventDefault: () => { } }, 'bench', index);
      return;
    }
    if (item) {
      playSound('buy');
      if (selectedBenchItem?.index === index) setSelectedBenchItem(null);
      else setSelectedBenchItem({ item, index });
    }
  };

  const handleGridClick = (gridIndex) => {
    if (battlePhase !== 'idle') return;
    if (badSectors.includes(gridIndex)) { playSound('error'); return; }

    if (draggingItem) {
      handleDrop({ preventDefault: () => { } }, 'board', gridIndex);
      return;
    }

    const newBoard = [...board]; const newBench = [...bench];
    if (newBoard[gridIndex] && !selectedBenchItem) {
      const emptyBenchIndex = bench.findIndex(slot => slot === null);
      if (emptyBenchIndex !== -1) {
        playSound('buy'); newBench[emptyBenchIndex] = newBoard[gridIndex]; newBoard[gridIndex] = null;
        updateGameState(newBoard, newBench);
      } else playSound('error'); return;
    }
    if (selectedBenchItem && !newBoard[gridIndex]) {
      playSound('buy'); newBoard[gridIndex] = selectedBenchItem.item; newBench[selectedBenchItem.index] = null;
      setSelectedBenchItem(null); updateGameState(newBoard, newBench); return;
    }
    if (selectedBenchItem && newBoard[gridIndex]) {
      playSound('buy'); const temp = newBoard[gridIndex]; newBoard[gridIndex] = selectedBenchItem.item; newBench[selectedBenchItem.index] = temp;
      setSelectedBenchItem(null); updateGameState(newBoard, newBench); return;
    }
  };

  const lockInGrid = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      playSound('error');
      alert("Koneksi belum stabil! Tunggu sebentar atau refresh.");
      return;
    }
    setBattlePhase('locked');
    const tacticalPayload = [];
    board.forEach((item, index) => {
      if (item) tacticalPayload.push({ type: item.name, row: Math.floor(index / 5), col: index % 5, star: item.star });
    });

    // 👇 TAMBAHKAN event: "lock_grid" DI BARIS INI 👇
    ws.current.send(JSON.stringify({ 
      event: "lock_grid", 
      grid: tacticalPayload, 
      name: playerName, 
      root_kit: isRootKitArmed, 
      hero: selectedHero.id 
    }));
  };

  const nextRound = () => {
    const baseIncome = selectedHero?.id === 'volta' ? 12 : 10;
    const roundBonus = currentRound;
    const totalIncome = baseIncome + roundBonus;

    setEnergy(energy + totalIncome);
    setIsRootKitArmed(false);
    setBattleResult(null);
    setBattlePhase('idle');
    rollShop();
  };

  const handleRematch = () => {
    if (ws.current) ws.current.close();
    setBattleResult(null);
    setBattlePhase('idle');
    setIsInRoom(false); // Ini akan otomatis menghapus memori ruangan di localStorage!

    if (roomCode === "RANDOM" || isOpponentDisconnected) {
      setRoomCode("");
    }

    setIsOpponentDisconnected(false);
    setBoard(Array(15).fill(null));
    setBench(Array(5).fill(null));
    setEnergy(15);
    setCurrentRound(1);
    setIsMatchStarted(false);

    // --- PENYESUAIAN HP AWAL UNTUK HERO BARU ---
    let startingHP = 100;
    if (selectedHero?.id === 'terra') startingHP = 150;
    else if (selectedHero?.id === 'noctis') startingHP = 80;
    else if (selectedHero?.id === 'lumina') startingHP = 110;

    setMyHP(startingHP);
    setOpponentHP(100);
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#0a0a0c] to-black flex flex-col items-center justify-center p-4 text-gray-100 font-sans">
        <div className="bg-[#1a1c23] p-8 rounded-sm border-2 border-gray-700 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-2xl w-full text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500 mb-8 drop-shadow-lg">ARENA ELEMEN</h1>

          <input
            type="text"
            placeholder="Masukkan Nama Petarung..."
            maxLength="12"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
            disabled={isNameLocked}
            className={`w-full bg-black/50 border shadow-inner rounded-sm p-4 text-2xl font-black text-center text-white outline-none mb-2 uppercase transition-all ${isNameLocked
              ? 'border-gray-800 text-gray-500 cursor-not-allowed opacity-60'
              : 'border-gray-600 focus:border-green-400'
              }`}
          />
          {isNameLocked && (
            <p className="text-xs text-yellow-500 mb-6 font-bold tracking-widest uppercase">
              🔒 Identitas Terkunci untuk Sesi Ini
            </p>
          )}

          <h3 className="text-xl font-bold text-gray-400 mb-4 text-left">Pilih Pahlawanmu:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {HERO_DATABASE.map(hero => (
              <div key={hero.id} onClick={() => handleHeroSelection(hero)} className={`p-4 rounded-sm border-2 cursor-pointer transition-all flex flex-col items-center text-center ${selectedHero?.id === hero.id ? `ring-2 ring-white ${hero.color} scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]` : 'border-gray-800 bg-black/40 hover:border-gray-600 hover:bg-black/60'}`}>
                {hero.image ? (
                  <img src={hero.image} alt={hero.name} className="h-40 w-auto object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] idle-breathe mb-2" />
                ) : (
                  <div className="text-4xl mb-2 drop-shadow-lg idle-breathe">{hero.icon}</div>
                )}
                <div className="font-black text-lg drop-shadow-md">{hero.name}</div>
                <div className="text-xs opacity-80 mb-2 font-mono">{hero.title}</div>
                <div className="text-[10px] text-gray-300 leading-tight bg-black/80 border border-white/5 p-2 rounded-sm mt-auto shadow-inner">{hero.desc}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (playerName && selectedHero) {
                setIsNameLocked(true);
                setIsJoined(true);
              } else playSound('error');
            }}
            className={`w-full py-4 mt-8 text-white font-bold rounded-sm text-xl transition-all shadow-lg ${playerName && selectedHero ? 'bg-gradient-to-r from-blue-700 to-blue-600 border border-blue-400' : 'bg-gray-800 border border-gray-700 cursor-not-allowed opacity-50'}`}
          >
            {playerName && selectedHero ? 'LANJUT KE LOBI' : 'ISI NAMA & PILIH HERO'}
          </button>
        </div>
      </div>
    );
  }

  if (!isInRoom) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-[#1a1c23] p-8 rounded-sm border-2 border-yellow-600 shadow-2xl max-w-md w-full text-center">
          <div className="mb-6">
            <span className="text-6xl drop-shadow-lg">{selectedHero?.icon}</span>
            <h2 className="text-2xl font-black text-yellow-400 mt-2">HALO, {playerName}!</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest">{selectedHero?.title}</p>
          </div>

          <p className="text-gray-400 text-sm mb-4 italic">Main dengan teman (Isi kode meja):</p>

          <input
            type="text"
            placeholder="KODE RUANG (Cth: MEJA-1)"
            maxLength="10"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/\s/g, '-'))}
            className="w-full bg-black/50 border border-gray-600 shadow-inner rounded-sm p-4 text-3xl font-black text-center text-yellow-400 outline-none focus:border-yellow-400 mb-4 uppercase font-mono tracking-widest"
          />

          <button
            onClick={() => {
              if (roomCode && roomCode !== "RANDOM") {
                setIsInRoom(true);
                rollShop();
              } else playSound('error');
            }}
            className={`w-full py-4 text-white font-black rounded-sm text-xl transition-all shadow-lg ${roomCode && roomCode !== "RANDOM" ? 'bg-gradient-to-r from-green-700 to-green-600 border border-green-500 hover:scale-105' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`}
          >
            GABUNG MEJA TEMAN
          </button>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-700" />
            <span className="px-3 text-gray-500 text-xs font-bold uppercase tracking-widest">Atau</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          <button
            onClick={() => {
              setRoomCode("RANDOM");
              setIsInRoom(true);
              rollShop();
            }}
            className="w-full py-5 text-white font-black rounded-sm text-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] bg-gradient-to-r from-blue-700 to-blue-600 border border-blue-400 hover:scale-105 animate-pulse"
          >
            CARI LAWAN ACAK 🌍
          </button>

          <button
            onClick={() => setIsJoined(false)}
            className="mt-6 text-gray-500 text-xs underline hover:text-gray-300 transition-all"
          >
            Ganti Pahlawan (Nama Terkunci)
          </button>
        </div>
      </div>
    );
  }

  const getLanePower = (col) => {
    let atk = 0; let def = 0;
    for (let row = 0; row < 3; row++) {
      const item = board[row * 5 + col];
      if (item) {
        const cardData = CARD_DATABASE.find(c => c.name === item.name);
        const starMult = item.star === 1 ? 1 : (item.star === 2 ? 2 : 4);
        let currentAtk = (cardData.atk || 0) * starMult;
        let currentDef = (cardData.def || 0) * starMult;
        if (selectedHero?.id === 'ignis' && cardData.faction === 'Api') currentAtk += 5;
        if (selectedHero?.id === 'terra' && cardData.faction === 'Bumi') currentDef += 5;
        atk += currentAtk; def += currentDef;
      }
    }
    return { atk, def };
  };

  const renderTooltip = () => {
    if (!hoveredCard) return null;
    const TooltipContent = (
      <>
        <div className="flex items-center gap-3 mb-2 border-b border-gray-700 pb-2">
          <span className="text-4xl">{hoveredCard.icon}</span>
          <div>
            <h3 className="font-black text-xl text-yellow-400 uppercase leading-none">{hoveredCard.name.replace(/_/g, ' ')}</h3>
            <span className="text-[10px] text-gray-500 font-mono">FAKSI: {hoveredCard.faction}</span>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">Apa kegunaannya?</p>
            <p className="text-gray-200">{hoveredCard.description?.action}</p>
          </div>
          <div>
            <p className="text-green-400 font-bold text-xs uppercase tracking-widest">Cara Bermain:</p>
            <p className="text-gray-200 italic">{hoveredCard.description?.howToPlay}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-black/40 p-2 rounded-sm border border-white/5">
              <p className="text-red-400 font-bold text-[9px] uppercase">Penempatan:</p>
              <p className="text-[11px] text-gray-300 leading-tight">{hoveredCard.description?.placement}</p>
            </div>
            <div className="bg-black/40 p-2 rounded-sm border border-white/5">
              <p className="text-purple-400 font-bold text-[9px] uppercase">Sinergi:</p>
              <p className="text-[11px] text-gray-300 leading-tight">{hoveredCard.description?.synergy}</p>
            </div>
          </div>
        </div>
      </>
    );

    return (
      <>
        <div className="hidden xl:block fixed z-[200] bg-[#1a1c23] border-2 border-yellow-500 p-4 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.9)] max-w-xs pointer-events-none"
          style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}>
          {TooltipContent}
        </div>
        <div className="xl:hidden fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setHoveredCard(null)}
        >
          <div className="bg-[#1a1c23] border-2 border-yellow-500 p-5 rounded-md shadow-2xl max-w-sm w-full relative pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {TooltipContent}
            <button
              onClick={() => setHoveredCard(null)}
              className="w-full mt-4 bg-gradient-to-r from-red-800 to-red-900 border border-red-500 text-white font-black py-3 rounded-sm shadow-lg active:scale-95 transition-all">
              TUTUP DESKRIPSI
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#0a0a0c] to-black text-gray-100 font-sans flex flex-col xl:flex-row relative px-1 py-2 md:p-6">

      {/* --- OVERLAY KONEKSI TERPUTUS --- */}
      {isOpponentDisconnected && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <span className="text-8xl mb-6 animate-pulse">📡</span>
          <h1 className="text-4xl md:text-5xl font-black text-red-500 mb-2 text-center drop-shadow-[0_0_15px_red]">
            LAWAN TERPUTUS!
          </h1>
          <p className="text-gray-300 mb-8 text-center text-lg italic">
            Menunggu <span className="font-bold text-white">{opponentName}</span> kembali ke arena... Jangan keluar!
          </p>
          <button
            onClick={handleRematch}
            className="py-4 px-8 border-2 border-red-800 text-red-400 font-bold hover:bg-red-900/40 transition-all rounded-sm"
          >
            NYERAH & KEMBALI KE LOBI
          </button>
        </div>
      )}

      {renderTooltip()}
      <div className="flex-grow w-full max-w-md mx-auto flex flex-col gap-2">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500 drop-shadow-lg leading-none">ARENA ELEMEN</h1>
            
            {/* 👇 TOMBOL BATAL / MENYERAH DITAMBAHKAN DI SINI 👇 */}
            <button
              onClick={() => {
                if (!isMatchStarted) {
                  // Jika musuh belum ketemu, batalkan pencarian
                  handleRematch(); 
                } else {
                  // Jika sudah bertarung, tanyakan kepastian untuk menyerah
                  if (window.confirm("Apakah Anda yakin ingin menyerah? Pertandingan akan langsung berakhir dan lawan Anda akan dinyatakan menang.")) {
                    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                      ws.current.send(JSON.stringify({ event: "surrender" }));
                    }
                  }
                }
              }}
              className="mt-2 text-[10px] md:text-xs font-black tracking-widest px-4 py-1.5 bg-red-950 hover:bg-red-800 text-red-300 border border-red-700 rounded-sm transition-all shadow-[0_0_10px_rgba(220,38,38,0.2)] active:scale-95"
            >
              {!isMatchStarted ? 'BATAL CARI LAWAN' : '🚩 MENYERAH'}
            </button>
          </div>
          
          <div className="text-3xl font-extrabold text-yellow-400 p-3 bg-[#1a1c23] rounded-sm border border-yellow-700/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] flex items-center gap-2">
            {UI_ICONS.Energy} {energy} <span className="text-xl opacity-60">Koin</span>
          </div>
        </header>

        <div className="flex justify-between items-center gap-1 md:gap-4 mb-2 w-full">
          <PlayerHP
            label={playerName}
            hp={myHP}
            maxHp={myMaxHP}
            overload={myOverload}
            isShaking={shakePlayer === "p1"}
            floatText={floatingDamage.p1}
            isSlashing={slashPlayers.p1}
            isCompact={true} />

          <div className="flex flex-col items-center shrink-0">
            <span className="font-black text-yellow-500 text-sm md:text-xl leading-none">VS</span>
            <span className="text-[8px] md:text-xs font-bold text-gray-300 mt-1 bg-black/60 px-2 py-0.5 rounded-sm border border-gray-700 shadow-inner whitespace-nowrap">
              RONDE {currentRound}
            </span>
          </div>

          <PlayerHP
            label={opponentName}
            hp={opponentHP}
            maxHp={opponentMaxHP}
            isOpponent={true}
            overload={opponentOverload}
            isShaking={shakePlayer === "p2"}
            floatText={floatingDamage.p2}
            isSlashing={slashPlayers.p2}
            isCompact={true} />
        </div>

        {battlePhase !== 'result' ? (
          <div className="flex flex-col flex-grow relative">
            {reactionText && (
              <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
                <h2 className="text-4xl md:text-6xl font-black text-yellow-400 italic uppercase drop-shadow-[0_0_20px_rgba(0,0,0,1)] animate-bounce">
                  {reactionText}
                </h2>
              </div>
            )}
            {myOverload >= 100 && battlePhase === 'idle' && (
              <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600 rounded-sm flex items-center justify-between animate-pulseFast shadow-[0_0_15px_rgba(202,138,4,0.2)]">
                <div>
                  <h3 className="text-xl font-black text-yellow-400 drop-shadow-md">⚠️ ULTIMATE SIAP!</h3>
                  <p className="text-sm text-yellow-200 opacity-90">Gunakan jurus ini untuk memberikan 30 kerusakan instan ke lawan!</p>
                </div>
                <button onClick={() => { setIsRootKitArmed(!isRootKitArmed); playSound('buy'); }} className={`px-8 py-3 font-black text-xl rounded-sm transition-all border ${isRootKitArmed ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_#facc15]' : 'bg-[#1a1c23] text-yellow-500 border-yellow-700 hover:bg-[#2d3748]'}`}>
                  {isRootKitArmed ? 'SIAP!' : 'SIAPKAN ULTIMATE'}
                </button>
              </div>
            )}

            <div className={`mb-6 w-full transition-all duration-500 ${battlePhase === 'locked' ? 'filter brightness-50 contrast-125' : ''}`}>
              <h4 className="text-sm font-bold text-gray-500 mb-2 tracking-widest uppercase drop-shadow-md">Arena Pertarungan</h4>

              <div className="grid grid-cols-5 gap-1 mb-1 text-[8px] md:text-[10px] text-center font-bold">
                {[0, 1, 2, 3, 4].map(col => {
                  const power = getLanePower(col);
                  return (
                    <div key={col} className="min-w-0 bg-black/50 py-1 rounded-t-sm border-x border-t border-[#3e2723] overflow-hidden flex flex-col xl:flex-row items-center justify-center xl:gap-1">
                      <span className="text-red-400">⚔️{power.atk}</span>
                      <span className="hidden xl:inline text-gray-500">|</span>
                      <span className="text-blue-400">🛡️{power.def}</span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gradient-to-br from-[#2a1b12] to-[#140b06] p-2 md:p-6 rounded-sm border-2 md:border-[6px] border-[#3e2723] relative shadow-[0_30px_60px_rgba(0,0,0,0.9)] flex flex-col justify-center">
                <div className="absolute inset-0 bg-black/20 shadow-[inset_0_0_50px_rgba(0,0,0,1)] pointer-events-none"></div>

                <div className="absolute -top-3 md:-top-4 left-0 w-full flex justify-between px-2 md:px-10 text-[8px] md:text-xs font-black text-[#8d6e63] uppercase tracking-widest pointer-events-none z-10 gap-2">
                  <span className="truncate">Belakang</span>
                  <span className="truncate">Tengah</span>
                  <span className="text-red-500 drop-shadow-md truncate">Depan (Bahaya!)</span>
                </div>

                <div className="grid grid-cols-5 grid-rows-3 gap-1 md:gap-3 w-full max-w-4xl mx-auto relative z-10">
                  {board.map((item, index) => {
                    const isBad = badSectors.includes(index);
                    const isColActive = activeLane === (index % 5);
                    return (
                      <div key={index}
                        onClick={() => handleGridClick(index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'board', index)}
                        className={`min-w-0 aspect-square w-full rounded-sm flex items-center justify-center transition-all overflow-hidden relative 
           ${isBad ? 'border border-red-600 bg-red-950/60 cursor-not-allowed shadow-[inset_0_0_15px_rgba(255,0,0,0.5)]' :
                            item ? 'border-transparent' :
                              'bg-black/50 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] border border-[#4e342e] hover:border-[#8d6e63] hover:bg-black/30 cursor-pointer'} 
           ${selectedBenchItem && !item && !isBad ? 'animate-pulse bg-[#3e2723]/50 ring-2 ring-yellow-700/50' : ''}
           ${isColActive ? 'ring-4 ring-yellow-400 bg-yellow-900/40 z-20 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : ''}`}>

                        {isColActive && index < 5 && combatLogText && (
                          <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 z-50 text-[10px] md:text-2xl font-black italic whitespace-nowrap drop-shadow-[0_0_10px_black] animate-floatUpFade pointer-events-none ${combatLogText.type === 'blocked' ? 'text-gray-400' : 'text-red-500'}`}>
                            {combatLogText.text}
                          </div>
                        )}

                        {isBad && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 animate-pulse bg-black/50">
                            <span className="text-xl md:text-3xl">⚠️</span>
                            <span className="text-[8px] md:text-[10px] font-black tracking-widest mt-1 drop-shadow-md">RUSAK</span>
                          </div>
                        )}

                        {!isBad && item ? (
                          <BlockCard
                            item={item}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (draggingItem?.index === index && draggingItem?.source === 'board') setDraggingItem(null);
                              else setDraggingItem({ item, source: 'board', index });
                            }}
                            isSelected={draggingItem?.index === index && draggingItem?.source === 'board'}
                            onHover={setHoveredCard}
                            onLeave={setHoveredCard}
                            isInteractive={battlePhase === 'idle'}
                            isCompact={true}
                            isClashingPhase={isColActive}
                            onDragStart={(e) => handleDragStart(e, item, 'board', index)}
                          />
                        ) : !isBad && (<span className="text-[#3e2723] font-black text-2xl opacity-50">+</span>)}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className={`mb-6 transition-all duration-500 ${battlePhase !== 'idle' ? 'opacity-30 pointer-events-none' : ''}`}>
              <h4 className="text-sm font-bold text-gray-500 mb-2 tracking-widest uppercase drop-shadow-md">Bangku Cadangan (Simpan Kartu)</h4>
              <div className="flex gap-1 md:gap-3 bg-[#1a1c23] p-2 md:p-4 rounded-sm border border-gray-800 shadow-inner h-[80px] md:h-[140px] overflow-x-auto">
                {bench.map((item, index) => (
                  <div key={index}
                    onClick={() => handleBenchClick(item, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'bench', index)}
                    className={`flex-1 rounded-sm flex items-center justify-center transition-all ${item ? 'border-transparent cursor-pointer' : 'bg-black/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] border border-white/5'} ${selectedBenchItem?.index === index ? 'ring-2 ring-yellow-500 scale-105' : ''}`}>
                    {item ? (
                      <BlockCard
                        item={item}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (draggingItem?.index === index && draggingItem?.source === 'bench') setDraggingItem(null);
                          else setDraggingItem({ item, source: 'bench', index });
                        }}
                        isSelected={draggingItem?.index === index && draggingItem?.source === 'bench'}
                        onHover={setHoveredCard}
                        onLeave={setHoveredCard}
                        isInteractive={battlePhase === 'idle'}
                        isCompact={true}
                        onDragStart={(e) => handleDragStart(e, item, 'bench', index)}
                      />
                    ) : <span className="text-gray-700 font-mono text-sm opacity-30 drop-shadow-md">KOSONG</span>}
                  </div>
                ))}
              </div>
            </div>

            {battlePhase === 'idle' ? (
              <button onClick={lockInGrid} className={`w-full py-5 px-8 rounded-sm border text-2xl font-black tracking-tighter text-white shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0 ${isRootKitArmed ? 'bg-red-800 border-red-500 animate-pulse shadow-[0_10px_30px_rgba(220,38,38,0.4)]' : 'bg-gradient-to-r from-blue-800 to-blue-900 border-blue-500 hover:from-blue-700 hover:to-blue-800 shadow-[0_10px_30px_rgba(37,99,235,0.3)]'}`}>
                {isRootKitArmed ? 'LEPASKAN ULTIMATE!' : 'MAJU BERTARUNG!'}
              </button>
            ) : (
              <div className="w-full py-5 px-8 rounded-sm border text-2xl font-black tracking-tighter text-gray-400 bg-[#0b0c10] border-gray-800 text-center animate-pulse shadow-inner">
                {battlePhase === 'locked' ? 'Menunggu Musuh...' : 'Sutradara Memulai Aksi!'}
              </div>
            )}

          </div>
        ) : (
          <div className="animate-fadeIn p-8 bg-[#0b0c10] rounded-sm border-4 border-[#1a1c23] text-center shadow-[0_0_50px_rgba(0,0,0,1)] max-w-5xl mx-auto flex-grow flex flex-col justify-center">
            <div className="text-sm font-mono text-gray-600 tracking-widest mb-10 drop-shadow-md">STATUS :: PERTARUNGAN SELESAI</div>
            <div className="flex justify-center items-stretch gap-10 mb-12">
              <ResultStats title={playerName} stats={battleResult.Player_1_Stats} dmgTaken={battleResult.P1_Damage_Taken} usedRootKit={battleResult.P1_Used_RootKit} />
              <div className="text-6xl font-black text-gray-800 italic flex items-center drop-shadow-lg">vs</div>
              <ResultStats title={opponentName} stats={battleResult.Player_2_Stats} dmgTaken={battleResult.P2_Damage_Taken} usedRootKit={battleResult.P2_Used_RootKit} />
            </div>
            <div className="py-6 bg-[#1a1c23] rounded-sm mb-10 border border-gray-800 shadow-inner">
              <h2 className="text-5xl font-extrabold tracking-tighter text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                {battleResult.Round_Winner === 'Seri!' ? 'SERI :: TIDAK ADA YANG TERLUKA' : `${battleResult.Round_Winner} memenangkan ronde ini!`}
              </h2>
            </div>
            {battleResult.Game_Over ? (
              <div className="my-10 animate-pulse text-center">
                <h1 className="text-8xl font-black tracking-tighter text-red-600 leading-none mb-4 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                  PERTANDINGAN SELESAI
                </h1>
                <button
                  onClick={handleRematch}
                  className="mt-8 py-4 px-12 bg-blue-800 border border-blue-500 text-white text-xl font-bold rounded-sm hover:bg-blue-700 shadow-2xl transition active:scale-95"
                >
                  CARI LAWAN LAGI (KEMBALI KE LOBI)
                </button>
              </div>
            ) : (
              <button onClick={nextRound} className="py-5 px-16 border bg-gradient-to-r from-green-800 to-green-900 border-green-500 text-white text-2xl font-black tracking-tight rounded-sm hover:from-green-700 hover:to-green-800 shadow-[0_10px_30px_rgba(22,163,74,0.3)] transition-all active:scale-95">
                Lanjut Ke Ronde {currentRound + 1} (+{selectedHero?.id === 'volta' ? 12 + currentRound : 10 + currentRound} Koin)
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full xl:w-[400px] flex flex-col gap-4 md:gap-6 order-last xl:order-none mb-10 xl:mb-0 shrink-0">
        <div
          className={`bg-[#1a1c23] border border-gray-800 rounded-sm p-4 flex flex-col gap-4 shadow-2xl transition-all ${battlePhase !== 'idle' ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'shop', null)}
          onClick={() => handleTouchOrClick(null, 'shop', null)}
        >
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h3 className="font-black text-green-500 tracking-widest uppercase text-sm drop-shadow-md">Toko Elemen</h3>
            <button onClick={handleReroll} className="bg-black/50 hover:bg-black/80 text-gray-300 text-xs font-bold py-1 px-3 rounded-sm flex items-center gap-1 border border-gray-700 transition-all shadow-inner active:scale-95">
              {UI_ICONS.Energy} {selectedHero?.id === 'aqua' ? 0 : 1} Ganti
            </button>
          </div>
          <div className="flex flex-row xl:grid xl:grid-cols-2 gap-3 overflow-x-auto overflow-y-hidden pb-2 xl:pb-0">
            {shopCards.map((item, index) => (
              <div key={index} className="min-w-[100px] w-full h-[100px] xl:h-[120px]">
                {item ? (
                  <BlockCard
                    item={item}
                    isInteractive={battlePhase === 'idle'}
                    onDragStart={(e) => handleDragStart(e, item, 'shop', index)}
                    onClick={() => handleTouchOrClick(item, 'shop', index)}
                    onHover={setHoveredCard}
                    onLeave={setHoveredCard}
                    isCompact={true}
                  />
                ) : (
                  <div className="w-full h-full bg-black/40 border border-white/5 rounded-sm flex items-center justify-center text-gray-700 text-xs font-mono shadow-inner">
                    [ DIBELI ]
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1c23] border border-indigo-900 p-4 rounded-sm shadow-xl animate-pulse border-b-4 mt-2">
          <h3 className="text-sm font-black text-indigo-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
            <span>💡</span> Info Taktik Rahasia
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Meletakkan elemen tertentu di <strong>Jalur (Kolom) yang sama</strong> akan memicu kekuatan super tersembunyi!
            <br /><br />
            Bocoran intelijen: Coba gabungkan <span className="text-red-400 font-bold">API 🔥</span> dan <span className="text-emerald-400 font-bold">BUMI ⛰️</span>, atau <span className="text-blue-400 font-bold">AIR 💧</span> dan <span className="text-yellow-400 font-bold">PETIR ⚡</span> dalam satu jalur.
          </p>
        </div>

        {/* --- papan peringkat ---*/}
        <div className="bg-[#1a1c23] border border-gray-800 p-4 md:p-6 rounded-sm shadow-2xl flex flex-col h-[350px] xl:h-[500px]">
          <h3 className="text-xl md:text-2xl font-black text-yellow-500 mb-4 shrink-0 border-b border-gray-800 pb-2">
            🏆 Peringkat Global
          </h3>

          {Object.keys(globalLeaderboard).length === 0 ? (
            <p className="text-gray-600 text-sm italic mt-2">Belum ada pertandingan selesai.</p>
          ) : (
            <ul className="space-y-3 overflow-y-auto flex-grow pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5563 #1a1c23' }}>
              {Object.entries(globalLeaderboard).map(([name, stats], index) => (
                <li key={name} className="flex justify-between items-center p-3 bg-black/50 border border-gray-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] rounded-sm shrink-0 hover:bg-gray-800/50 transition-colors">
                  <span className="font-bold text-gray-300 flex items-center gap-2 truncate max-w-[120px] md:max-w-[150px]">
                    <span className="text-gray-600 text-sm">#{index + 1}</span> {name}
                  </span>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-black text-blue-500 drop-shadow-md leading-tight">{stats.wins} Menang</span>
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">⚔️ {stats.damage} DMG</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <style>{INJECTED_STYLES}</style>
    </div>
  );
}

export default App;