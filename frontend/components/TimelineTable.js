'use client';
import { useState, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import BatchDropdown from '@/components/buttons/BatchDropdown';
import timeline from '@/app/timeline/page';

export default function TimelineTable({ timeline_data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState(timeline_data[0].batch);
  const [filteredData, setFilteredData] = useState(timeline_data.filter((entry) => entry.batch === selectedBatch));
  
  function updateTable(batchNum) {

    setSelectedBatch(batchNum);
  }
  
  useEffect(() => {

    const data = timeline_data.filter((entry) => entry.batch === selectedBatch);
    setFilteredData(data);
   
    setCurrentPage(1);
  }, [selectedBatch]);


  const pageSize = 7;

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginate = (items, pageNumber, pageSize) => {
    const startIndex = (pageNumber - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  };

  const paginatedRows = paginate(filteredData, currentPage, pageSize);

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  return (
    <div>
      <BatchDropdown timelineData={timeline_data} updateTable={updateTable} />
      <h1 className="text-4xl">Timeline Table</h1>
      <table className="border-collapse table-auto w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="border border-slate-600 px-6 py-2 text-xs">ID</th>
            <th className="border border-slate-600 px-6 py-2 text-xs">img</th>
            <th className="border border-slate-600 px-6 py-2 text-xs">Age</th>
            <th className="border border-slate-600 px-6 py-2 text-xs">Phase</th>
            <th className="border border-slate-600 px-6 py-2 text-xs">Date</th>
            <th className="border border-slate-600 px-6 py-2 text-xs">Time</th>
            <th className="border border-slate-600 px-6 py-2 text-xs">Count Data</th>
            <th className="border border-slate-600 px-6 py-2 text-xs">Mortality</th>
            <th className="border border-slate-600 px-6 py-2 text-xs">Cumulative Mortality</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, index) => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
              <td className="border border-slate-600 px-6 py-4 text-xs">{row.id}</td>
              <td className="border border-slate-600 px-6 py-4 text-xs">
                <img src={row.img_blob} width={150} alt={`Image for ${row.id}`} />
              </td>
              <td className="border border-slate-600 px-6 py-4 text-xs">{row.age}</td>
              <td className="border border-slate-600 px-6 py-4 text-xs">{row.phase}</td>
              <td className="border border-slate-600 px-6 py-4 text-xs">
                {new Date(row.datestamp).toLocaleDateString('en-US', dateOptions)}
              </td>
              <td className="border border-slate-600 px-6 py-4 text-xs">
                {new Date(`${row.datestamp}T${row.timestamp}Z`).toLocaleTimeString('en-US', timeOptions)}
              </td>
              <td className="border border-slate-600 px-6 py-4 text-xs">{row.count_data}</td>
              <td className="border border-slate-600 px-6 py-4 text-xs">{row.mortality_rate}</td>
              <td className="border border-slate-600 px-6 py-4 text-xs">{row.cumulative_mortality_rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        items={filteredData.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
