import { test, expect } from "vitest";
import { ThermalPrinterWrapper } from "./ThermalPrinterWrapper.js";

const tpw = new ThermalPrinterWrapper();

test("Queue", () => {
    tpw.text("a");
    tpw.getQueue();
});
