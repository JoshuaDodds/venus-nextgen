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

const SystemControl = observer(() => {
  const { publish } = useMqtt()

  const ControlTopics = {
    grid_import_enabled: "Tesla/settings/grid_charging_enabled",
    ac_in_power_setpoint: "W/48e7da878d35/settings/0/Settings/CGwacs/AcPowerSetPoint",
    battery_min_soc_limit: "W/48e7da878d35/settings/0/Settings/CGwacs/BatteryLife/MinimumSocLimit",
    max_charge_voltage: "W/48e7da878d35/settings/0/Settings/SystemSetup/MaxChargeVoltage",
  }

  const { grid_import_enabled, ac_in_power_setpoint, battery_min_soc_limit, max_charge_voltage } = SystemControlTopics()
  const visible = !!(grid_import_enabled || ac_in_power_setpoint || battery_min_soc_limit)
  useVisibilityNotifier({ widgetName: WIDGET_TYPES.SYSTEM_CONTROL, visible })

  const kwhOptions = [-10000.0, -6000.0, 0.0, 3000.0, 6000.0, 10000.0, 13000.0]

  const firstSelectorButtonNode = React.useRef<HTMLDivElement>(null)

  if (visible) {
    return (
      <ColumnContainer>
        <ListView icon={Icon} title={"AC In & ESS Control"} subTitle={""} child={false}>
          <table cellPadding="5px">
            <tr>
              <td>
                <span className="text--subtitle-upper">Max Chg V: </span> {max_charge_voltage.toFixed(1)}V
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
            <div className="inverter__mode-selector">
              <SelectorButton
                active={grid_import_enabled === "True"}
                disabled={grid_import_enabled === "False"}
                onClick={() => toggle_grid_input()}
              >
                GridAssist Charge Off
              </SelectorButton>
              <SelectorButton
                active={grid_import_enabled === "False"}
                disabled={grid_import_enabled === "True"}
                onClick={() => toggle_grid_input()}
              >
                GridAssist Charge On
              </SelectorButton>
            </div>
          </ListRow>
        </ListView>
      </ColumnContainer>
    )
  } else {
    return null
  }

  function set_ac_in_setpoint(watts: any) {
    publish(ControlTopics.ac_in_power_setpoint, watts)
  }

  function toggle_grid_input() {
    if (grid_import_enabled === "True") {
      publish(ControlTopics.grid_import_enabled, "False")
    } else {
      publish(ControlTopics.grid_import_enabled, "True")
    }
  }
})

export default SystemControl
