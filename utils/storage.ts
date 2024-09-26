import { AiAgentApiKeys } from "@/typings/aiModelAdaptor";

/** 遍历索引缓存 */
export const jobListItemIndex = storage.defineItem<number>(
    'local:jobListItemIndex',
    {
        fallback: 0,
    },
);


/** content 通信sender id缓存 */
export const senderId = storage.defineItem<number>(
    'local:senderId',
    {
        fallback: 0,
    },
);


/** 简历内容缓存 */
export const resumeCache = storage.defineItem<string>(
    'local:resumeCache',
    {
        fallback: '',
    },
);

/** 最大遍历次数 */
export const loopLimitStorage = storage.defineItem<number>(
    'local:loopLimitStorage',
    {
        fallback: 5,
    },
);

/** 追加 Prompt */
export const additionalPrompt = storage.defineItem<string>(
    'local:additionalPrompt',
    {
        fallback: '',
    },
);

/** 招呼语字数 */
export const greetingWordsLimit = storage.defineItem<number>(
    'local:greetingWordsLimit',
    {
        fallback: 50,
    },
);


/** apikey 设定缓存 */
export const agentsStorage = storage.defineItem<AiAgentApiKeys>(
    'local:agents',
    {
        fallback: [],
    },
);

/** 通过黑名单过滤外包公司 */
export const filterOutsourcingCompany = storage.defineItem<boolean>(
    'local:filterOutsourcingCompany',
    {
        fallback: true,
    },
);

/** 过滤猎头 */
export const filterHeadhunting = storage.defineItem<boolean>(
    'local:filterHeadhunting',
    {
        fallback: true,
    },
);



