type Props = {
    quote: string;
    location: string;
}

const QuoteTile = ({ quote, location }: Props) => {
    return (
        <div className="bg-white shadow-xl rounded-lg p-10 w-full sm:w-[600px] border border-gray-200" >
            <p className="text-gray-700 text-md">{quote}</p>
            <p className="text-gray-500 text-sm italic mt-2">(Location {location})</p>
        </div>
    )
}

export default QuoteTile