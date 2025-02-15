'use client'

export default function Pagination ({ items, pageSize, currentPage, onPageChange }) {
  const pagesCount = Math.ceil(items / pageSize); // 100/10

  if (pagesCount === 1) return null;
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  return (
    <div>
      <ul className="flex space-x-2">
        {pages.map((page) => (
          <li
            key={page}
            className={`flex justify-center items-center w-8 h-8 border border-gray-300 rounded-lg cursor-pointer ${
              page === currentPage ? "bg-red-500 text-white" : ""
            }`}
          >
            <a className="cursor-pointer" onClick={() => onPageChange(page)}>
              {page}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

