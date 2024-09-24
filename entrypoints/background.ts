import xunfeiSpark from "@/aiModels/xunfeiSpark";
import cohere from "@/aiModels/cohere";
import openai from "@/aiModels/openai";
import kimi from "@/aiModels/kimi";
import { sleep } from "@/utils/common";
import { log } from "@/utils/app";
import { storage } from 'wxt/storage';
import { jobListItemIndex } from "@/utils/storage"
import { AiApiAdaptor } from "@/aiModels";
import { chatanywhereAIService } from "@/aiModels/chatanywhere";

const xunfeiAPILite = 'ZKjFMdRTavVPDUABbwvf:hratmjKhQzyVNuArxvzm'
const xunfeiAPIV3pro = 'MTrricoschHlfxWNvIJD:ZXklDofIqPdoBxkWsjTA'

const cohereAPI = 'CvYnKq8ZuSuZjDuG00Qyf8dxCHQEEBW5wcc1zjvr'

const openAiKey = "sk-IjXDututkGHzTVcw77BfB735565d46Db84Cb67804fF1E83b"
const kimiApiKey = "sk-PT9aRZnfqpilMASfDj5HsePrYp5WfTakY4wQtwqpODKaSwUy"
const chatanywhereApiKey = "sk-M72D5lilVXr4dKsWwPJgs8PRzvnLQleW0UrpBKdjjm7hHWWL"
let stopTag = false
let AI: AiApiAdaptor | null = null;
export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.from !== "content" && message.from !== "popup") return;

    switch (message.type) {
      case 'start-bot':
        console.log("start-bot listener triggered")
        await jobListItemIndex.setValue(1)
        await sendMessageToContent({ type: "goBack" })
        // await browser.tabs.sendMessage(tab.id, { from: 'background', type: "goBack" });
        // await sleep(2000)
        // await browser.tabs.sendMessage(tab.id, { from: 'background', type: "start-bot" });

        // 页面刷新，等待 content 事件重新注册
        await sleep(2000)
        await sendMessageToContent({ type: "start-bot" })
        break;
      case 'stop-bot':
        stopTag = true
        break;
      case 'agents-changed':
        console.log("agents-change")
        break;
      default:
        break;
    }


    if (message.type === 'init') {
      switch (message.site) {
        case 'zhipin':
          stopTag = false
          zhipin(sender.tab?.id)
          break;
        default:
          break;
      }
    }
  });

  initAiApiAdaptor()
});

function initAiApiAdaptor() {
  AI = new AiApiAdaptor([
    new chatanywhereAIService(chatanywhereApiKey, ['gpt-4o-mini']),
  ])
}

async function zhipin(senderId?: number) {
  console.log('Hello background.zhipin!');
  // 检查 AI Adaptor 的初始化
  if (!AI) { initAiApiAdaptor() }
  if (!senderId) return;
  // 尝试点击 工作意向偏好

  await browser.tabs.sendMessage(senderId, { from: 'background', type: "clickPreference" });
  let index = await jobListItemIndex.getValue()
  let loopLimit = await loopLimitStorage.getValue() || 1
  // 避免意外情况导致的死循环
  let safeloopMax = 10000
  let safeloopIndex = 0
  while (index < loopLimit && !stopTag) {
    safeloopIndex += 1
    if(safeloopIndex >= safeloopMax){
      log('意外错误，程序终止...', 'error')
      return
    };
    
    index = await jobListItemIndex.getValue()
    log(`将进行 [${index}/${loopLimit}] 次招聘信息的检查`)
    await jobListItemIndex.setValue(index + 1)

    await sleep(2000)
    await browser.tabs.sendMessage(senderId, { from: 'background', type: "selectJobFromList", data: index });
    await sleep(1000);// 等待点击事件
    const jobBaseInfo = await browser.tabs.sendMessage(senderId, { from: 'background', type: "getJobBaseInfo" });
    const jobDescription = await browser.tabs.sendMessage(senderId, { from: 'background', type: "getJobDescription" });
    if (!jobDescription || !jobBaseInfo) { log('获取[岗位基本信息/职位描述失败], 将尝试下一个招聘信息！', 'warn'); continue };


    //  fix 掉了while 循环的问题， 接下来，处理ai 的操作，1.prompt 调教，2.ai adaptor
    const ifMatchBaseInfo = await checkIfMatchBaseJobInfo(jobBaseInfo)
    if (!ifMatchBaseInfo) { log('不符合岗位基本描述！为你找下一个招聘信息~', 'warn'); continue }

    log('基本岗位信息符合，将为你生成对应的招呼语！', 'success')

    // await sleep(3000);// 有的 api(kimi) 要求请求间隔超过1s
    const msgOrFalse = await generateHelloMessage(jobDescription)

    if (!msgOrFalse) { log('不符合职位描述！为你找下一个招聘信息~', 'warn'); continue }

    log(msgOrFalse)

    // 点击立即沟通按钮
    await browser.tabs.sendMessage(senderId, { from: 'background', type: "clickContactBtn" });
    await sleep(2000)
    console.log('msgOrFalse', msgOrFalse)
    await browser.tabs.sendMessage(senderId, { from: 'background', type: "fillInputField", data: msgOrFalse });
    await sleep(2000)
    await browser.tabs.sendMessage(senderId, { from: 'background', type: "goBack" });
  }
  log('结束！')


}
async function checkIfMatchBaseJobInfo(jobBaseInfo: string) {
  if (!AI) { return; }
  const checkBaseInfoMatch = await generateBaseInfoCheckMessage(jobBaseInfo)
  const _ifMatch = await AI.chat(checkBaseInfoMatch);
  return convertMsgToBool(_ifMatch)
}

async function generateHelloMessage(jobDescription: string) {
  if (!AI) { return; }

  const inputMsg = await generateInputMessage(jobDescription)
  const _ifMatch = await AI.chat(inputMsg);
  return _ifMatch.includes('false') ? false : _ifMatch
}

async function sendMessageToContent(msg: { type: string, data?: any }) {
  return new Promise(async (resolve, reject) => {
    // 获取当前活动的 tab，然后向其发送消息
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true })
      tabs.forEach(async (tab) => {
        if (tab.id !== undefined) {
          await browser.tabs.sendMessage(tab.id, { from: 'background', ...msg });
          resolve('ok')
        } else {
          console.error('Tab ID is undefined');
        }
      })
    } catch (err) { reject(err) }

  })
}

// background.js (或 service worker)

