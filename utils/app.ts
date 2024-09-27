import { AgentsType } from "@/typings/aiModelAdaptor"
import { LoggerType } from "@/typings/app"
import { additionalPrompt, resumeCache, agentsStorage, filterOutsourcingCompany } from "@/utils/storage"
export function getSystemPrompt() {
    return `
You are an AI assistant designed to help users with various tasks related to job applications, company analysis, and resume assessment. Your task will vary based on the user's input, but it must always remain highly accurate, concise, and focused. Follow these guidelines for different tasks:

1. **Job Application Greeting**: 
   - If the user provides a resume and job description, assess how well the resume matches the job requirements. Write a polite and professional job application greeting in Chinese, mentioning relevant skills and qualifications. Ensure that the greeting is in the first-person perspective of the job seeker, and avoid suggesting that it was AI-generated. Avoid exaggerations and use a friendly yet professional tone. Ensure it is tailored to the job and the company..

2. **Outsourcing Company Detection**: 
   - If the user asks about whether a company is an outsourcing company, analyze the company information provided (such as services offered, scale, and industry focus). Respond with 'true' if the company is likely an outsourcing company, or 'false' otherwise. Do not provide any additional explanation.

3. **Resume-Job Fit Analysis**:
   - If the user provides job base information and requests an analysis of their resume's fit for the role, analyze both. Respond with 'true' if the resume matches the job requirements, or 'false' if it does not. No additional text should be included.

For all responses, ensure clarity, conciseness, and relevance to the specific user query. The response should be only what is necessary for the user's request.
`
}
export async function getResume() {
    return await resumeCache.getValue()
}

export async function generateInputMessage(jd: string) {
    const wordsLimit = await greetingWordsLimit.getValue()
    return `
请根据下面的岗位描述和我的简历,帮我写一个${wordsLimit}字左右的求职招呼语,争取面试机会。如果不能胜任,直接返回字符串 'false'。你的回答中**只能**包含招呼语或 'false',不要有任何多余解释或其他文字。
注意事项: 
1.使用第一人称,撰写求职者向招聘公司发送的招呼语, 
2.招呼语要专业且自然, 避免使用书面化的词汇，例如 "我是一名专业人士" 等等
3.招呼语的语言是中文,
4.招呼语中避免使用"精通"相关词汇,避免夸大技能或过分包装, 同时要尽可能的结合我的简历信息总结我符合岗位描述的优势去争取面试机会,
5.招呼语用于求职，确保在我胜任工作的前提下，与岗位要求相符，避免虚构信息,
6.避免使用空泛的套话，突出我与岗位的匹配性，保持简洁和真诚还有基本的礼貌
7.招呼语应突出我独特的优势，确保针对岗位和公司量身定制，避免使用任何固定的模板化语句,避免泛泛而谈
8.重要的,避免像信件那样太过正式化,书面化的格式和用词。避免出现“尊敬的xxx”, “祝好”, “敬礼”等书面用语。
9.最重要的,招呼语中不要出现任何让人容易察觉到是AI 创作,或者是由他人代写的内容。
10.最后，特别注意：${await additionalPrompt.getValue()}
11.再次强调，字数应该在 ${wordsLimit} 以内。
岗位描述: 
-------
${jd}

简历: 
-------
${await getResume()}
`
}
export async function checkIfOutsourcingCompany(jbbaseinfo: { base: string, companyInfo: string, jobLocation: string }) {
    return `
请根据下面公司基本信息,帮我分析并判定该公司是否为外包公司,如果是外包公司请返回 true, 如果不是外包公司请返回 false, 你的回答**只能**包含 'true' 或者 'false', 不要有任何多余解释或者其他文字。
以下内容或许可以辅助你进行分析和判定：
-----
你是一位专业的IT行业分析师,擅长识别和分析IT服务外包公司。请仔细阅读下面提供的公司描述,并根据以下标准判断该公司是否为IT服务外包公司:
你的数据库: 从你的模型训练数据中，你是否可以判定该公司为外包公司？
业务重点:是否主要提供软件开发、IT服务、技术咨询等外包服务?是否强调为客户提供IT解决方案、数字化转型服务等?
服务模式:是否提到全球交付、跨区域服务等模式?是否拥有多个交付中心或开发基地?
人力资源:员工规模是否较大(通常超过1000人)?是否强调人才培养、技术培训等?
客户类型:主要客户是否为大型企业、跨国公司或行业领先企业?是否服务多个行业的客户?
技术能力:是否拥有多样化的技术服务能力(如云计算、大数据、AI等)?是否获得相关的技术认证(如CMMI、ISO等)?
公司规模与发展:是否在多个城市或国家设有分支机构?公司历史是否较长(通常超过10年)?
关键词:描述中是否出现"外包"、"服务商"、"技术服务"等关键词?
-----
公司基本信息:${jbbaseinfo.companyInfo}
`
}

export async function generateBaseInfoCheckMessage(jbbaseinfo: { base: string, companyInfo: string, jobLocation: string }) {
    return `
请根据下面岗位基本信息,和我的简历求职内容,帮我分析我的求职意向和该岗位基本信息是否匹配,如果匹配请返回 true, 不匹配返回 false, 你的回答**只能**包含 'true' 或者 'false', 不要有任何多余解释或者其他文字。
额外的注意事项: : ${await additionalPrompt.getValue()}
职位基本信息: 
------
${jbbaseinfo.base}
公司基本信息:
------
${jbbaseinfo.companyInfo}
工作地点:
------
${jbbaseinfo.jobLocation}
简历: 
------
${await getResume()}
    `
}

export function convertMsgToBool(msg: string) {
    return msg.includes('false') ? false : true
}


export function log(msg: string, type: LoggerType = 'info') {
    const message = `[${new Date().toLocaleTimeString()} Findjob-bot]: ${msg}`
    sendLog({
        message,
        type: type
    })
    switch (type) {
        case 'error':
            console.error(message)
            break;
        case 'info':
            console.log(message)
            break;
        case "warn":
            console.warn(message)
            break;
        default:
            break;
    }
}

function sendLog(msg: { message: string, type: LoggerType }) {
    browser.runtime.sendMessage({
        type: 'findjob-bot-logger',
        data: msg
    });
}

export async function getAgentApiKey(Agent: AgentsType) {
    const keys = await agentsStorage.getValue()
    return keys.find(agent => agent.agentName === Agent)?.apiKey
}