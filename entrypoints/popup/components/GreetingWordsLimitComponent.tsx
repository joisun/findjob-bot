


import React, { useState, useEffect } from 'react';
import styles from './GreetingWordsLimitComponent.module.css';
import { greetingWordsLimit } from '@/utils/storage';

const GreetingWordsLimitComponent = () => {
    const [text, setText] = useState(1);
    useEffect(() => {
        greetingWordsLimit.getValue().then(cache => {
            console.log('cache',cache)
            setText(cache)
        })
    }, [])




    const handleInputChange = async (e: any) => {
        const target = e.target as HTMLInputElement
        const { max, value } = target;
        let val = +value <= +max ? +value : +max
        
        setText(val);
        if(val < 10){
            greetingWordsLimit.setValue(10);
        }else{
            greetingWordsLimit.setValue(val);
        }

    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>招呼语长度限制</h2>
            <p>输入值小于 10 将无效,会自动默认设定为10, 最大长度为 1000</p>

            <input
                type='number'
                value={text}
                className={styles.textarea}
                onChange={handleInputChange}
                placeholder="生成招呼语的长度（30-200 为宜）"
                max='1000'
            />
        </div>
    );
};

export default GreetingWordsLimitComponent;