import { htmlToPlainText } from "@/lib/utils/richText";

export default function OverView({ post }) {
  // Imported listings can have a literal "NULL" description; ignore it so the
  // overview text (if there is one) is shown instead
  const description = htmlToPlainText(post.acf?.business_description)
    ? post.acf.business_description
    : "";
  const overview =
    post.acf?.business_overview && post.acf.business_overview !== "NULL"
      ? post.acf.business_overview
      : "";

  return (
    <div className="business_overview">
      {/* Business overview */}
      {description || overview ? (
        <>
          <h4>Business Overview</h4>
          <div
            dangerouslySetInnerHTML={{
              __html: description || overview,
            }}
          />
        </>
      ) : null}
    </div>
  );
}
