import { log } from "@/utils/app";
import { sleep } from "@/utils/common";
import { getJobBaseInfo, getJobDescription, getConcatBtn, fillInputField, checkUsedToContacted, goTo } from "@/utils/domRelated";

export default defineContentScript({
  matches: ['*://*.zhipin.com/*'],
  runAt: 'document_end',
  main() {
    console.log("Hello.Content")
    // if (!isValidPage()) {
    //   goTo('https://www.zhipin.com/web/geek/job-recommend')
    // }

    browser.runtime.onMessage.addListener(async (message) => {
      if (message.from !== "background") return;

      switch (message.type) {
        case 'start-bot':
          console.log("rereived start bot message from background to content")
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

        case 'checkUsedToContacted':
          return Promise.resolve(checkUsedToContacted())

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
  const preference = await waitForElement(".recommend-search-expect a:nth-child(3)") as HTMLElement
  if (preference) {
    preference.click()
    return preference.textContent
  } else {
    log(`【目标意向工作项】未找到, 将直接从推荐职位列表中找寻工作机会！`)
  }
}

async function selectJobFromList(index: number) {
  const selector = `.rec-job-list > li:nth-child(${index})`;
  let jobItem = document.querySelector(selector) as HTMLLIElement

  // 等待列表项存在
  while (!jobItem) {
    // 获取列表容器
    const container = document.querySelector('.rec-job-list');

    // 如果容器存在，进行滚动
    if (container) {
      // 模拟滚动到底部
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

      // 等待下一次加载
      await new Promise(resolve => setTimeout(resolve, 1000)); // 根据实际情况调整时间
    }

    // 重新选择目标项
    jobItem = document.querySelector(selector)!
  }

  // 如果找到了目标项，选择它
  if (jobItem) {
    jobItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    jobItem.click(); // 如果需要点击选中
    return jobItem.querySelector('.company-location')?.textContent

  }
}




function isValidPage() {
  return strMatch(/https:\/\/www\.zhipin\.com\/web\/geek\/(?:chat|job-recommend)(\?.*)?/, location.href);
}