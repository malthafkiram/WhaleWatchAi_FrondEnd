import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Plus, TrendingUp, TrendingDown } from "lucide-react"; // Ikon penanda arah tren pasar

export default function CryptoRow({
  coin,
  index,
  onAddToWatchlist,
  onRowClick,
}) {
  const navigate = useNavigate();
  const isPositive = coin.price_change_percentage_24h >= 0;

  // Alasan logis menggunakan toLocaleString: Memformat angka desimal finansial agar rapi sesuai standar global
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onRowClick}
      className="border-b border-gray-800/60 hover:bg-cyber-dark/60 transition-colors cursor-pointer group"
    >
      {/* Klik pada area baris selain tombol "+" akan memicu navigasi detail koin */}
      <td
        className="py-4 px-4 font-mono text-gray-500 text-sm"
        onClick={() => navigate(`/coin/${coin.id}`)}
      >
        {index + 1}
      </td>

      <td
        className="py-4 px-4 flex items-center gap-3"
        onClick={() => navigate(`/coin/${coin.id}`)}
      >
        <img
          src={coin.image}
          alt={coin.name}
          className="w-6 h-6 rounded-full group-hover:scale-110 transition-transform"
        />
        <div>
          <span className="font-bold text-white block group-hover:text-cyber-cyan transition-colors">
            {coin.name}
          </span>
          <span className="text-xs text-gray-400 font-mono tracking-wider">
            {coin.symbol}
          </span>
        </div>
      </td>

      <td
        className="py-4 px-4 font-mono font-bold text-white"
        onClick={() => navigate(`/coin/${coin.id}`)}
      >
        {formatPrice(coin.current_price)}
      </td>

      <td
        className="py-4 px-4 font-mono font-bold"
        onClick={() => navigate(`/coin/${coin.id}`)}
      >
        <span
          className={`flex items-center gap-1 text-sm ${isPositive ? "text-cyber-emerald" : "text-cyber-rose"}`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {coin.price_change_percentage_24h?.toFixed(2)}%
        </span>
      </td>

      <td className="py-4 px-4 font-mono">
        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-cyber-dark text-cyber-cyan border border-cyber-cyan/30">
          {coin.category || "Layer 1"}
        </span>
      </td>

      <td className="py-4 px-4 text-center">
        <motion.button
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation(); // Mencegah bubbling event klik agar tidak masuk ke trigger rute detail koin
            onAddToWatchlist(coin.id);
          }}
          className="p-2 bg-cyber-cyan/10 hover:bg-cyber-cyan text-cyber-cyan hover:text-cyber-bg border border-cyber-cyan/30 rounded-xl transition-all"
          title="Tambahkan ke Watchlist"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </td>
    </motion.tr>
  );
}
