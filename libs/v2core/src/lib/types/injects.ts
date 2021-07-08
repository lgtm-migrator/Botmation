import { Browser } from "puppeteer"
import { PipeValue } from "./pipe-value"

export type injects = {}

export type injectsValue = {value: PipeValue}

export type injectsBrowser = injects & {browser: Browser}
