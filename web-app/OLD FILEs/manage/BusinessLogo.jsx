"use client";

export default function BusinessLogo({ data, onEditClick }) {
  const currentLogo = data?.acf.logo;
  const logoUrl = currentLogo?.url || currentLogo;

  console.log(data);

  return (
    <div className="card card_main">
      <div className="card_title">Business Logo</div>
      <div className="card_body">
        {/* Information section */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🏢</span>
            <h4
              style={{
                margin: 0,
                color: "#166534",
                fontSize: "0.95rem",
                fontWeight: "600",
              }}
            >
              Business Identity
            </h4>
          </div>
          <p
            style={{
              margin: 0,
              color: "#166534",
              fontSize: "0.85rem",
              lineHeight: "1.4",
            }}
          >
            Your logo represents your business across the platform and appears
            on your business listing, in search results, and throughout your
            business profile. Upload a clear, professional logo that works well
            at different sizes.
          </p>
        </div>

        {/* Logo display */}
        {logoUrl ? (
          <div className="current_logo">
            <div
              style={{
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1.5rem",
                background: "#ffffff",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "120px",
                  minWidth: "120px",
                }}
              >
                <img
                  src={logoUrl}
                  alt="Current business logo"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
              <p
                className="help"
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                Current business logo
              </p>
            </div>
          </div>
        ) : (
          <div
            className="no_logo"
            style={{
              border: "2px dashed #d1d5db",
              borderRadius: "8px",
              padding: "2rem",
              textAlign: "center",
              background: "#f9fafb",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
              🏢
            </div>
            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontWeight: "500",
                fontSize: "1rem",
              }}
            >
              No logo uploaded yet
            </p>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                color: "#9ca3af",
                fontSize: "0.85rem",
              }}
            >
              Upload a professional logo to establish your business identity
            </p>
          </div>
        )}
      </div>
      <div className="card_footer">
        <button
          onClick={onEditClick}
          className="btn"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            border: 0,
            padding: "0.75rem 1.5rem",
            borderRadius: "25px",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
          }}
        >
          <span style={{ fontSize: "1rem" }}>✏️</span>
          {logoUrl ? "Edit Logo" : "Upload Logo"}
        </button>
      </div>
    </div>
  );
}
