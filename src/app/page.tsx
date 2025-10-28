import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-row gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.svg"
          alt="Bobadex logo"
          width={300}
          height={300}
          priority
        />
        <div className="flex-col">
          <h1 className="text-3xl font-bold">Bobadex</h1>
          <p className="mt-2 text-muted-foreground">Track and share your favorite boba shops & drinks.</p>
          <a className="mt-10 ml-10 inline-block rounded-lg border px-4 py-2" href="/auth/login?next=/dashboard">
            Get started
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          footer
        </a>
      </footer>
    </div>
  );
}