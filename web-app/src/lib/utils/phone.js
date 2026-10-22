/**
 * Formats a phone number for Zimbabwe (+263).
 * 
 * @param {string|number} phone - The phone number to format.
 * @param {string} type - 'wa' for WhatsApp (no +) or 'tel' (with +).
 * @returns {string} - The formatted phone number.
 */
export function formatZimPhone(phone, type = 'wa') {
  if (!phone) return "";
  
  // Drop the optional trunk zero, e.g. "263(0)77 123 4567", then clean all
  // non-numeric characters
  let cleaned = String(phone).replace(/\(0\)/g, "").replace(/\D/g, "");
  
  // Handle Zimbabwe prefix logic
  if (cleaned.startsWith("0")) {
    // Replace leading 0 with 263 (standard Zim mobile format: 07... -> 2637...)
    cleaned = "263" + cleaned.substring(1);
  } else if (cleaned.length === 9 && (cleaned.startsWith("7") || cleaned.startsWith("1") || cleaned.startsWith("3"))) {
    // If it's 9 digits (e.g. 773765485), prepend 263
    cleaned = "263" + cleaned;
  }
  
  // Return based on requested type
  if (type === 'tel') {
    return `+${cleaned}`;
  }
  
  return cleaned;
}

/**
 * Formats a phone number for showing to people, e.g. "+263 78 346 1813".
 * Numbers that aren't a Zimbabwe mobile are shown as "+" and the digits.
 *
 * @param {string|number} phone - The phone number to format.
 * @returns {string} - The number to display.
 */
export function displayZimPhone(phone) {
  const digits = formatZimPhone(phone, "wa");
  if (!digits) return "";

  const mobile = digits.match(/^263(\d{2})(\d{3})(\d{4})$/);
  return mobile ? `+263 ${mobile[1]} ${mobile[2]} ${mobile[3]}` : `+${digits}`;
}
