import React, { useState, useEffect } from 'react';
import styles from './ResumeInputComponent.module.css';
import { resumeCache } from '@/utils/storage';
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
    <div className={styles.container}>
      <h2 className={styles.title}>简历描述（向AI描述你的简历）<p>{charCount === 0 ? '简历描述信息不可为空' : ''}</p></h2>
      <textarea
        className={styles.textarea}
        style={{ borderColor: validate || text.length ? 'green' : 'red', boxShadow: validate || text.length ? '0 0 0 2px #00ff3c27' : '0 0 0 2px #ff002b27' }}
        value={text}
        onChange={handleInputChange}
        placeholder="Enter your resume description here..."
      />
      <div className={styles.charCount}>
        {charCount ?? 0}/{maxChars} characters
      </div>

    </div>
  );
};

export default TextInputComponent;