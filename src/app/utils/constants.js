import preval from "preval.macro";

export const BUILD_TIMESTAMP = preval`module.exports = new Date().toLocaleDateString();`;

export const BATTERY_STATE = {
  IDLE: 0,
  CHARGING: 1,
  DISCHARGING: 2,
};

export const VEBUS_SYSTEM_STATE = {
  OFF: 0,
  LOW_POWER: 1,
  FAULT_CONDITION: 2,
  BULK_CHARGING: 3,
  ABSORPTION_CHARGINNG: 4,
  FLOAT_CHARGING: 5,
  STORAGE_MODE: 6,
  EQUALISATION_CHARGING: 7,
  PASSTHRU: 8,
  INVERTING: 9,
  ASSISTING: 10,
  POWER_SUPPLY_MODE: 11,
  DISCHARGING: 256,
  SUSTAIN: 257,
};

export const AC_SOURCE = {
  NOT_AVAILABLE: 0,
  GRID: 1,
  GENSET: 2,
  SHORE: 3,
  INVERTING_ISLAND_MODE: 240,
};

export const AC_SOURCE_TYPE = {
  NOT_IN_USE: 0,
  GRID: 1,
  GENERATOR: 2,
  SHORE: 3,
};

export const ACTIVE_INPUT = {
  INPUT_0: 0,
  INPUT_1: 1,
  NONE: 240, // Inverting
};

export const SYSTEM_MODE = {
  CHARGER_ONLY: 1,
  INVERTER_ONLY: 2,
  ON: 3,
  OFF: 4,
};

export const CHARGER_MODE = {
  OFF: 4,
  ON: 1,
};

export const INVERTER_MODE = {
  ON: 2,
  VEBUS_ON: 3, // Vebus inverters use mode 3 in stead of 2 for ON.
  OFF: 4,
  ECO: 5,
};

export const FISCHER_PANDA_GENSET_PRODUCT_ID = 45120; /// 0xB040 VE_PROD_ID_FISCHER_PANDA_GENSET

export const FISCHER_PANDA_GENSET_AUTOSTART = {
  DISABLED: 0,
  ENABLED: 1,
};

export const RELAY_FUNCTION = {
  GENERATOR_START_STOP: 1,
};

export const GENERATOR_START_STOP = {
  STOP: 0,
  START: 1,
  AUTO_ON: 1,
  AUTO_OFF: 0,
};

export const VIEWS = {
  CONNECTING: "CONNECTING",
  METRICS: "METRICS",
  INVERTER_CHARGER_INPUT_LIMIT_SELECTOR:
    "INVERTER_CHARGER_INPUT_LIMIT_SELECTOR",
  REMOTE_CONSOLE: "REMOTE_CONSOLE",
  MQTT_UNAVAILABLE: "MQTT_UNAVAILABLE",
  ERROR: "ERROR",
};
