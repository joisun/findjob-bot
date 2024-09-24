import { log } from "./app";
import { sleep } from "./common";
export function waitForElement(selector: string): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (element) { resolve(element); return; }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector) as HTMLElement | null;
      if (element) {
        obs.disconnect(); // 停止观察
        resolve(element); // 返回找到的元素
      }
    });

    // 开始观察文档的变化
    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    // 超时处理（可选）
    setTimeout(() => {
      observer.disconnect();
      // 如果 observer 没找到元素， 那么通过循环去兜底获取元素，循环6次，每次间隔 1000，
      timeWalker(1000, 6, () => {
        const element = document.querySelector(selector) as HTMLElement | null;
        if (element) {
          resolve(element);
          return true;
        }
      }, () => {
        reject(new Error(`Element ${selector} not found within timeout`));
      })
    }, 1000); // 1秒等待页面反应， 如果observer 获取不到元素，则终止 observer
  });
}


/**
 * 
 * @param gap 循环间隔
 * @param limit 最多循环次数
 * @param cb 每次循环时执行的回调，返回 true 可提前中断循环
 * @param failedHandler 当循环终止时的回调
 */
function timeWalker(gap: number, limit: number, cb: Function, failedHandler: Function) {
  let count = 0;
  walker(gap, cb);
  function walker(gap: number, cb: Function) {
    count++;
    const timer = setTimeout(() => {
      const result = cb();
      if (!result && count < limit) {
        walker(gap, cb)
      } else {
        failedHandler()
      }
      clearTimeout(timer)
    }, gap)
  }
}


export function goTo(url: string) {
  if (location.href === url) location.reload();
  location.href = url
}

/**
 * 根据 xpath 获取元素，但是只能首次获取到目标元素就resolve 掉，如果是一个动态列表，有可能获取到的元素，不是目标元素。 例如 ，希望获取 li[3], 但是 li[2]是js动态插入的。 这样实际获取到的，就会是 li[4]
 * @param xpath 
 * @returns Promise<HTMLElement>
 */
export function getElementByXPath(xpath: string): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations, obs) => {
      const result = document.evaluate(
        xpath,                // XPath 表达式
        document,             // 要搜索的上下文（通常是 document）
        null,                 // 命名空间解析函数，通常为 null
        XPathResult.FIRST_ORDERED_NODE_TYPE, // 返回类型
        null                  // result 参数，用于复用结果对象（通常为 null）
      );
      const element = result.singleNodeValue as HTMLElement | null;
      if (element) {
        obs.disconnect(); // 停止观察
        resolve(element); // 返回找到的元素
      }
    });

    // 开始观察文档的变化
    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    // 超时处理（可选）
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${xpath} not found within timeout`));
    }, 10000); // 10秒超时
  });
}

export async function getJobDescription() {
  const jobDescriptionEl = await waitForElement(`div.job-detail-body > p.desc`) as HTMLElement | null
  if (!jobDescriptionEl) return null
  jobDescriptionEl.click()
  return jobDescriptionEl.innerText
}


export async function getJobBaseInfo() {
  const jobDescriptionEl = await waitForElement(`div.job-detail-container div.job-header-info`) as HTMLElement | null
  if (!jobDescriptionEl) return null
  return jobDescriptionEl.innerText
}

export async function getConcatBtn() {
  const concatBtn = await waitForElement(".job-detail-container a.op-btn-chat") as HTMLElement | null
  if (!concatBtn) return null
  return concatBtn
}


export async function fillInputField(textContent: string) {
  const inputTextField = await waitForElement(".chat-input") as HTMLElement | null
  const checkIfcontacted = document.querySelector(".item-myself") as HTMLElement | null
  if(checkIfcontacted) { log("已存在历史沟通， 跳过....", 'warn');  return}
  if (!inputTextField) { log("定位输入框失败!"); return }
  inputTextField.focus()
  inputTextField.innerText = textContent

  // 手动触发输入事件（模拟用户在输入框中打字）
  const inputEvent = new Event('input', { bubbles: true });
  inputTextField.dispatchEvent(inputEvent);
  await sleep(2000);// 模拟2s等待
  // 创建一个回车键事件
  const enterEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,     // 对应键盘上的 Enter 键
    which: 13,       // 兼容旧版浏览器
    bubbles: true    // 事件需要冒泡，否则不会被监听器捕获
  });
  // 触发回车键事件
  inputTextField.dispatchEvent(enterEvent);
}