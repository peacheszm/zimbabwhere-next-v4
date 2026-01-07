export default function BusinessOverview({ data, onRefresh, onEditClick }) {
  const title = data?.title?.rendered || "Untitled";
  const acf = data?.acf || {};
  const phone = acf?.phone_number || "—";
  const email = acf?.business_email || "—";
  const whatsapp = acf?.business_whatsapp || null;
  const website = acf?.business_website || null;
  const addressParts = [acf?.street_number, acf?.street_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="card card_main">
      <div className="card_title">Business Information</div>
      <div className="card_body">
        <h4 style={{ marginBottom: "0.5rem" }}>{title}</h4>
        {acf?.business_motto && (
          <div style={{ marginBottom: "1rem", opacity: 0.8 }}>
            {acf.business_motto}
          </div>
        )}

        <div className="address">
          <div className="icon"></div>
          <div>{addressParts || "Address not specified"}</div>
        </div>

        <div className="phone">{phone}</div>
        {whatsapp && <div className="phone">WhatsApp: {whatsapp}</div>}
        <div className="phone">{email}</div>
        {website && (
          <div className="phone">
            <a href={website} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </div>
        )}
      </div>
      <div className="card_footer">
        <button
          onClick={onEditClick}
          className="btn"
          style={{
            background: "none",
            border: "1px solid #ddd",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
