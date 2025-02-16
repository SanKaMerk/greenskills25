import { AxiosResponse } from "axios";

export type TResponse<T> = Promise<AxiosResponse<T>>;
