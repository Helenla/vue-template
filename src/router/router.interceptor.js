import router from "./index";
import { clearPending } from "@/services/pending";
import { SetDocumentTitle } from "@/common/index";

router.beforeEach((to, from, next) => {
  SetDocumentTitle(to.meta.title);
  clearPending();
  next();
});
