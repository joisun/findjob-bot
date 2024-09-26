import React, { useState, useEffect } from 'react';
import { additionalPrompt } from '@/utils/storage';
import HeadlingTitle from './common/HeadlingTitle';

const TextInputComponent = () => {
  const [text, setText] = useState('');
  useEffect(()=>{
    additionalPrompt.getValue().then(cache=>{
      setText(cache)
    })
  },[])
  const [charCount, setCharCount] = useState(0);
  const maxChars = 200;

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const handleInputChange = async (e: any) => {
    const target = e.target as HTMLInputElement
    const inputText = target.value;
    if (inputText.length <= maxChars) {
      setText(inputText);
      await additionalPrompt.setValue(inputText)
    }
  };

  return (
    <div className='relative'>
      <HeadlingTitle >追加 Prompt</HeadlingTitle>
      <textarea
        value={text}
        onChange={handleInputChange}
        placeholder="追加更多的限制词，例如： 不考虑 go, java 等后端岗位 | 不考虑web3, 区块链相关岗位 | 不考虑如技术咨询，技术支持等外包岗位"
      />
      <div className="absolute right-2 bottom-0 mt-2 mb-2 text-xs text-green-400">
        {charCount ?? 0} / {maxChars}
      </div>
    </div>
  );
};

export default TextInputComponent;