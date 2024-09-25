export type LoggerType = 'info' | 'warn' | 'error' | 'success'

export enum API_ERROR_TYPE {
    "APIError" = "APIError",
    "APINETEXCEPTION" = "APINETEXCEPTION"
}
export type API_ERROR = {
    message: string,
    type: API_ERROR_TYPE
}


// 定义 API 参数接口
export type APIParams = {
    apikey: string;
    apiUrl: string;
    model: string;
    userMessage: string;
}
// 定义函数类型接口
export interface RequestFn {
    (params: APIParams): Promise<string>;
}