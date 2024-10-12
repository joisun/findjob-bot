
import { filterOutsourcingCompany } from '@/utils/storage'
import { Switch } from '@headlessui/react'
import cn from "classnames"
import { useState } from 'react'
import HeadlingTitle from './common/HeadlingTitle'
import Subtitle from './common/Subtitle'
export default function() {
  const [disabled, setDisabled] = useState(false)
  useEffect(() => {
    filterOutsourcingCompany.getValue().then(cache => {
      setDisabled(cache)
    })
  })
  function handleChange(disabled: boolean) {
    filterOutsourcingCompany.setValue(disabled)
    setDisabled(disabled)
  }
  return (
    <>
      <HeadlingTitle >过滤外包公司
        <Switch
          checked={disabled}
          onChange={handleChange}
          className={cn("group relative flex h-6 w-10 cursor-pointer rounded-full bg-white/10 p-[2px] transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10 ",
            disabled ? 'gradient-background' : ''
          )
          }
        >
          <span
            aria-hidden="true"
            className={cn("pointer-events-none inline-block h-full aspect-square translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-4",
            )}
          />
        </Switch></HeadlingTitle>
      <Subtitle>过滤通过内部维护常见外包公司名单 + AI判定的外包公司</Subtitle>
    </>
  )
}