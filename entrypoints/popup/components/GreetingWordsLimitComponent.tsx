


import { greetingWordsLimit } from '@/utils/storage';
import { useEffect, useState } from 'react';
import HeadlingTitle from './common/HeadlingTitle';
import Subtitle from './common/Subtitle';

const GreetingWordsLimitComponent = () => {
    const [text, setText] = useState(1);
    useEffect(() => {
        greetingWordsLimit.getValue().then(cache => {
            setText(cache)
        })
    }, [])




    const handleInputChange = async (e: any) => {
        const target = e.target as HTMLInputElement
        const { max, value } = target;
        let val = +value <= +max ? +value : +max

        setText(val);
        if (val < 10) {
            greetingWordsLimit.setValue(10);
        } else {
            greetingWordsLimit.setValue(val);
        }

    };

    return (
        <>
            <HeadlingTitle >招呼语长度限制</HeadlingTitle>
            <Subtitle>输入值小于 10 将无效,会自动默认设定为10, 最大长度为 1000</Subtitle>

            <input
                type='number'
                value={text}
                onChange={handleInputChange}
                placeholder="生成招呼语的长度（30-200 为宜）"
                max='1000'
            />
        </>
    );
};

export default GreetingWordsLimitComponent;