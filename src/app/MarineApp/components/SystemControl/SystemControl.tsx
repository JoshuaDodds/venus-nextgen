import ColumnContainer from "../ColumnContainer"
import Icon from "../../images/icons/ac.svg"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
import { SystemControlTopics } from "app/MarineApp/modules/ExtraMetrics"
import SelectorButton from "../SelectorButton"
import { useMqtt } from "@elninotech/mfd-modules"
import { ListRow, ListView } from "../ListView"
import React from "react"

import "./SystemControl.scss"

const SystemControl = observer(() => {
  const { publish, portalId } = useMqtt()

  const ControlTopics = {
    grid_import_enabled: "Tesla/settings/grid_charging_enabled",
    ac_in_power_setpoint: `W/${portalId}/settings/0/Settings/CGwacs/AcPowerSetPoint`,
    n_ac_in_power_setpoint: `N/${portalId}/settings/0/Settings/CGwacs/AcPowerSetPoint`,
    battery_min_soc_limit: `W/${portalId}/settings/0/Settings/CGwacs/BatteryLife/MinimumSocLimit`,
    max_charge_voltage: `W/${portalId}/settings/0/Settings/SystemSetup/MaxChargeVoltage`,
    system_shutdown: "Cerbomoticzgx/system/shutdown",
    ess_net_metering_enabled: "Cerbomoticzgx/system/EssNetMeteringEnabled",
    ess_net_metering_overridden: "Cerbomoticzgx/system/EssNetMeteringOverridden",
    ess_net_metering_batt_min_soc: "Cerbomoticzgx/system/EssNetMeteringBattMinSoc",
  }

  const {
    grid_import_enabled,
    ac_in_power_setpoint,
    battery_min_soc_limit,
    max_charge_voltage,
    system_shutdown,
    ess_net_metering_enabled,
    ess_net_metering_batt_min_soc,
  } = SystemControlTopics()

  const visible = !!(grid_import_enabled || ac_in_power_setpoint || battery_min_soc_limit)
  useVisibilityNotifier({ widgetName: WIDGET_TYPES.SYSTEM_CONTROL, visible })

  const kwhOptions = [-13000.0, -10000.0, -6000.0, 0.0, 3000.0, 10000.0, 13000.0]
  const dischargeOptions = [20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0]

  const firstSelectorButtonNode = React.useRef<HTMLDivElement>(null)

  if (visible) {
    return (
      <ColumnContainer>
        <ListView icon={Icon} title={"Manual System Control"} subTitle={""} child={false}>
          <table cellPadding="5px">
            <tr>
              <td>
                <span className="text--subtitle-upper">Max Chg V: </span>
                {max_charge_voltage ? max_charge_voltage.toFixed(1) + "V" : "N/A"}
              </td>
              <td>
                <span className="text--subtitle-upper">Grid Setpoint: </span>
                {ac_in_power_setpoint}W
              </td>
              <td>
                <span className="text--subtitle-upper">Min SoC: </span>
                {battery_min_soc_limit}%
              </td>
            </tr>
            <tr>
              <td>
                <span className="text--subtitle-upper">Dynamic ESS SoC Limit: </span>
                {ess_net_metering_batt_min_soc}%
              </td>
            </tr>
          </table>
          <ListRow>
            {kwhOptions.map((currentValue, index) => {
              const ref = index === 0 ? firstSelectorButtonNode : null
              return (
                <div ref={ref}>
                  <SelectorButton
                    key={currentValue}
                    className={"selector-button__gridsetpoint text--small"}
                    active={ac_in_power_setpoint === currentValue}
                    onClick={() => set_ac_in_setpoint(currentValue)}
                    large
                  >
                    {currentValue / 1000}kW
                  </SelectorButton>
                </div>
              )
            })}
          </ListRow>
          <ListRow>
            {dischargeOptions.map((currentValue, index) => {
              const ref = index === 0 ? firstSelectorButtonNode : null
              return (
                <div ref={ref}>
                  <SelectorButton
                    key={currentValue.toFixed(1)}
                    className={"selector-button__gridsetpoint text--small"}
                    active={ess_net_metering_batt_min_soc === currentValue.toFixed(1)}
                    onClick={() => set_ess_net_metering_batt_min_soc(currentValue.toFixed(1))}
                    large
                  >
                    {currentValue}%
                  </SelectorButton>
                </div>
              )
            })}
          </ListRow>
          <ListRow>
            <div className="gridassist__mode-selector">
              <SelectorButton
                active={grid_import_enabled === "True"}
                disabled={grid_import_enabled === "False"}
                onClick={() => toggle_grid_input()}
              >
                Disable GridAssist Charge
              </SelectorButton>
            </div>
            <div className="gridassist__mode-selector">
              <SelectorButton
                active={grid_import_enabled === "False"}
                disabled={grid_import_enabled === "True"}
                onClick={() => toggle_grid_input()}
              >
                Activate GridAssist Charge
              </SelectorButton>
            </div>
          </ListRow>
          <ListRow>
            <div className="gridassist__mode-selector">
              <SelectorButton
                active={system_shutdown === "False"}
                disabled={system_shutdown === "True"}
                onClick={() => send_system_shutdown_message()}
              >
                Restart CerbomoticzGX Service
              </SelectorButton>
            </div>
            <div className="gridassist__mode-selector">
              <SelectorButton
                active={ess_net_metering_enabled === "True"}
                // disabled={ess_net_metering_enabled === "False"}
                onClick={() => toggle_ess_net_metering()}
              >
                {ess_net_metering_enabled === "True" ? "Disable ESS Net Metering" : "Enable ESS Net Metering"}
              </SelectorButton>
            </div>
          </ListRow>
        </ListView>
      </ColumnContainer>
    )
  } else {
    return null
  }

  function set_ess_net_metering_batt_min_soc(percent: any) {
    percent = percent.toString()
    publish(ControlTopics.ess_net_metering_batt_min_soc, percent, { retain: true })
  }

  function set_ac_in_setpoint(watts: any) {
    watts = watts.toString() + ".0"
    publish(ControlTopics.ac_in_power_setpoint, watts)
    publish(ControlTopics.n_ac_in_power_setpoint, watts)
    watts === "0.0"
      ? publish(ControlTopics.ess_net_metering_overridden, "False", { retain: true })
      : publish(ControlTopics.ess_net_metering_overridden, "True", { retain: true })
  }

  function toggle_grid_input() {
    if (grid_import_enabled === "True") {
      publish(ControlTopics.grid_import_enabled, "False", { retain: true })
      publish(ControlTopics.ess_net_metering_overridden, "False", { retain: true })
      publish(grid_import_enabled, "False", { retain: true })
    } else {
      publish(ControlTopics.grid_import_enabled, "True", { retain: true })
      publish(ControlTopics.ess_net_metering_overridden, "True", { retain: true })
      publish(grid_import_enabled, "True", { retain: true })
    }
  }

  function send_system_shutdown_message() {
    publish(ControlTopics.system_shutdown, "True")
  }

  function toggle_ess_net_metering() {
    if (ess_net_metering_enabled === "True") {
      publish(ControlTopics.ess_net_metering_enabled, "False", { retain: true })
    } else {
      publish(ControlTopics.ess_net_metering_enabled, "True", { retain: true })
    }
  }
})

export default SystemControl
