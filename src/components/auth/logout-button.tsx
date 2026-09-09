"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({
  className = "",
}: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/cuenta");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="h-6 w-6" />
      Cerrar sesión
    </button>
  );
}