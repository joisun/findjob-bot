import { AiApiAdaptor } from "@/aiModels";
import { chatanywhereAIService } from "@/aiModels/chatanywhere";
import { kimiAPIAIService } from "@/aiModels/kimi";
import { xunfeiSparkAPIAIService } from "@/aiModels/xunfeiSpark";
import { checkIfOutsourcingCompany, log } from "@/utils/app";
import { sleep } from "@/utils/common";
import { jobListItemIndex, filterOutsourcingCompany } from "@/utils/storage";

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
        initAiApiAdaptor()

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

});


function initAiApiAdaptor() {
  AI = new AiApiAdaptor([
    new chatanywhereAIService(['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4']),
    new xunfeiSparkAPIAIService(['generalv3']),
    new kimiAPIAIService(["moonshot-v1-8k"])
  ])
}

async function zhipin(senderId?: number) {
  console.log('Hello background.zhipin!');
  // 检查 AI Adaptor 的初始化
  if (!AI) { initAiApiAdaptor() }
  if (!senderId) return;
  // 尝试点击 工作意向偏好

  let index = await jobListItemIndex.getValue()
  let loopLimit = await loopLimitStorage.getValue() || 1

  // 避免意外情况导致的死循环
  let safeloopMax = 10000
  let safeloopIndex = 0
  while (index <= loopLimit && !stopTag) {
    safeloopIndex += 1
    if (safeloopIndex >= safeloopMax) {
      log('意外错误，程序终止...', 'error')
      return
    };

    try {
      index = await jobListItemIndex.getValue()
      log(`将进行 [${index}/${loopLimit}] 次招聘信息的检查`)
      index++
      await jobListItemIndex.setValue(index)

      console.log('index',index)
      // 选中求职偏好(垃圾boss 偏好没卵用，没几个地点是偏好工作base的地点, 但是“推荐职位列表有限制”)
      // 必须等待，否则无法继续，因为页面刷新会导致 content 还没有注册消息监听
      await sleep(2000)

      const preference = await browser.tabs.sendMessage(senderId, { from: 'background', type: "clickPreference" });
      const match = preference.match(/\（(.*?)\）/);
      const preferCity = match ? match[1] : null;
      if (!preferCity) { log('获取[意向城市偏好失败], 将尝试下一个招聘信息！', 'warn'); continue };


      await sleep(2000)
      const jobLocation = await browser.tabs.sendMessage(senderId, { from: 'background', type: "selectJobFromList", data: index });
      if (!jobLocation) { log('获取[工作城市信息失败], 将尝试下一个招聘信息！', 'warn'); continue };

      if (!jobLocation.includes(preferCity)) { log('[意向城市和工作城市不匹配], 将尝试下一个招聘信息！', 'warn'); continue };

      
     
     
     await sleep(1000);// 等待点击事件
    //  const jobLocation = await browser.tabs.sendMessage(senderId, { from: 'background', type: "selectJobFromList", data: index });
      const jobBaseInfo = await browser.tabs.sendMessage(senderId, { from: 'background', type: "getJobBaseInfo" });
      const jobDescription = await browser.tabs.sendMessage(senderId, { from: 'background', type: "getJobDescription" });
      if (!jobDescription || !jobBaseInfo) { log('获取[岗位基本信息/职位描述失败], 将尝试下一个招聘信息！', 'warn'); continue };
      // if (!jobBaseInfo.companyInfo.trim()) { log('该公司未提供公司基本信息, 将视作皮包公司，为你尝试下一个招聘信息！', 'warn'); continue };

      // 外包公司判定
      if (await filterOutsourcingCompany.getValue()) {
        const ifMatchOutsourcing = await checkOutsourcingCompany(jobBaseInfo)
        if (ifMatchOutsourcing) { log('AI 判定该公司为外包公司！为你找下一个招聘信息~', 'warn'); continue }
      }

      // 基本岗位检测
      const ifMatchBaseInfo = await checkIfMatchBaseJobInfo(jobBaseInfo)
      if (!ifMatchBaseInfo) { log('不符合岗位基本描述！为你找下一个招聘信息~', 'warn'); continue }

      // 点击立即沟通按钮
      await browser.tabs.sendMessage(senderId, { from: 'background', type: "clickContactBtn" });
      await sleep(3000)


      // 检查是否存在历史沟通消息
      const hasHistoryChat = await browser.tabs.sendMessage(senderId, { from: 'background', type: "checkUsedToContacted" });
      if (hasHistoryChat) {
        log("已存在历史沟通， 跳过....", 'warn');

      } else {
        // 生成+填写+发送 招呼语
        log('基本岗位信息符合，将根据具体岗位JD为你生成对应的招呼语！', 'success')
        const msgOrFalse = await generateHelloMessage(jobDescription)
        if (!msgOrFalse) { log('不符合职位描述！为你找下一个招聘信息~', 'warn'); continue }
        log(msgOrFalse)
        await browser.tabs.sendMessage(senderId, { from: 'background', type: "fillInputField", data: msgOrFalse });
        await sleep(2000)
      }

      await browser.tabs.sendMessage(senderId, { from: 'background', type: "goBack" });


    } catch (error) {
      if (error instanceof APIException) {
        log(`${error.type}:${error.message}`, 'error')
        return;
      } else {
        log(`遇到不可预期的错误，将自动继续尝试下一项${error}`, 'error')
        continue
      }
    }
  }

  log('结束！')

}
async function checkIfMatchBaseJobInfo(jobBaseInfo: { base: string, companyInfo: string, jobLocation: string }) {
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

async function checkOutsourcingCompany(jobBaseInfo: { base: string, companyInfo: string, jobLocation: string }) {
  if (!AI) { return; }

  const inputMsg = await checkIfOutsourcingCompany(jobBaseInfo)
  const _ifMatch = await AI.chat(inputMsg);
  return _ifMatch.includes('true') ? true : false
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

