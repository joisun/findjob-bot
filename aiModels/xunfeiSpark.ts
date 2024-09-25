import { AgentsType } from "@/typings/aiModelAdaptor";
import { AiApiBasic, AIModelInterface } from ".";
import { RequestFn } from "@/typings/app";
// https://www.xfyun.cn/doc/spark/HTTP%E8%B0%83%E7%94%A8%E6%96%87%E6%A1%A3.html#_3-%E8%AF%B7%E6%B1%82%E8%AF%B4%E6%98%8E
// 不要用 spark-lite(general), 纯属智障！！


const xunfeiSparkAPI: RequestFn = function ({ apikey, apiUrl, model, userMessage }) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apikey}`, // 替换成你的 token
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "system",
                        content: getSystemPrompt()
                    },
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
                stream: false,
            }),
        };
        fetch(apiUrl, options)
            .then(response => response.json())  // 这里根据实际情况决定是 `.text()` 还是 `.json()`
            .then(result => resolve(result.choices[0]?.message?.content as string))
            .catch(error => reject(error));
    })
}



// export class xunfeiSparkAPIAIService implements AIModelInterface {
//     name = AgentsType.XunFeiSpark
//     apikey
//     apiUrl = 'https://spark-api-open.xf-yun.com/v1/chat/completions'
//     modelList = ['generalv3']

//     /**
//      * AI 服务 chatanywhereAIService
//      * @param apiKey 
//      * @param modelList 支持的模型列表, 默认使用第一个, 失败后往后依次尝试
//      */
//     constructor(apiKey: string, modelList: string[]) {
//         this.apikey = apiKey;
//         this.modelList = modelList;
//     }
//     // AI 服务应该在自己内部尝试多轮 模型尝试,直到全部失败才抛出错误
//     async chatCompletion(input: string): Promise<string> {
//         if (!this.apikey) {
//             throw new Error(`AI API: ${this.name} 未设置apikey，请在setting中设置`);
//         }

//         for (const model of this.modelList) {
//             try {
//                 // 依次尝试调用各个服务
//                 const response = await xunfeiSparkAPI(this.apikey, this.apiUrl, model, input);
//                 return Promise.resolve(response);
//             } catch (error) {
//                 log(`ChatAnywhere API failed for model ${model}: \n ${error}`, 'error');
//                 continue;  // 尝试下一个model
//             }
//         }
//         // 如果所有模型的请求都失败了,那么就会抛出错误
//         throw new Error("All AI services failed");
//     }
// }


export class xunfeiSparkAPIAIService extends AiApiBasic {
    constructor(apiKey: string, modelList: string[]) {
        const apiUrl = 'https://spark-api-open.xf-yun.com/v1/chat/completions'
        super(AgentsType.XunFeiSpark, apiUrl, apiKey, modelList, xunfeiSparkAPI)
    }
}