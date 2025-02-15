"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import BatchDropdown from '@/components/buttons/BatchDropdown';

export default function App({ columns, timeline_data }) {
  
  // States for Batch Dropdown Filter and Pagination
    const [page, setPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState(timeline_data[0].batch);
  const [filteredData, setFilteredData] = useState(timeline_data.filter((entry) => entry.batch === selectedBatch));
  

 //Batch Dropdown functions 
  function updateTable(batchNum) {
    setSelectedBatch(batchNum);
  }
  useEffect(() => {
    const data = timeline_data.filter((entry) => entry.batch === selectedBatch);
    setFilteredData(data);
    setPage(1);
  }, [selectedBatch]);


  //Pagination
  const rowsPerPage = 7;
  const pages = Math.ceil(filteredData.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredData.slice(start, end);
  }, [page, filteredData]);

  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const renderCell = useCallback((row, columnKey) => {
    const cellValue = row[columnKey];

    switch (columnKey) {
      case "img_blob":
        return (
          <img src={cellValue} width={150} alt={`Image for${row["id"]}`}/>  
        );
      case "datestamp":
        return new Date(cellValue).toLocaleDateString("en-US", dateOptions);
      case "timestamp":
        return new Date(`${row["datestamp"]}T${cellValue}`).toLocaleTimeString("en-US", timeOptions);
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
         <BatchDropdown timelineData={timeline_data} updateTable={updateTable} />
      <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align="start">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>

    </div>
    );
}
