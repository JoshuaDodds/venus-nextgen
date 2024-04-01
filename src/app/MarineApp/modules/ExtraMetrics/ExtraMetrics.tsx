import { useMemo } from "react"
import { PortalId, useMqtt, useTopicsState, useTopicSubscriptions } from "@elninotech/mfd-modules"

export function ExtraTibberMetrics() {
  const getTopics = function () {
    return {
      imported: "Tibber/home/energy/day/imported",
      cost: "Tibber/home/energy/day/cost",
      exported: "Tibber/home/energy/day/exported",
      reward: "Tibber/home/energy/day/reward",
      import_peak: "Tibber/home/energy/day/import_peak",
      export_peak: "Tibber/home/energy/day/export_peak",
      average_power: "Tibber/home/energy/day/average_power",
      last_update: "Tibber/home/energy/day/last_update",
      buy_price: "Tibber/home/price_info/today/lowest/0/cost",
      buy_time: "Tibber/home/price_info/today/lowest/0/hour",
      sell_price: "Tibber/home/price_info/today/highest/0/cost",
      sell_time: "Tibber/home/price_info/today/highest/0/hour",
      buy_price2: "Tibber/home/price_info/tomorrow/lowest/0/cost",
      buy_time2: "Tibber/home/price_info/tomorrow/lowest/0/hour",
      sell_price2: "Tibber/home/price_info/tomorrow/highest/0/cost",
      sell_time2: "Tibber/home/price_info/tomorrow/highest/0/hour",
      current_price: "Tibber/home/price_info/now/total",
      tibber_export_schedule_status: "Tibber/home/price_info/today/tibber_export_schedule_status",
    }
  }
  const topics = useMemo(function () {
    return getTopics()
  }, [])
  useTopicSubscriptions(topics)
  return useTopicsState(topics)
}

export function ExtraVehicleMetrics() {
  const getTopics = function () {
    return {
      vehicle_name: "Tesla/vehicle0/vehicle_name",
      charging_status: "Tesla/vehicle0/charging_status",
      charging_amps: "Tesla/vehicle0/charging_amps",
      charging_watts: "Tesla/vehicle0/charging_watts",
      battery_soc: "Tesla/vehicle0/battery_soc",
      battery_soc_setpoint: "Tesla/vehicle0/battery_soc_setpoint",
      plugged_status: "Tesla/vehicle0/plugged_status",
      surplus_watts: "Tesla/vehicle0/solar/surplus_watts",
      load_reservation: "Tesla/vehicle0/solar/load_reservation",
      insufficient_surplus: "Tesla/vehicle0/solar/insufficient_surplus",
      time_until_full: "Tesla/vehicle0/time_until_full",
      last_update_at: "Tesla/vehicle0/last_update_at",
    }
  }
  const topics = useMemo(function () {
    return getTopics()
  }, [])
  useTopicSubscriptions(topics)
  return useTopicsState(topics)
}

export function ExtraAcMetrics() {
  const getTopics = function () {
    return {
      house_load: "Tesla/vehicle0/Ac/ac_loads",
      ev_charger_load: "Tesla/vehicle0/Ac/tesla_load",
    }
  }
  const topics = useMemo(function () {
    return getTopics()
  }, [])
  useTopicSubscriptions(topics)
  return useTopicsState(topics)
}

export function SystemControlTopics() {
  const getTopics = (portalId: PortalId) => {
    return {
      grid_import_enabled: "Tesla/settings/grid_charging_enabled",
      ac_in_power_setpoint: `N/${portalId}/settings/0/Settings/CGwacs/AcPowerSetPoint`,
      battery_min_soc_limit: `N/${portalId}/settings/0/Settings/CGwacs/BatteryLife/MinimumSocLimit`,
      max_charge_voltage: `N/${portalId}/settings/0/Settings/SystemSetup/MaxChargeVoltage`,
      system_shutdown: "Cerbomoticzgx/system/shutdown",
      ess_net_metering_enabled: "Cerbomoticzgx/system/EssNetMeteringEnabled",
      ess_net_metering_batt_min_soc: "Cerbomoticzgx/GlobalState/ess_net_metering_batt_min_soc",
    }
  }
  const { portalId } = useMqtt()
  const topics = useMemo(() => getTopics(portalId), [portalId])
  useTopicSubscriptions(topics)
  return useTopicsState(topics)
}

export function ExtraBatteryMetrics() {
  const getTopics = (portalId: PortalId) => {
    return {
      shared_temp_sense: `N/${portalId}/system/0/Dc/Battery/Temperature`,
      min_cell_temp: `N/${portalId}/battery/512/System/MinCellTemperature`,
      max_cell_temp: `N/${portalId}/battery/512/System/MaxCellTemperature`,
      min_cell_volt: `N/${portalId}/battery/512/System/MinCellVoltage`,
      max_cell_volt: `N/${portalId}/battery/512/System/MaxCellVoltage`,
      modules_online: `N/${portalId}/battery/512/System/NrOfModulesOnline`,
      capacity_available: `N/${portalId}/battery/512/Capacity`,
      capacity_installed: `N/${portalId}/battery/512/InstalledCapacity`,
      state_of_health: `N/${portalId}/battery/512/Soh`,
      discharged_capacity: `N/${portalId}/battery/277/History/DischargedEnergy`,
      lfp_voltage: `N/${portalId}/battery/512/Dc/0/Voltage`,
    }
  }
  const { portalId } = useMqtt()
  const topics = useMemo(() => getTopics(portalId), [portalId])
  useTopicSubscriptions(topics)
  return useTopicsState(topics)
}

export function ExtraSolarMetrics() {
  const getTopics = (portalId: PortalId) => {
    return {
      string_a_volts: `N/${portalId}/solarcharger/283/Pv/0/V`,
      string_a_power: `N/${portalId}/solarcharger/283/Pv/0/P`,
      string_d_volts: `N/${portalId}/solarcharger/283/Pv/1/V`,
      string_d_power: `N/${portalId}/solarcharger/283/Pv/1/P`,
      //
      string_b_volts: `N/${portalId}/solarcharger/282/Pv/1/V`,
      string_b_power: `N/${portalId}/solarcharger/282/Pv/1/P`,
      string_c_volts: `N/${portalId}/solarcharger/282/Pv/0/V`,
      string_c_power: `N/${portalId}/solarcharger/282/Pv/0/P`,
      //
      c2_daily_yield: `N/${portalId}/solarcharger/283/History/Daily/0/Yield`,
      c1_daily_yield: `N/${portalId}/solarcharger/282/History/Daily/0/Yield`,
      pv_projected_today: `Cerbomoticzgx/GlobalState/pv_projected_today`,
    }
  }
  const { portalId } = useMqtt()
  const topics = useMemo(() => getTopics(portalId), [portalId])
  useTopicSubscriptions(topics)
  return useTopicsState(topics)
}

export function pass() {
  return true
}
