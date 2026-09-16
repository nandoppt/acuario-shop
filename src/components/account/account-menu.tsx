"use client";

import Link from "next/link";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Package,
  SearchCheck,
  User,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AccountUser = {
  email: string;
  firstName: string;
};

export function AccountMenu() {
  const [user, setUser] =
    useState<AccountUser | null>(null);

  const [open, setOpen] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
        return;
      }

      const firstName =
        user.user_metadata?.first_name ??
        "";

      setUser({
        email: user.email ?? "",
        firstName:
          firstName.trim() || "Cliente",
      });
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setUser(null);
          return;
        }

        const firstName =
          session.user.user_metadata
            ?.first_name ?? "";

        setUser({
          email:
            session.user.email ?? "",
          firstName:
            firstName.trim() || "Cliente",
        });
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [open]);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    setOpen(false);

    router.refresh();
    router.push("/");
  }

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        aria-expanded={open}
        aria-haspopup="menu"
        className="hidden items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-muted md:flex"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={17} />
        </div>

        <div className="max-w-36">
          {user ? (
            <>
              <p className="text-[11px] leading-4 text-muted-foreground">
                Hola
              </p>

              <p className="truncate text-sm font-medium leading-4">
                {user.firstName}
              </p>
            </>
          ) : (
            <p className="text-sm font-medium">
              Mi cuenta
            </p>
          )}
        </div>

        <ChevronDown
          size={16}
          className={[
            "text-muted-foreground transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
        >
          {user ? (
            <>
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-semibold">
                  Hola, {user.firstName}
                </p>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>

              <div className="p-2">
                <Link
                  href="/cuenta"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-muted"
                >
                  <User
                    size={18}
                    className="text-primary"
                  />

                  <span>Mi cuenta</span>
                </Link>

                <Link
                  href="/cuenta/pedidos"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-muted"
                >
                  <Package
                    size={18}
                    className="text-primary"
                  />

                  <span>Mis pedidos</span>
                </Link>

                <Link
                  href="/pedido/seguimiento"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-muted"
                >
                  <SearchCheck
                    size={18}
                    className="text-primary"
                  />

                  <span>
                    Seguimiento de pedidos
                  </span>
                </Link>
              </div>

              <div className="border-t border-border p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                >
                  <LogOut size={18} />

                  <span>
                    Cerrar sesión
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-semibold">
                  Mi cuenta
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Inicia sesión o consulta
                  tus pedidos y compras.
                </p>
              </div>

              <div className="space-y-2 p-3">
                <Link
                    href="/pedido/seguimiento"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:bg-muted"
                    >
                    <SearchCheck size={17} />

                    Consultar pedido
                    </Link>
                <Link
                  href="/cuenta/login"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <LogIn size={17} />

                  Iniciar sesión
                </Link>

                <Link
                  href="/cuenta/registro"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:bg-muted"
                >
                  <UserPlus size={17} />

                  Crear cuenta
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* Cuenta móvil */}

      <Link
        href="/cuenta"
        aria-label="Mi cuenta"
        className="rounded-full p-2 transition-colors hover:bg-muted md:hidden"
      >
        <User size={20} />
      </Link>
    </div>
  );
}