import {
    ThermalPrinterWrapper,
    type TWPColOptions,
    type TWPRow,
    type TWPTableOptions,
} from "../ThermalPrinterWrapper.js";

function indexOfGreatest(arr: number[]) {
    if (arr.length == 0) return -1;

    let greatestIndex: number = 0;
    let greatestValue: number = -Infinity;

    arr.forEach((v, i) => {
        if (v > greatestValue) {
            greatestValue = v;
            greatestIndex = i;
        }
    });

    return greatestIndex;
}

export function generateTable(
    colOptions: TWPColOptions[],
    rows: TWPRow[],
    tableOption: TWPTableOptions,
) {
    /** Max number of chars on one line */
    const maxTableWidth = 42;
    /** Number of char to share between lines */
    const maxLinesWidth =
        maxTableWidth - colOptions.length + (tableOption?.outerBorder ? 1 : -1);

    // Convertir en string
    /** Array of rows with values converted to string, and without overflow */
    const stringTable: string[][] = [];
    // Déterminer la largeur de chaque colonne
    /** Array containing the total number of char of each cols */
    const colTotalChars: number[] = [];

    for (let rowCursor = 0; rowCursor < rows.length; rowCursor++) {
        /** Array of strings, representing a string */
        const stringRow: string[] = [];
        for (let colCursor = 0; colCursor < colOptions.length; colCursor++) {
            if (!colTotalChars[colCursor]) {
                colTotalChars[colCursor] = 0;
            }

            /* Convert the value to a string, default to empty string */
            // @ts-expect-error TS think rows[rowCursor] can be undefined, but can't.
            const value = rows[rowCursor][colCursor]?.toString() ?? "";
            /* Add it's length to the col's total char count */
            colTotalChars[colCursor] = (value.length ?? 0) + (colTotalChars[colCursor] ?? 0);
            /* Save the value */
            stringRow.push(value);
        }
        /* Save the row */
        stringTable.push(stringRow);
    }
    /** Calculate the average num of char of each cols */
    const averageColWidth = colTotalChars.map((v) => v / rows.length);
    /** Calculate the average width of rows */
    const averageRowWidth = averageColWidth.reduce((a, b) => a + b);
    /** Calculate the final width of each cols */
    const finalColLength = averageColWidth.map((v) =>
        Math.floor((v / averageRowWidth) * maxLinesWidth),
    );
    /** Calculate the remaining number of chars to distribute */
    const remaining = maxLinesWidth - finalColLength.reduce((a, b) => a + b);

    /* Get the index of the largest column (on average) */
    const index = indexOfGreatest(averageColWidth);

    // @ts-expect-error TS think finalColLength[index] can be undefined, but can't.
    finalColLength[index] += index;

    console.log("Before", rows);
    console.log("After", stringTable);
    console.log("Total Lengths", colTotalChars);
    console.log("Average Lengths", averageColWidth);
    console.log("Final length", finalColLength);
    console.log("Remaining", remaining);

    // Déterminer la hauteur de chaque ligne
    // Padder & assembler

    return colTotalChars;
}
