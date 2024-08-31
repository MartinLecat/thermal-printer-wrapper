import { ThermalPrinterWrapper } from "./ThermalPrinterWrapper.js";

const tpw = new ThermalPrinterWrapper();
tpw.text("a");
console.log(tpw.getQueue());
