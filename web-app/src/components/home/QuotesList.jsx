import Link from "next/link";
import {
  IconEye,
  IconMessageCircle,
  IconCalendar,
  IconMapPin,
} from "@tabler/icons-react";
import { formatDate } from "@/lib/utils/formatDate";

export default function QuoteList({ quotes }) {
  return (
    <>
      {quotes.map((quote, qindex) => (
        <div key={qindex} className="quote_item">
          <div className="quote_body">
            <div className="quote_title">
              <Link href={`/quotes/${quote.slug}`}>
                <div
                  dangerouslySetInnerHTML={{ __html: quote.title.rendered }}
                />
              </Link>
              {quote.ACF?.new_quote && <div className="new">new</div>}
            </div>
            <div
              className="quote_description"
              dangerouslySetInnerHTML={{ __html: quote.content.rendered }}
            />

            <div className="quote_footer">
              <div className="quote_meta">
                <div className="meta_item">
                  <div className="icon">
                    <IconEye size={16} />
                  </div>
                  {quote.ACF?.page_views || 0} Views
                </div>
                <div className="meta_item">
                  <div className="icon">
                    <IconMessageCircle size={16} />
                  </div>
                  {quote.ACF?.quote_responses || 0} Responses
                </div>
                <div className="meta_item">
                  <div className="icon">
                    <IconCalendar size={16} />
                  </div>
                  {formatDate(quote.date)}
                </div>
                <div className="meta_item">
                  <div className="icon">
                    <IconMapPin size={16} />
                  </div>
                  {quote.ACF?.town_city?.name || "N/A"}
                </div>
              </div>
              <div className="quote_cta">
                <div className="btn_group">
                  <Link
                    href={`/quotes/${quote.slug}`}
                    className="btn btn-green"
                  >
                    Respond To Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
