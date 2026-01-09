import { getQuotes } from "@/lib/endpoints/quotes";
import QuotesList from "@/components/home/QuotesList";
import PaginationTop from "@/components/home/PaginationTop";
import PaginationBottom from "@/components/home/PaginationBottom";
import SiteSideBar from "@/components/global/Sidebar";

export default async function QuotesPage({ searchParams }) {
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
    return (
      <div className="page_wrapper">
        <div className="container">
          <main className="main">
            <div className="error">{error}</div>
          </main>
          <aside className="aside">
            <SiteSideBar />
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="page_wrapper">
      <div className="container">
        <main className="main">
          <div className="quote_list_wrapper">
            <div className="quotes_total">
              {pagination && <PaginationTop pagination={pagination} />}
            </div>
            <div className="quotes_body">
              <QuotesList quotes={quotes} />
            </div>
            {pagination && <PaginationBottom pagination={pagination} />}
          </div>
        </main>
        <aside className="aside">
          <SiteSideBar />
        </aside>
      </div>
    </div>
  );
}
