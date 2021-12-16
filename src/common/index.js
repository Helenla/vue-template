/**
 * 全局通用的方法
 */

/**
 * 设置页面标题
 * @param name 页面标题
 */
export function SetDocumentTitle(name) {
  console.log("设置标题：", name);
  name && (document.title = name);
}
