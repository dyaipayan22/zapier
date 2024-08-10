import { useEffect } from "react";
import { axiosPrivate } from "@/lib/axios";
import { useRefreshToken } from "./useRefreshToken";
import { useAuthStore } from "@/store/authStore";

export const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization && token !== null) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.request.eject(responseIntercept);
    };
  }, [token, refresh]);

  return axiosPrivate;
};
