import _ from "lodash";
import { encodeText } from "./CodePage/index.js";

// MARK: Definitions
/**
 * Define the text size variant (small or normal)
 * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_cm.html | Epson documentation} for more information
 */
export type TPWTextSize = "small" | "normal";
/**
 * Define the underlining style
 *
 * - `0`: off
 * - `1`: thin
 * - `2`: thick
 * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_minus.html | Epson documentation} for more information
 */
export type TPWUnderlineStyle = 0 | 1 | 2;
/**
 * Define the character size (height and width independently)
 *
 * - `1`: 1 times the normal char size
 * - `2`: 2 times the normal char size
 * - `3`: 3 times the normal char size
 * - and so on
 * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_exclamation.html | Epson documentation} for more information
 */
export type TPWCharSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface TPWOptions {
    /** With of the ticket in number of characters */
    width: number;
    /** Default underline style */
    defaultUnderlineStyle: TPWUnderlineStyle;
    /** Default states to apply */
    defaultStates: TPWStates;
}
export interface TPWStates {
    align: "left" | "center" | "right";
    bold: boolean;
    doubleStrike: boolean;
    inverted: boolean;
    italic: boolean;
    underlined: boolean;
    charWidth: TPWCharSize;
    charHeight: TPWCharSize;
}

export class ThermalPrinterWrapper {
    /** Queue of values waiting to be buffered */
    private _queued: number[] = [];
    /** Buffer of values, made from queue but with closed tags */
    private _buffer: number[] = [];
    /** Current states */
    private _states: TPWStates;
    /** Current options */
    private _options: TPWOptions;

    /** Cursor horizontal position */
    private _cursor: number;

    public static DefaultOptions: TPWOptions = {
        width: 42,
        defaultUnderlineStyle: 1,
        defaultStates: {
            align: "left",
            bold: false,
            doubleStrike: false,
            inverted: false,
            italic: false,
            underlined: false,
            charHeight: 1,
            charWidth: 1,
        },
    };

    // MARK: Constructor
    constructor(options?: Partial<TPWOptions>) {
        this._options = _.merge(ThermalPrinterWrapper.DefaultOptions, options);
        this._states = this._options.defaultStates;
        this._cursor = 0;
    }

    // MARK: Privates
    // #########################################################################
    // #                                                                       #
    // #                            Private methods                            #
    // #                                                                       #
    // #########################################################################

    /**
     * Add values to the queue, waiting to be encoded
     *
     * @param {number[]} vals
     * @returns {this}
     */
    private _queue(vals: number[]): this {
        this._queued.push(...vals);

        return this;
    }

    /**
     * Chunkize text in lines around the ticket width, or the width given in arguments
     *
     * @returns {string[]}
     */
    private _wrap(text: string, width?: number): string[] {
        /* Get width to wrap around */
        width = width ?? this._options.width;

        /* Initialize an empty string array */
        const lines: string[] = [];
        /* Get current cursor pos */
        let cur = this._cursor;

        /* Cut the text every width-cur char */
        for (let i = 0; i < text.length; i += width - cur) {
            /* Push the line */
            lines.push(text.substring(i, width - cur));
            /* Reset cur (only needed once) */
            cur = 0;
        }

        return lines;
    }

    /**
     * Encode a string to the specified codepage
     * @todo Faire vrai encodage des codepages (==> besoin d'une étude approfondi du sujet)
     *
     * @param {string} text
     * @returns {number[]}
     */
    private _encode(text: string): number[] {
        return encodeText(text);
    }

    /**
     * Transfer queue to buffer, and close every state tags
     */
    private _flush() {
        /* Close bold tag if opened */
        if (this._states.bold) {
            this.bold(false);
        }
        /* Close double strike tag if opened */
        if (this._states.doubleStrike) {
            this.doubleStrike(false);
        }
        /* Close invert tag if opened */
        if (this._states.inverted) {
            this.invert(false);
        }
        /* Close underline tag if opened */
        if (this._states.underlined) {
            this.underline(0);
        }

        this._buffer = this._queued;
    }

    // MARK: Publics
    // #########################################################################
    // #                                                                       #
    // #                            Public methods                             #
    // #                                                                       #
    // #########################################################################

    // #################################
    // #       Bold definitions        #
    // #################################
    /**
     * Toggle Boldening
     *
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_ce.html | Epson documentation} for more information
     */
    public bold(): this;
    /**
     * Bolden the given text
     *
     * @param {string} text Text to underline
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_ce.html | Epson documentation} for more information
     */
    public bold(text: string): this;
    /**
     * Enable or disable bolding depending on the state given
     *
     * @param {boolean} type True to enable boldening, false to disable
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_ce.html | Epson documentation} for more information
     */
    public bold(type: boolean): this;
    public bold(a?: boolean | string): this {
        if (typeof a === "undefined") {
            /* If no arguments were given */
            this._states.bold = !this._states.bold;
            /* Queue the boldening tag */
            this._queue([0x1b, 0x45, this._states.bold ? 0x01 : 0x00]);
        } else if (typeof a === "boolean") {
            /* If only one argument is being passed & it's a boolean */
            this._states.bold = a;
            this._queue([0x1b, 0x45, this._states.bold ? 0x01 : 0x00]);
        } else if (typeof a === "string") {
            /* If a string is passed as the first argument */
            this._states.bold = !this._states.bold;
            /* Enable boldening with the given style, or the default one */
            this._queue([0x1b, 0x45, 0x01]);
            /* Queue the text */
            this.text(a);
            /* Close the boldening tag */
            this._queue([0x1b, 0x45, 0x00]);
        }

        return this;
    }
    // #################################
    // #   Double-strike definitions   #
    // #################################
    /**
     * Toggle double-strike
     *
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_cg.html | Epson documentation} for more information
     */
    public doubleStrike(): this;
    /**
     * Double-strike the given text
     *
     * @param {string} text Text to underline
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_cg.html | Epson documentation} for more information
     */
    public doubleStrike(text: string): this;
    /**
     * Enable or disable double-striking depending on the state given
     *
     * @param {boolean} type True to enable double-striking, false to disable
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_cg.html | Epson documentation} for more information
     */
    public doubleStrike(type: boolean): this;
    public doubleStrike(a?: boolean | string): this {
        if (typeof a === "undefined") {
            /* If no arguments were given */
            this._states.doubleStrike = !this._states.doubleStrike;
            /* Queue the double-strike tag */
            this._queue([0x1b, 0x47, this._states.doubleStrike ? 0x01 : 0x00]);
        } else if (typeof a === "boolean") {
            /* If only one argument is being passed & it's a boolean */
            this._states.doubleStrike = a;
            this._queue([0x1b, 0x47, this._states.doubleStrike ? 0x01 : 0x00]);
        } else if (typeof a === "string") {
            /* If a string is passed as the first argument */
            this._states.doubleStrike = !this._states.doubleStrike;
            /* Enable double-strike with the given style, or the default one */
            this._queue([0x1b, 0x47, 0x01]);
            /* Queue the text */
            this.text(a);
            /* Disable double-strike */
            this._queue([0x1b, 0x47, 0x00]);
        }

        return this;
    }

    // #################################
    // #      Invert definitions       #
    // #################################
    /**
     * Toggle Invert
     *
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_cb.html | Epson documentation} for more information
     */
    public invert(): this;
    /**
     * Invert the given text
     *
     * @param {string} text Text to underline
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_cb.html | Epson documentation} for more information
     */
    public invert(text: string): this;
    /**
     * Enable or disable inverting depending on the state given
     *
     * @param {boolean} type True to enable inverting, false to disable
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_cb.html | Epson documentation} for more information
     */
    public invert(type: boolean): this;
    public invert(a?: boolean | string): this {
        if (typeof a === "undefined") {
            /* If no arguments were given */
            this._states.inverted = !this._states.inverted;
            /* Queue the Invert tag */
            this._queue([0x1d, 0x42, this._states.inverted ? 0x01 : 0x00]);
        } else if (typeof a === "boolean") {
            /* If only one argument is being passed & it's a boolean */
            this._states.inverted = a;
            this._queue([0x1d, 0x42, this._states.inverted ? 0x01 : 0x00]);
        } else if (typeof a === "string") {
            /* If a string is passed as the first argument */
            this._states.inverted = !this._states.inverted;
            /* Enable Invert with the given style, or the default one */
            this._queue([0x1d, 0x42, 0x01]);
            /* Queue the text */
            this.text(a);
            /* Disable Invert */
            this._queue([0x1d, 0x42, 0x00]);
        }

        return this;
    }

    // #################################
    // #    Underlining definitions    #
    // #################################
    /**
     * Toggle underlining
     *
     * If not already enabled, will use the the default style
     *
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_minus.html | Epson documentation} for more information
     */
    public underline(): this;
    /**
     * Underline the given text using the default style
     *
     * @param {string} text Text to underline
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_minus.html | Epson documentation} for more information
     */
    public underline(text: string): this;
    /**
     * Underline the given text using the given style
     *
     * @param {string} text Text to underline
     * @param {TPWUnderlineStyle} type Underlining style to use
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_minus.html | Epson documentation} for more information
     */
    public underline(text: string, type: TPWUnderlineStyle): this;
    /**
     * Enable or disable underlining depending on the style passed
     * - `0`: off
     * - `1`: thin
     * - `2`: thick
     *
     * @param {TPWUnderlineStyle} type Underlining style to use
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_minus.html | Epson documentation} for more information
     */
    public underline(type: TPWUnderlineStyle): this;
    public underline(a?: TPWUnderlineStyle | string, b?: TPWUnderlineStyle): this {
        if (typeof a === "undefined") {
            /* If no arguments were given */

            let lineStyle: TPWUnderlineStyle;
            /* If the underlining state is on */
            if (this._states.underlined) {
                /* Disable it */
                lineStyle = 0x00;
            } else {
                /* Else turn it on with the default underlining style */
                lineStyle = this._options.defaultUnderlineStyle;
            }
            /* Queue the underlining tag */
            this._queue([0x1b, 0x2d, lineStyle]);
            /* Save state based on style value (0 for disabled) */
            this._states.underlined = lineStyle > 0;
        } else if (typeof a === "number") {
            /* If only one argument is being passed & it's a number (styling) */
            this._queue([0x1b, 0x2d, a]);
            this._states.underlined = a > 0;
        } else if (typeof a === "string") {
            /* If a string is passed as the first argument */
            /* Enable underlining with the given style, or the default one */
            this._queue([0x1b, 0x2d, b ?? this._options.defaultUnderlineStyle]);
            /* Queue the text */
            this.text(a);
            /* Close the underlining tag */
            this._queue([0x1b, 0x2d, 0x00]);
        }

        return this;
    }

    public print(): this {
        this._queue([0x1b, 0x64, 0x04]);
        return this;
    }

    /**
     * Encode a string, wrapped by the ticket's width
     *
     * @param {string} text Text to encode
     * @param {number} [wrap] Number of chars to wrap text (overwrite ticket's width)
     */
    public text(text: string, wrap?: number): this {
        /* Chunk text to get an array of lines */
        const lines = this._wrap(text, wrap);

        /* For each lines */
        for (const [i, l] of lines.entries()) {
            /* Encode the line in bytes */
            const bytes = this._encode(l);
            /* Queue the bytes */
            this._queue(bytes);

            if (i < lines.length - 1) {
                /* If the current line is not the last, add newline */
                this.newline();
            } else {
                /* Else, save the cursor pos */
                this._cursor += l.length * this._states.charWidth;
            }
        }

        return this;
    }

    // #################################
    // #      Spacing definitions      #
    // #################################
    /**
     * Insert a newline
     *
     * @returns {this}
     */
    public newline(count: number = 1): this {
        for (let i = 0; i < count; i++) {
            this._queue([0x0d, 0x0a]);
        }
        this._cursor = 0;
        return this;
    }
    /**
     * Encode the given text on a new line
     */
    public line(text: string): this {
        if (this._cursor !== 0) {
            /* If cursor is not at the beginning of the line, insert a newline */
            this.newline();
        }
        this.text(text);

        return this;
    }

    // #################################
    // #       Other definitions       #
    // #################################
    /**
     * Initialize the printer
     *
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_atsign.html | Epson documentation} for more information
     */
    public initialize(): this {
        this._queue([0x1b, 0x40]);
        return this;
    }

    /**
     * Queue raw values
     *
     * @param {number[]} values
     * @returns {this}
     */
    public raw(values: number[]): this {
        this._queue(values);
        return this;
    }

    /**
     * Encode values in the buffer, ready to be sent to the printer
     *
     * @returns {Uint8Array}
     */
    public encode(): Uint8Array {
        this._flush();
        const result = new Uint8Array(this._buffer);

        return result;
    }

    /**
     * Cut the paper
     */
    public cut(): this {
        this.newline(5);
        /* Cut command */
        this._queue([0x1d, 0x56, 0x00]);
        return this;
    }

    /**
     * Define characters width
     *
     * @param {TPWCharSize} size
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_exclamation.html | Epson documentation} for more information
     */
    public setCharWidth(size: TPWCharSize): this {
        if (size < 0 || size > 8) {
            throw new Error("Size should be between 1 and 8 included");
        }

        this._states.charWidth = size;
        this._queue([
            0x1d,
            0x21,
            (this._states.charHeight - 1) | ((this._states.charWidth - 1) << 4),
        ]);
        return this;
    }
    /**
     * Define characters width
     *
     * @param {TPWCharSize} size
     * @returns {this}
     * @see {@link https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_exclamation.html | Epson documentation} for more information
     */
    public setCharHeight(size: TPWCharSize): this {
        if (size < 0 || size > 8) {
            throw new Error("Size should be between 1 and 8 included");
        }

        this._states.charHeight = size;
        this._queue([
            0x1d,
            0x21,
            (this._states.charHeight - 1) | ((this._states.charWidth - 1) << 4),
        ]);
        return this;
    }

    // MARK: Test utils
    // #########################################################################
    // #                                                                       #
    // #                           Test only methods                           #
    // #                                                                       #
    // #########################################################################
    public getBuffer() {
        return this._buffer;
    }
    public getQueue() {
        return this._queued;
    }
}
