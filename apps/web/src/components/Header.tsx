import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const Header = () => {
    const onLogOut = () => signOut({ callbackUrl: window.location.origin });
    const { data: sessionData } = useSession();
    console.log(sessionData);
    const isLoggedIn = useMemo<boolean>(() => sessionData?.user !== undefined, [sessionData]);
    return (
        <header className="flex flex-row items-center justify-between py-6 px-4 mx-auto max-w-4xl border-b border-gray-100 w-full">
            <div className="flex flex-row flex-1 items-center gap-6">
                <div className="flex flex-row gap-1 mr-4">
                    <Image src="/rekindled-logo.png" width={40} height={35} alt="Rekindled Logo" className="rounded-full" />
                    <h1 className="text-3xl sm:text-4xl font-bold bg-red-500 bg-clip-text text-transparent">Rekindled</h1>
                </div>
                {
                    isLoggedIn && (
                        <>
                            <Link href="/books" className="text-gray-500 hover:text-gray-600 duration-200 text-lg font-semibold pt-1">Books</Link>
                            <Link href="/sync" className="text-gray-500 hover:text-gray-600 duration-200 text-lg font-semibold pt-1">Sync</Link>
                        </>
                    )
                }
            </div>
            {
                isLoggedIn && (
                    <button type='button' className="text-gray-500 hover:text-gray-600 duration-200 text-lg font-semibold pt-1" onClick={onLogOut}>Log out</button>
                )
            }
        </header>
    )
}

export default Header