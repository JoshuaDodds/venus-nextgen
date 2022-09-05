import ColumnContainer from "../ColumnContainer"
import MetricValues from "../MetricValues"
import NumericValue from "../../../components/NumericValue"

import TibberIcon from "../../images/icons/icon-tibber.svg"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
import { ListView } from "../ListView"
import { ExtraTibberMetrics } from "app/MarineApp/modules/ExtraMetrics"

const Tibber = observer(() => {
  const { imported, exported, cost, reward, import_peak, export_peak, buy_price, buy_time, sell_price, sell_time } =
    ExtraTibberMetrics()

  const visible = !!(imported || exported || imported === 0)
  const daily_profit = parseFloat((cost - reward).toFixed(2))
  const loss_or_gain = daily_profit < 0 ? " Profit" : " Cost"

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
          title="Tibber Daily"
          subTitle={"€ " + day_total + loss_or_gain + " / " + (exported - imported).toFixed(2) + "kWh Production"}
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

export default Tibber
