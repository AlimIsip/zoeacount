

export default function TimelineTable({timelinedata, onClose})
 {
    console.log(onClose)
    return (
        <div className="bg-amber-100 p-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1>Messages</h1>
            <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">img</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Count Data</th>
                    <th className="px-6 py-4">Mortality</th>
                    <th className="px-6 py-4">Cumulative Mortality</th>
                </tr>
                </thead>
                <tbody>
                {timelinedata.map((row, index) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                        <td className="px-6 py-4">{row.id}</td>
                        <td className="px-6 py-4">img</td>
                        <td className="px-6 py-4">{row.date_time}</td>
                        <td className="px-6 py-4">{row.count_data}</td>
                        <td className="px-6 py-4">{row.mortality}</td>
                        <td className="px-6 py-4">{row.cumulative_mortality}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={onClose}> Close </button>
        </div>

    );
}