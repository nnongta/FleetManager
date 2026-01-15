import { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

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

  const menuItems = [
    { name: "Dashboard", path: "/", roles: ["admin"] },
    { name: "Booking", path: "/bookings", roles: ["admin"] },
    { name: "Vehicle", path: "/vehicles", roles: ["admin"] },
    { name: "Driver", path: "/drivers", roles: ["admin"] },
    { name: "Approve Requests", path: "/approve", roles: ["approver"] },
  ];

  const filteredMenus = menuItems.filter(menu =>
    menu.roles.includes(userRole)
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f8]">
      <HashRedirectFix />

      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm ring-1 ring-slate-900/5 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
            <span className="material-symbols-outlined text-[24px]">
              directions_car
            </span>
          </div>
          <span className="font-bold text-slate-900">FleetManager</span>

          <button
            onClick={() => {
              const nextRole = userRole === "admin" ? "approver" : "admin";
              setUserRole(nextRole);
              navigate(nextRole === "approver" ? "/approve" : "/", {
                replace: true,
              });
            }}
            className="ml-4 px-2 py-1 text-[10px] bg-slate-100 border rounded hover:bg-slate-200"
          >
            Switch to {userRole === "admin" ? "Approver" : "Admin"}
          </button>
        </div>

        <div className="flex-1 flex justify-end mr-6">
          <nav className="hidden md:flex items-center gap-1">
            {filteredMenus.map(menu => (
              <Link
                key={menu.path}
                to={menu.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(menu.path)
                    ? "bg-blue-600/5 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {menu.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 capitalize">
              {userRole}
            </p>
            <p className="text-[10px] text-slate-500">Active Session</p>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-slate-100">
            <img
              src={`https://i.pravatar.cc/150?u=${userRole}`}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
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
