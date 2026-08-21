
export default function Home() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-20 md:px-8">
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-primary">
          VidaBajoAgua
        </p>

        <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
          Naturaleza que cobra vida.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          Todo para crear, cuidar y disfrutar un mundo acuático lleno de vida.
          Plantas, equipamiento, decoración y mucho más.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90">
            Explorar tienda
          </button>

          <button className="rounded-xl border border-border px-6 py-3 font-medium transition hover:bg-muted">
            Conocer más
          </button>
        </div>
      </div>
    </section>
  );
}