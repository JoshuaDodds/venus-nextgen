import ColumnContainer from "../ColumnContainer"
import Icon from "../../images/icons/ac.svg"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
import { SystemControlTopics } from "app/MarineApp/modules/ExtraMetrics"
import SelectorButton from "../SelectorButton"
import HeaderView from "../HeaderView"
import { useMqtt } from "@elninotech/mfd-modules"
import { ListRow } from "../ListView"
import React from "react"

const SystemControl = observer(() => {
  const { publish } = useMqtt()
  const { grid_import_enabled, ac_in_power_setpoint, battery_min_soc_limit, max_charge_voltage } = SystemControlTopics()
  const visible = !!(grid_import_enabled || ac_in_power_setpoint || battery_min_soc_limit)
  useVisibilityNotifier({ widgetName: WIDGET_TYPES.SYSTEM_CONTROL, visible })

  const ControlTopics = {
    grid_import_enabled: "Tesla/settings/grid_charging_enabled",
    ac_in_power_setpoint: "W/48e7da878d35/settings/0/Settings/CGwacs/AcPowerSetPoint",
    battery_min_soc_limit: "W/48e7da878d35/settings/0/Settings/CGwacs/BatteryLife/MinimumSocLimit",
    max_charge_voltage: "W/48e7da878d35/settings/0/Settings/SystemSetup/MaxChargeVoltage",
  }

  if (visible) {
    return (
      <ColumnContainer>
        <HeaderView icon={Icon} title={"AC In & ESS Control"} subTitle={""} child={false}>
          <ListRow>
            <table>
              <tr>
                <td>
                  <span className="text--subtitle-upper">Max Charge Voltage: </span> {max_charge_voltage.toFixed(1)}V
                </td>
                <td>
                  <span className="text--subtitle-upper">Ac-In Target: </span>
                  {ac_in_power_setpoint}W
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text--subtitle-upper">Min SoC: </span>
                  {battery_min_soc_limit}%
                </td>
              </tr>
            </table>
          </ListRow>
          <ListRow>
            <div className="inverter__mode-selector">
              <SelectorButton
                active={grid_import_enabled === "True"}
                disabled={grid_import_enabled === "False"}
                onClick={() => toggle_grid_input()}
              >
                Import Disable
              </SelectorButton>
              <SelectorButton
                active={grid_import_enabled === "False"}
                disabled={grid_import_enabled === "True"}
                onClick={() => toggle_grid_input()}
              >
                Import Enable
              </SelectorButton>
            </div>
          </ListRow>
        </HeaderView>
      </ColumnContainer>
    )
  } else {
    return null
  }

  function toggle_grid_input() {
    if (grid_import_enabled === "True") {
      publish(ControlTopics.grid_import_enabled, "False")
      publish(ControlTopics.ac_in_power_setpoint, "0.0")
    } else {
      publish(ControlTopics.grid_import_enabled, "True")
      publish(ControlTopics.ac_in_power_setpoint, "12000.0")
    }
  }
})

export default SystemControl
