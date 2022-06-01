import fse from "fs-extra";
import { PACKAGE_JSON_FILE } from "./constants.js";

export function setNodeEnv(value) {
  process.env.NODE_ENV = value;
}

export function setBuildTarget(value) {
  process.env.BUILD_TARGET = value;
}

export function isDev() {
  return process.env.NODE_ENV === 'development';
}

export function getPackageJson() {
  const rawJson = fse.readFileSync(PACKAGE_JSON_FILE, "utf-8");
  return JSON.parse(rawJson);
}
