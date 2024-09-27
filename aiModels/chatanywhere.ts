// https://github.com/chatanywhere/GPT_API_free?tab=readme-ov-file#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8
// https://api.chatanywhere.org/v1/oauth/free/github/callback?code=2e9979ab6cedf931dece&state=b98fe5899848fd31cfb9079a08f98af7
// https://api.chatanywhere.tech/#/

// 所有可用模型查询
// https://chatanywhere.apifox.cn/api-92222074
import { AgentsType } from "@/typings/aiModelAdaptor";
import { API_ERROR_TYPE, RequestFn } from "@/typings/app";
import { getSystemPrompt } from "@/utils/app";
import { AiApiBasic } from ".";


const chatanywhereAPI: RequestFn = function ({ apikey, apiUrl, model, userMessage, maxTokens }) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apikey}`, // 替换成你的 API key
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                max_tokens: maxTokens,
                messages: [
                    {
                        role: "system",
                        content: getSystemPrompt()
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                temperature: 0.3
            })
        };

        fetch(apiUrl, options)
            .then(response => response.json())  // 处理 JSON 响应
            .then(result => {
                if (result.choices && result.choices[0].message) {
                    resolve(result.choices[0].message.content);  // 返回结果
                } else {
                    log(`${AgentsType.ChatAnywhere} API failed for model ${model}: \n ${result.error.message }`, 'error');
                    throw new APIException(result?.error?.message || `${AgentsType.ChatAnywhere} API failed for model ${model}: \n ${result}`, API_ERROR_TYPE.APIError);
                }
            })
            .catch(error => reject({
                message: error.message,
                type: API_ERROR_TYPE.APINETEXCEPTION
            }));  // 捕获错误
    });
}


export class chatanywhereAIService extends AiApiBasic {
    constructor(modelList: string[]) {
        const apiUrl = 'https://api.chatanywhere.tech/v1/chat/completions'
        super(AgentsType.ChatAnywhere, apiUrl, modelList, chatanywhereAPI)
    }
}
