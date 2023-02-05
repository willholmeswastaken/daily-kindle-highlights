import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import dayjs from "dayjs";
import calendar from 'dayjs/plugin/calendar';
import { ToastContainer } from "react-toastify";

import { api } from "../utils/api";
import Header from "../components/Header";

import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';


dayjs.extend(calendar)

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ToastContainer />
      <div className="flex min-h-screen flex-col items-center w-screen">
        {/* add a blurred bottom border in the header with tailwindcss */}
        <Header />
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
