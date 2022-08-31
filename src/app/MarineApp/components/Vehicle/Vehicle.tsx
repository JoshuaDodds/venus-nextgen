import React from "react"

import ColumnContainer from "../ColumnContainer"
import MetricValues from "../MetricValues"
import NumericValue from "../../../components/NumericValue"

import TeslaIcon from "../../images/icons/icon-tesla.svg"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
// import { translate } from "react-i18nify"  todo: uncomment this when i18n files are ready
import { ListView } from "../ListView"
import { useTopicsState, useTopicSubscriptions } from "@elninotech/mfd-modules"
import { useMemo } from "react"

const Vehicle = observer(() => {
  const vehicle = useVehicle()
  const visible = !!(
    (vehicle.battery_soc &&
      vehicle.charging_status &&
      vehicle.charging_amps &&
      vehicle.battery_soc_setpoint &&
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
  const eta = vehicle.time_until_full > 0 ? vehicle.time_until_full + " Mins" : "N/A"

  if (visible) {
    return (
      <ColumnContainer>
        <ListView icon={TeslaIcon} title={vehicle_name} subTitle={subtitle} child={false}>
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
              <MetricValues>
                <div className="text--small">
                  <td>
                    <span className="text--very-small text--subtitle-upper">PV Surplus:&nbsp;</span>
                    <NumericValue value={vehicle.surplus_watts} unit="W" defaultValue={null} precision={1} />
                  </td>
                  <td>
                    <span className="text--very-small text--subtitle-upper">Watts Reserved:&nbsp;</span>
                    <NumericValue value={vehicle.load_reservation} unit="W" defaultValue={null} precision={1} />
                  </td>
                </div>
              </MetricValues>
            </tr>
          </table>
        </ListView>
      </ColumnContainer>
    )
  } else {
    return null
  }
})

function useVehicle() {
  const getTopics = function () {
    return {
      vehicle_name: "Tesla/vehicle0/vehicle_name",
      charging_status: "Tesla/vehicle0/charging_status",
      charging_amps: "Tesla/vehicle0/charging_amps",
      battery_soc: "Tesla/vehicle0/battery_soc",
      battery_soc_setpoint: "Tesla/vehicle0/battery_soc_setpoint",
      plugged_status: "Tesla/vehicle0/plugged_status",
      surplus_watts: "Tesla/vehicle0/solar/surplus_watts",
      load_reservation: "Tesla/vehicle0/solar/load_reservation",
      insufficient_surplus: "Tesla/vehicle0/solar/insufficient_surplus",
      time_until_full: "Tesla/vehicle0/time_until_full",
    }
  }
  const topics = useMemo(function () {
    return getTopics()
  }, [])
  useTopicSubscriptions(topics)
  return useTopicsState(topics)
}

export default Vehicle
