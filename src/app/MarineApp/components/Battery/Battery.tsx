import React, { Component, useMemo } from "react"

import { Battery, useBattery, useTopicsState, useTopicSubscriptions } from "@elninotech/mfd-modules"
import { BATTERY_STATE } from "../../../utils/constants"

import ColumnContainer from "../ColumnContainer"
import BatteryIcon from "../../images/icons/battery.svg"
import classnames from "classnames"
import { ListViewWithTotals, ListRow } from "../ListViewWithTotals"
import NumericValue from "../../../components/NumericValue"
import MetricValues from "../MetricValues"
import SelectorButton from "../SelectorButton"
import { BatteryLevel } from "./BatteryLevel"

import "./Battery.scss"

import LIcon from "../../images/icons/L.svg"
import RIcon from "../../images/icons/R.svg"
import { translate } from "react-i18nify"
import { observer } from "mobx-react"
import { useVisibilityNotifier } from "app/MarineApp/modules"
import { WIDGET_TYPES } from "app/MarineApp/utils/constants"

type PaginatorProps = {
  setPage: Function
  currentPage: number
  pages: number
}

const Paginator = ({ setPage, currentPage, pages }: PaginatorProps) => {
  return (
    <div className="battery__paginator">
      <SelectorButton alwaysUnlocked={true} disabled={currentPage < 1} onClick={() => setPage(currentPage - 1)}>
        <img src={LIcon} className="battery__paginator-button" alt={"Pagination button left"} />
      </SelectorButton>
      <span className="battery__paginator-page">{currentPage + 1}</span>
      <SelectorButton
        alwaysUnlocked={true}
        disabled={currentPage + 1 >= pages}
        onClick={() => setPage(currentPage + 1)}
      >
        <img src={RIcon} className="battery__paginator-button" alt={"Pagination button right"} />
      </SelectorButton>
    </div>
  )
}

type BatteryHeaderProps = {
  amount: number
  paginate: boolean
  setPage: Function
  currentPage: number
  pageSize: number
}

const BatteryHeader = ({ amount, paginate, setPage, currentPage, pageSize }: BatteryHeaderProps) => {
  let primaryBatteryPower = useBattery().batteries[amount - amount].power

  return (
    <ListViewWithTotals
      icon={BatteryIcon}
      title={translate("widgets." + (amount > 1 ? "batteries" : "battery"))}
      totals={primaryBatteryPower}
      subTitle={amount + " " + translate("widgets." + (amount > 1 ? "batteries" : "battery"))}
      child={true}
    >
      <ListRow>
        {paginate && <Paginator setPage={setPage} currentPage={currentPage} pages={Math.ceil(amount / pageSize)} />}
      </ListRow>
    </ListViewWithTotals>
  )
}

const BatteryRowMainInfo = (battery: Battery) => {
  return (
    <MetricValues inflate>
      <div className="metrics__left">
        <NumericValue value={battery.voltage} unit="V" defaultValue={null} precision={1} />
        <NumericValue value={battery.current} unit="A" defaultValue={null} precision={1} />
        <NumericValue value={battery.power} unit="W" defaultValue={null} />
      </div>
      {battery.soc !== undefined && <BatteryLevel battery={battery} />}
    </MetricValues>
  )
}

const BatteryRowAdditionalInfo = (battery: Battery) => {
  const {
    min_cell_temp,
    max_cell_temp,
    min_cell_volt,
    max_cell_volt,
    modules_online,
    capacity_available,
    capacity_installed,
    state_of_health,
  } = useCustomBatteryMetrics()
  const temperature_min_max = min_cell_temp + "° / " + max_cell_temp + "°"
  const cell_voltage_min_max =
    parseFloat(min_cell_volt).toFixed(2) + "v min " + parseFloat(max_cell_volt).toFixed(2) + "v max"

  const additionalInfo = !!((min_cell_temp && min_cell_volt && capacity_available && modules_online) || false)

  return (
    <MetricValues inflate>
      {additionalInfo && (
        <div className="metrics__left text--subtitle-upper">
          <ColumnContainer>
            <span>
              &nbsp;{temperature_min_max}
              <br /> min / max
            </span>
          </ColumnContainer>
          <ColumnContainer>
            <span>{cell_voltage_min_max}</span>
          </ColumnContainer>
          <ColumnContainer>
            {capacity_available} / {capacity_installed} Ah <br />
            SoH: {state_of_health}%
          </ColumnContainer>
          <ColumnContainer>{modules_online} Modules Online</ColumnContainer>
        </div>
      )}
    </MetricValues>
  )
}

const SingleBattery = (battery: Battery) => (
  <ListViewWithTotals
    icon={BatteryIcon}
    title={translate("widgets.battery")}
    totals={battery.power}
    subTitle={battery.name}
    child={false}
  >
    <ListRow>
      <BatteryRowMainInfo {...battery} />
    </ListRow>
    <ListRow>
      <BatteryRowAdditionalInfo {...battery} />
    </ListRow>
  </ListViewWithTotals>
)

type BatteryListProps = {
  batteries: Array<Battery | any>
  currentPage: number
  pageSize: number
}

class BatteryList extends Component<BatteryListProps> {
  ref = React.createRef<HTMLDivElement>()

  render() {
    const { batteries } = this.props
    return (
      <div
        className="batteries"
        ref={this.ref}
        style={this.ref.current && batteries.some((b) => b.dummy) ? { height: this.ref.current!.offsetHeight } : {}}
      >
        {batteries.map((battery, i) => {
          return (
            <div
              className={classnames("battery", {
                "battery--dummy": battery.dummy,
              })}
              key={i}
            >
              {!battery.dummy && (
                <div className="battery__data">
                  <div className="battery__title-row text--subtitle-upper">{battery.name}</div>
                  <BatteryRowMainInfo {...(battery as Battery)} />
                  <BatteryRowAdditionalInfo {...(battery as Battery)} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

type BatteriesProps = {
  batteries: Array<Battery>
}
type BatteriesState = {
  pageSize: number
  currentPage: number
}

export class Batteries extends Component<BatteriesProps, BatteriesState> {
  state = { pageSize: 1, currentPage: 0 }
  ref = React.createRef()

  setPage = (currentPage: number) => {
    this.setState({ currentPage })
  }

  updatePageSize() {
    const pageSize = window.innerHeight < 500 ? 1 : window.innerHeight < 700 ? 2 : 3

    if (pageSize !== this.state.pageSize) {
      this.setState({ pageSize })
      this.setPage(0)
    }
  }

  componentDidMount() {
    this.updatePageSize()
    window.addEventListener("resize", this.updatePageSize.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePageSize.bind(this))
  }

  render() {
    const { batteries } = this.props
    const pageSize = this.state.pageSize
    const paginate = batteries.length > pageSize
    const currentPage = this.state.currentPage

    const batteriesToShow: Array<any> = paginate
      ? batteries.slice(currentPage * pageSize, currentPage * pageSize + pageSize)
      : batteries
    // These fill the last page with empty elements if necessary
    const fillerBatteries = paginate
      ? [...Array(pageSize - batteriesToShow.length)].map(() => ({
          dummy: true,
        }))
      : []

    const MultipleBatteries = (
      <div className="metric metric__battery">
        <BatteryHeader
          amount={batteries.length}
          setPage={this.setPage}
          currentPage={currentPage}
          paginate={paginate}
          pageSize={pageSize}
        />
        <BatteryList
          batteries={batteriesToShow.concat(fillerBatteries)}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </div>
    )

    return batteries.length === 1 ? SingleBattery(batteries[0]) : MultipleBatteries
  }
}

export const BatteriesWithData = observer(() => {
  const { batteries } = useBattery()

  useVisibilityNotifier({
    widgetName: WIDGET_TYPES.BATTERY,
    visible: !!(batteries && batteries.length),
  })

  if (batteries) {
    // Sort batteries first by state, and then by ID to keep order consistent
    const sorted = batteries.slice().sort((a, b) => {
      // Show charging batteries before discharging batteries
      if (a.state === BATTERY_STATE.CHARGING && b.state !== BATTERY_STATE.CHARGING) return -1
      if (a.state !== BATTERY_STATE.CHARGING && b.state === BATTERY_STATE.CHARGING) return 1
      if (a.state === BATTERY_STATE.CHARGING && b.state === BATTERY_STATE.CHARGING) {
        return parseInt(a.id) - parseInt(b.id)
      }

      // Show discharging batteries before idle batteries
      if (a.state === BATTERY_STATE.DISCHARGING && b.state === BATTERY_STATE.IDLE) return -1
      if (a.state === BATTERY_STATE.IDLE && b.state === BATTERY_STATE.DISCHARGING) return 1
      if (a.state === BATTERY_STATE.DISCHARGING && b.state === BATTERY_STATE.DISCHARGING) {
        return parseInt(a.id) - parseInt(b.id)
      }

      return parseInt(a.id) - parseInt(b.id)
    })
    return (
      <ColumnContainer>
        <Batteries batteries={sorted} />
      </ColumnContainer>
    )
  } else {
    return <div />
  }
})

function useCustomBatteryMetrics() {
  const getTopics = function () {
    return {
      min_cell_temp: "N/48e7da878d35/battery/512/System/MinCellTemperature",
      max_cell_temp: "N/48e7da878d35/battery/512/System/MaxCellTemperature",
      min_cell_volt: "N/48e7da878d35/battery/512/System/MinCellVoltage",
      max_cell_volt: "N/48e7da878d35/battery/512/System/MaxCellVoltage",
      modules_online: "N/48e7da878d35/battery/512/System/NrOfModulesOnline",
      capacity_available: "N/48e7da878d35/battery/512/Capacity",
      capacity_installed: "N/48e7da878d35/battery/512/InstalledCapacity",
      state_of_health: "N/48e7da878d35/battery/512/Soh",
    }
  }
  const topics = useMemo(function () {
    return getTopics()
  }, [])
  useTopicSubscriptions(topics)
  return useTopicsState(topics)
}

export default BatteriesWithData
