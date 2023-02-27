import React from "react"

import ColumnContainer from "../ColumnContainer"
import MetricValues from "../MetricValues"
import NumericValue from "../../../components/NumericValue"

import TeslaIcon from "../../images/icons/icon-tesla.svg"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
import { ListViewWithTotals } from "../ListViewWithTotals"
import { ExtraVehicleMetrics } from "app/MarineApp/modules/ExtraMetrics"

const Vehicle = observer(() => {
  const vehicle = ExtraVehicleMetrics()
  const visible = !!(
    (vehicle.battery_soc &&
      vehicle.charging_status &&
      vehicle.charging_amps &&
      vehicle.battery_soc_setpoint &&
      vehicle.charging_watts &&
      vehicle.plugged_status) ||
    false
  )

  useVisibilityNotifier({ widgetName: WIDGET_TYPES.VEHICLE, visible })

  const vehicle_name = "Vehicle: " + vehicle.vehicle_name || "My Tesla Vehicle"
  const surplus_deficiency = function () {
    if (vehicle.insufficient_surplus === "true") {
      return " / (Insufficient surplus)"
    } else {
      return ""
    }
  }

  const subtitle = vehicle.charging_status + " / " + vehicle.plugged_status + " " + surplus_deficiency()
  const eta = vehicle.time_until_full

  if (visible) {
    return (
      <ColumnContainer>
        <ListViewWithTotals
          icon={TeslaIcon}
          title={vehicle_name}
          totals={parseFloat(vehicle.charging_watts)}
          subTitle={subtitle}
          child={false}
        >
          <table>
            <tr>
              <MetricValues>
                <td>
                  <span className="text--small text--subtitle-upper">Amps:&nbsp;</span>
                  <NumericValue value={vehicle.charging_amps} unit="A" defaultValue={null} precision={1} />
                </td>
                <td>
                  <span className="text--very-small text--subtitle-upper">SoC:&nbsp;</span>
                  <NumericValue value={vehicle.battery_soc} unit="%" defaultValue={null} precision={1} />
                </td>
                <td>
                  <span className="text--very-small text--subtitle-upper">Limit:&nbsp;</span>
                  <NumericValue value={vehicle.battery_soc_setpoint} unit="%" defaultValue={null} precision={1} />
                </td>
                <td>
                  <span className="text--very-small text--subtitle-upper">ETA:&nbsp;</span>
                  <span>{eta}</span>
                </td>
              </MetricValues>
            </tr>
            <tr>
              <span className="text--opaque text--smaller">Last update: </span>
              <span className="text--smaller">
                {(vehicle.last_update_at = 0 ? "Pending..." : vehicle.last_update_at)}
              </span>
            </tr>
          </table>
        </ListViewWithTotals>
      </ColumnContainer>
    )
  } else {
    return null
  }
})

export default Vehicle
