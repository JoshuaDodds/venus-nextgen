import React, { useMemo } from "react"

import ColumnContainer from "../ColumnContainer"
import MetricValues from "../MetricValues"
import NumericValue from "../../../components/NumericValue"

import TibberIcon from "../../images/icons/icon-tibber.svg"
import { useTopicsState, useTopicSubscriptions } from "@elninotech/mfd-modules"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
// import { translate } from "react-i18nify"
import { ListView } from "../ListView"

const Tibber = observer(() => {
  const {
    imported,
    exported,
    cost,
    reward,
    import_peak,
    export_peak,
    average_power,
    buy_price,
    buy_time,
    sell_price,
    sell_time,
  } = useTibber()
  const visible = !!(imported || exported || imported === 0)
  const daily_profit = parseFloat((cost - reward).toFixed(2))
  const loss_or_gain = daily_profit < 0 ? " Net Profit" : " Net Loss"
  let day_total
  if (daily_profit <= 0) {
    day_total = Math.abs(daily_profit).toFixed(2)
  } else {
    day_total = daily_profit
  }
  // let average_power_watts = parseFloat((average_power / 1000).toFixed(0))

  useVisibilityNotifier({ widgetName: WIDGET_TYPES.TIBBER, visible })

  if (visible) {
    return (
      <ColumnContainer>
        <ListView
          icon={TibberIcon}
          title="Tibber Daily"
          subTitle={
            "€ " + day_total + loss_or_gain + " / " + parseFloat(average_power).toFixed(0) + "W (Daily Average)"
          }
          child={false}
        >
          <MetricValues inflate>
            <div className="text--smaller">
              <table cellPadding="0" cellSpacing="0">
                <tr>
                  <td>
                    <span className="text--small text--subtitle-upper">Import&nbsp;</span>
                    <NumericValue value={imported} unit=" kWh" defaultValue={null} precision={2} />
                    <NumericValue value={cost} unit=" EUR" defaultValue={null} precision={2} />
                  </td>
                  <td>
                    <span className="text--small text--subtitle-upper">Max&nbsp;</span>
                    <NumericValue value={import_peak} unit="W" defaultValue={null} precision={1} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text--small text--subtitle-upper">Export&nbsp;</span>
                    <NumericValue value={exported} unit=" kWh" defaultValue={null} precision={2} />
                    <NumericValue value={reward} unit=" EUR" defaultValue={null} precision={2} />
                  </td>
                  <td>
                    <span className="text--small text--subtitle-upper">Max&nbsp;</span>
                    <NumericValue value={export_peak} unit="W" defaultValue={null} precision={1} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text--small text--subtitle-upper">Day Low&nbsp;</span>
                    <span>€ {buy_price}</span>
                    <span className="text--small"> @ {buy_time}</span>
                  </td>
                  <td>
                    <span className="text--small text--subtitle-upper">Day High&nbsp;</span>
                    <span>€ {sell_price}</span>
                    <span className="text--small"> @ {sell_time}</span>
                  </td>
                </tr>
              </table>
            </div>
          </MetricValues>
        </ListView>
      </ColumnContainer>
    )
  } else {
    return null
  }
})

function useTibber() {
  const getTopics = function () {
    return {
      imported: "Tibber/home/energy/day/imported",
      cost: "Tibber/home/energy/day/cost",
      exported: "Tibber/home/energy/day/exported",
      reward: "Tibber/home/energy/day/reward",
      import_peak: "Tibber/home/energy/day/import_peak",
      export_peak: "Tibber/home/energy/day/export_peak",
      average_power: "Tibber/home/energy/day/average_power",
      buy_price: "Tibber/home/price_info/today/lowest/0/cost",
      buy_time: "Tibber/home/price_info/today/lowest/0/hour",
      sell_price: "Tibber/home/price_info/today/highest/0/cost",
      sell_time: "Tibber/home/price_info/today/highest/0/hour",
    }
  }
  const topics = useMemo(function () {
    return getTopics()
  }, [])
  useTopicSubscriptions(topics)
  return useTopicsState(topics)
}

export default Tibber
