import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react"; // AnimatePresence untuk mendeteksi hilangnya elemen DOM
import { Coins, AlertCircle } from "lucide-react";
import {
  setWatchlist,
  updateWatchlistNotes,
  removeFromWatchlist,
} from "../store/watchlistSlice.js";
import WatchlistCard from "../components/WatchlistCard.jsx";
import api from "../utils/api.js";

export default function Watchlist() {
  const dispatch = useDispatch();
  const watchlistItems = useSelector((state) => state.watchlist.items); // Menghubungkan kabel data ke slice watchlist[cite: 28]

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        setLoading(true);
        // Membaca seluruh data watchlist milik user yang sedang aktif login dari backend kamu
        const response = await api.get("/api/watchlist");
        dispatch(setWatchlist(response.data.data));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Gagal menyinkronkan data radar watchlist.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistData();
  }, [dispatch]);

  const handleUpdateNotes = async (id, notes) => {
    try {
      await api.put(`/api/watchlist/${id}`, { notes });

      dispatch(updateWatchlistNotes({ id, notes }));
    } catch (err) {
      alert(
        err.response?.data?.message || "Gagal memperbarui catatan instruksi.",
      );
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      // Mengirimkan perintah penghapusan baris data watchlist tertentu berdasarkan ID entitas ke backend
      await api.delete(`/api/watchlist/${id}`);
      dispatch(removeFromWatchlist(id)); // Hapus dari antrean visual secara instan[cite: 28]
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Gagal membersihkan koin dari radar pantauan.",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6 font-mono"
    >
      {/* HEADER RADAR PANTALAN */}
      <div className="flex items-center gap-3 bg-cyber-dark/40 border border-gray-800 p-6 rounded-2xl">
        <div className="p-3 bg-cyber-pink/10 rounded-xl border border-cyber-pink/30 text-cyber-pink">
          <Coins className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            PERSONAL WATCHLIST RADAR
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Ruang kendali penuh manipulasi target harga dan klaster koin taktis
          </p>
        </div>
      </div>

      {/* KONDISI LOADING & ERROR */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 tracking-widest animate-pulse">
          FETCHING SYSTEM DATABASE RECORD...
        </div>
      ) : error ? (
        <div className="p-12 text-center text-cyber-rose">
          [CRITICAL ERROR]: {error}
        </div>
      ) : watchlistItems.length === 0 ? (
        /* KONDISI REAKTIF JIKA RADAR KOSONG */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 text-center border-2 border-dashed border-gray-800 rounded-2xl bg-cyber-dark/20 text-gray-500 space-y-2"
        >
          <AlertCircle className="w-8 h-8 text-gray-600 mx-auto" />
          <p className="font-bold">RADAR DETEKSI KOSONG</p>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Kamu belum mendaftarkan koin apapun. Kembali ke Dasbor utama dan
            klik ikon "+" pada baris koin untuk mengaktifkan pelacakan.
          </p>
        </motion.div>
      ) : (
        /* GRID LAYOUT DINAMIS KUMPULAN KARTU KOIN */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wrapper AnimatePresence mendeteksi siklus hidup unmounting elemen Motion */}
          <AnimatePresence>
            {watchlistItems.map((item) => (
              <WatchlistCard
                key={item.id}
                item={item}
                onUpdateNotes={handleUpdateNotes}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
