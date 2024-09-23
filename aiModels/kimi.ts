// import OpenAI from "openai"


// export default function (message: string): Promise<string> {
//     const client = new OpenAI({
//         apiKey: "sk-PT9aRZnfqpilMASfDj5HsePrYp5WfTakY4wQtwqpODKaSwUy", // 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
//         baseURL: "https://api.moonshot.cn/v1",
//     })


//     // return chatCompletion.data.choices[0].message.content
//     return new Promise(async (resolve, reject) => {
//         const chatCompletion: OpenAI.Chat.ChatCompletion = await client.chat.completions.create({
//             model: "moonshot-v1-8k",
//             messages: [
//                 { "role": "system", "content": "Please analyze the user's provided resume information and job description to assess how well the user matches the job. Consider key job-related factors such as job title, required skill set, education, years of experience, age, and any other relevant details. Based on the analysis, write a polite and conversational job application greeting, aiming to secure an interview or job opportunity. Be sure to use professional yet friendly language." },
//                 { "role": "user", "content": message }
//             ],
//             temperature: 0.3,
//         })
//         try {
//             const content = chatCompletion.choices[0].message.content
//             if (content) {
//                 resolve(content)
//             } else {
//                 reject('kimi 返回内容为null')
//             }

//         } catch (err) {
//             reject(err)
//         }


//     });
// }

// https://platform.moonshot.cn/console/limits
// RPM 3，每分钟 3 次请求数， 不够用啊 阿 sir

const url = 'https://api.moonshot.cn/v1/chat/completions';

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
                model: "moonshot-v1-8k",
                messages: [
                    {
                        role: "system",
                        content: "Please analyze the user's provided resume information and job description to assess how well the user matches the job. Consider key job-related factors such as job title, required skill set, education, years of experience, age, and any other relevant details. Based on the analysis, write a polite and conversational job application greeting, aiming to secure an interview or job opportunity. Be sure to use professional yet friendly language."
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
