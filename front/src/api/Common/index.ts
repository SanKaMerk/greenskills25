import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { AxiosService } from "../Axios";

export class ApiCommon {
  axios: AxiosInstance;

  constructor() {
    this.axios = new AxiosService().axios;
  }

  readonly get = <T>(
    path: string,
    params?: Record<string, string | boolean | number | string[]>
  ): Promise<AxiosResponse<T>> => this.axios.get<T>(path, { params });

  readonly post = <T, D>(
    path: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => this.axios.post<T>(path, data, config);

  readonly put = <T, D>(
    path: string,
    data: D,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => this.axios.put<T>(path, data, config);

  readonly delete = <T>(
    path: string,
    params?: Record<string, string | boolean | number | string[]>
  ): Promise<AxiosResponse<T>> => this.axios.delete<T>(path, { params });
}

export const api = new ApiCommon();
