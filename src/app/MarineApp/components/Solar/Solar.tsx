import ColumnContainer from "../ColumnContainer"
import NumericValue from "../../../components/NumericValue"
import SolarIcon from "../../images/icons/icon_solar.svg"
import { usePvCharger } from "@elninotech/mfd-modules"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
import { translate } from "react-i18nify"
import { ListViewWithTotals } from "../ListViewWithTotals"
import { ExtraSolarMetrics, ExtraVehicleMetrics } from "app/MarineApp/modules/ExtraMetrics"
import MetricValues from "../MetricValues"

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

  const { surplus_watts, load_reservation } = ExtraVehicleMetrics()

  const extraVisible = !!(c1_daily_yield || c2_daily_yield || current || false)
  const daily_yield = (c1_daily_yield || 0) + (c2_daily_yield || 0)
  const total_power = (string_a_power || 0) + (string_b_power || 0) + (string_c_power || 0) + (string_d_power || 0)

  if (visible) {
    return (
      <ColumnContainer>
        <ListViewWithTotals
          icon={SolarIcon}
          title={translate("widgets.solar")}
          totals={total_power || power}
          subTitle={false}
          child={false}
        >
          {extraVisible && (
            <div className="text--smaller">
              <span className="text--small text--subtitle-upper">Pv Current&nbsp;</span>
              <NumericValue value={current} unit=" Amps" precision={1} />
              {daily_yield ? <span className="text--small text--subtitle-upper">Production Today&nbsp;</span> : null}
              {daily_yield ? <NumericValue value={daily_yield} unit="kWh" precision={2} /> : null}
              <table cellPadding="0" cellSpacing="5" width="100%">
                <tr>
                  {string_a_volts && string_a_power ? (
                    <td>
                      <span className="text--small text--subtitle-upper">String A&nbsp;</span>
                      <NumericValue value={string_a_volts || 0} unit="V" defaultValue={null} precision={1} />
                      <NumericValue value={string_a_power || 0} unit="W" defaultValue={null} precision={1} />
                    </td>
                  ) : null}
                  {string_b_volts && string_b_power ? (
                    <td>
                      <span className="text--small text--subtitle-upper">String B&nbsp;</span>
                      <NumericValue value={string_b_volts || 0} unit="V" defaultValue={null} precision={1} />
                      <NumericValue value={string_b_power || 0} unit="W" defaultValue={null} precision={1} />
                    </td>
                  ) : null}
                </tr>
                <tr>
                  {string_c_volts && string_c_power ? (
                    <td>
                      <span className="text--small text--subtitle-upper">String C&nbsp;</span>
                      <NumericValue value={string_c_volts || 0} unit="V" defaultValue={null} precision={1} />
                      <NumericValue value={string_c_power || 0} unit="W" defaultValue={null} precision={1} />
                    </td>
                  ) : null}
                  {string_d_volts && string_d_power ? (
                    <td>
                      <span className="text--small text--subtitle-upper">String D&nbsp;</span>
                      <NumericValue value={string_d_volts || 0} unit="V" defaultValue={null} precision={1} />
                      <NumericValue value={string_d_power || 0} unit="W" defaultValue={null} precision={1} />
                    </td>
                  ) : null}
                </tr>
              </table>
              {surplus_watts && load_reservation ? (
                <table>
                  <tr>
                    <MetricValues>
                      <div className="text--small">
                        <td>
                          <span className="text--very-small text--subtitle-upper">Surplus:&nbsp;</span>
                          <NumericValue value={surplus_watts} unit="W" defaultValue={null} precision={1} />
                        </td>
                        <td>
                          <span className="text--very-small text--subtitle-upper">Reserved:&nbsp;</span>
                          <NumericValue value={load_reservation} unit="W" defaultValue={null} precision={1} />
                        </td>
                      </div>
                    </MetricValues>
                  </tr>
                </table>
              ) : null}
            </div>
          )}
        </ListViewWithTotals>
      </ColumnContainer>
    )
  } else {
    return null
  }
})

export default Solar
