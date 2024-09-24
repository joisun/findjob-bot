import { AiAgentApiKeys } from "@/typings/aiModelAdaptor";

// utils/storage.ts
export const jobListItemIndex = storage.defineItem<number>(
    'local:jobListItemIndex',
    {
        fallback: 0,
    },
);


// utils/storage.ts
export const senderId = storage.defineItem<number>(
    'local:senderId',
    {
        fallback: 0,
    },
);



export const resumeCache = storage.defineItem<string>(
    'local:resumeCache',
    {
        fallback: '',
    },
);

export const loopLimitStorage = storage.defineItem<number>(
    'local:loopLimitStorage',
    {
        fallback: 5,
    },
);

export const additionalPrompt = storage.defineItem<string>(
    'local:additionalPrompt',
    {
        fallback: '',
    },
);


export const greetingWordsLimit = storage.defineItem<number>(
    'local:greetingWordsLimit',
    {
        fallback: 100,
    },
);



export const agentsStorage = storage.defineItem<AiAgentApiKeys>(
    'local:agents',
    {
        fallback: [],
    },
);


