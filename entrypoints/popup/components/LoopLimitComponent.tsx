


import React, { useState, useEffect } from 'react';
import styles from './LoopLimitComponent.module.css';
import { loopLimitStorage } from '@/utils/storage';

const LoopLimitComponent = () => {
    const [text, setText] = useState(1);
    useEffect(() => {
        loopLimitStorage.getValue().then(cache => {
            console.log('cache', cache)
            setText(cache)
        })
    }, [])




    const handleInputChange = async (e: any) => {
        const target = e.target as HTMLInputElement
        const { max, value } = target;
        let val = +value <= +max ? +value : +max

        setText(val);
        if (val <= 0) {
            loopLimitStorage.setValue(1);
        } else {
            loopLimitStorage.setValue(val);
        }

    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>循环</h2>
            <input
                type='number'
                value={text}
                className={styles.textarea}
                onChange={handleInputChange}
                max='1000'
            />
            <h2 className={styles.title}>次</h2>
        </div>
    );
};

export default LoopLimitComponent;