import { useState, useEffect } from "react";
import Header from "@/pages/components/Header";
import Body from "@/pages/components/Body";
import Pagination from "@/pages/components/Pagination";

export default function TimelineTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/table")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  console.log("data in timeline: ", data);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const onPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const paginate = (items, pageNumber, pageSize) => {
    const startIndex = (pageNumber - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize); // 0, 9
  };

  const paginatedRows = paginate(data, currentPage, pageSize);

  return (
    <>
      <Header />
      <Body>
        <h1 className="text-4xl">Timeline Table</h1>
        <table className="border-collapse table-auto w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="border border-slate-600 px-6 py-2 text-xs">ID</th>
              <th className="border border-slate-600 px-6 py-2 text-xs">img</th>
              <th className="border border-slate-600 px-6 py-2 text-xs">Age</th>
              <th className="border border-slate-600 px-6 py-2 text-xs">
                Phase
              </th>
              <th className="border border-slate-600 px-6 py-2 text-xs">
                Timestamp
              </th>
              <th className="border border-slate-600 px-6 py-2 text-xs">
                Count Data
              </th>
              <th className="border border-slate-600 px-6 py-2 text-xs">
                Mortality
              </th>
              <th className="border border-slate-600 px-6 py-2 text-xs">
                Cumulative Mortality
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="border border-slate-600 px-6 py-4 text-xs">
                  {row.id}
                </td>
                <td className="border border-slate-600 px-6 py-4 text-xs">
                  <img src={row.img_blob} width={150} />
                </td>
                <td className="border border-slate-600 px-6 py-4 text-xs">
                  {row.age}
                </td>
                <td className="border border-slate-600 px-6 py-4 text-xs">
                  {row.phase}
                </td>
                <td className="border border-slate-600 px-6 py-4 text-xs">
                  {row.timestamp}
                </td>
                <td className="border border-slate-600 px-6 py-4 text-xs">
                  {row.count_data}
                </td>
                <td className="border border-slate-600 px-6 py-4 text-xs">
                  {row.mortality_rate}
                </td>
                <td className="border border-slate-600 px-6 py-4 text-xs">
                  {row.cumulative_mortality_rate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Body>
      
      <Pagination
            items={data.length} // 100
            currentPage={currentPage} // 1
            pageSize={pageSize} // 10
            onPageChange={onPageChange}
          />
    </>
  );
}
