"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";

interface TrackingCodeActionsProps {
  trackingToken: string;
}

export function TrackingCodeActions({
  trackingToken,
}: TrackingCodeActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingToken);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Código copiado
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copiar código
          </>
        )}
      </button>

      <Link
        href="/pedido/seguimiento"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        <ExternalLink className="h-4 w-4" />
        Ver seguimiento
      </Link>
    </div>
  );
}