/**
 * @public debounce防抖 throttle节流
 * @param fn [function] 需要防抖的函数
 * @param delay [number] 毫秒，防抖期限值
 */
// export function debounce(fn, delay) {
//   let timer: any = null;
//   return function() {
//     if (timer) {
//       clearInterval(timer);
//     }
//     timer = setTimeout(fn, delay);
//   };
// }
// export function throttle(fn, delay) {
//   let vaild = true;
//   return function() {
//     if (!vaild) {
//       return false;
//     }
//     vaild = false;
//     setTimeout(() => {
//       fn();
//       vaild = true;
//     }, delay);
//   };
// }
