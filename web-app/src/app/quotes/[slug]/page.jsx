import Link from "next/link";
import { getQuoteBySlug } from "@/lib/endpoints/quotes";
import { formatDate } from "@/lib/utils/formatDate";

import RespondActions from "@/components/quotes/RespondActions";
import ShareQuote from "@/components/quotes/ShareQuote";
import QuoteViewTracker from "@/components/quotes/QuoteViewTracker";

import {
  IconEye,
  IconMessageCircle,
  IconCalendar,
  IconMapPin,
  IconPhone,
  IconBrandWhatsapp,
  IconMail,
} from "@tabler/icons-react";

export default async function QuotePage({ params }) {
  const { slug } = params;
  const results = await getQuoteBySlug(slug);
  const post = Array.isArray(results) ? results[0] : null;

  return (
    <div className="single_quote">
      <div className="body_wrapper aside_left">
        <div className="container">
          <main className="main">
            <div className="breadcrumb">
              <Link href="/"> &#8249; Back to all Quotes </Link>
            </div>

            <div className="quote_title_area">
              {post?.title?.rendered && (
                <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              )}
              <div className="quote_meta">
                <div className="meta_item">
                  <div className="icon">
                    <IconEye size={16} />
                  </div>
                  {post?.acf?.page_views || 0} Views
                </div>
                <div className="meta_item">
                  <div className="icon">
                    <IconMessageCircle size={16} />
                  </div>
                  {post?.acf?.quote_responses || 0} Responses
                </div>
                <div className="meta_item">
                  <div className="icon">
                    <IconCalendar size={16} />
                  </div>
                  {formatDate(post?.date)}
                </div>
                <div className="meta_item">
                  <div className="icon">
                    <IconMapPin size={16} />
                  </div>
                  {post?.acf?.town_city?.name || "N/A"}
                </div>
              </div>
            </div>

            <div
              className="quote_body"
              dangerouslySetInnerHTML={{
                __html: post?.content?.rendered || "",
              }}
            />

            {post?.acf?.quote_files?.length ? (
              <div className="quote_files inner_container">
                {post.acf.quote_files.map((file, index) => (
                  <a
                    key={index}
                    href={file?.file?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file?.file?.url}
                      alt={file?.file?.alt || "Attachment"}
                    />
                  </a>
                ))}
              </div>
            ) : null}

            <div className="quote_respond">
              <h4>Respond to quote</h4>
              <RespondActions
                title={post?.title?.rendered || ""}
                postId={post?.id}
                phone={post?.acf?.phone_whatsapp_number}
                email={post?.acf?.email}
              />
            </div>

            <ShareQuote
              title={post?.title?.rendered?.replace(/<[^>]+>/g, "") || "Quote"}
            />
          </main>
          <aside className="aside">{/* <Sidebar /> */}</aside>
        </div>
      </div>

      <QuoteViewTracker quoteId={post?.id} />
    </div>
  );
}
