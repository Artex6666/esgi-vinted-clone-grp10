import { NavLink, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-y-2">
          <NavLink to="/" className="text-xl sm:text-2xl font-bold hover:text-teal-100">
            Vinted Clone
          </NavLink>
          <nav className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "text-white font-semibold" : "hover:text-teal-200"
              }
            >
              Accueil
            </NavLink>
            <NavLink
              to="/my-articles"
              className={({ isActive }) =>
                isActive ? "text-white font-semibold" : "hover:text-teal-200"
              }
            >
              Mes annonces
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive ? "text-white font-semibold" : "hover:text-teal-200"
              }
            >
              Favoris
            </NavLink>
            <NavLink
              to="/publish"
              className={({ isActive }) =>
                isActive
                  ? "bg-white text-teal-700 font-semibold px-4 py-1.5 rounded-full"
                  : "bg-white text-teal-700 font-semibold px-4 py-1.5 rounded-full hover:bg-teal-50"
              }
            >
              Publier
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <Outlet />
       
      </main>
    </div>
  );
}
