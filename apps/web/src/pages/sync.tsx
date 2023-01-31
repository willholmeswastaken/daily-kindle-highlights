import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { requireAuth } from "../utils/requireAuth";
import { getImportMethodsAsync } from "../utils/importMethods";
import { getSession } from "next-auth/react";
import { ImportMethod } from "../types/ImportMethod";
import dayjs from "dayjs";

export const getServerSideProps = requireAuth(async (ctx) => {
    const session = await getSession({ ctx });
    const importMethods = await getImportMethodsAsync(session!.user.id);
    return {
        props: {
            importMethods
        }
    }
}, 'books');

type Props = {
    importMethods: ImportMethod[];
}

const Sync: NextPage<Props> = ({ importMethods }) => {
    return (
        <>
            <Head>
                <title>Rekindled</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1 className="text-4xl font-bold mb-5">Import Highlights</h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    {
                        importMethods.map((importMethod) => (
                            <div key={importMethod.type} className="border rounded-lg h-52 w-full sm:w-60 flex flex-col px-4">
                                <Image src="/kindle-icon.png" alt="Kindle" width={50} height={50} className="rounded-lg mt-8" />
                                <div className="flex-1">
                                    <h1 className='text-xl text-gray-700 mt-2'>{importMethod.name}</h1>
                                    <span className='text-xs text-gray-600'>{importMethod.desc}</span>
                                </div>
                                <div className="flex flex-row pb-2">
                                    <div className="flex flex-row gap-1 text-xs flex-1">
                                        <ArrowPathIcon className="w-4 h-4 text-red-500" />
                                        <span className="text-gray-500">Last updated {importMethod.lastUpdatedOn !== null
                                            ? dayjs(importMethod.lastUpdatedOn).calendar()
                                            : 'never'}</span>
                                    </div>
                                    <button className="bg-white border border-red-500 text-red-500 px-4 rounded-lg hover:bg-red-500 hover:text-white duration-200 h-6 text-xs self-end mt-[-5px]">Sync</button>
                                </div>
                            </div>
                        ))}
                </div>
            </main>
        </>
    );
};

export default Sync;
