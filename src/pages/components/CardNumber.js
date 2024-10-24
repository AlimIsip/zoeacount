export default function CardNumber({number, title}) {
    return (
        <div
            className="block
           flex-grow
           m-3
           p-5
           bg-white
           border
           border-gray-200
           rounded-lg shadow
           hover:bg-gray-100
           dark:bg-gray-800
           dark:border-gray-700
           dark:hover:bg-gray-700">

            <h5 className="mb-2 text-5xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
                {number}
            </h5>
            <p className="font-normal text-center text-gray-700 dark:text-gray-400">
                {title}
            </p>
        </div>
    )
}

