import { resumeCache } from "@/utils/storage";
import { useState } from 'react';
import './App.css';
import AdditionalInputComponent from './components/AdditionalInputComponent';
import ApiKeysConfigComponent from './components/ApiKeysConfigComponent';
import GreetingWordsLimitComponent from './components/GreetingWordsLimitComponent';
import LogDisplayComponent from './components/LogDisplayComponent';
import LoopLimitComponent from './components/LoopLimitComponent';
import ResumeInputComponent from "./components/ResumeInputComponent";
import TabSwitcher, { Tabs } from './components/TabSwitcher';
import wxtLogo from '/wxt.svg';
function App() {

  const [tab, setTab] = useState(Tabs.main)
  const [resumeValidate, setResumeValidate] = useState(false);

  const handleClickStart = function () {
    resumeCache.getValue().then((cache) => {
      if (cache.trim() === '') {
        setResumeValidate(false)
        return
      }else{
        setResumeValidate(true)
        browser.runtime.sendMessage({ from: 'popup', type: "start-bot" });
      }
    })
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
          <LoopLimitComponent />
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
          <ResumeInputComponent validate={resumeValidate} />
          <LogDisplayComponent />
        </div>

        {/* tab settings */}
        <div style={{ display: tab === Tabs.settings ? 'block' : 'none' }}>
          <AdditionalInputComponent />
          <GreetingWordsLimitComponent />
          <ApiKeysConfigComponent />
        </div>

      </div>

    </div>
  );
}


export default App;