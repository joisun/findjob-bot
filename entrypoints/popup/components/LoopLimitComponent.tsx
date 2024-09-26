


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
        <div className="flex justify-start items-center flex-nowrap h-full gap">
            <h2 className="text-xl font-semibold">循环</h2>
            <input
                type='number'
                value={text}
                className="box-border w-[10ch] h-full px-4 py-2 mx-1 inline-block text-white text-base"
                onChange={handleInputChange}
                max='1000'
            />
            <h2 className="text-xl font-semibold">次</h2>
        </div>
    );
};

export default LoopLimitComponent;