import { LoggerType } from "@/typings/app"
import { additionalPrompt, resumeCache } from "@/utils/storage"
export function getSystemPrompt() {
    return `Please analyze the user-provided resume information and the job description to assess how well the user matches the job. Focus on key factors like job title, required skills, education, years of experience, and other relevant details. Based on the analysis, write a polite and conversational job application greeting that the user can send directly to the employer. Mention specific skills or qualifications from the job requirements, explaining how the user’s resume aligns with those points. Avoid any language that would suggest the greeting is AI-generated or written by someone else. Keep the tone professional, confident, and friendly, in the first-person perspective of the job seeker. The greeting should be written in Chinese.`
}
export async function getResume() {
    return await resumeCache.getValue()
}

export async function generateInputMessage(jd: string) {
    return `
请根据下面的岗位描述和我的简历,帮我写一个${await greetingWordsLimit.getValue()}字左右的求职招呼语,争取面试机会。如果不能胜任,直接返回字符串 'false'。你的回答中**只能**包含招呼语或 'false',不要有任何多余解释或其他文字。
注意事项: 
1.使用第一人称,撰写求职者向招聘公司发送的招呼语, 
2.招呼语要专业的，用语自然,
3.招呼语的语言是中文 
4.招呼语中避免使用精通相关词汇
5.招呼语是用于求职的，所以应该在保证我能胜任该工作的前提下，尽量和岗位描述相符合
6.重要的,避免像信件那样太过正式化，书面化的格式和用词。避免出现“尊敬的xxx”, “祝好”, “敬礼”等书面用语。
7.最重要的,招呼语中不要出现任何让人容易察觉到是AI 创作,或者是由他人代写的内容。
8.${await additionalPrompt.getValue()}
岗位描述: 
-------
${jd}

简历: 
-------
${await getResume()}
`
}

export async function generateBaseInfoCheckMessage(jbbaseinfo: { base: string, companyInfo: string, jonLocation: string }) {
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
${jbbaseinfo.jonLocation}

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
