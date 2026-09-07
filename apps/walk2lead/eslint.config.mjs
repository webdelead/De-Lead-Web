import { globalIgnores } from "eslint/config";
import base from "@delead/config/eslint.config.base.mjs";
const config = [...base, globalIgnores(["public/**"])];
export default config;
