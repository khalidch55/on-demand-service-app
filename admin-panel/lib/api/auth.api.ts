import { postRequest } from "@/utils/helpers/common/http-methods";

export const AuthApis = {
  login: (email: string, password: string) =>
    postRequest("/admin/login", { email, password }),
  logout: () => postRequest("/auth/logout", {}),
};
