import { decodeHtml } from "@/lib/utils/decodeHtml";

// Chains are listed as one business per branch, all titled "<Brand> <Branch>"
// (e.g. "Tiger Wheel & Tyre Borrowdale"). The API has no parent/brand field, so
// we group on the title instead.
//
// Businesses are grouped when 2+ of them start with the same first two words;
// the brand is the longest run of leading words they all share and the branch
// is whatever follows it. Requiring two words keeps unrelated businesses that
// merely start with the same word ("Harare Plumbers", "Harare Auto") apart.
// Single word brands are deliberately not grouped.

const MIN_BRAND_WORDS = 2;
// Separators between brand and branch ("Pizza Inn - Avondale")
const BRAND_TRAILING_JOINERS = /[\s\-–—|,:&@]+$/;
const BRANCH_LEADING_JOINERS = /^[\s\-–—|,:@]+/;

const getWords = (title) =>
  decodeHtml(title || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const sameWord = (a, b) => a.toLowerCase() === b.toLowerCase();

function commonPrefixLength(members) {
  const [first, ...rest] = members;
  let length = 0;

  while (
    length < first.words.length &&
    rest.every(
      (member) =>
        length < member.words.length &&
        sameWord(member.words[length], first.words[length]),
    )
  ) {
    length += 1;
  }

  return length;
}

/**
 * Turn a flat list of businesses into a list of entries, keeping the original
 * order. A chain takes the position of its first branch.
 *
 *   { type: "single", item }
 *   { type: "group", key, name, branches: [{ item, label }] }
 */
export function groupBusinesses(businesses) {
  const buckets = new Map();

  for (const item of businesses) {
    const words = getWords(item.title);
    // Needs a brand plus at least one word left over for the branch
    if (words.length <= MIN_BRAND_WORDS) continue;

    const key = words.slice(0, MIN_BRAND_WORDS).join(" ").toLowerCase();
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push({ item, words });
  }

  const groupByItemId = new Map();

  for (const [key, bucket] of buckets) {
    let members = bucket;
    let prefixLength = 0;

    // A business that is exactly the brand has no branch name, so it stays
    // out of the group (and can't shorten the shared brand)
    while (members.length >= 2) {
      prefixLength = commonPrefixLength(members);
      const withBranch = members.filter(
        (member) => member.words.length > prefixLength,
      );
      if (withBranch.length === members.length) break;
      members = withBranch;
    }

    if (members.length < 2) continue;

    const name = members[0].words
      .slice(0, prefixLength)
      .join(" ")
      .replace(BRAND_TRAILING_JOINERS, "");

    const group = {
      type: "group",
      key: `group-${key}`,
      name,
      branches: members
        .map(({ item, words }) => ({
          item,
          label: words
            .slice(prefixLength)
            .join(" ")
            .replace(BRANCH_LEADING_JOINERS, ""),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    };

    for (const { item } of members) groupByItemId.set(item.id, group);
  }

  const entries = [];
  const emitted = new Set();

  for (const item of businesses) {
    const group = groupByItemId.get(item.id);

    if (!group) {
      entries.push({ type: "single", item });
    } else if (!emitted.has(group)) {
      emitted.add(group);
      entries.push(group);
    }
  }

  return entries;
}
