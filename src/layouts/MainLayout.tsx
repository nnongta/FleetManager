import { useEffect, useState, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { authService, type User } from "../services/auth";

type Props = {
  userRole: "admin" | "approver";
  setUserRole: React.Dispatch<React.SetStateAction<"admin" | "approver">>;
};

function HashRedirectFix() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash.startsWith("#BK-")) {
      const id = location.hash.replace("#", "");
      navigate(`/bookings/${id}`, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

export default function MainLayout({ userRole, setUserRole }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // state currentUser
  const [currentUser, setCurrentUser] = useState<User | null>(
    authService.getCurrentUser()
  );

  const menuItems = [
    { name: "Dashboard", path: "/", roles: ["admin"] },
    { name: "Booking", path: "/bookings", roles: ["admin"] },
    { name: "Vehicle", path: "/vehicles", roles: ["admin"] },
    { name: "Driver", path: "/drivers", roles: ["admin"] },
    { name: "Approve Requests", path: "/approve", roles: ["approver"] },
  ];

  const filteredMenus = menuItems.filter((menu) =>
    menu.roles.includes(userRole)
  );

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f8]">
      <HashRedirectFix />
      {/* --- Header / Navbar --- */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm ring-1 ring-slate-900/5 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
            <span className="material-symbols-outlined text-[24px]">directions_car</span>
          </div>
          <span className="font-bold text-slate-900">FleetManager</span>
        </div>

        <div className="flex-1 flex justify-end mr-6">
          <nav className="hidden md:flex items-center gap-1">
            {filteredMenus.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive(menu.path)
                    ? "bg-blue-600/5 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                {menu.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="relative flex items-center gap-3 border-l border-slate-200 pl-6" ref={profileRef}>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 capitalize">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500">Active Session</p>
          </div>
          <button
            className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-slate-100 relative flex items-center justify-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`}
              alt="Profile"
              className="h-full w-full object-cover"
            />
            <ChevronDown className="absolute right-0 bottom-0 w-4 h-4 text-white/90" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-12 w-32 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden z-50 animate-fade-in">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Outlet key={location.pathname} />
        </div>
      </main>
    </div>
  );
}
