#!/usr/bin/env node

const { parse, HtmlGenerator } = require('latex.js')

let latex = "Hi, this is a line of text."

let generator = new HtmlGenerator({ hyphenate: false })

let doc = parse(latex, { generator: generator }).htmlDocument()

console.log(doc.documentElement.outerHTML)
