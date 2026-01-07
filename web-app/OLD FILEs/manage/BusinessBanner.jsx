"use client";

export default function BusinessBanner({ data, onEditClick, token }) {
  const currentBanner = data?.acf.business_banner;
  const bannerUrl = currentBanner?.url || currentBanner;

  return (
    <div className="card card_main">
      <div className="card_title">Business Banner</div>
      <div className="card_body">
        {/* Information section */}
        <div className="buy_button_wrapper">
          <a
            href={`/api/auth/autologin-url?token=${encodeURIComponent(token)}`}
            target="_blank"
            rel="noopener"
            className="but_button"
          >
            Buy Home Page Billboard
          </a>
        </div>
        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
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
            <span style={{ fontSize: "1.2rem" }}>🏠</span>
            <h4
              style={{
                margin: 0,
                color: "#0369a1",
                fontSize: "0.95rem",
                fontWeight: "600",
              }}
            >
              Home Page Banner
            </h4>
          </div>
          <p
            style={{
              margin: 0,
              color: "#0369a1",
              fontSize: "0.85rem",
              lineHeight: "1.4",
            }}
          >
            This banner image will be used as a featured banner on the home page
            when your business is selected for promotion. Choose an
            eye-catching, high-quality image that represents your business well.
          </p>
        </div>

        {/* Banner display */}
        {bannerUrl ? (
          <div className="current_banner">
            <div
              style={{
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1rem",
                background: "#ffffff",
                textAlign: "center",
              }}
            >
              <img
                src={bannerUrl}
                alt="Current business banner"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <p
                className="help"
                style={{
                  marginTop: "0.75rem",
                  marginBottom: 0,
                  color: "#6b7280",
                }}
              >
                Current banner image
              </p>
            </div>
          </div>
        ) : (
          <div
            className="no_banner"
            style={{
              border: "2px dashed #d1d5db",
              borderRadius: "8px",
              padding: "2rem",
              textAlign: "center",
              background: "#f9fafb",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🖼️</div>
            <p style={{ margin: 0, color: "#6b7280", fontWeight: "500" }}>
              No banner uploaded yet
            </p>
            <p
              style={{
                margin: "0.25rem 0 0 0",
                color: "#9ca3af",
                fontSize: "0.85rem",
              }}
            >
              Upload a banner to make your business stand out
            </p>
          </div>
        )}
      </div>
      <div className="card_footer">
        <button
          onClick={onEditClick}
          className="btn"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "#ffffff",
            border: 0,
            padding: "0.75rem 1.5rem",
            borderRadius: "25px",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
          }}
        >
          <span style={{ fontSize: "1rem" }}>✏️</span>
          {bannerUrl ? "Edit Banner" : "Upload Banner"}
        </button>
      </div>
    </div>
  );
}
