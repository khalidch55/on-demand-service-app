import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase,
  CalendarCheck,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Bookings", href: "/bookings", icon: CalendarCheck },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-surface text-foreground hidden md:flex flex-col border-r border-border transition-transform duration-300 ease-in-out shadow-sm">
      <div className="flex h-16 shrink-0 items-center gap-2 px-6 border-b border-border bg-surface/50 backdrop-blur-md">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="font-bold text-primary-foreground text-xl leading-none tracking-tighter">S</span>
        </div>
        <span className="font-semibold text-lg tracking-tight">ServiceAdmin</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200 group"
            >
              <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
          <h4 className="font-medium text-sm text-primary mb-1">Admin Panel</h4>
          <p className="text-xs text-text-muted mb-3">On-Demand Service App</p>
          <button className="w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors">
            View App
          </button>
        </div>
      </div>
    </aside>
  );
}
