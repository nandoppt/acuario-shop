import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero-aquascape.webp"
          alt="Aquascape plantado de VidaBajoAgua"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/65 to-transparent" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background/55 via-transparent to-transparent" />

      <div className="mx-auto flex min-h-[680px] max-w-7xl items-center px-4 py-24 md:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-4 py-2 text-sm font-medium text-primary backdrop-blur-md">
            <Leaf size={16} />
            <span>El mundo acuático comienza aquí</span>
          </div>

          <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Naturaleza que{" "}
            <span className="text-primary">cobra vida.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
            Todo para crear, cuidar y disfrutar tu mundo acuático.
            Descubre plantas, equipamiento y accesorios seleccionados
            para llevar tu acuario a otro nivel.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tienda"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground shadow-lg shadow-primary/10 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explorar tienda
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/tienda?categoria=plantas"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background/70 px-6 py-3.5 font-medium backdrop-blur-md transition hover:bg-background"
            >
              Descubrir plantas
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span>🌿 Plantas</span>
            <span>💧 Equipamiento</span>
            <span>🇪🇨 Envíos en Ecuador</span>
          </div>
        </div>
      </div>
    </section>
  );
}