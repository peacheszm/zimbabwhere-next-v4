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
//
// Some chains are listed with exactly the same name for every branch (four
// listings all called "TrenTyre"). Those have no brand prefix to find, so they
// are grouped when 2+ businesses have an identical title, and each branch is
// named after the town in its motto ("Best Brands, Best Prices (Harare)") or,
// failing that, its address.

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

// The town a branch is in, for chains where every branch has the same title
function getBranchLabel(item, index) {
  const motto = decodeHtml(item.business_motto || "");
  const fromMotto = motto.match(/\(([^()]+)\)\s*$/);
  if (fromMotto) return fromMotto[1].trim();

  const address = decodeHtml(item.address || "")
    .replace(/\b([\w']+)(\s+\1\b)+/gi, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return address || `Branch ${index + 1}`;
}

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

  // Chains whose branches all have the same title
  const sameTitleBuckets = new Map();
  for (const item of businesses) {
    if (groupByItemId.has(item.id)) continue;
    const key = getWords(item.title).join(" ").toLowerCase();
    if (!key) continue;
    if (!sameTitleBuckets.has(key)) sameTitleBuckets.set(key, []);
    sameTitleBuckets.get(key).push(item);
  }

  for (const [key, members] of sameTitleBuckets) {
    if (members.length < 2) continue;

    const group = {
      type: "group",
      key: `group-same-${key}`,
      name: getWords(members[0].title).join(" "),
      branches: members
        .map((item, index) => ({ item, label: getBranchLabel(item, index) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    };

    for (const item of members) groupByItemId.set(item.id, group);
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
