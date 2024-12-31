import Image from "next/image";

export default function CardAgeTimeline({phase}) {
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


            <ol className="items-center sm:flex">

                <li className="relative mb-6 sm:mb-0">
                    <div className="flex items-center">
                        <div
                            className="z-10 flex items-center justify-center w-15 h-15 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                           <Image className="object-contain" src={'/zoea_phases/Z1.png'} width={50} height={50}/>
                        </div>
                        <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                    </div>
                    <div className="mt-3 sm:pe-8">

                        <h3
                            className={`text-lg ${
                                phase === 1 ? "font-semibold" : "font-normal"
                            } text-gray-900 dark:text-white`}
                        >
                            Phase 1
                        </h3>

                    </div>
                </li>


                <li className="relative mb-6 sm:mb-0">
                    <div className="flex items-center">
                        <div
                            className="z-10 flex items-center justify-center w-15 h-15 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <Image src={'/zoea_phases/Z2.png'} width={50} height={50}/>
                        </div>
                        <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                    </div>
                    <div className="mt-3 sm:pe-8">
                        <h3
                            className={`text-lg ${
                                phase === 2 ? "font-semibold" : "font-normal"
                            } text-gray-900 dark:text-white`}
                        >
                            Phase 2
                        </h3>
                    </div>
                </li>


                <li className="relative mb-6 sm:mb-0">
                    <div className="flex items-center">
                        <div
                            className="z-10 flex items-center justify-center w-15 h-15 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <Image src={'/zoea_phases/Z3.png'} width={50} height={50}/>
                        </div>
                        <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                    </div>
                    <div className="mt-3 sm:pe-8">
                        <h3
                            className={`text-lg ${
                                phase === 3 ? "font-semibold" : "font-normal"
                            } text-gray-900 dark:text-white`}
                        >
                            Phase 3
                        </h3>
                    </div>
                </li>


                <li className="relative mb-6 sm:mb-0">
                    <div className="flex items-center">
                        <div
                            className="z-10 flex items-center justify-center w-15 h-15 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <Image src={'/zoea_phases/Z4.png'} width={50} height={50}/>
                        </div>
                        <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                    </div>
                    <div className="mt-3 sm:pe-8">
                        <h3
                            className={`text-lg ${
                                phase === 4 ? "font-semibold" : "font-normal"
                            } text-gray-900 dark:text-white`}
                        >
                            Phase 4
                        </h3>
                    </div>
                </li>


                <li className="relative mb-6 sm:mb-0">
                    <div className="flex items-center">
                        <div
                            className="z-10 flex items-center justify-center w-15 h-15 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <Image src={'/zoea_phases/Z5.png'} width={50} height={50}/>
                        </div>
                    </div>
                    <div className="mt-3 sm:pe-8">
                        <h3
                            className={`text-lg ${
                                phase === 5 ? "font-semibold" : "font-normal"
                            } text-gray-900 dark:text-white`}
                        >
                            Phase 5
                        </h3>
                    </div>
                </li>


            </ol>
            <p className="font-normal text-center text-gray-700 dark:text-gray-400">
                Current Age
            </p>
        </div>
    )
}

