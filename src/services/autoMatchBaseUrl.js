import { HOME_PREFIX } from "@/constant";

export default function autoMatchBaseUrl(prefix) {
  let baseUrl = "";
  switch (prefix) {
    case HOME_PREFIX:
      baseUrl = "/test-api" + prefix;
      break;

    default:
      baseUrl = "/default-api" + prefix;
      break;
  }

  return baseUrl;
}
