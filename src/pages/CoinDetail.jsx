import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Cpu, Globe, ShieldAlert, ArrowLeft, Lock, Share2, Copy, Check, Sparkles, X } from "lucide-react";
import SentimentBar from "../components/SentimentBar.jsx";
import api from "../utils/api.js";
import { formatCryptoPrice } from "../utils/formatters.js";


export default function CoinDetail() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [coinData, setCoinData] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLocked =
    (!user || String(user.isPremium) === "false") &&
    coinId !== "bitcoin" &&
    coinId !== "ethereum";

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const [detailRes, chartRes] = await Promise.all([
          api.get(`/api/coins/detail/${coinId}`),
          api.get(`/api/coins/chart/${coinId}?days=7`).catch(() => ({ data: { data: [] } })),
        ]);

        setCoinData(detailRes.data.data);
        if (chartRes.data?.data && chartRes.data.data.length > 0) {
          setChartData(chartRes.data.data);
        } else {
          const sampleChart = Array.from({ length: 7 }, (_, i) => ({
            day: `Day ${i + 1}`,
            Price:
              detailRes.data.data.market_stats.current_price *
              (1 + (Math.random() * 0.04 - 0.02)),
          }));
          setChartData(sampleChart);
        }

        if (!isLocked) {
          const aiRes = await api.get(`/api/ai/analyze/${coinId}`);
          setAiData(aiRes.data.data);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Gagal memuat detail data koin.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [coinId, isLocked]);

  const handleCopyCardText = () => {
    const shareText = `🚀 WhaleWatch AI Signal Report 🚀\n\nCoin: ${coinData?.name} (${coinData?.symbol})\nCurrent Price: $${coinData?.market_stats?.current_price}\nAI Recommendation: ${aiData?.ai_analysis?.recommendation || "HOLD"}\nSentiment: ${aiData?.ai_analysis?.sentiment || "Neutral"}\n\nAnalysis: "${aiData?.ai_analysis?.analysis || "N/A"}"\n\nAnalyze more at WhaleWatch.AI!`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };


  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-mono tracking-widest animate-pulse">
        DECRYPTING BLOCKCHAIN TELEMETRY IN PROGRESS...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-cyber-rose font-mono space-y-4">
        <p>[ERROR]: {error}</p>
        <button
          onClick={() => navigate("/")}
          className="text-cyber-cyan underline"
        >
          Kembali ke Dasbor
        </button>
      </div>
    );
  }

  const getActionColor = (action) => {
    if (action === "BUY")
      return "text-cyber-emerald border-cyber-emerald bg-cyber-emerald/10";
    if (action === "SELL")
      return "text-cyber-rose border-cyber-rose bg-cyber-rose/10";
    return "text-cyber-amber border-cyber-amber bg-cyber-amber/10";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto space-y-6 font-mono"
    >
      {/* Tombol Back */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> KEMBALI KE RADAR PASAR
      </button>

      {/* SEGMENT 1: DETAIL RINGKAS ASET */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-cyber-dark border border-gray-800 p-6 rounded-2xl gap-4">
        <div className="flex items-center gap-4">
          <img
            src={coinData?.image}
            alt={coinData?.name}
            className="w-12 h-12 rounded-full border-2 border-cyber-cyan/30"
          />
          <div>
            <h1 className="text-2xl font-black text-white">
              {coinData?.name}{" "}
              <span className="text-cyber-cyan text-sm">
                [{coinData?.symbol}]
              </span>
            </h1>
            <a
              href={coinData?.official_website}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mt-1"
            >
              <Globe className="w-3 h-3" /> Situs Resmi Proyek
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isLocked && aiData && (
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" /> BAGIKAN KARTU AI
            </button>
          )}
          <div className="text-left lg:text-right">
            <span className="text-xs text-gray-400 block">
              HARGA INDEKS SAAT INI
            </span>
            <span className="text-2xl font-black text-white">
              {formatCryptoPrice(coinData?.market_stats?.current_price)}
            </span>
          </div>
        </div>
      </div>



        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-cyber-dark border border-cyber-cyan/40 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-white font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyber-neon" /> EKSPOR KARTU SINYAL AI
                </span>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Infographic Preview */}
              <div className="bg-gradient-to-br from-cyber-dark to-cyber-bg border border-cyber-cyan/30 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl font-mono">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <img src={coinData?.image} className="w-8 h-8 rounded-full" alt="coin" />
                    <div>
                      <h4 className="font-black text-white text-sm">{coinData?.name}</h4>
                      <span className="text-[10px] text-cyber-cyan">[{coinData?.symbol}]</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan font-black text-xs rounded-lg">
                    {aiData?.ai_analysis?.recommendation || "HOLD"}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Harga Indeks Live:</span>
                    <span className="text-white font-bold">{formatCryptoPrice(coinData?.market_stats?.current_price)}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Sentimen Pasar:</span>
                    <span className="text-cyber-neon font-bold">{aiData?.ai_analysis?.sentiment || "Netral"}</span>
                  </div>
                </div>

                <div className="p-3 bg-cyber-dark rounded-xl border border-gray-800 text-gray-300 text-xs italic leading-relaxed">
                  "{aiData?.ai_analysis?.analysis || "Analisis neural sedang aktif..."}"
                </div>

                <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500">
                  <span>WHALEWATCH AI NEURAL CORE</span>
                  <span>TERVERIFIKASI</span>
                </div>
              </div>

              <button
                onClick={handleCopyCardText}
                className="w-full py-3 bg-cyber-cyan text-cyber-dark font-black rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-cyan-300 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                {copied ? "BERHASIL DISALIN KE CLIPBOARD!" : "SALIN TEKS SINYAL AI UNTUK SOSMED"}
              </button>
            </motion.div>
          </div>
        )}

      {/* SEGMENT 2: TWO-COLUMN LAYOUT GRAFIK VS AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Visualisasi Grafik Recharts */}
        <div className="lg:col-span-2 bg-cyber-dark border border-gray-800 p-4 sm:p-6 rounded-2xl space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-gray-400 tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyber-cyan" /> GRAFIK HARGA HISTORIS (7 HARI)
          </h3>
          <div className="w-full h-[260px] sm:h-[320px] bg-cyber-bg/50 rounded-xl p-2 border border-gray-900">
            <ResponsiveContainer width="100%" h="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                <YAxis
                  stroke="#64748B"
                  fontSize={10}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0F19",
                    borderColor: "#1E293B",
                    color: "#FFF",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Price"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kolom Kanan: Kotak Analisis AI */}
        <div className="bg-cyber-dark border border-gray-800 p-4 sm:p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-gray-400 tracking-wider flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-cyber-neon" /> RADAR SENTIMEN AI
          </h3>


          {/* JIKA AKSES AI TERKUNCI (BACKDROP BLUR TIRAI) */}
          {isLocked ? (
            <div className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
              <div className="p-4 bg-cyber-neon/10 rounded-2xl border border-cyber-neon text-cyber-neon">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-white font-black text-lg">
                ANALISIS AI TERKUNCI
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                Fitur evaluasi psikologis pasar bertenaga AI untuk koin selain
                Bitcoin & Ethereum khusus bagi anggota kelas Whale Pro.
              </p>
              <button
                onClick={() => navigate("/upgrade")}
                className="px-6 py-2.5 bg-cyber-neon text-white font-bold text-xs rounded-xl tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                UPGRADE TO WHALE PRO
              </button>
            </div>
          ) : null}

          {/* KONTEN KOTAK DATA AI JIKA TERBUKA ACCESNYA */}
          {aiData ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="text-center p-4 border-2 rounded-2xl border-dashed tracking-widest">
                <span className="text-xs text-gray-400 block mb-1">
                  RECOMMENDED ACTION
                </span>
                <span
                  className={`text-3xl font-black px-4 py-1 rounded-md ${getActionColor(aiData.ai_analysis.recommendation)}`}
                >
                  {aiData.ai_analysis.recommendation || "HOLD"}
                </span>
              </div>

              <SentimentBar
                score={
                  aiData.ai_analysis.sentimentScore ||
                  (aiData.ai_analysis.sentiment === "Bullish"
                    ? 80
                    : aiData.ai_analysis.sentiment === "Bearish"
                      ? 20
                      : 50)
                }
                status={aiData.ai_analysis.sentiment?.toUpperCase()}
              />

              <div className="bg-cyber-bg border border-gray-800 p-4 rounded-xl text-xs text-gray-300 leading-relaxed flex flex-col gap-1.5">
                <span className="text-cyber-neon font-bold block">
                  AI CLINICAL ARGUMENT:
                </span>

                <div className="max-h-62.5 overflow-y-auto pr-1 custom-scrollbar font-mono text-gray-400">
                  "
                  {aiData?.ai_analysis?.analysis ||
                    aiData?.ai_analysis?.premium_deep_dive ||
                    "Memindai klaster data blockchain..."}
                  "
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-xs text-center py-12">
              Menunggu pasokan sinyal AI...
            </div>
          )}
        </div>
      </div>

      {/* SEGMENT 3: AKTIVITAS DEVELOPER & LIVE NEWS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sub-kotak: GitHub Tracker */}
        <div className="bg-cyber-dark border border-gray-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider flex items-center gap-2">
            <img
              src="https://github.githubassets.com/favicons/favicon-dark.png"
              alt="git"
              className="w-4 h-4 invert"
            />{" "}
            DEV CODE MONITOR
          </h3>
          {typeof coinData?.developer_activity === "object" ? (
            <div className="space-y-3 text-xs bg-cyber-bg p-4 rounded-xl border border-gray-900">
              <div className="flex justify-between border-b border-gray-800/60 pb-2">
                <span className="text-gray-400">Past Month Commits:</span>
                <span className="text-cyber-cyan font-bold font-mono">
                  {coinData.developer_activity.total_commits_past_month}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block">
                  Latest Commit Message:
                </span>
                <p className="text-white italic bg-cyber-dark p-3 rounded-xl border border-gray-800/60 max-h-24 overflow-y-auto break-words whitespace-pre-wrap font-mono text-xs custom-scrollbar">
                  "{coinData.developer_activity.latest_commit_message}"
                </p>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-xs p-4 text-center border border-dashed border-gray-800 rounded-xl">
              {coinData?.developer_activity ||
                "Aktivitas pengodean repositori tidak tersedia."}
            </div>
          )}
        </div>

        {/* Sub-kotak: Berita Live Feed Aggregator (Lebar 2 Kolom) */}
        <div className="lg:col-span-2 bg-cyber-dark border border-gray-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyber-pink" /> LIVE AGGREGATED NEWS
            CORRIDOR
          </h3>
          <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2">
            {aiData?.news && aiData.news.length > 0 ? (
              aiData.news.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-cyber-bg p-3 rounded-xl border border-gray-900 hover:border-cyber-pink/40 transition-colors text-xs text-white hover:text-cyber-pink font-mono truncate"
                >
                  [{idx + 1}] {item.title}
                </a>
              ))
            ) : (
              <div className="text-gray-500 text-xs text-center py-6 border border-dashed border-gray-800 rounded-xl">
                Aliran feed berita global koin ini kosong atau terproteksi tirai
                premium.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
