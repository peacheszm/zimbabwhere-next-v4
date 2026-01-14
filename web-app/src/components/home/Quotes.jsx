import { getLatestQuotes } from "@/lib/endpoints/quotes";
import QuotesList from "@/components/home/QuotesList";
import Link from "next/link";

export default async function Quotes() {
  let quotes = [];
  let total = 0;
  let error = null;

  try {
    const result = await getLatestQuotes();

    if (result.statusCode) {
      error = result.body;
    } else {
      quotes = result.data || [];
      total = parseInt(result.total) || 0;
    }
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="quote_list_wrapper">
      <div className="quotes_header">
        <h2>Quote Requests</h2>
      </div>
      <div className="quotes_body">
        <QuotesList quotes={quotes} responsive={true} />
      </div>
      {total > 3 && (
        <div className="btn_group more_quotes">
          <Link href="/quotes" className="btn">
            View More Quotes...
          </Link>
        </div>
      )}
    </div>
  );
}
