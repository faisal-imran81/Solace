export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Solace</h1>
      <p className="text-muted-foreground">AI-powered mental wellness for everyone</p>
      <a
        href="/sign-in"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Sign in
      </a>
    </main>
  );
}
