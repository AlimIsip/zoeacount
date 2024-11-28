import { useState, useEffect } from 'react'

export default function TimelineTable({onClose})
 {
     const [data, setData] = useState([])

     useEffect(() => {
         fetch('http://127.0.0.1:8000/api/table')
             .then((res) => res.json())
             .then((data) => {
                 setData(data)
             })
     }, [])
     console.log(data)

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
                {data.map((row) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">{row.id}</td>
                        <td className="px-6 py-4"><img src={row.img_blob}/></td>
                        <td className="px-6 py-4">{row.timestamp}</td>
                        <td className="px-6 py-4">{row.count_data}</td>
                        <td className="px-6 py-4">{row.mortality_rate}</td>
                        <td className="px-6 py-4">{row.cumulative_mortality_rate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={onClose}> Close </button>
        </div>

    );
}