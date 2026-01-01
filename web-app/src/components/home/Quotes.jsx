// app/quotes/page.js
import { getQuotes } from "@/lib/endpoints/quotes";
import QuotesList from "@/components/home/QuotesList";
import PaginationTop from "@/components/home/PaginationTop";
import PaginationBottom from "@/components/home/PaginationBottom";

export default async function Quotes({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  let quotes = [];
  let pagination = null;
  let error = null;

  try {
    const result = await getQuotes({ page });

    if (result.statusCode) {
      error = result.body;
    } else {
      quotes = result.data || [];
      pagination = {
        from: (page - 1) * 10 + 1,
        to: Math.min(page * 10, parseInt(result.total)),
        total: parseInt(result.total),
        currentPage: page,
        totalPages: parseInt(result.totalPages),
        prevPage: page > 1,
        nextPage: page < parseInt(result.totalPages),
      };
    }
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="quote_list_wrapper">
      <div className="container">
        <div className="quotes_total">
          {pagination && <PaginationTop pagination={pagination} />}
        </div>
        <div className="quotes_body">
          <QuotesList quotes={quotes} />
        </div>
        {pagination && <PaginationBottom pagination={pagination} />}
      </div>
    </div>
  );
}
