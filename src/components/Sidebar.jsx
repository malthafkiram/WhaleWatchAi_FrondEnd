import { NavLink } from "react-router"; // Menggunakan react-router murni sesuai pilihanmu
import { LayoutDashboard, Coins, Zap, Bitcoin } from "lucide-react"; // Aset ikon modern

export default function Sidebar() {
  // Alasan logis memisahkan array objek menu: Mempermudah penambahan menu baru di masa depan tanpa mengotori blok JSX (Clean Code)
  const menuItems = [
    { path: "/", name: "MARKET RADAR", icon: LayoutDashboard },
    { path: "/watchlist", name: "MY WATCHLIST", icon: Coins },
    { path: "/upgrade", name: "UPGRADE TRANSMISSION", icon: Zap },
  ];

  return (
    <aside className="w-64 h-screen bg-cyber-dark border-r border-gray-800/80 fixed left-0 top-0 flex flex-col justify-between p-5 z-30">
      <div className="space-y-8">
        {/* LOGO UTAMA PLATFORM (Menjawab Kekurangan 6 kamu) */}
        <div className="flex items-center gap-3 px-2 py-4 border-b border-gray-800/40">
          <div className="p-2 bg-cyber-neon/10 rounded-xl border border-cyber-neon/30 text-cyber-neon shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Bitcoin className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-sm font-black text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            WHALEWATCH AI
          </span>
        </div>

        {/* LIST MENU NAVIGASI INTERNAL */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                // Menggunakan fungsi callback bawaan NavLink untuk mendeteksi status rute aktif secara dinamis
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-bold tracking-wider transition-all border ${
                    isActive
                      ? "bg-cyber-neon/10 text-cyber-neon border-cyber-neon/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                      : "text-gray-400 border-transparent hover:bg-cyber-bg/50 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* FOOTER INFORMASI TERMINAL */}
      <div className="text-[10px] font-mono text-gray-600 border-t border-gray-800/40 pt-4 text-center tracking-widest">
        SECURE NODE: v1.0.0-PRO Created By : GoBar
      </div>
    </aside>
  );
}
