// https://github.com/popjane/free_chatgpt_api?tab=readme-ov-file#%E5%B8%B8%E7%94%A8%E5%BA%94%E7%94%A8%E6%94%AF%E6%8C%81
// https://free.gpt.ge/oauth/github?code=3f4467d10832da7ecfb9&state=qe9EjGNmTrlf

const url = 'https://free.gpt.ge/v1';

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
                model: "gpt-3.5-turbo",
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
