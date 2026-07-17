import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { LayoutDashboard, AlertCircle } from "lucide-react";
import {
  fetchCoinsStart,
  fetchCoinsSuccess,
  fetchCoinsFailure,
} from "../store/cryptoSlice.js";
import { addToWatchlist } from "../store/watchlistSlice.js";
import CryptoRow from "../components/CryptoRow.jsx";
import api from "../utils/api.js";

import AnimatedGauge from "../components/AnimatedGauge.jsx";
import LiveTerminalFeed from "../components/LiveTerminalFeed.jsx"; // Bertindak sebagai Asset/Volume Monitor

export default function DashboardHome() {
  const dispatch = useDispatch();
  const { coins, loading, error } = useSelector((state) => state.crypto);
  const [noti, setNoti] = useState(null);

  // STATE ENGINE GAME: Dioptimasi Menggunakan Fungsi Hydration Inisialisasi Lokal
  const [virtualCash, setVirtualCash] = useState(() => {
    // Membaca cache lokal instan saat komponen remount untuk melenyapkan kedipan visual
    const savedCash = localStorage.getItem("ww_virtual_cash");
    return savedCash ? parseFloat(savedCash) : 5000;
  });

  const [userLevel, setUserLevel] = useState(() => {
    const savedLevel = localStorage.getItem("ww_user_level");
    return savedLevel ? parseInt(savedLevel) : 1;
  });

  const [userXp, setUserXp] = useState(() => {
    const savedXp = localStorage.getItem("ww_user_xp");
    return savedXp ? parseInt(savedXp) : 0;
  });

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [gameStatus, setGameStatus] = useState("IDLE"); // Siklus antarmuka: 'IDLE' atau 'WAITING'
  const [gaugeScore, setGaugeScore] = useState(50); // Nilai default awal di tengah (Neutral)

  // Ambil data mutakhir dari database PostgreSQL & Selaraskan UI Cache
  useEffect(() => {
    const syncUserWallet = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        const userData = response.data?.user;
        if (userData) {
          const freshCash = parseFloat(userData.virtualCash || 5000);
          const freshLevel = parseInt(userData.level || 1);
          const freshXp = parseInt(userData.xp || 0);
          const freshIsPremium = userData.isPremium;

          // Perbarui state reaktif React
          setVirtualCash(freshCash);
          setUserLevel(freshLevel);
          setUserXp(freshXp);

          // Kunci salinannya ke localStorage sebagai cache transisi masa depan
          localStorage.setItem("ww_virtual_cash", freshCash);
          localStorage.setItem("ww_user_level", freshLevel);
          localStorage.setItem("ww_user_xp", freshXp);
          localStorage.setItem("ww_is_premium", freshIsPremium);
        }
      } catch (err) {
        console.error("Gagal memuat profil finansial virtual game:", err);
      }
    };
    syncUserWallet();
  }, []);

  // Polling pasar berkala + Otomatis Memicu Settlement Game di Backend
  useEffect(() => {
    const getMarketData = async (isSilent = false) => {
      try {
        if (!isSilent) {
          dispatch(fetchCoinsStart());
        }
        const response = await api.get("/api/coins/markets");
        const freshCoins = response.data.data;
        dispatch(fetchCoinsSuccess(freshCoins));

        // Dieksekusi otomatis setelah menunggu 1 menit

        if (isSilent && gameStatus === "WAITING") {
          try {
            const gameResponse = await api.post("/api/game/settle");
            const {
              result,
              user: updatedUser,
              leveledUp,
            } = gameResponse.data.data;

            const nextCash = parseFloat(updatedUser.virtualCash);
            const nextLevel = parseInt(updatedUser.level);
            const nextXp = parseInt(updatedUser.xp);

            // Perbarui State Aplikasi
            setVirtualCash(nextCash);
            setUserLevel(nextLevel);
            setUserXp(nextXp);

            // Perbarui Cache Finansial Lokal Browser
            localStorage.setItem("ww_virtual_cash", nextCash);
            localStorage.setItem("ww_user_level", nextLevel);
            localStorage.setItem("ww_user_xp", nextXp);

            if (result === "WIN") {
              setGaugeScore(85); // Putar jarum visual ke area hijau (Win Zone)
              setNoti({
                type: "success",
                msg: `🎯 BLOCK SETTLED! Prediksi Anda akurat. Profit +$500 berhasil diamankan! ${leveledUp ? "🎉 LEVEL UP ACCELERATED!" : ""}`,
              });
            } else {
              setGaugeScore(20); // Putar jarum visual ke area merah (Lose Zone)
              setNoti({
                type: "error",
                msg: `💥 BLOCK SETTLED! Prediksi Anda meleset akibat manipulasi pasar. Saldo dipotong -$300.`,
              });
            }
          } catch (gameErr) {
            console.error(
              "Proses settlement dilewati:",
              gameErr.response?.data?.message,
            );
          } finally {
            setGameStatus("IDLE"); // Kembalikan status ke IDLE
          }
        }
      } catch (err) {
        if (!isSilent) {
          dispatch(
            fetchCoinsFailure(
              err.response?.data?.message || "Gagal memuat sirkulasi pasar.",
            ),
          );
        }
      }
    };

    getMarketData(false);

    const marketInterval = setInterval(() => {
      getMarketData(true); // Memicu silent refresh + game evaluation setiap 60 detik
    }, 60000);

    return () => {
      clearInterval(marketInterval); // Mencegah kebocoran memori RAM browser
    };
  }, [dispatch, gameStatus]); // Dependensi gameStatus wajib dimasukkan agar scope closure setInterval terupdate

  // HANDLER A KLIEN: Mengunci Prediksi Awal & Entry Price ke Database
  const handlePlaceBet = async (type) => {
    if (!selectedCoin) {
      alert("Silakan tentukan koin target operasi Anda terlebih dahulu!");
      return;
    }

    try {
      setGameStatus("WAITING"); // Kunci tombol taruhan agar user tidak klik ganda
      setGaugeScore(50); // Setel jarum speedometer ke posisi tengah sementara
      setNoti(null);

      // Tembak endpoint POST game untuk mencatat entryPrice detik ini di database
      await api.post("/api/game/predict", {
        coinId: selectedCoin.id,
        prediction: type,
      });

      setNoti({
        type: "success",
        msg: `📡 POSISI DIBUKA! Mengunci prediksi ${type} pada ${selectedCoin.name}. Menunggu penutupan blok harga 1 menit ke depan...`,
      });
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message;
      alert(`[BACKEND CRITICAL ERROR]: ${serverMsg}`);
      setGameStatus("IDLE"); // Buka kembali kunci jika terjadi error di gerbang awal
    }
  };

  // Otomatis menetapkan koin index pertama sebagai target default jika user belum memilih
  useEffect(() => {
    if (coins.length > 0 && !selectedCoin) {
      setSelectedCoin(coins[0]);
    }
  }, [coins, selectedCoin]);

  const handleCreateWatchlist = async (coinId) => {
    try {
      setNoti(null);
      const response = await api.post("/api/watchlist", { coinId });
      dispatch(addToWatchlist(response.data.data));
      setNoti({
        type: "success",
        msg: `Koin ${coinId.toUpperCase()} masuk ke radar pantauan!`,
      });
    } catch (err) {
      setNoti({
        type: "error",
        msg: err.response?.data?.message || "Koin gagal didaftarkan.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6 font-mono"
    >
      {/* 1. TICKER MARQUEE RUNNING TEXT */}
      <div className="w-full bg-cyber-dark border border-cyber-cyan/20 rounded-xl py-3 overflow-hidden relative flex items-center">
        <div className="absolute left-0 bg-cyber-dark px-4 font-bold text-cyber-cyan border-r border-gray-800 z-10 text-xs">
          LIVE TICKER
        </div>
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-sm tracking-wider pl-27.5">
          {coins.slice(0, 5).map((c) => (
            <span key={c.id} className="inline-flex items-center gap-2">
              <span className="text-white font-bold"> {c.symbol} </span>
              <span className="text-gray-400">
                ${c.current_price?.toLocaleString()}
              </span>
              <span
                className={
                  c.price_change_percentage_24h >= 0
                    ? "text-cyber-emerald"
                    : "text-cyber-rose"
                }
              >
                {c.price_change_percentage_24h >= 0 ? "+" : ""}
                {c.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. AREA WIDGET INTERAKTIF DENGAN KENDALI PROPS PERSISTEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedGauge
          score={gaugeScore}
          gameStatus={gameStatus}
          onPlaceBet={handlePlaceBet}
          virtualCash={virtualCash}
          level={userLevel}
          xp={userXp}
        />

        <LiveTerminalFeed
          coins={coins}
          selectedCoin={selectedCoin}
          onSelectCoin={setSelectedCoin}
          gameStatus={gameStatus}
        />
      </div>

      {/* 3. HEADER UTAMA DASBOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cyber-dark/40 border border-gray-800 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyber-cyan/10 rounded-xl border border-cyber-cyan/30 text-cyber-cyan">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              MARKET INTELLIGENCE
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Memantau pergerakan koin raksasa bursa kripto global
            </p>
          </div>
        </div>
      </div>

      {/* NOTIFIKASI HASIL TRADING VIRTUAL/GAME */}
      {noti && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 border rounded-xl flex items-center gap-2 text-sm ${
            noti.type === "success"
              ? "bg-cyber-emerald/10 border-cyber-emerald text-cyber-emerald"
              : "bg-cyber-rose/10 border-cyber-rose text-cyber-rose"
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{noti.msg}</span>
        </motion.div>
      )}

      {/* 5. TABEL PASAR UTAMA */}
      <div className="bg-cyber-dark border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-gray-500 tracking-widest animate-pulse">
            LOADING REAL-TIME BLOCKCHAIN DATA...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-cyber-rose">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cyber-dark/80 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-4 px-4 font-normal">#</th>
                  <th className="py-4 px-4 font-normal">Nama Aset</th>
                  <th className="py-4 px-4 font-normal">Harga Live (USD)</th>
                  <th className="py-4 px-4 font-normal">Perubahan 24J</th>
                  <th className="py-4 px-4 font-normal">Kategori Klaster</th>
                  <th className="py-4 px-4 font-normal text-center">Pantau</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin, index) => (
                  <CryptoRow
                    key={coin.id}
                    coin={coin}
                    index={index}
                    onAddToWatchlist={handleCreateWatchlist}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
