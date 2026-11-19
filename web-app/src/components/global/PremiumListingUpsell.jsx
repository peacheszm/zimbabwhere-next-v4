import BuyButton from "@/components/global/BuyButton";

// Shown under the headings for business owners, to point them at Premium
export default function PremiumListingUpsell({ className = "" }) {
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
      <BuyButton title="$450 / Year" subTitle="Buy Premium Listing" />
    </div>
  );
}
