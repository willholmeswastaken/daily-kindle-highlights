import { type NextPage } from "next";
import Head from "next/head";

import { requireAuth } from "../utils/requireAuth";
import QuoteTile from "../components/QuoteTile";
import { trpc } from "../utils/trpc";
import SkeletonTile from "../components/SkeletonTile";

export const getServerSideProps = requireAuth((undefined), 'books');

const Favourites: NextPage = () => {
    // need to add skeleton loading
    const { isLoading, isError, data, refetch } = trpc.highlights.getFavourites.useQuery();
    const onFavouriteToggled = async () => {
        await refetch();
    }
    return (
        <>
            <Head>
                <title>Rekindled</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex flex-col justify-center items-center gap-4">
                <div className="flex flex-col text-center">
                    <h1 className="text-4xl text-red-500 font-bold">Favourites</h1>
                    <h2 className="text-lg sm:text-2xl text-gray-400 italic">Highlights tagged as favourites, by you.</h2>
                </div>
                <div className="flex flex-col gap-y-4 w-full items-center">
                    {
                        isLoading
                            ? (
                                <>
                                    <SkeletonTile />
                                    <SkeletonTile />
                                    <SkeletonTile />
                                </>
                            )
                            : (
                                data &&
                                    data.length > 0
                                    ? data.map((highlight) => <QuoteTile id={highlight.id} bookTitle={highlight.bookTitle} bookAuthor={highlight.bookAuthor} onFavouriteToggled={onFavouriteToggled} isFavourite={highlight.isFavourite} key={highlight.id} quote={highlight.content} location={highlight.location} />)
                                    : <p className="text-gray-500">No favourites found</p>
                            )
                    }
                    {
                        isError && <p className="text-gray-500">An error occurred</p>
                    }
                </div>
            </main>
        </>
    );
};

export default Favourites;