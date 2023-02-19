export type ApiResponse<T> = {
  errorMessage?: string;
  responseCode: "200" | "201" | "400" | "401" | "404" | "500";
  data?: T;
};
