import BuyButton from "@/components/global/BuyButton";

// Shown under the headings for business owners, to point them at Premium.
// `headingCount` (optional) is how many headings the business has right now,
// so the link between Premium and headings is spelled out with their number.
export default function PremiumListingUpsell({
  className = "",
  headingCount = 0,
}) {
  return (
    <div className={`premium_upsell ${className}`.trim()}>
      <div className="offer_tag">Go Premium</div>
      <h4>Get seen first with a Premium Listing</h4>
      <ul>
        <li>
          Be listed in the Premium section, above all the free listed
          companies.
        </li>
        <li>
          Your company images are showcased right in the listing, so people
          see who you are and what you do at a glance.
        </li>
        <li>
          Your Premium Listing is linked to every business heading you select
          for your business, for the whole year.
        </li>
      </ul>
      {headingCount > 0 && (
        <p className="premium_heading_count">
          Right now that's{" "}
          <strong>
            {headingCount} {headingCount === 1 ? "heading" : "headings"}
          </strong>
          . Buy extra headings above and Premium covers those too.
        </p>
      )}
      <BuyButton title="$450 / Year" subTitle="Buy Premium Listing" />
    </div>
  );
}
