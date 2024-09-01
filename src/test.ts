// import { ThermalPrinterWrapper } from "./ThermalPrinterWrapper.js";
// import net from "net";

import generateTable from "./utils/generateTable.js";

// const client = new net.Socket();
// const tpw = new ThermalPrinterWrapper();
// client.connect(9100, "192.168.0.3", function (...args) {
//     console.log("Connected", args);
//     const result = tpw.initialize().line("Ahahahahah").cut().encode();
//     console.log("Sending", result);
//     client.write(result, function (...args) {
//         console.log("Sent", args);
//         client.end();
//     });
// });

// client.on("data", function (data) {
//     data.forEach((v) => {
//         console.log("Received", v.toString(16));
//     });
// });

// tpw.table(
//     [
//         { align: "left", width: 1 },
//         { align: "left", width: 1 },
//         { align: "left", width: 1 },
//     ],
//     [
//         [1, 2],
//         [1, 2],
//     ],
// );

generateTable(
    [{}, {}],
    [
        [1, 2, 3],
        [1, 2],
        [1, 2, 3, 4],
        [false, "123456789"],
        ["123456", true],
    ],
);
