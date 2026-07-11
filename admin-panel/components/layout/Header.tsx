"use client";

import { useAppSelector } from "@/store";
import { Bell, Search, Menu } from "lucide-react";
import { logout } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { AuthApis } from "@/lib/api/auth.api";

export default function Header() {
  const { email } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AuthApis.logout();
    } catch {
      // Proceed with local logout even if API call fails
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-surface/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-text-muted md:hidden hover:bg-surface-hover rounded-lg transition-colors">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-border md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-field" className="sr-only">Search</label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-text-muted ml-3" aria-hidden="true" />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-10 pr-0 text-foreground placeholder:text-text-muted focus:ring-0 sm:text-sm bg-transparent outline-none"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-full transition-colors relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 hover:bg-surface-hover rounded-lg px-2 py-1 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {email?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <span className="hidden lg:block text-sm font-semibold text-foreground">
              {email ?? "Admin"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
