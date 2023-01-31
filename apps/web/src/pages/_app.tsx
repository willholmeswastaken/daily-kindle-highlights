import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import Image from "next/image";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (

    <SessionProvider session={session}>
      <div className="flex min-h-screen flex-col items-center w-screen">
        {/* add a blurred bottom border in the header with tailwindcss */}
        <header className="flex flex-row items-center justify-between py-6 px-4 mx-auto max-w-4xl border-b border-gray-100 w-full">
          <div className="flex items-center gap-2">
            <Image src="/rekindled-logo.png" width={35} height={35} alt="Rekindled Logo" className="rounded-2xl" />
            <h1 className="text-3xl font-bold bg-red-500 bg-clip-text text-transparent">Rekindled</h1>
          </div>
        </header>
        <div className="container mx-auto py-6 px-4 max-w-4xl flex-1">
          <Component {...pageProps} />
        </div>
        <footer className="py-6 px-4 mx-auto max-w-4xl text-black border-t w-full">
          Copyright © 2021 Rekindled
        </footer>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
