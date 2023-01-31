import React from 'react'

type Props = {
    icon?: JSX.Element;
    title: string;
    description: string;
}

const IconTile = ({ icon, title, description }: Props) => {
    return (
        <div className="border rounded-lg h-60 w-64 text-center flex flex-col py-4 px-1 items-center justify-center">
            <div className="flex-1 mt-8">
                {icon}
            </div>
            <h1 className='text-xl font-semibold text-gray-700'>{title}</h1>
            <span className='text-gray-600'>{description}</span>
        </div>
    )
}

export default IconTile