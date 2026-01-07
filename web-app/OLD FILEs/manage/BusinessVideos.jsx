export default function BusinessVideos({ data, onEditClick }) {
  const videos = Array.isArray(data?.acf?.youtube_videos)
    ? data.acf.youtube_videos
    : [];

  return (
    <div className="card card_main">
      <div className="card_title">Youtube Videos</div>
      <div className="card_body">
        {videos.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No videos provided.</div>
        ) : (
          <ul className="list_items opening_times">
            {videos.map((row, idx) => (
              <li key={idx}>
                <span>{row.video_title || "Video"}</span>
                <span>
                  {row.video_url ? (
                    <a
                      href={`https://www.youtube.com/watch?v=${row.video_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch
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
          Edit Videos
        </button>
      </div>
    </div>
  );
}
