import Api from "./request";

/**
 * @param data 入参
 * @returns promise
 */

export function getSysParam(data = {}) {
  return Api({
    url: "/shop/getSysParam",
    data,
  });
}

export function getFirstLvGroup(data = {}) {
  return Api({
    url: "/shop/getFirstLvGroup",
    data,
    prefix: "MALL_PREFIX",
  });
}
