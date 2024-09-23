


export async function chatComplete(message: string) {
    return browser.runtime.sendMessage({ type: "chatCompletion", data: message });
}


// 定义 AI 接口的统一结构
export interface AIModelInterface {
    chatCompletion(input: string): Promise<string>;
}

