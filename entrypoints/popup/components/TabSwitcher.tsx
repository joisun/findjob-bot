import React, { useState, useEffect } from 'react';
import styles from './TabSwitcher.module.css';

export enum Tabs {
    main = 'main',
    settings = 'settings'
}
// 定义 Props 类型
interface TabSwitcherProps {
    tab: string | number;  // 假设 tab 是 string 或 number
    handleSwitch: (tab: Tabs) => void;  // setTab 是一个接收 tab 参数的函数
}
const TextInputComponent: React.FC<TabSwitcherProps> = ({ tab, handleSwitch }) => {

    function handleClick(tab: Tabs) {
        handleSwitch(tab)
    }

    return (
        <p className={styles.tabs}>
            <button onClick={() => handleClick(Tabs.main)} className={`${styles.main} ${tab === Tabs.main ? styles.active : ''} `}>main</button>
            <button onClick={() => handleClick(Tabs.settings)} className={`${styles.settings} ${tab === Tabs.settings ? styles.active : ''} `}>settings</button>
        </p>
    );
};

export default TextInputComponent;