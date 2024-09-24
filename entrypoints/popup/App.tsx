import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import ResumeInputComponent from "./components/ResumeInputComponent"
import './App.css';
import LogDisplayComponent from './components/LogDisplayComponent';
import TabSwitcher, { Tabs } from './components/TabSwitcher';
import AdditionalInputComponent from './components/AdditionalInputComponent';
import { resumeCache, additionalPrompt,greetingWordsLimit } from "@/utils/storage"
import GreetingWordsLimitComponent from './components/GreetingWordsLimitComponent';
import ApiKeysConfigComponent from './components/ApiKeysConfigComponent';
function App() {

  const [tab, setTab] = useState(Tabs.main)

  const handleClickStart = function () {
    browser.runtime.sendMessage({ from: 'popup', type: "start-bot" });
  }
  const handleClickStop = async function () {
    // const resume = await resumeCache.getValue()
    // const msgOrFalse = await additionalPrompt.getValue()
    // const aaa = await greetingWordsLimit.getValue()
    // console.log('greetingWordsLimit',aaa)


    browser.runtime.sendMessage({ from: 'popup', type: "stop-bot" });
  }
  return (
    <div id='root-container'>
      <h1><span className='flex-center'><img className='logo' src={wxtLogo} alt="" /> Findjob-bot</span>
        <div className='flex-center'>
          <button className='go-btn' onClick={handleClickStart}>
            Go!!!
          </button>
          <button className='stop-btn' onClick={handleClickStop}>
            Stop
          </button>
        </div>
      </h1>
      <TabSwitcher tab={tab} handleSwitch={tab => setTab(tab)} />

      <div className="card">
        {/* tab main */}
        <div style={{ display: tab === Tabs.main ? 'block' : 'none' }}>
          <ResumeInputComponent />
          <LogDisplayComponent />
        </div>

        {/* tab settings */}
        <div style={{ display: tab === Tabs.settings ? 'block' : 'none' }}>
          <AdditionalInputComponent />
          <GreetingWordsLimitComponent/>
          <ApiKeysConfigComponent/>
        </div>

      </div>

    </div>
  );
}


export default App;