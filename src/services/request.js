import Qs from "qs";
import axios from "axios";
import { timeout } from "@/constant";
import { Toast } from "vant";
import { IMethod } from "@/interface";
import { addPending, removePending } from "@/services/pending";

// 处理请求返回数据格式
function handleSuccess(response) {
  const prefix = response.config.prefix;
  const res = response.data;
  const prefixDataMap = {
    HOME_PREFIX() {
      const errorNo = res.code;
      if (errorNo === "0") {
        return res.data;
      } else if (errorNo === "20") {
        Toast.clear();
        return Promise.reject("接口超时");
      } else {
        Toast(res.data.errorInfo);
        return Promise.reject(res.data.errorInfo);
      }
    },
    MALL_PREFIX() {
      const errorNo = res.code;
      if (errorNo === "0") {
        return res.data;
      } else if (errorNo === "20") {
        Toast.clear();
        return Promise.reject("接口超时");
      } else {
        Toast(res.data.errorInfo);
        return Promise.reject(res.data.errorInfo);
      }
    }
  };
  return prefixDataMap[prefix]();
}

// 核对http码
function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response) {
    // -1000 自己定义，连接错误的status
    const status = response.status || -1000;

    if ((status >= 200 && status < 300) || status === 304) {
      // 如果不需要除了data之外的数据，可以直接 return response.data
      return handleSuccess(response);
    } else {
      let errorInfo = "";
      switch (status) {
        case -1:
          errorInfo = "远程服务响应失败,请稍后重试";
          break;
        case 400:
          errorInfo = "400: 错误请求";
          break;
        case 401:
          errorInfo = "401: 访问令牌无效或已过期";
          break;
        case 403:
          errorInfo = "403: 拒绝访问";
          break;
        case 404:
          errorInfo = "404：资源不存在";
          break;
        case 405:
          errorInfo = "405: 请求方法未允许";
          break;
        case 408:
          errorInfo = "408: 请求超时";
          break;
        case 500:
          errorInfo = "500：访问服务失败";
          break;
        case 501:
          errorInfo = "501：未实现";
          break;
        case 502:
          errorInfo = "502：无效网关";
          break;
        case 503:
          errorInfo = "503: 服务不可用";
          break;
        default:
          errorInfo = `连接错误${status}`;
      }
      return {
        status,
        msg: errorInfo
      };
    }
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: "网络异常"
  };
}

/**
 * 全局请求扩展配置
 * 添加一个请求拦截器 （于transformRequest之前处理）
 */
const axiosConfig = {
  success: config => {
    // 在请求开始前，对之前的请求做检查取消操作
    removePending(config);
    // 将当前请求添加到 pending 中
    addPending(config);
    return config;
  },
  error: error => Promise.reject(error)
};

/**
 * 全局请求响应处理
 * 添加一个返回拦截器 （于transformResponse之后处理）
 * 返回的数据类型默认是json，若是其他类型（text）就会出现问题，因此用try,catch捕获异常
 */
const axiosResponse = {
  success: response => {
    // 在请求结束后，移除本次请求
    removePending(response);
    return checkStatus(response);
  },
  error: error => {
    const { response } = error;
    if (axios.isCancel(error)) {
      console.log("repeated request: " + error.message);
    } else {
      // handle error code
    }
    if (response) {
      // 请求已发出，但是不在2xx的范围
      // 对返回的错误进行一些处理
      return Promise.reject(checkStatus(response));
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      console.error("断网了~");
    }
  }
};

axios.interceptors.request.use(axiosConfig.success, axiosConfig.error);
axios.interceptors.response.use(axiosResponse.success, axiosResponse.error);

/**
 * 基于axios ajax请求
 * @param url
 * @param method
 * @param data
 * @param headers
 * @param dataType
 * @returns {Promise.<T>}
 */
export default function request({
  url,
  method,
  data,
  prefix = "HOME_PREFIX",
  headers = {}
}: IMethod) {
  headers = Object.assign(
    method === "get"
      ? {
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8"
        }
      : {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
    headers
  );

  const contentType = headers["Content-Type"];

  const defaultConfig: IMethod = {
    url,
    method: method || "post",
    timeout,
    params: data,
    data,
    prefix,
    headers,
    responseType: "json"
  };

  if (method === "get") {
    delete defaultConfig.data;
    // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
    if (data !== undefined) {
      defaultConfig.params = Object.assign(defaultConfig.params, {
        _t: new Date().getTime()
      });
    } else {
      defaultConfig.params = { _t: new Date().getTime() };
    }
  } else {
    delete defaultConfig.params;
  }

  if (typeof contentType !== "undefined") {
    if (contentType.indexOf("multipart") !== -1) {
      // 类型 `multipart/form-data;`
      // defaultConfig.data = defaultConfig.data;
    } else if (contentType.indexOf("json") !== -1) {
      // 类型 `application/json`
      // 服务器收到的raw body(原始数据) "{name:"jhon",sex:"man"}"（普通字符串）
      defaultConfig.data = JSON.stringify(defaultConfig.data);
    } else {
      // 类型 `application/x-www-form-urlencoded`
      // 服务器收到的raw body(原始数据) name=homeway&key=nokey
      defaultConfig.data = Qs.stringify(defaultConfig.data);
    }
  }

  return axios(defaultConfig);
}
