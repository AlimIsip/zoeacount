"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export default function App({ columns, timeline_data }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;
  const pages = Math.ceil(timeline_data.length / rowsPerPage);

  const [selectedRow, setSelectedRow] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return timeline_data.slice(start, start + rowsPerPage);
  }, [page, timeline_data]);

  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };

  const renderCell = useCallback((row, columnKey) => {
    const cellValue = row[columnKey];

    switch (columnKey) {
      case "img_blob":
        return <img src={cellValue} width={150} alt={`Image for ${row.id}`} />;
      case "datestamp":
        return new Date(cellValue).toLocaleDateString("en-US", dateOptions);
      case "timestamp":
        return new Date(`${row.datestamp}T${cellValue}`).toLocaleTimeString("en-US", timeOptions);
      default:
        return cellValue;
    }
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="p-6 bg-sky-950 text-amber-400">
      <Table className="w-full border border-sky-700 bg-sky-800 rounded-lg py-5 px-52 overflow-hidden">
        <TableHeader className="bg-sky-800 text-amber-700">
          {columns.map((column) => (
            <TableColumn key={column.uid} className="bg-sky-800 text-amber-400" align="start">
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody className="divide-y divide-sky-700 bg-sky-800">
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="even:bg-sky-900 odd:bg-sky-700 hover:bg-sky-800 cursor-pointer"
              onClick={() => {
                setSelectedRow(item);
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
            >
              {columns.map((col) => (
                <TableCell key={col.uid}>{renderCell(item, col.uid)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex w-full justify-center mt-4">
        <Pagination isCompact showControls showShadow color="secondary" page={page} total={pages} onChange={setPage} />
      </div>

      {selectedRow && (
        <Modal isOpen={true} onClose={() => setSelectedRow(null)} size="full" scrollBehavior="inside">
          <ModalContent className="bg-sky-900 text-amber-400 rounded-lg shadow-xl">
            <ModalHeader className="text-lg font-bold border-b border-sky-700">
              Row Details - ID {selectedRow.id}
            </ModalHeader>
            <ModalBody className="p-6 flex flex-col items-center">
              <div
                className="relative flex flex-col items-center border border-amber-500 p-4 bg-sky-800 rounded-lg w-full max-w-4xl overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
              >
                <img
                  src={selectedRow.img_blob}
                  alt="Large preview"
                  className="object-contain border border-sky-700 rounded-lg"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? "none" : "transform 0.2s ease-out",
                  }}
                />
                <div className="mt-4 flex gap-4">
                  <Button className="border border-amber-500 bg-amber-600 text-white" onClick={() => setZoom(zoom + 0.1)}>Zoom In</Button>
                  <Button className="border border-amber-500 bg-amber-600 text-white" onClick={() => setZoom(Math.max(1, zoom - 0.1))}>Zoom Out</Button>
                  <Button className="border border-amber-500 bg-amber-600 text-white" onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }}>Reset</Button>
                  <Button className="border border-amber-500 bg-amber-600 text-white" onClick={() => setShowDetailsModal(true)}>Show Details</Button>
                  <Button className="border border-amber-500 bg-amber-600 text-white" onClick={() => setSelectedRow(null)}>Close</Button>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

{showDetailsModal && (
        <Modal isOpen={true} onClose={() => setShowDetailsModal(false)} size="2xl" scrollBehavior="inside">
          <ModalContent className="bg-sky-900 text-amber-400 rounded-lg shadow-xl">
            <ModalHeader className="text-lg font-bold border-b border-sky-700">
              Additional Details
            </ModalHeader>
            <ModalBody className="p-6">
              {columns.map((col) => (
                col.uid !== "img_blob" && (
                  <div key={col.uid} className="flex flex-col border-b border-sky-700 py-2">
                    <span className="font-semibold">{col.name}:</span>
                    <span>{renderCell(selectedRow, col.uid)}</span>
                  </div>
                )
              ))}
            </ModalBody>
            <ModalFooter>
              <Button className="border border-amber-500 bg-amber-600 text-white" onClick={() => setShowDetailsModal(false)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
