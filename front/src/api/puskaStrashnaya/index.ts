import { ApiCommon } from "../Common";
import { TResponse } from "../Common/types";
import {
  TPostGenerateRequestData,
  TPostGenerateResponse,
  TPresentation
} from "./types";

export class PuskaStrashnayaApiClass extends ApiCommon {
  public postGenerate = <T = TPostGenerateResponse>(
    data: TPostGenerateRequestData
  ): TResponse<T> => {
    const path = "/api/v1/presentation/generate";
    return this.post<T, TPostGenerateRequestData>(path, data);
  };

  public getPresentations = <
    T = { id: string; name: string }[]
  >(): TResponse<T> => {
    const path = "/api/v1/presentation/all";
    return this.get<T>(path);
  };

  public deletePresentation = <T = null>(id: string): TResponse<T> => {
    const path = `/api/v1/presentation?presentation_id=${id}`;
    return this.delete<T>(path);
  };

  public getPresentation = <T = TPresentation>(id: string): TResponse<T> => {
    const path = `/api/v1/presentation?presentation_id=${id}`;
    return this.get<T>(path);
  };

  public putPresentation = <T = null>(data: TPresentation): TResponse<T> => {
    const path = "/api/v1/presentation";
    return this.put<T, TPresentation>(path, data);
  };

  public login = <T = { access_token: string }>(data: {
    username: string;
    password: string;
  }): TResponse<T> => {
    const path = "/api/v1/auth_v2/login";
    return this.post<
      T,
      {
        username: string;
        password: string;
      }
    >(path, data);
  };
}

export const puskaStrashnayaApi = new PuskaStrashnayaApiClass();
