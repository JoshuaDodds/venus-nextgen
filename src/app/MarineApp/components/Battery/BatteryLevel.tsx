import { BATTERY_STATE } from "../../../utils/constants"
import { Battery, useLanguage } from "@elninotech/mfd-modules"
import { formatNumber } from "../../../components/NumericValue"
import { translate, Translate } from "react-i18nify"
import { mfdLanguageOptions } from "app/locales/constants"
import { observer } from "mobx-react"

const batteryStateFormatter = (value: number) => {
  switch (value) {
    case BATTERY_STATE.CHARGING:
      return "charging"
    case BATTERY_STATE.DISCHARGING:
      return "discharging"
    case BATTERY_STATE.IDLE:
      return "idle"
    default:
      return null
  }
}

const batteryTimeToGoFormatter = (timeToGo: number) => {
  const secs = timeToGo
  if (!isNaN(secs)) {
    // const days = Math.floor(secs / 86400)
    // const hours = Math.floor((secs - days * 86400) / 3600)
    // const minutes = Math.floor((secs - hours * 3600) / 60)
    // const seconds = Math.floor(secs - minutes * 60)

    // if (days) return `${days}${translate("common.days")}`
    // else if (hours) return `${hours}${translate("common.hours")}`
    // else if (minutes) return `${minutes}${translate("common.minutes")}`

    const hours = (secs / 3600).toFixed(2)
    return `${hours}${translate("common.hours")}`
  } else {
    return null
  }
}

type BatteryLevelProps = {
  battery: Battery
}

function calculateChargeTime(batteryCapacity_kWh: number, currentCharge_watts: number): number {
  const batteryCapacity_wh: number = batteryCapacity_kWh * 1000
  const chargeTime_seconds: number = (batteryCapacity_wh / currentCharge_watts) * 3600
  return Math.floor(chargeTime_seconds)
}

function calculateSoCLeftToCharge(currentSoC: number, capacity_kWh: number, targetSoC: number): number {
  currentSoC = Math.max(0, Math.min(100, currentSoC))
  targetSoC = Math.max(0, Math.min(100, targetSoC))
  capacity_kWh = Math.abs(capacity_kWh)
  const remainingSoC = targetSoC - currentSoC

  if (remainingSoC <= 0) {
    return 0
  }

  return (remainingSoC / 100) * capacity_kWh
}

export const BatteryLevel = observer(({ battery }: BatteryLevelProps) => {
  useLanguage(mfdLanguageOptions)

  const batteryStateLabel = batteryStateFormatter(battery.state!)
  const leftToCCharge = calculateSoCLeftToCharge(battery.soc, 40, 100)
  const chargeTimeToGoLabel = batteryTimeToGoFormatter(calculateChargeTime(leftToCCharge!, battery.power!)) + " "
  const showSoc = battery.soc !== undefined && battery.soc !== null

  let batteryLabelClass = typeof batteryStateLabel === "string" ? "-" + batteryStateLabel.toLowerCase() : "idle"

  return (
    <div className={"metrics__right battery-level" + batteryLabelClass}>
      {batteryStateLabel && (
        <span>
          <Translate data-test-id="batteryStatus" value={"common." + batteryStateLabel} />
        </span>
      )}
      <div className="charge-indicator">
        {showSoc && (
          <>
            <span>{formatNumber({ value: battery.soc, precision: 1 })}</span>
            <span>%</span>
          </>
        )}
        {(battery.state === BATTERY_STATE.DISCHARGING || battery.state === BATTERY_STATE.CHARGING) && (
          <div className="time-to-go">
            {battery.state === BATTERY_STATE.DISCHARGING
              ? batteryTimeToGoFormatter(battery.timetogo!) + " "
              : chargeTimeToGoLabel}
          </div>
        )}
      </div>
    </div>
  )
})
