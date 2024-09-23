// https://github.com/chatanywhere/GPT_API_free?tab=readme-ov-file#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8
// https://api.chatanywhere.org/v1/oauth/free/github/callback?code=2e9979ab6cedf931dece&state=b98fe5899848fd31cfb9079a08f98af7
// https://api.chatanywhere.tech/#/

// 所有可用模型查询
// https://chatanywhere.apifox.cn/api-92222074
import { getSystemPrompt } from "@/utils/app";
const url = 'https://api.chatanywhere.tech/v1/chat/completions';

export default function (apikey: string, userMessage: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apikey}`, // 替换成你的 API key
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
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

        fetch(url, options)
            .then(response => response.json())  // 处理 JSON 响应
            .then(result => {
                if (result.choices && result.choices[0].message) {
                    resolve(result.choices[0].message.content);  // 返回结果
                } else {
                    reject("接口获取信息错误，请排查：moonshot api");
                }
            })
            .catch(error => reject(error));  // 捕获错误
    });
}
