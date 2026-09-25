"use client";

import Link from "next/link";
import { ArrowLeft, Calculator, Ruler } from "lucide-react";
import { useMemo, useState } from "react";

export default function LitrajeCalculatorPage() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [fill, setFill] = useState("100");

  const result = useMemo(() => {
    const l = Number(length);
    const w = Number(width);
    const h = Number(height);
    const percentage = Number(fill);

    if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0) return null;

    const gross = (l * w * h) / 1000;
    const useful = gross * Math.min(Math.max(percentage, 0), 100) / 100;
    return { gross, useful };
  }, [length, width, height, fill]);

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
        <Link
          href="/guias"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          <ArrowLeft className="size-4" />
          Volver a guías
        </Link>

        <div className="mt-10 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Herramienta
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Calculadora de litraje
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Introduce las medidas internas aproximadas del acuario para obtener
            el volumen bruto y una estimación según el porcentaje de llenado.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <Ruler className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold">Medidas</h2>
                <p className="text-xs text-muted-foreground">Centímetros</p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-medium">
                Largo
                <input className={inputClass} inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} placeholder="60" />
              </label>
              <label className="text-sm font-medium">
                Ancho
                <input className={inputClass} inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="30" />
              </label>
              <label className="text-sm font-medium">
                Alto
                <input className={inputClass} inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="36" />
              </label>
            </div>

            <label className="mt-5 block text-sm font-medium">
              Porcentaje de llenado
              <div className="mt-2 flex items-center gap-4">
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={fill}
                  onChange={(e) => setFill(e.target.value)}
                  className="w-full accent-primary"
                />
                <span className="w-12 text-right text-sm tabular-nums">{fill}%</span>
              </div>
            </label>
          </section>

          <section className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-6">
            <Calculator className="size-5 text-primary" />
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Resultado
            </p>
            {result ? (
              <div className="mt-4 space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">Volumen bruto</p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight">
                    {result.gross.toFixed(1)} <span className="text-lg">L</span>
                  </p>
                </div>
                <div className="border-t border-border pt-5">
                  <p className="text-sm text-muted-foreground">Volumen según llenado</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.useful.toFixed(1)} L
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Introduce largo, ancho y alto para calcular el volumen.
              </p>
            )}
            <p className="mt-7 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
              Resultado orientativo. El volumen real será menor si el acuario
              contiene sustrato, rocas, raíces, equipos u otros elementos.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
