# thermal-printer-wrapper
**Heavily inspired by [NielsLeenheer](https://github.com/NielsLeenheer/)'s work**

A wrapper tool my Thermal Printer (Epson TM-T88V)

# IMPORTANT
-> vérifier si l'imprimante wrap elle même le texte, si oui déplacer la fonction _wrap en utilitaire
pour être utilisée par generateTable, et revoir le principe de cursor


# Todo
- [ ] [initializer](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_atsign.html)
- [x] newline
- [x] line
- [x] text
- [x] [bold](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_ce.html)
- [x] [double strike](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_cg.html)
- [x] [invert](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_cb.html)
- [x] [underline](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_minus.html)
- [ ] [upside-down](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_lbrace.html)
- [x] [setCharWidth]()
- [x] [setCharHeight]()
- [ ] [text size variant](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_cm.html)
- [ ] [90° rotation](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_cv.html)
- [ ] [cut](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_cv.html)
- [ ] [get status](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/dle_eot.html)
- [ ] barcode
  - [ ] [num pos](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_ch.html)
  - [ ] [fonts ?](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_lf.html)
  - [ ] [height](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_lh.html)
  - [ ] [width](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_lw.html)
  - [ ] [print](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_lk.html)
- [ ] [test prints](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_lparen_ca.html)

# erh
- [ ] [Exploration]

# Unsure yet
- [ ] [smooth~~~~](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_lb.html)
- [ ] [fonts ?](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_cm.html)
- [ ] [charset ?](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_cr.html)
- [ ] [chartset 2 ?](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_lt.html)