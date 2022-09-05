import { useAcLoads } from "@elninotech/mfd-modules"

import HeaderView from "../HeaderView"
import ColumnContainer from "../ColumnContainer"
import MetricValues from "../MetricValues"
import NumericValue from "../../../components/NumericValue"
import { ListViewWithTotals, ListRow } from "../ListViewWithTotals"

import AcIcon from "../../images/icons/ac.svg"
import { translate, Translate } from "react-i18nify"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"
import { ExtraAcMetrics } from "app/MarineApp/modules/ExtraMetrics"

const AcLoads = observer(() => {
  const { current, voltage, power, phases } = useAcLoads()
  const { house_load, ev_charger_load } = ExtraAcMetrics()
  const showAsList = phases > 1

  const hasEvCharger = !!(house_load && ev_charger_load)
  const isVisible = !!(current && voltage && power && phases)
  let phaseTotals = power.reduce((p, n) => (p && n ? p + n : p))

  useVisibilityNotifier({
    widgetName: WIDGET_TYPES.AC_LOADS,
    visible: isVisible,
  })

  if (isVisible) {
    return showAsList ? (
      <ColumnContainer>
        <ListViewWithTotals
          icon={AcIcon}
          title={<Translate value="widgets.acLoads" />}
          totals={hasEvCharger ? parseFloat(house_load) : phaseTotals}
          subTitle={<Translate value="common.nrOfPhases" phases={phases} />}
          child={false}
        >
          {voltage.slice(0, phases).map(
            (v, i) =>
              v && (
                <ListRow key={i}>
                  <span className="value value__phase">L{i + 1}</span>
                  <NumericValue value={v} unit="V" />
                  <NumericValue value={current[i]} unit="A" precision={1} />
                  <NumericValue value={power[i]} unit={"W"} />
                </ListRow>
              )
          )}
        </ListViewWithTotals>
      </ColumnContainer>
    ) : (
      <ColumnContainer>
        <HeaderView icon={AcIcon} title={translate("widgets.acLoads")}>
          <MetricValues>
            <NumericValue value={voltage[0]} unit="V" />
            <NumericValue value={current[0]} unit="A" precision={1} />
            <NumericValue value={power[0]} unit={"W"} />
          </MetricValues>
        </HeaderView>
      </ColumnContainer>
    )
  } else {
    return <div />
  }
})

export default AcLoads
