import ColumnContainer from "../ColumnContainer"
import MetricValues from "../MetricValues"
import NumericValue from "../../../components/NumericValue"

import SolarIcon from "../../images/icons/icon_solar.svg"
import { usePvCharger } from "@elninotech/mfd-modules"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
import { translate } from "react-i18nify"
import { ListViewWithTotals } from "../ListViewWithTotals"
import { ExtraSolarMetrics } from "app/MarineApp/modules/ExtraMetrics"

const Solar = observer(() => {
  const { current, power } = usePvCharger()
  const visible = !!(current || power || power === 0)

  useVisibilityNotifier({ widgetName: WIDGET_TYPES.SOLAR, visible })

  const {
    string_a_volts,
    string_b_volts,
    string_c_volts,
    string_d_volts,
    c1_daily_yield,
    c2_daily_yield,
    string_a_power,
    string_b_power,
    string_c_power,
    string_d_power,
  } = ExtraSolarMetrics()

  const extraVisible = !!((c1_daily_yield && c2_daily_yield) || false)
  const daily_yield = c1_daily_yield + c2_daily_yield

  if (visible) {
    return (
      <ColumnContainer>
        <ListViewWithTotals
          icon={SolarIcon}
          title={translate("widgets.solar")}
          totals={power}
          subTitle={false}
          child={false}
        >
          <MetricValues>
            {extraVisible && (
              <span>
                <span className="text--small text--subtitle-upper">Production Today&nbsp;</span>
                <NumericValue value={daily_yield} unit="kWh" precision={2} />
              </span>
            )}
            <span className="text--small text--subtitle-upper">Pv Current&nbsp;</span>
            <NumericValue value={current} unit=" Amps" precision={1} />
          </MetricValues>
          {extraVisible && (
            <MetricValues inflate>
              <div className="text--smaller">
                <table cellPadding="0" cellSpacing="5">
                  <tr>
                    <td>
                      <span className="text--small text--subtitle-upper">String A&nbsp;</span>
                      <NumericValue value={string_a_volts} unit="V" defaultValue={null} precision={1} />
                      <NumericValue value={string_a_power} unit="W" defaultValue={null} precision={1} />
                    </td>
                    <td>
                      <span className="text--small text--subtitle-upper">String B&nbsp;</span>
                      <NumericValue value={string_b_volts} unit="V" defaultValue={null} precision={1} />
                      <NumericValue value={string_b_power} unit="W" defaultValue={null} precision={1} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text--small text--subtitle-upper">String C&nbsp;</span>
                      <NumericValue value={string_c_volts} unit="V" defaultValue={null} precision={1} />
                      <NumericValue value={string_c_power} unit="W" defaultValue={null} precision={1} />
                    </td>
                    <td>
                      <span className="text--small text--subtitle-upper">String D&nbsp;</span>
                      <NumericValue value={string_d_volts} unit="V" defaultValue={null} precision={1} />
                      <NumericValue value={string_d_power} unit="W" defaultValue={null} precision={1} />
                    </td>
                  </tr>
                </table>
              </div>
            </MetricValues>
          )}
        </ListViewWithTotals>
      </ColumnContainer>
    )
  } else {
    return null
  }
})

export default Solar
