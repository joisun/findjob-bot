import React, { useState, useEffect, useRef } from 'react';
import styles from './LogDisplayComponent.module.css';

const LogDisplayComponent = () => {
  const [logs, setLogs] = useState<{ message: string, type: 'info' | 'warn' | 'error' }[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messageListener = (message: { type: string, data: any }) => {
      if (message.type === 'findjob-bot-logger') {
        setLogs((prevLogs) => [...prevLogs, message.data]);
      }
    };

    browser.runtime.onMessage.addListener(messageListener);

    return () => {
      browser.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Logs</h2>
      <div className={styles.logContainer} ref={logContainerRef}>
        {logs.map((log, index) => (
          <div key={index} className={`${styles.logEntry} ${styles[log.type]}`} >
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogDisplayComponent;