export function normalizeId(value) {
  try {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (value._id) return String(value._id);
      if (value.$oid) return String(value.$oid);
    }
    return String(value);
  } catch (_) {
    return "";
  }
}


