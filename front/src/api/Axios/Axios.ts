// eslint-disable-next-line import/no-named-as-default
import Axios, { AxiosInstance } from "axios";
import NProgress from "nprogress";
import { getToken } from "src/helpers";

export const TOKEN_TYPE = "Bearer";

export class AxiosService {
  public axios: AxiosInstance;
  private numberOfAjaxCAllPending = 0;

  constructor() {
    this.axios = Axios.create({
      validateStatus: (status) => status >= 200 && status < 400,
      timeout: 3000000
    });

    this.axios.interceptors.request.use((config) => {
      const token = getToken();
      if (token && config.url !== "/auth/sign-in") {
        config.headers["Authorization"] = `${TOKEN_TYPE} ${token}`;
      }
      config.headers["Accept"] = "application/json";
      config.headers["Content-Type"] = "application/json";

      this.numberOfAjaxCAllPending++;
      NProgress.start();
      return config;
    });

    this.axios.interceptors.response.use(
      (response) => {
        this.numberOfAjaxCAllPending--;

        if (this.numberOfAjaxCAllPending === 0) {
          NProgress.done(true);
        }

        return response;
      },
      async (error) => {
        this.numberOfAjaxCAllPending--;

        if (this.numberOfAjaxCAllPending === 0) {
          NProgress.done(true);
        }

        return Promise.reject(error);
      }
    );
  }
}
