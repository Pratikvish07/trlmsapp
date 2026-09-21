export function getMimeTypeFromUri(uri = "") {
  const normalized = String(uri).toLowerCase();
  if (normalized.endsWith(".png")) {
    return "image/png";
  }
  if (normalized.endsWith(".webp")) {
    return "image/webp";
  }
  return "image/jpeg";
}

export function getVideoMimeTypeFromUri(uri = "") {
  const normalized = String(uri).toLowerCase();
  if (normalized.endsWith(".mov")) {
    return "video/quicktime";
  }
  if (normalized.endsWith(".webm")) {
    return "video/webm";
  }
  return "video/mp4";
}

export function firstOption(options) {
  const first = options[0];

  if (!first) {
    return "";
  }

  if (typeof first === "string" || typeof first === "number") {
    return String(first);
  }

  if (typeof first === "object") {
    return first.name || first.label || first.value || first.id || "";
  }

  return "";
}

export function humanizeKey(key) {
  return String(key || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

export function formatIsoDateToDisplay(value) {
  if (!value) {
    return "";
  }

  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year}`;
}

export function formatDisplayDateToIso(value) {
  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const [day, month, year] = String(value).split("-");
  if (!day || !month || !year) {
    return "";
  }

  return `${year.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function toNumberOrZero(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function toBooleanValue(value) {
  if (typeof value === "boolean") {
    return value;
  }

  return ["yes", "true", "1"].includes(String(value || "").trim().toLowerCase());
}

export function findOptionIdByName(options, name) {
  const match = options.find((item) => String(item?.name || "") === String(name || ""));
  return toNumberOrZero(match?.id);
}

export function getLhCboTypeKey(type) {
  switch (type) {
    case "Producer Group (PG)":
      return "pg";
    case "Non-Farm Collective (NFC)":
      return "nfc";
    case "Integrated Farming Cluster (IFC)":
      return "ifc";
    case "Custom Hiring Center (CHC)":
      return "chc";
    case "Farmer Producer Company (FPC)":
      return "fpc";
    default:
      return "pg";
  }
}
