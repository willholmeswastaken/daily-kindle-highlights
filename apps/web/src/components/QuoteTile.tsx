import { toast } from "react-toastify";
import { trpc } from "../utils/trpc";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

type Props = {
    id: string;
    onFavouriteToggled: () => void;
    isFavourite: boolean;
    quote: string;
    location: string;
    bookTitle?: string;
    bookAuthor?: string;
}

const QuoteTile = ({ id, onFavouriteToggled, isFavourite, quote, location, bookTitle, bookAuthor }: Props) => {
    const favouriteQuoteMutation = trpc.highlights.toggleFavouriteHighlight.useMutation({
        onSuccess: () => {
            onFavouriteToggled();
        },
        onError: () => {
            toast.error('Failed to favourite highlight, try again later!');
        }
    });

    const onFavouriteClicked = () => {
        favouriteQuoteMutation.mutate({ highlightId: id, favourite: !isFavourite });
    }

    const viewingAsFavourite = useMemo(() => bookTitle && bookAuthor, [bookTitle, bookAuthor]);
    const favouriteButton = () => (
        <button onClick={onFavouriteClicked} className="text-red-500 self-start">
            {isFavourite ? <HeartIconFilled className="text-red-500 w-6 h-6" /> : <HeartIcon className="text-red-500 w-6 h-6" />}
        </button>
    )

    return (
        <div className="flex flex-col bg-white shadow-xl rounded-lg p-10 w-full sm:w-[600px] border border-gray-200" >
            <div className="flex flex-col items-start gap-x-2 gap-y-2">
                {
                    viewingAsFavourite && (
                        <div className="flex flex-row w-full">
                            <div className="flex flex-col flex-1">
                                <p className="text-gray-700 text-xl font-bold">{bookTitle}</p>
                                <p className="text-gray-500 text-sm italic mt-2">By {bookAuthor}</p>
                            </div>
                            {favouriteButton()}
                        </div>
                    )
                }
                <div className="flex flex-row w-full">
                    <p className="text-gray-700 text-md flex-1">{quote}</p>
                    {
                        !viewingAsFavourite && favouriteButton()
                    }
                </div>
            </div>
            <p className="text-gray-500 text-sm italic mt-2">(Location {location})</p>
        </div>
    )
}

export default QuoteTile