import config from "../config/config.json";

export function getConfig(param: keyof typeof config) {
  return config[param];
}
