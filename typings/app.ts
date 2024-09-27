export type LoggerType = 'info' | 'warn' | 'error' | 'success'

export enum API_ERROR_TYPE {
    "APIError" = "APIError",
    "APINETEXCEPTION" = "APINETEXCEPTION"
}
export type API_ERROR = {
    message: string,
    type: API_ERROR_TYPE
}



/**
 * 定义 API 参数接口
 * apikey: api 提供方申请的 key;
 * apiUrl: api 请求地址;
 * model: 使用的ai模型;
 * userMessage: 发送的消息;
 * maxTokens: 最长回复字符限制;
 */
export type APIParams = {
    apikey: string;
    apiUrl: string;
    model: string;
    userMessage: string;
    maxTokens: number;
}
// 定义函数类型接口
export interface RequestFn {
    (params: APIParams): Promise<string>;
}