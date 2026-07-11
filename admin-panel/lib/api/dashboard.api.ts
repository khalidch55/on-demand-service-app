import { getRequest } from "@/utils/helpers/common/http-methods";

export const DashboardApis = {
  getDashboard: (skipLoader = false) =>
    getRequest("/admin/dashboard", {}, { skipGlobalLoader: skipLoader }),
};
