import router from "./index";
import { clearPending } from "@/services/pending";
import { SetDocumentTitle } from "@/common";

router.beforeEach((to, from, next) => {
  SetDocumentTitle(to.meta.title);
  clearPending();
  next();
});
