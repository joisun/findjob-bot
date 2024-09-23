import { log } from "@/utils/app";


export async function chatComplete(message: string) {
    return browser.runtime.sendMessage({ type: "chatCompletion", data: message });
}


// 定义 AI 接口的统一结构
export interface AIModelInterface {
    /**API 的 名字 */
    name: string
    /**API 的 APIKey */
    apikey: string
    /**API 的 URL 请求地址 */
    apiUrl: string
    /**API 所应用的模型列表 */
    modelList: string[]
    chatCompletion(input: string): Promise<string>;
}


/**
 * AI 接口调度器, 自动化尝试调用各个 AI 服务, 包括所有 AI 接口提供的不同模型
 */
export class AiApiAdaptor {
    services: AIModelInterface[]
    constructor(services: AIModelInterface[]) {
        this.services = services
    }

    async chat(input: string): Promise<string> {
        for (const service of this.services) {
            try {
                // 依次尝试调用各个服务
                const response = await service.chatCompletion(input);
                return response;
            } catch (error) {
                log(`${service.name} API failed for all model.`, 'error');
                continue;  // 尝试下一个服务
            }
        }
        throw new Error("All AI services failed");
    }
}