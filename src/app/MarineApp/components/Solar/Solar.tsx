import React, { useMemo } from "react";

import ColumnContainer from "../ColumnContainer";
import MetricValues from "../MetricValues";
import NumericValue from "../../../components/NumericValue";

import SolarIcon from "../../images/icons/icon_solar.svg";
import {
  usePvCharger,
  useTopicsState,
  useTopicSubscriptions,
} from "@elninotech/mfd-modules";
import { observer } from "mobx-react";
import { useVisibilityNotifier } from "app/MarineApp/modules";
import { WIDGET_TYPES } from "app/MarineApp/utils/constants";
import { translate } from "react-i18nify";
import { ListViewWithTotals } from "../ListViewWithTotals";

const Solar = observer(() => {
  const { current, power } = usePvCharger();
  const pvExtra = usePvDetail();
  const visible = !!(current || power || power === 0);
  const daily_yield = pvExtra.c1_daily_yield + pvExtra.c2_daily_yield;
  useVisibilityNotifier({ widgetName: WIDGET_TYPES.SOLAR, visible });

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
            <span className="text--small text--subtitle-upper">
              Production Today&nbsp;
            </span>
            <NumericValue value={daily_yield} unit="kWh" precision={2} />
            <span className="text--small text--subtitle-upper">
              Pv Current&nbsp;
            </span>
            <NumericValue value={current} unit=" Amps" precision={1} />
          </MetricValues>
          <MetricValues inflate>
            <div className="text--smaller">
              <table cellPadding="0" cellSpacing="5">
                <tr>
                  <td>
                    <span className="text--small text--subtitle-upper">
                      String A&nbsp;
                    </span>
                    <NumericValue
                      value={pvExtra.string_a_volts}
                      unit="V"
                      defaultValue={null}
                      precision={1}
                    />
                    <NumericValue
                      value={pvExtra.string_a_power}
                      unit="W"
                      defaultValue={null}
                      precision={1}
                    />
                  </td>
                  <td>
                    <span className="text--small text--subtitle-upper">
                      String B&nbsp;
                    </span>
                    <NumericValue
                      value={pvExtra.string_b_volts}
                      unit="V"
                      defaultValue={null}
                      precision={1}
                    />
                    <NumericValue
                      value={pvExtra.string_b_power}
                      unit="W"
                      defaultValue={null}
                      precision={1}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="text--small text--subtitle-upper">
                      String C&nbsp;
                    </span>
                    <NumericValue
                      value={pvExtra.string_c_volts}
                      unit="V"
                      defaultValue={null}
                      precision={1}
                    />
                    <NumericValue
                      value={pvExtra.string_c_power}
                      unit="W"
                      defaultValue={null}
                      precision={1}
                    />
                  </td>
                  <td>
                    <span className="text--small text--subtitle-upper">
                      String D&nbsp;
                    </span>
                    <NumericValue
                      value={pvExtra.string_d_volts}
                      unit="V"
                      defaultValue={null}
                      precision={1}
                    />
                    <NumericValue
                      value={pvExtra.string_d_power}
                      unit="W"
                      defaultValue={null}
                      precision={1}
                    />
                  </td>
                </tr>
              </table>
            </div>
          </MetricValues>
        </ListViewWithTotals>
      </ColumnContainer>
    );
  } else {
    return null;
  }
});

function usePvDetail() {
  const getTopics = function () {
    return {
      string_a_volts: "N/48e7da878d35/solarcharger/279/Pv/0/V",
      string_a_power: "N/48e7da878d35/solarcharger/279/Pv/0/P",
      string_d_volts: "N/48e7da878d35/solarcharger/279/Pv/1/V",
      string_d_power: "N/48e7da878d35/solarcharger/279/Pv/1/P",
      //
      string_b_volts: "N/48e7da878d35/solarcharger/280/Pv/1/V",
      string_b_power: "N/48e7da878d35/solarcharger/280/Pv/1/P",
      string_c_volts: "N/48e7da878d35/solarcharger/280/Pv/0/V",
      string_c_power: "N/48e7da878d35/solarcharger/280/Pv/0/P",
      //
      c2_daily_yield: "N/48e7da878d35/solarcharger/279/History/Daily/0/Yield",
      c1_daily_yield: "N/48e7da878d35/solarcharger/280/History/Daily/0/Yield",
    };
  };
  const topics = useMemo(function () {
    return getTopics();
  }, []);
  useTopicSubscriptions(topics);
  return useTopicsState(topics);
}

export default Solar;
