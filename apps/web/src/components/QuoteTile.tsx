import React from 'react'

type Props = {
    quote: string;
    location: string;
}

const QuoteTile = ({ quote, location }: Props) => {
    return (
        <div className="bg-white shadow rounded-lg p-4 w-[600px]" >
            <p className="text-gray-700 text-lg">{quote}</p>
            <p className="text-gray-500 text-sm italic mt-2">{location}</p>
        </div>
    )
}

export default QuoteTile