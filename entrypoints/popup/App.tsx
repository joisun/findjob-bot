import { resumeCache } from "@/utils/storage";
import { useState } from 'react';
import './App.css';
import AdditionalInputComponent from './components/AdditionalInputComponent';
import ApiKeysConfigComponent from './components/ApiKeysConfigComponent';
import GreetingWordsLimitComponent from './components/GreetingWordsLimitComponent';
import LogDisplayComponent from './components/LogDisplayComponent';
import LoopLimitComponent from './components/LoopLimitComponent';
import ResumeInputComponent from "./components/ResumeInputComponent";
import FilterOutsourcingCompComponent from './components/FilterOutsourcingCompComponent'
import TabSwitcher, { Tabs } from './components/TabSwitcher';
import wxtLogo from '/findjob-bot.svg';
import FilterHeadhuntingComponent from "./components/FilterHeadhuntingComponent";
function App() {

  const [tab, setTab] = useState(Tabs.main)
  const [resumeValidate, setResumeValidate] = useState(false);

  const handleClickStart = function () {
    resumeCache.getValue().then((cache) => {
      if (cache.trim() === '') {
        setResumeValidate(false)
        return
      } else {
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
  const handleClickTest = async function () {
    // fetchCompanyInfo()
    // const key = await getAgentApiKey(AgentsType.ChatAnywhere)
    // console.log('key',key)

  }
  return (
    <div id='root-container'>
      <h1 className="mb-2"><span className='flex-center font-bold select-none'><img className='logo' src={wxtLogo} alt="" /> Findjob-bot</span>
        <div className='flex-center'>
          <LoopLimitComponent />
          <button className='go-btn text-white hover:border-[#63ff93] relative font-bold bg-[#1cff1c28] border border-[#00ff3c] overflow-hidden' onClick={handleClickStart}>
            Go!!!
          </button>
          <button className='stop-btn text-red-500' onClick={handleClickStop}>
            Stop
          </button>
          {/* <button className='stop-btn' onClick={handleClickTest}>
            test
          </button> */}
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
          <FilterOutsourcingCompComponent/>
          {/* <FilterHeadhuntingComponent/> */}
          <ApiKeysConfigComponent />
        </div>

      </div>

    </div>
  );
}


export default App;