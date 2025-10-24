import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.svg"
          alt="Bobadex logo"
          width={180}
          height={38}
          priority
        />
        <Link className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/auth/sign-in">
          Sign In
        </Link>
        <Link className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/auth/sign-up">
          Sign Up
        </Link>
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