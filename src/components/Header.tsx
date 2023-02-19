import { ArrowPathIcon, BookOpenIcon, HeartIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type MenuItem = {
    name: string;
    url: string;
    icon?: JSX.Element;
};
const menuItems: MenuItem[] = [
    { name: "Favourites", url: "/favourites", icon: <HeartIcon className="h-6 w-6 flex-shrink-0 text-red-500" /> },
    { name: "Books", url: "/books", icon: <BookOpenIcon className="h-6 w-6 flex-shrink-0 text-red-500" /> },
    { name: "Sync", url: "/sync", icon: <ArrowPathIcon className="h-6 w-6 flex-shrink-0 text-red-500" /> },
];

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: sessionData } = useSession();
    const isLoggedIn = useMemo<boolean>(() => sessionData?.user !== undefined, [sessionData]);

    const onSignOut = () => {
        signOut({ callbackUrl: window.location.origin }).catch((err) => { console.error(err) });
    };
    const onSignIn = () => {
        signIn(undefined, { callbackUrl: `${window.location.origin}/books` }).catch((err) => { console.error(err) });
    }

    const openMobileMenu = () => setIsMobileMenuOpen(true);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="relative bg-white w-full">
            <div className="mx-auto max-w-4xl px-4">
                <div className="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link href="/" className="flex flex-row gap-1">
                            <span className="sr-only">Your Company</span>
                            <Image className="h-8 w-auto sm:h-10 rounded-full" src="/rekindled-logo.png" width={100} height={100} alt="Rekindled company logo" />
                            <h1 className="sm:mt-1 text-2xl text-red-500 font-semibold">Rekindled</h1>
                        </Link>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false"
                            onClick={openMobileMenu}>
                            <span className="sr-only">Open menu</span>

                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                    <nav className="hidden space-x-10 md:flex">
                        {
                            isLoggedIn && menuItems.map(x => (
                                <Link href={x.url} key={x.name} className="text-base font-medium text-gray-500 hover:text-gray-900">{x.name}</Link>
                            ))
                        }
                    </nav>
                    <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                        {
                            isLoggedIn
                                ? <button type="button" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900" onClick={onSignOut}>Sign Out</button>
                                : <button type="button" className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-500" onClick={onSignIn}>Get Started</button>
                        }
                    </div>
                </div>
            </div>
            <div className={`absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden z-10 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="px-5 pt-5 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Image className="h-8 w-auto rounded-full" src="/rekindled-logo.png" width={100} height={100} alt="" />
                            </div>
                            <div className="-mr-2">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                    onClick={closeMobileMenu}>
                                    <span className="sr-only">Close menu</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <nav className="grid gap-y-8">
                                {
                                    isLoggedIn && menuItems.map(x => (
                                        <Link key={x.name} href={x.url} className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50" onClick={closeMobileMenu}>
                                            {x.icon}
                                            <span className="ml-3 text-base font-medium text-gray-900">{x.name}</span>
                                        </Link>
                                    ))
                                }
                            </nav>
                        </div>
                    </div>
                    <div className="space-y-6 py-6 px-5">
                        <div>
                            {
                                isLoggedIn ? <button type="button" className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600" onClick={onSignOut}>Sign Out</button>
                                    : <button type="button" className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600" onClick={onSignIn}>Get Started</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header