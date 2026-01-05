import Link from "next/link";

export default function Categorys({ post }) {
  return (
    <>
      {post._embedded?.["wp:term"] && (
        <div className="business_categorys">
          {post._embedded["wp:term"][0]?.map((cat, ct) => (
            <Link
              key={ct}
              href={`/search?category_filter=${cat.id}`}
              dangerouslySetInnerHTML={{ __html: cat.name }}
            />
          ))}
        </div>
      )}
    </>
  );
}
