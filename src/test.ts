import { ThermalPrinterWrapper } from "./ThermalPrinterWrapper.js";
import net from "net";

const client = new net.Socket();
const tpw = new ThermalPrinterWrapper();
client.connect(9100, "192.168.0.3", function (...args) {
    console.log("Connected", args);
    const result = tpw.initialize().line("Ahahahahah").cut().encode();
    console.log("Sending", result);
    client.write(result, function (...args) {
        console.log("Sent", args);
        client.end();
    });
});

client.on("data", function (data) {
    data.forEach((v) => {
        console.log("Received", v.toString(16));
    });
});
