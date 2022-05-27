import { promisify } from "util";
import globCallback from "glob";

export const glob = promisify(globCallback);