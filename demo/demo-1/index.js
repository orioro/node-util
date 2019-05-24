const util = require('../../src')

console.log(util())

document.querySelector('body').innerHTML = `Demo: ${util()}`
