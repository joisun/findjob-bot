const url = 'https://spark-api-open.xf-yun.com/v1/chat/completions';


export default function (apikey: string, message: string) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apikey}`, // 替换成你的 token
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // https://www.xfyun.cn/doc/spark/HTTP%E8%B0%83%E7%94%A8%E6%96%87%E6%A1%A3.html#_3-%E8%AF%B7%E6%B1%82%E8%AF%B4%E6%98%8E
                // 不要用 spark-lite(general), 纯属智障！！

                model: 'generalv3.5',
                messages: [
                    {
                        role: 'user',
                        content: message,
                    },
                ],
                stream: false,
            }),
        };
        fetch(url, options)
            .then(response => response.json())  // 这里根据实际情况决定是 `.text()` 还是 `.json()`
            .then(result => resolve(result.choices[0]?.message?.content))
            .catch(error => reject(error));
    })
}
