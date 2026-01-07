export default function BusinessHours({ data, onEditClick }) {
  const openingTimes = data?.acf?.opening_times || [];

  return (
    <div className="card card_main">
      <div className="card_title">Business Hours</div>
      <div className="card_body">
        {openingTimes.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No opening times provided.</div>
        ) : (
          <ul className="list_items opening_times">
            {openingTimes.map((row, idx) => (
              <li key={idx}>
                <span>{row.day || "Day"}</span>
                <span>
                  {row.opening_time && row.closing_time
                    ? `${row.opening_time} - ${row.closing_time}`
                    : "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card_footer">
        <button
          onClick={onEditClick}
          className="btn"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Edit Business Hours
        </button>
      </div>
    </div>
  );
}
