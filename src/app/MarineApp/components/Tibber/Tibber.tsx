import ColumnContainer from "../ColumnContainer"
import MetricValues from "../MetricValues"
import NumericValue from "../../../components/NumericValue"

import TibberIcon from "../../images/icons/icon-tibber.svg"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
import { ListView } from "../ListView"
import { ExtraTibberMetrics } from "app/MarineApp/modules/ExtraMetrics"
import React from "react"

const Tibber = observer(() => {
  const {
    imported,
    exported,
    cost,
    reward,
    import_peak,
    export_peak,
    buy_price,
    buy_time,
    sell_price,
    sell_time,
    buy_price2,
    buy_time2,
    sell_price2,
    sell_time2,
    current_price,
    last_update,
    tibber_export_schedule_status,
  } = ExtraTibberMetrics()

  const visible = !!(imported || exported || imported === 0)
  const daily_profit = parseFloat((cost - reward).toFixed(2))
  const loss_or_gain = daily_profit < 0 ? " Day Profit" : " Day Cost"

  let day_total
  if (daily_profit <= 0) {
    day_total = Math.abs(daily_profit).toFixed(2)
  } else {
    day_total = daily_profit
  }

  useVisibilityNotifier({ widgetName: WIDGET_TYPES.TIBBER, visible })

  if (visible) {
    return (
      <ColumnContainer>
        <ListView
          icon={TibberIcon}
          title={"Tibber Now €" + parseFloat(current_price).toFixed(3) + " / kWh"}
          subTitle={"€ " + day_total + loss_or_gain + " / " + (exported - imported).toFixed(2) + "kWh Day Production"}
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
                    <span className="text--small text--subtitle-upper">Peak&nbsp;</span>
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
                    <span className="text--small text--subtitle-upper">Peak&nbsp;</span>
                    <NumericValue value={export_peak} unit="W" defaultValue={null} precision={1} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text--small text--subtitle-upper">24h Low&nbsp;</span>
                    <span>€ {buy_price}</span>
                    <span className="text--small"> @ {buy_time && buy_time.substring(0, 5)}</span>
                  </td>
                  <td>
                    <span className="text--small text--subtitle-upper">24h High&nbsp;</span>
                    <span>€ {sell_price}</span>
                    <span className="text--small"> @ {sell_time && sell_time.substring(0, 5)}</span>
                  </td>
                </tr>
                {buy_price2 !== "not_yet_published" && (
                  <tr>
                    <td>
                      <span className="text--small text--subtitle-upper">48h Low&nbsp;</span>
                      <span>€ {buy_price2}</span>
                      <span className="text--small"> @ {buy_time2 && buy_time2.substring(0, 5)}</span>
                    </td>
                    <td>
                      <span className="text--small text--subtitle-upper">48h High&nbsp;</span>
                      <span>€ {sell_price2}</span>
                      <span className="text--small"> @ {sell_time2 && sell_time2.substring(0, 5)}</span>
                    </td>
                  </tr>
                )}
              </table>
            </div>

            <ColumnContainer>
              <span className="text--opaque text--smaller">Last update: </span>
              <span className="text--smaller">{last_update}</span>
            </ColumnContainer>

            <span className="text--subtitle">
              <em>
                <span style={{ fontSize: "0.8rem" }}>{tibber_export_schedule_status}</span>
              </em>
            </span>
          </MetricValues>
        </ListView>
      </ColumnContainer>
    )
  } else {
    return null
  }
})

export default Tibber
