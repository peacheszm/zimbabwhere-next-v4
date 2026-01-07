export default function BusinessGalleryFiles({ data, onEditClick }) {
  const uploads = Array.isArray(data?.acf?.uploads) ? data.acf.uploads : [];

  return (
    <div className="card card_main uploads">
      <div className="card_title">
        Flyer / Brochure / Menu / Price List / Image
      </div>
      <div className="card_body">
        {uploads.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No uploads provided.</div>
        ) : (
          <ul className="list_items uploads">
            {uploads.map((row, idx) => {
              const file = row.file || {};
              const thumb = file?.sizes?.thumbnail || file?.icon || file?.url;
              const title = file?.title || file?.filename || "Untitled";
              return (
                <li key={idx} className="file flex">
                  <span className="icon">
                    {thumb ? <img src={thumb} alt={title} /> : <span />}
                  </span>
                  <span className="title_wrapper">
                    <h6>{title}</h6>
                    {file?.date && (
                      <span>
                        Uploaded on{" "}
                        {new Date(file.date).toLocaleDateString("en-GB")}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
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
          Edit Uploads
        </button>
      </div>
    </div>
  );
}
