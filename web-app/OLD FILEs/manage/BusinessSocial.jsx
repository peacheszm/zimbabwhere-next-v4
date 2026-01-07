export default function BusinessSocial({ data, onEditClick }) {
  const social = Array.isArray(data?.acf?.social) ? data.acf.social : [];

  return (
    <div className="card card_main">
      <div className="card_title">Social</div>
      <div className="card_body">
        {social.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No social profiles provided.</div>
        ) : (
          <ul className="list_items opening_times">
            {social.map((row, idx) => (
              <li key={idx}>
                <span>{row.social_platform || "Platform"}</span>
                <span>
                  {row.url ? (
                    <a href={row.url} target="_blank" rel="noopener noreferrer">
                      Visit
                    </a>
                  ) : (
                    "—"
                  )}
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
          Edit Social Media
        </button>
      </div>
    </div>
  );
}
