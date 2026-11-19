// The "Double Headings" offer. One place for the wording so every page that
// mentions it says the same thing. The offer itself is applied when the order
// is completed in WordPress (woo_after_purchase.php in the theme).
export default function DoubleUpOffer({ className = "" }) {
  return (
    <div className={`double_up_offer ${className}`.trim()}>
      <div className="offer_tag">Double Headings Offer</div>
      <p>
        <strong>
          Spend $100 or more (not including VAT) on extra headings and we
          double the headings you purchase for the year!
        </strong>{" "}
        For example, buy 3 headings for $105 and get 6 headings.
      </p>
    </div>
  );
}
