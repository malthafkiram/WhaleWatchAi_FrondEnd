import { NavLink } from "react-router"; // Menggunakan react-router murni sesuai pilihanmu
import { LayoutDashboard, Coins, Zap, Bitcoin, X } from "lucide-react"; // Aset ikon modern

export default function Sidebar({ isOpen, onClose }) {
  // Alasan logis memisahkan array objek menu: Mempermudah penambahan menu baru di masa depan tanpa mengotori blok JSX (Clean Code)
  const menuItems = [
    { path: "/", name: "MARKET RADAR", icon: LayoutDashboard },
    { path: "/watchlist", name: "MY WATCHLIST", icon: Coins },
    { path: "/upgrade", name: "UPGRADE TRANSMISSION", icon: Zap },
  ];

  return (
    <>
      {/* Backdrop Overlay untuk Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 h-screen bg-cyber-dark border-r border-gray-800/80 fixed left-0 top-0 flex flex-col justify-between p-5 z-40 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* LOGO UTAMA PLATFORM DAN CLOSE BUTTON MOBILE */}
          <div className="flex items-center justify-between px-2 py-4 border-b border-gray-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyber-neon/10 rounded-xl border border-cyber-neon/30 text-cyber-neon shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Bitcoin className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-sm font-black text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                WHALEWATCH AI
              </span>
            </div>
            {/* Tombol X Tutup Sidebar di Mobile */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/40 md:hidden transition-colors cursor-pointer"
              title="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* LIST MENU NAVIGASI INTERNAL */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose} // Otomatis tutup sidebar setelah memilih navigasi di mobile
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
    </>
  );
}
