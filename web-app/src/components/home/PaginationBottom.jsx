import Link from "next/link";

export default function Pagination({ pagination }) {
  const { currentPage, prevPage, nextPage } = pagination;

  return (
    <div className="pagination btn_group">
      {prevPage && (
        <Link href={`/quotes?page=${currentPage - 1}`} className="btn">
          Previous
        </Link>
      )}

      {nextPage && (
        <Link href={`/quotes?page=${currentPage + 1}`} className="btn">
          Next
        </Link>
      )}
    </div>
  );
}
