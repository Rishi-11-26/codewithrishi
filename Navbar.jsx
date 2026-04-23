import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Problems" },
  { to: "/add", label: "Add Problem" },
  { to: "/import", label: "Import JSON" },
  { to: "/submissions", label: "Submissions" }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <h1 className="text-xl font-bold text-slate-100">
          <span className="text-cyan-400">Code</span>WithRishi
        </h1>
        <nav className="flex gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-slate-800 text-cyan-300 ring-1 ring-cyan-600/50"
                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
