const SkeletonTile = () => {
    return (
        <div className="bg-white shadow rounded-md p-4 w-full sm:w-[600px]">
            <div className="animate-pulse">
                <div className="h-4 bg-gray-300 w-full rounded mb-4"></div>
                <div className="h-20 bg-gray-300 rounded-md mb-4"></div>
            </div>
        </div>
    );
};

export default SkeletonTile;