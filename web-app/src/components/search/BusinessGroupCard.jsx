import Link from "next/link";
import Image from "next/image";

import { IconMapPin, IconPhone } from "@tabler/icons-react";

// One card for a chain with several branches (see groupBusinesses). The branch
// list is a native <details>, so it works without JS and the links are still in
// the page HTML for crawlers.
export default function BusinessGroupCard({ group }) {
  const { name, branches } = group;
  const count = branches.length;
  // Use the first branch that has a logo; the first branch listed may not
  // have uploaded one, which would show the placeholder for the whole chain
  const lead =
    branches.find(({ item }) => item.logo)?.item || branches[0].item;

  // A branch's town in brackets ("... Best Prices (Harare)") is wrong for the
  // whole chain, so leave it off
  const motto = (lead.business_motto || "").replace(/\s*\([^()]*\)\s*$/, "");

  return (
    <div className="business_listing_item business_group">
      <div className="col col_left">
        <Image
          src={lead.logo || "/img/placeholder.png"}
          alt={name}
          width={200}
          height={200}
        />
      </div>

      <div className="col col_middle">
        <h3>{name}</h3>
        <div className="branch_count">{count} branches</div>

        {motto && <div className="motto">{motto}</div>}
      </div>

      <details className="branches">
        <summary>
          <span className="label_closed">Show all {count} branches</span>
          <span className="label_open">Hide branches</span>
        </summary>

        <ul>
          {branches.map(({ item, label }) => (
            <li key={item.id}>
              <div className="branch_info">
                <Link
                  href={`/business/${item.slug}`}
                  aria-label={`${name} ${label}`}
                >
                  {label}
                </Link>

                {item.address && (
                  <span className="branch_address">
                    <IconMapPin size={14} />
                    {item.address}
                  </span>
                )}
              </div>

              {item.phone_number && (
                <a
                  href={`tel:${item.phone_number}`}
                  className="branch_tel"
                  aria-label={`Call ${name} ${label}`}
                >
                  <IconPhone />
                </a>
              )}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
