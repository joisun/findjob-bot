const url = 'https://api.cohere.com/v1/chat';

export default function (apikey: string, message: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apikey}`, // 替换成你的 API key
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                model: "command-r-plus",
                preamble: "Please analyze the user's provided resume information and job description to assess how well the user matches the job. Consider key job-related factors such as job title, required skill set, education, years of experience, age, and any other relevant details. Based on the analysis, write a polite and conversational job application greeting, aiming to secure an interview or job opportunity. Be sure to use professional yet friendly language."
            }),
        };

        fetch(url, options)
            .then(response => response.json())  // 处理 JSON 响应
            .then(result => {
                if(result.chat_history[1].message){
                    resolve(result.chat_history[1].message)   // 返回结果
                }else{
                    reject("接口获取信息错误，请排查：cohere api")
                }
            })
            .catch(error => reject(error));     // 捕获错误
    });
}
