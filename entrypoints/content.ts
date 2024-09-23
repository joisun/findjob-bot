import { notice } from "@/utils/app";
import { sleep } from "@/utils/common";
import { getJobBaseInfo, getJobDescription, getConcatBtn, fillInputField, goTo } from "@/utils/domRelated";

export default defineContentScript({
  matches: ['*://*.zhipin.com/*'],
  main() {
    console.log("Hello.Content")
    // if (!isValidPage()) {
    //   goTo('https://www.zhipin.com/web/geek/job-recommend')
    // }

    browser.runtime.onMessage.addListener(async (message) => {
      if (message.from !== "background") return;

      switch (message.type) {
        case 'start-bot':
          browser.runtime.sendMessage({ from: 'content', type: "init", site: "zhipin" });
          break;
        case 'clickPreference':
          return await clickPreference()

        case 'selectJobFromList':
          return await selectJobFromList(message.data)

        case 'getJobBaseInfo':
          const jobBaseInfo = await getJobBaseInfo()
          return Promise.resolve(jobBaseInfo)

        case 'getJobDescription':
          const jobDescription = await getJobDescription()
          return Promise.resolve(jobDescription)

        case 'clickContactBtn':
          const concatBtn = await getConcatBtn()
          concatBtn?.click()
          return Promise.resolve()
        case 'fillInputField':
          return await fillInputField(message.data)
        case 'goBack':
          goTo('https://www.zhipin.com/web/geek/job-recommend')
          return

        default:
          break;
      }
    });








    // let jobListItemIndex = 0;
    // goTo("https://www.zhipin.com/web/geek/job-recommend")
    // inConcatPage()
  },
});

async function clickPreference() {
  // preference 列表是动态插入的，这里等待执行
  await sleep(1000)
  const preference = document.querySelector(".recommend-search-expect a:nth-child(3)") as HTMLElement
  if (preference) {
    preference.click()
  } else {
    notice(`【目标意向工作项】未找到, 将直接从推荐职位列表中找寻工作机会！`)
  }
}

async function selectJobFromList(index: number) {
  // const targetJobListItem = await waitForElement(`.rec-job-list > li:nth-child(${index})`) as HTMLElement | null
  const targetJobListItem = document.querySelector(`.rec-job-list > li:nth-child(${index})`) as HTMLElement | null
  if (targetJobListItem) {
    targetJobListItem.click()
  } else {
    // 检查是不是最后一个，如果是的，则尝试翻页
  }

}


function isValidPage() {
  return strMatch(/https:\/\/www\.zhipin\.com\/web\/geek\/(?:chat|job-recommend)(\?.*)?/, location.href);
}