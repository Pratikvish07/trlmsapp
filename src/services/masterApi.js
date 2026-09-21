const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://trlm.pickitover.com/api";
const INVALID_BASE_URL_MARKERS = ["YOUR_API_HOST", "YOUR_PORT"];
let authToken = "";


export const API_ENDPOINTS = {
  master: {
    districts: process.env.EXPO_PUBLIC_DISTRICTS_PATH || "/api/master/districts",
    blocksByDistrict: (districtId) =>
      `${process.env.EXPO_PUBLIC_BLOCKS_BY_DISTRICT_PATH || "/api/master/block"}/${districtId}`,
    gpsByBlock: (blockId) =>
      `${process.env.EXPO_PUBLIC_GPS_BY_BLOCK_PATH || "/api/master/gp"}/${blockId}`,
    villagesByGp: (gpId) =>
      `${process.env.EXPO_PUBLIC_VILLAGES_BY_GP_PATH || "/api/master/village"}/${gpId}`,
    categories:
      process.env.EXPO_PUBLIC_CATEGORY_PATH || "/api/category/get-all",
    crpTypes: process.env.EXPO_PUBLIC_CRP_TYPES_PATH || "/api/crptype",
    roles: process.env.EXPO_PUBLIC_ROLE_PATH || "/api/Role",
    activities: process.env.EXPO_PUBLIC_ACTIVITY_PATH || "/api/activity",
    // Confirmed live: GET /api/subcategory returns the FULL list, each row
    // already carrying its own ActivityId. There is no working
    // "/subcategory/by-activity/{id}" route on the server today, so we
    // fetch once and filter client-side (see fetchSubCategoriesByActivity).
    subCategoriesAll:
      process.env.EXPO_PUBLIC_SUBCATEGORY_PATH || "/api/subcategory",
    // activityTypeById (get/{id}) is NOT this - confirmed by testing it:
    // it returns {"main": null, "production": []}, an ActivityProfile
    // detail lookup by that profile's own id, unrelated to the Seasonal/
    // Perennial type list. This get-all path is the real one - confirmed
    // live, returns [{"ActivityTypeId":1,"ActivityTypeName":"Seasonal"},
    // {"ActivityTypeId":2,"ActivityTypeName":"Perennial"}].
    activityTypeById: (activityTypeId) =>
      `${process.env.EXPO_PUBLIC_ACTIVITY_TYPE_PATH || "/api/activity-type/get"}/${activityTypeId}`,
    activityTypes:
      process.env.EXPO_PUBLIC_ACTIVITY_TYPES_PATH || "/api/activity-type/get-all",
    landTypes:
      process.env.EXPO_PUBLIC_LAND_TYPE_PATH || "/api/Land-type/get-all",
    unitsOfArea:
      process.env.EXPO_PUBLIC_UNIT_OF_AREA_PATH || "/api/unit-of-area/get-all",
    seasons: process.env.EXPO_PUBLIC_SEASON_PATH || "/api/season/get-all",
    shgMembersByVillage: (villageId) =>
      `${process.env.EXPO_PUBLIC_SHG_MEMBERS_BY_VILLAGE_PATH || "/api/master/shg-member"}/${villageId}`
  },
  auth: {
    allCrps: process.env.EXPO_PUBLIC_ALL_CRPS_PATH || "/api/auth/crp/all",
    crpSignup:
      process.env.EXPO_PUBLIC_CRP_SIGNUP_PATH || "/api/auth/crp/signup",
    login: process.env.EXPO_PUBLIC_LOGIN_PATH || "/api/auth/crp/login"
  },
  livelihood: {
    create: process.env.EXPO_PUBLIC_LIVELIHOOD_PATH || "/api/livelihood",
    shgTracking:
      process.env.EXPO_PUBLIC_SHG_TRACKING_PATH ||
      "/api/shg-tracking/save",
    // Both /save and /create exist on the server side per the payload dump
    // you shared. Keep both wired; submitShgTracking() still targets /save
    // (already used across the app), submitShgTrackingCreate() targets
    // /create for any new-enrolment flow that wants it explicitly.
    shgTrackingCreate:
      process.env.EXPO_PUBLIC_SHG_TRACKING_CREATE_PATH ||
      "/api/shg-tracking/create",
    shgTrackingUploadImage:
      process.env.EXPO_PUBLIC_SHG_TRACKING_UPLOAD_IMAGE_PATH ||
      "/api/shg-tracking/upload-image",
    shgTrackingUploadVideo:
      process.env.EXPO_PUBLIC_SHG_TRACKING_UPLOAD_VIDEO_PATH ||
      "/api/shg-tracking/upload-video",
    shgTrackingGeo:
      process.env.EXPO_PUBLIC_SHG_TRACKING_GEO_PATH ||
      "/api/shg-tracking/geo",
    // CONFIRMED live via Swagger: returns {SHGMemberId, PastSupport:
    // {Financial:[],Technical:[]}, PresentSupport:{...}, SupportRequired:
    // {...}} - backs the Past Supports / Present Support / Support Required
    // segment buttons on the Technical Support screen.
    shgTrackingGetSupport: (shgMemberId) =>
      `${process.env.EXPO_PUBLIC_SHG_TRACKING_GET_SUPPORT_PATH || "/api/shg-tracking/get_Support"}/${shgMemberId}`
  },
  activityProfile: {
    save:
      process.env.EXPO_PUBLIC_ACTIVITY_PROFILE_SAVE_PATH ||
      "/api/activity-profile/save"
  },
  attendance: {
    checkIn:
      process.env.EXPO_PUBLIC_CRP_ATTENDANCE_CHECKIN_PATH ||
      "/api/crp-attendance/checkin",
    checkOut:
      process.env.EXPO_PUBLIC_CRP_ATTENDANCE_CHECKOUT_PATH ||
      "/api/crp-attendance/checkout",
    byId: (crpRegistrationId) =>
      `${process.env.EXPO_PUBLIC_CRP_ATTENDANCE_BY_ID_PATH || "/api/crp-attendance"}/${crpRegistrationId}`,
    // CONFIRMED BROKEN AS A BARE GET: the server answers 400 without query
    // params. It almost certainly needs crpRegistrationId / fromDate /
    // toDate query params - confirm the exact param names with the backend
    // team before wiring a dashboard "report" screen to this.
    report:
      process.env.EXPO_PUBLIC_CRP_ATTENDANCE_REPORT_PATH ||
      "/api/crp-attendance/report"
  },
  financialSupport: {
    insert:
      process.env.EXPO_PUBLIC_FINANCIAL_SUPPORT_INSERT_PATH ||
      "/api/financial-support/insert",
    update:
      process.env.EXPO_PUBLIC_FINANCIAL_SUPPORT_UPDATE_PATH ||
      "/api/financial-support/update",
    // CONFIRMED BROKEN: GET .../loan-projectio returns 404 exactly as given.
    // Likely either a typo for "loan-projection" or it only exists as a
    // POST. Left as-is (not guessed/renamed) - confirm the real path/verb
    // with the backend team before wiring the Loan Projection screen to it.
    loanProjection:
      process.env.EXPO_PUBLIC_LOAN_PROJECTION_PATH ||
      "/api/financial-support/loan-projectio"
  },
  incomeProfile: {
    save:
      process.env.EXPO_PUBLIC_INCOME_PROFILE_SAVE_PATH ||
      "/api/income-profile/save"
  },
  investmentProfile: {
    insert:
      process.env.EXPO_PUBLIC_INVESTMENT_PROFILE_INSERT_PATH ||
      "/api/investment-profile/insert"
  },
  technicalSupport: {
    save:
      process.env.EXPO_PUBLIC_TECHNICAL_SUPPORT_SAVE_PATH ||
      "/api/technical-support/save"
  },
  trainingAgency: {
    save:
      process.env.EXPO_PUBLIC_TRAINING_AGENCY_SAVE_PATH ||
      "/api/training-agency/save",
    getAll:
      process.env.EXPO_PUBLIC_TRAINING_AGENCY_GET_ALL_PATH ||
      "/api/training-agency/get-all"
  },
  trade: {
    save: process.env.EXPO_PUBLIC_TRADE_SAVE_PATH || "/api/trade/save",
    getAll: process.env.EXPO_PUBLIC_TRADE_GET_ALL_PATH || "/api/trade/get-all"
  },
  productionMaster: {
    getAll:
      process.env.EXPO_PUBLIC_PRODUCTION_MASTER_GET_ALL_PATH ||
      "/api/production-master/get-all",
    save:
      process.env.EXPO_PUBLIC_PRODUCTION_MASTER_SAVE_PATH ||
      "/api/production-master/save"
  },
  memberActivity: {
    getAll:
      process.env.EXPO_PUBLIC_MEMBER_ACTIVITY_GET_ALL_PATH ||
      "/api/member-activity/get-all"
  }
};

function getBaseUrl() {
  const sanitizedBaseUrl = API_BASE_URL.trim().replace(/\/+$/, "");
  const hasPlaceholder = INVALID_BASE_URL_MARKERS.some((marker) =>
    sanitizedBaseUrl.includes(marker)
  );

  if (!sanitizedBaseUrl || hasPlaceholder) {
    throw new Error(
      "API base URL is not configured. Update EXPO_PUBLIC_API_BASE_URL in .env with your real backend URL."
    );
  }

  return sanitizedBaseUrl;
}

function normalizeEndpointPath(path) {
  if (!path) {
    throw new Error("API path is missing.");
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `/${String(path).replace(/^\/+/, "")}`;
}

function buildUrl(path) {
  const normalizedPath = normalizeEndpointPath(path);

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  const base = getBaseUrl();
  return `${base}${normalizedPath}`;
}

function ensureArray(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.result)) {
    return payload.result;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

function extractErrorMessage(payload, fallbackMessage) {
  if (!payload) {
    return fallbackMessage;
  }

  if (typeof payload === "string") {
    return payload;
  }

  // ASP.NET Core's default validation-error shape (ProblemDetails) puts the
  // actually-useful info in `errors` (field -> [messages]), not in `title`
  // - `title` is always the generic "One or more validation errors
  // occurred." Previously this function returned just that generic title,
  // which is why on-screen errors never said which field was the problem.
  // FK-constraint / DB errors (like the ActivityId one) use `detail`
  // (singular, per the ProblemDetails spec) - this used to check `details`
  // (plural) and so never matched.
  if (payload.errors && typeof payload.errors === "object") {
    const fieldMessages = Object.entries(payload.errors)
      .map(([field, messages]) => {
        const text = Array.isArray(messages) ? messages.join(" ") : String(messages);
        return `${field}: ${text}`;
      })
      .join(" | ");
    if (fieldMessages) {
      return fieldMessages;
    }
  }

  return (
    payload.detail ||
    payload.message ||
    payload.error ||
    payload.title ||
    payload.details ||
    fallbackMessage
  );
}

async function parseApiResponse(response, entityName) {
  const fallbackMessage = `${entityName} request failed (${response.status})`;
  const contentType = response.headers.get("content-type") || "";
  const bodyText = await response.text();
  // ASP.NET Core's default validation-error responses (ValidationProblemDetails)
  // use content-type "application/problem+json" - which does NOT contain the
  // substring "application/json", so the old check here missed it entirely.
  // That's exactly why the alert showed the raw, unparsed JSON blob instead
  // of the flattened "name: The name field is required." message: this
  // function thought the body wasn't JSON at all and fell back to using the
  // raw text as-is. Now it just tries to parse whenever the body looks like
  // JSON, regardless of what the content-type header claims.
  const looksLikeJson =
    contentType.toLowerCase().includes("json") ||
    (bodyText.trim().startsWith("{") || bodyText.trim().startsWith("["));

  let parsedPayload = null;

  if (bodyText && looksLikeJson) {
    try {
      parsedPayload = JSON.parse(bodyText);
    } catch {
      // Looked like JSON but wasn't - fall through and use bodyText as-is
      // below rather than throwing, since this path is also reached for
      // legitimate non-JSON error pages.
    }
  }

  console.log(`[API] ${entityName} -> ${response.status} ${response.url}`, bodyText);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `${entityName} endpoint not found (404). The API server may be offline or the endpoint path changed.`
      );
    }

    throw new Error(
      extractErrorMessage(parsedPayload || bodyText, fallbackMessage)
    );
  }

  if (parsedPayload !== null) {
    return parsedPayload;
  }

  if (!bodyText) {
    return {};
  }

  return { message: bodyText };
}

async function executeRequest(path, entityName, options = {}) {
  const requestUrl = buildUrl(path);
  const authHeaders = authToken
    ? {
        Authorization: `Bearer ${authToken}`
      }
    : {};

  let response;

  try {
    response = await fetch(requestUrl, {
      headers: {
        Accept: "application/json",
        ...authHeaders,
        ...options.headers
      },
      ...options
    });
  } catch (error) {
    throw new Error(
      `Cannot reach the API server (${requestUrl}). Check the internet connection and try again.`
    );
  }

  return parseApiResponse(response, entityName);
}

function mapOption(item, idKeys, nameKeys) {
  const id = idKeys
    .map((key) => item?.[key])
    .find((value) => value !== undefined && value !== null && value !== "");
  const name = nameKeys
    .map((key) => item?.[key])
    .find((value) => typeof value === "string" && value.trim());

  return {
    id,
    name: typeof name === "string" ? name.trim() : ""
  };
}

function mapCollection(payload, idKeys, nameKeys) {
  return ensureArray(payload)
    .map((item) => mapOption(item, idKeys, nameKeys))
    .filter((item) => item.id !== undefined && item.id !== null && item.name);
}

export async function fetchDistricts() {
  const payload = await executeRequest(
    API_ENDPOINTS.master.districts,
    "districts"
  );
  return mapCollection(payload, ["districtId", "id", "value"], [
    "districtName",
    "name",
    "label"
  ]);
}

export async function fetchBlocksByDistrict(districtId) {
  const payload = await executeRequest(
    API_ENDPOINTS.master.blocksByDistrict(districtId),
    "blocks"
  );
  return mapCollection(payload, ["blockId", "BlockId", "id", "value"], [
    "blockName",
    "BlockName",
    "name",
    "label"
  ]);
}

export async function fetchGpsByBlock(blockId) {
  const payload = await executeRequest(
    API_ENDPOINTS.master.gpsByBlock(blockId),
    "gram panchayats"
  );
  return mapCollection(payload, ["gpId", "GPId", "id", "value"], [
    "gpName",
    "GPName",
    "name",
    "label"
  ]);
}

export async function fetchVillagesByGp(gpId) {
  const payload = await executeRequest(
    API_ENDPOINTS.master.villagesByGp(gpId),
    "villages"
  );
  return mapCollection(payload, ["villageId", "VillageId", "id", "value"], [
    "villageName",
    "VillageName",
    "name",
    "label"
  ]);
}

export async function fetchCrpTypes() {
  const payload = await executeRequest(API_ENDPOINTS.master.crpTypes, "CRP types");
  return mapCollection(payload, ["crpTypeId", "CRPTypeId", "CrpTypeId", "id", "value"], [
    "crpTypeName",
    "CRPTypeName",
    "CrpTypeName",
    "name",
    "label"
  ]);
}

export async function fetchCategories() {
  const payload = await executeRequest(API_ENDPOINTS.master.categories, "categories");
  return mapCollection(payload, ["categoryId", "CategoryId", "id", "value"], [
    "categoryName",
    "CategoryName",
    "name",
    "label"
  ]);
}

export async function fetchActivities() {
  const payload = await executeRequest(API_ENDPOINTS.master.activities, "activities");

  return ensureArray(payload)
    .map((item, index) => ({
      id:
        item?.activityId ??
        item?.ActivityId ??
        item?.id ??
        item?.Id ??
        index,
      name:
        item?.activityName ??
        item?.ActivityName ??
        item?.name ??
        item?.Name ??
        item?.label ??
        "",
      categoryId:
        item?.categoryId ??
        item?.CategoryId ??
        "",
      categoryName:
        item?.categoryName ??
        item?.CategoryName ??
        ""
    }))
    .filter((item) => item.name);
}

let subCategoryCache = null;

// The server has no working "subcategory by activity" route today (see the
// note next to API_ENDPOINTS.master.subCategoriesAll). GET /api/subcategory
// returns everything with an ActivityId on each row, so we fetch it once,
// cache it for the session, and filter in-memory. This is both faster
// (no repeated network round-trips per activity change) and more accurate
// (no guessed/broken endpoint path).
export async function fetchAllSubCategories() {
  if (subCategoryCache) {
    return subCategoryCache;
  }

  const payload = await executeRequest(
    API_ENDPOINTS.master.subCategoriesAll,
    "sub-categories"
  );

  subCategoryCache = ensureArray(payload)
    .map((item, index) => ({
      id:
        item?.subCategoryId ??
        item?.SubCategoryId ??
        item?.id ??
        item?.Id ??
        index,
      activityId:
        item?.activityId ??
        item?.ActivityId ??
        "",
      name:
        item?.subCategoryName ??
        item?.SubCategoryName ??
        item?.name ??
        item?.Name ??
        item?.label ??
        ""
    }))
    .filter((item) => item.name);

  return subCategoryCache;
}

export async function fetchSubCategoriesByActivity(activityId) {
  const all = await fetchAllSubCategories();
  if (!activityId && activityId !== 0) {
    return all;
  }
  return all.filter((item) => String(item.activityId) === String(activityId));
}

export function clearSubCategoryCache() {
  subCategoryCache = null;
}

export async function fetchRoles() {
  const payload = await executeRequest(API_ENDPOINTS.master.roles, "roles");
  return mapCollection(payload, ["roleId", "RoleId", "id", "value"], [
    "roleName",
    "RoleName",
    "name",
    "label"
  ]);
}

export async function fetchLandTypes() {
  const payload = await executeRequest(API_ENDPOINTS.master.landTypes, "land types");
  return mapCollection(payload, ["landTypeId", "LandTypeId", "id", "value"], [
    "landTypeName",
    "LandTypeName",
    "name",
    "label"
  ]);
}

export async function fetchUnitsOfArea() {
  const payload = await executeRequest(API_ENDPOINTS.master.unitsOfArea, "units of area");
  return mapCollection(payload, ["unitId", "UnitId", "id", "value"], [
    "unitName",
    "UnitName",
    "name",
    "label"
  ]);
}

export async function fetchSeasons() {
  const payload = await executeRequest(API_ENDPOINTS.master.seasons, "seasons");
  return mapCollection(payload, ["seasonId", "SeasonId", "id", "value"], [
    "seasonName",
    "SeasonName",
    "name",
    "label"
  ]);
}

export async function fetchActivityTypeById(activityTypeId) {
  const payload = await executeRequest(
    API_ENDPOINTS.master.activityTypeById(activityTypeId),
    "activity type"
  );
  return mapCollection(payload, ["activityTypeId", "ActivityTypeId", "id", "value"], [
    "activityTypeName",
    "ActivityTypeName",
    "name",
    "label"
  ]);
}

// This is the real "Type of Activity" (Seasonal/Perennial) master list -
// confirmed live. fetchActivityTypeById above hits a different endpoint
// that turned out to be an ActivityProfile detail lookup, not this list.
export async function fetchActivityTypes() {
  const payload = await executeRequest(API_ENDPOINTS.master.activityTypes, "activity types");
  return mapCollection(payload, ["activityTypeId", "ActivityTypeId", "id", "value"], [
    "activityTypeName",
    "ActivityTypeName",
    "name",
    "label"
  ]);
}

export async function fetchCrpAttendanceById(crpRegistrationId) {
  const payload = await executeRequest(
    API_ENDPOINTS.attendance.byId(crpRegistrationId),
    "CRP attendance"
  );
  return ensureArray(payload);
}

export async function fetchAllCrps() {
  const payload = await executeRequest(API_ENDPOINTS.auth.allCrps, "CRP list");

  return ensureArray(payload)
    .map((item) => ({
      ...item,
      id:
        item?.id ??
        item?.crpRegistrationId ??
        item?.CrpRegistrationId ??
        item?.crpId,
      crpRegistrationId:
        item?.crpRegistrationId ??
        item?.CrpRegistrationId ??
        item?.id ??
        item?.Id ??
        "",
      crpId: item?.crpId ?? item?.CRPId ?? item?.masterId ?? item?.MasterId ?? "",
      fullName: item?.fullName ?? item?.FullName ?? item?.name ?? "",
      aadhaarNo: item?.aadhaarNo ?? item?.AadhaarNo ?? item?.uid ?? "",
      contactNo: item?.contactNo ?? item?.ContactNo ?? item?.mobileNo ?? "",
      districtId: item?.districtId ?? item?.DistrictId ?? "",
      districtName:
        item?.districtName ?? item?.DistrictName ?? item?.district ?? "",
      blockId: item?.blockId ?? item?.BlockId ?? "",
      blockName:
        item?.blockName ?? item?.BlockName ?? item?.block ?? "",
      gpId: item?.gpId ?? item?.GPId ?? "",
      gpName:
        item?.gpName ?? item?.GPName ?? item?.gpVcName ?? "",
      villageId: item?.villageId ?? item?.VillageId ?? "",
      villageName:
        item?.villageName ?? item?.VillageName ?? item?.village ?? "",
      name: item?.fullName || item?.FullName || item?.name || item?.crpId || ""
    }))
    .filter((item) => item.id !== undefined && item.id !== null && item.id !== "");
}

export async function fetchShgMembersByVillage(villageId) {
  const payload = await executeRequest(
    API_ENDPOINTS.master.shgMembersByVillage(villageId),
    "SHG members"
  );

  return ensureArray(payload)
    .map((item, index) => ({
      ...item,
      id:
        item?.id ??
        item?.memberId ??
        item?.MemberId ??
        item?.shgMemberId ??
        item?.SHGMemberId ??
        `${item?.shgName || item?.SHGName || "SHG"}-${item?.memberName || item?.name || index}`,
      shgCode:
        item?.shgCode ||
        item?.SHGCode ||
        "",
      shgName:
        item?.shgName ||
        item?.SHGName ||
        item?.shg ||
        item?.groupName ||
        "",
      memberName:
        item?.memberName ||
        item?.MemberName ||
        item?.name ||
        item?.fullName ||
        "",
      mobileNo:
        item?.mobileNo ||
        item?.MobileNo ||
        ""
    }))
    .filter((item) => item.shgName && item.memberName);
}

export async function submitCrpSignup(payload) {
  return executeRequest(API_ENDPOINTS.auth.crpSignup, "CRP signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function loginUser(payload) {
  return executeRequest(API_ENDPOINTS.auth.login, "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function submitLivelihoodAssignment(formData) {
  return executeRequest(API_ENDPOINTS.livelihood.create, "livelihood assignment", {
    method: "POST",
    body: formData
  });
}

async function executeJsonRequest(path, entityName, payload, method = "POST") {
  return executeRequest(path, entityName, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function submitShgTracking(payload) {
  return executeJsonRequest(API_ENDPOINTS.livelihood.shgTracking, "SHG tracking", payload);
}

// CONFIRMED via live Swagger on trlm.pickitover.com: /api/shg-tracking/save's
// real request body is multipart/form-data with binary Image/Video file
// fields (TrackingId, SHGMemberId, SHGName, CRPRegistrationId, Latitude,
// Longitude, Image, Video, Remarks) - not the JSON imagePath/videoPath
// string shape submitShgTracking() above sends. That JSON shape is why
// saved records always came back with null image/video paths: the server
// never actually accepts file data through it. Use this for any save that
// includes an image or video.
export async function submitShgTrackingMultipart(formData) {
  return executeRequest(API_ENDPOINTS.livelihood.shgTracking, "SHG tracking", {
    method: "POST",
    body: formData
  });
}

export async function submitShgTrackingUploadImage(payload) {
  return executeJsonRequest(
    API_ENDPOINTS.livelihood.shgTrackingUploadImage,
    "SHG tracking image",
    payload
  );
}

export async function submitShgTrackingGeo(payload) {
  return executeJsonRequest(API_ENDPOINTS.livelihood.shgTrackingGeo, "SHG tracking geo", payload);
}

export async function fetchShgTrackingSupport(shgMemberId) {
  return executeRequest(
    API_ENDPOINTS.livelihood.shgTrackingGetSupport(shgMemberId),
    "SHG support history"
  );
}

export async function submitShgTrackingCreate(payload) {
  return executeJsonRequest(API_ENDPOINTS.livelihood.shgTrackingCreate, "SHG tracking create", payload);
}

export async function submitShgTrackingUploadVideo(payload) {
  return executeJsonRequest(
    API_ENDPOINTS.livelihood.shgTrackingUploadVideo,
    "SHG tracking video",
    payload
  );
}

export async function submitTradeSave(payload) {
  return executeJsonRequest(API_ENDPOINTS.trade.save, "trade", payload);
}

export async function fetchTradeOptions() {
  const payload = await executeRequest(API_ENDPOINTS.trade.getAll, "trade options");
  return mapCollection(payload, ["tradeId", "TradeId", "id", "value"], [
    "tradeName",
    "TradeName",
    "name",
    "label"
  ]);
}

export async function fetchTrainingAgencyOptions() {
  const payload = await executeRequest(API_ENDPOINTS.trainingAgency.getAll, "training agency options");
  return mapCollection(payload, ["trainingAgencyId", "TrainingAgencyId", "agencyId", "AgencyId", "id", "value"], [
    "trainingAgencyName",
    "TrainingAgencyName",
    "agencyName",
    "AgencyName",
    "name",
    "label"
  ]);
}

export async function fetchProductionMaster() {
  const payload = await executeRequest(
    API_ENDPOINTS.productionMaster.getAll,
    "production master"
  );
  return mapCollection(payload, ["productionId", "ProductionId", "id", "value"], [
    "productionName",
    "ProductionName",
    "name",
    "label"
  ]);
}

// CONFIRMED live via GET /api/member-activity/get-all: returns
// [{"ActivityId":1,"ActivityName":"Paddy Cultivation",...}, ...] - the same
// six values ("Activity of the Member" on the Financial Support form) that
// were previously hardcoded in SUPPORT_ACTIVITY_OPTIONS.
export async function fetchMemberActivities() {
  const payload = await executeRequest(
    API_ENDPOINTS.memberActivity.getAll,
    "member activity"
  );
  return mapCollection(payload, ["activityId", "ActivityId", "id", "value"], [
    "activityName",
    "ActivityName",
    "name",
    "label"
  ]);
}

// Used when the CRP types a production name that isn't in the master list
// yet - creates it server-side so we get back a real productionId instead
// of submitting 0 (which is what was silently happening before, and part
// of why /activity-profile/save was rejecting the request).
//
// CONFIRMED via live swagger.json (trlm.pickitover.com/api/swagger/v1/swagger.json):
// this endpoint takes `id` and `name` as query-string parameters, not a JSON
// body - same shape as submitTrainingAgency() below. Sending {ProductionName}
// as a JSON body (the old code) always hit "The name field is required" (400)
// because the server never looks at the body at all.
//
// NOTE: even called correctly, this endpoint currently 500s server-side on
// trlm.pickitover.com - `{"detail":"@ActivityTypeId is not a parameter for
// procedure sp_ProductionMaster_CRUD."}` - for every request, including the
// bare minimum id=0/name=X. That's a backend stored-procedure bug (confirmed
// via direct curl against the live API), not a client payload problem -
// needs the backend team to fix sp_ProductionMaster_CRUD before "add new
// production" can work at all.
export async function submitProductionMaster({ id = 0, name = "" }) {
  const query = new URLSearchParams({
    id: String(Number(id) || 0),
    name: String(name || "")
  });

  return executeRequest(
    `${API_ENDPOINTS.productionMaster.save}?${query.toString()}`,
    "production master",
    {
      method: "POST"
    }
  );
}

// UNVERIFIED: exact request shape for /api/financial-support/loan-projectio
// was never supplied and the GET form of this path returns 404 (see the
// note next to API_ENDPOINTS.financialSupport.loanProjection). Wired here
// as a POST so it's ready the moment the real path/verb is confirmed -
// don't rely on this until you've checked it against a live response.
export async function fetchLoanProjection(payload) {
  return executeJsonRequest(API_ENDPOINTS.financialSupport.loanProjection, "loan projection", payload);
}

export async function submitActivityProfile(payload) {
  return executeJsonRequest(API_ENDPOINTS.activityProfile.save, "activity profile", payload);
}

export async function submitCrpAttendanceCheckIn(payload) {
  return executeJsonRequest(API_ENDPOINTS.attendance.checkIn, "CRP attendance check-in", payload);
}

// CONFIRMED via live Swagger test on trlm.pickitover.com: POST
// /api/crp-attendance/checkout takes {attendanceId, crpRegistrationId,
// livelihoodId, latitude, longitude} and returns {"Message": "Check-Out
// Successful"}. attendanceId is the id returned by the check-in call for
// today's session - the caller is responsible for having captured it from
// submitCrpAttendanceCheckIn's response.
export async function submitCrpAttendanceCheckout(payload) {
  return executeJsonRequest(API_ENDPOINTS.attendance.checkOut, "CRP attendance check-out", payload);
}

export async function submitFinancialSupport(payload, mode = "insert") {
  const endpoint =
    mode === "update"
      ? API_ENDPOINTS.financialSupport.update
      : API_ENDPOINTS.financialSupport.insert;

  return executeJsonRequest(endpoint, "financial support", payload, mode === "update" ? "PUT" : "POST");
}

export async function submitIncomeProfile(payload) {
  return executeJsonRequest(API_ENDPOINTS.incomeProfile.save, "income profile", payload);
}

export async function submitInvestmentProfile(payload) {
  return executeJsonRequest(API_ENDPOINTS.investmentProfile.insert, "investment profile", payload);
}

export async function submitTechnicalSupport(payload) {
  return executeJsonRequest(API_ENDPOINTS.technicalSupport.save, "technical support", payload);
}

export async function submitTrainingAgency({ id = 0, name = "" }) {
  const query = new URLSearchParams({
    id: String(Number(id) || 0),
    name: String(name || "")
  });

  return executeRequest(
    `${API_ENDPOINTS.trainingAgency.save}?${query.toString()}`,
    "training agency",
    {
      method: "POST"
    }
  );
}

export async function submitShgTrackingLegacyMultipart(formData) {
  return executeRequest(API_ENDPOINTS.livelihood.create, "SHG tracking", {
    method: "POST",
    body: formData
  });
}

export function setAuthToken(token) {
  authToken = String(token || "").trim();
}

export function clearAuthToken() {
  authToken = "";
}

// The login API (POST /api/auth/crp/login) returns only { token }. Every
// other field the app previously guessed at (role, user id, block) is
// actually inside that JWT's claims. Decoding it directly is both faster
// (skips an extra fetchAllCrps() round-trip used as a fallback) and more
// accurate (reads the server's own claim instead of pattern-matching the
// CRP ID string). This is a plain base64url JSON decode - no signature
// verification (that's the server's job; the app only needs the claims).
const MS_CLAIM_ROLE =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export function decodeJwtToken(token) {
  if (typeof token !== "string" || !token.trim()) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64Payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64Payload.padEnd(
      base64Payload.length + ((4 - (base64Payload.length % 4)) % 4),
      "="
    );
    const decoded =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8");
    const claims = JSON.parse(decoded);

    return {
      userId: claims?.UserId ?? claims?.userId ?? "",
      role: claims?.[MS_CLAIM_ROLE] ?? claims?.role ?? claims?.Role ?? "",
      district: claims?.District ?? claims?.district ?? "",
      block: claims?.Block ?? claims?.block ?? "",
      expiresAt: typeof claims?.exp === "number" ? claims.exp : null,
      raw: claims
    };
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const claims = decodeJwtToken(token);
  if (!claims || !claims.expiresAt) {
    // Can't verify -> don't block the user over a decode failure.
    return false;
  }
  return Date.now() >= claims.expiresAt * 1000;
}