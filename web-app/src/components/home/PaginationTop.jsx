import Link from "next/link";

export default function PaginationTop({ pagination }) {
  const { from, to, total } = pagination;

  return (
    <span>
      Showing {from} to {to} of {total}
    </span>
  );
}
