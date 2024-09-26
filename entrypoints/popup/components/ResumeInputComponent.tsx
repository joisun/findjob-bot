import React, { useState, useEffect } from 'react';
import { resumeCache } from '@/utils/storage';
import HeadlingTitle from './common/HeadlingTitle';
interface TextInputComponentProps {
  validate: boolean
}
const TextInputComponent: React.FC<TextInputComponentProps> = ({ validate }) => {
  const [text, setText] = useState('');



  useEffect(() => {
    resumeCache.getValue().then(cache => {
      setText(cache)
    })
  }, [])
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000;

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const handleInputChange = async (e: any) => {
    const target = e.target as HTMLInputElement
    const inputText = target.value;
    if (inputText.length <= maxChars) {
      setText(inputText);
      await resumeCache.setValue(inputText)
    }
  };

  return (
    <div className='relative'>
      <HeadlingTitle>简历描述（向AI描述你的简历）<p className='opacity-65'>{charCount === 0 ? '简历描述信息不可为空' : ''}</p></HeadlingTitle>
      <textarea
        style={{ borderColor: validate || text.length ? 'green' : 'red', boxShadow: validate || text.length ? '0 0 0 2px #00ff3c27' : '0 0 0 2px #ff002b27' }}
        value={text}
        onChange={handleInputChange}
        placeholder="在这里输入你的简历和基本描述信息..."
      />
      <div className="absolute right-2 bottom-0 mt-2 mb-2 text-xs text-green-400">
        {charCount ?? 0} / {maxChars}
      </div>
    </div>
  );
};

export default TextInputComponent;