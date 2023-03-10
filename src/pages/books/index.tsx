import { type NextPage } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";

import { requireAuth } from "../../utils/requireAuth";
import { prisma } from "../../server/db";
import type { BookViewModel } from "../../types/BookViewModel";
import { parseDateForDisplay } from "../../utils/parseDateForDisplay";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export const getServerSideProps = requireAuth(async (ctx) => {
    const session = await getSession({ ctx });
    const books = await prisma.book.findMany({
        where: {
            userId: session?.user.id
        }
    });
    return {
        props: {
            books: books.map(x => ({
                ...x,
                title: `${x.title.substring(0, 50)}${x.title.length > 50 ? '...' : ''}`,
                lastHighlightedOn: parseDateForDisplay(x.lastHighlightedOn),
                importedOn: parseDateForDisplay(x.importedOn)
            })) as BookViewModel[]
        }
    }
}, 'books');



type Props = {
    books: BookViewModel[];
}

const Books: NextPage<Props> = ({ books }) => {
    return (
        <>
            <Head>
                <title>Rekindled</title>
                <meta name="description" content="Generated by create-t3-app" />
            </Head>
            <main className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold text-red-500">Books</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {
                        books.length > 0
                            ? books.map(x => (
                                <Link key={x.title} href={`/books/review/${x.id}`} className="border rounded-lg min-h-[8.5rem] w-full sm:w-[10.5rem] text-left flex flex-col py-2 px-2 items-start justify-start shadow-md duration-300 ease-in-out transform hover:scale-110">
                                    <div className="flex-1">
                                        <BookOpenIcon className='w-8 h-8 text-red-500' />
                                    </div>
                                    <h1 className='text-sm font-semibold text-gray-700'>{x.title}</h1>
                                    <span className='text-xs text-gray-600'>{x.author}</span>
                                </Link>
                            ))
                            : <p className="text-gray-500">No books found</p>
                    }
                </div>
            </main>
        </>
    );
};

export default Books;
