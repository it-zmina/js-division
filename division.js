function longMultiply(divisor, digit) {
  let result = []
  let additionToNextSegment = 0
  for (let i = divisor.length - 1; i >= 0; i--) {
    const segment = parseInt(divisor[i]) * digit + additionToNextSegment
    result = result.concat((segment % 10).toString())
    additionToNextSegment = Math.trunc(segment / 10)
  }

  if (additionToNextSegment > 0) {
    result = result.concat(additionToNextSegment.toString())
  }

  return result.reverse()
}

function isLongGreaterOrEqual(firstValue, secondValue) {

  const first = trimLeadingZeros(firstValue)
  const second = trimLeadingZeros(secondValue)

  if (first.length > second.length) {
    return true;
  }
  if (first.length < second.length) {
    return false;
  }
  for (let i = 0; i < firstValue.length; i++) {
    if (parseInt(first[i]) < parseInt(second[i])) {
      return false
    } else if (parseInt(first[i]) > parseInt(second[i])) {
      return true
    }
  }
  return true;
}

function longSubtract(value, subtraction) {
  let subtractionFromNextSegment = 0
  let result = []

  for (let i = 0; i < value.length; i++) {
    let segment
    if (subtraction.length - 1 - i >= 0) {
      segment = parseInt(value[value.length - 1 - i]) - parseInt(subtraction[subtraction.length - 1 - i]) - subtractionFromNextSegment
    } else {
      segment = parseInt(value[value.length - 1 - i]) - subtractionFromNextSegment
    }
    if (segment < 0) {
      subtractionFromNextSegment = 1
      result = result.concat((segment + 10).toString())
    } else {
      result = result.concat((segment).toString())
    }
  }

  return trimLeadingZeros(result.reverse())
}

function trimLeadingZeros(digits) {
  let nonZeroOrder
  for (nonZeroOrder = 0; nonZeroOrder < digits.length - 1; nonZeroOrder++) {
    if (digits[nonZeroOrder] !== '0') {
      break;
    }
  }
  return digits.slice(nonZeroOrder)
}

function longDivision(dividendValue, divisorValue) {
  const dividend = dividendValue.split('')
  const divisor = divisorValue.split('')
  let resultDigits = ''
  let order = 0
  let partialDividends = []
  let remainders = []
  let subtractions = []
  let remainder = []
  let subtraction = ['0']
  let orders = []

  do {
    // get sufficient amount of digits that grater or equal to divisor
    if (subtraction.length > 1 || subtraction[0] !== '0') {
      remainder = subtraction
    } else {
      remainder = []
    }

    let i
    for (i = order; i < dividend.length; i++) {
      remainder = remainder.concat(dividend[i])
      if (isLongGreaterOrEqual(remainder, divisor)) {
        break;
      } else if (resultDigits.length > 0) {
        resultDigits = resultDigits.concat('0')
      }
    }
    order = i + 1
    orders = orders.concat(Math.min(order, dividend.length))
    // if last remainder too small than exit loop
    if (order > dividend.length) {
      subtraction = remainder
      break
    }

    remainders = remainders.concat(trimLeadingZeros(remainder).join(''))

    // define result digit
    let partialDividend = []
    let digit = ''
    for (let nextDigit = 1; nextDigit <= 9; nextDigit++) {
      const nextPartialDividend = longMultiply(divisor, nextDigit)
      if (isLongGreaterOrEqual(remainder, nextPartialDividend)) {
        partialDividend = nextPartialDividend
        digit = nextDigit
      } else {
        break
      }
    }

    subtraction = longSubtract(remainder, partialDividend)
    subtractions = subtractions.concat(subtraction.join(''))
    partialDividends = partialDividends.concat(partialDividend.join(''))
    resultDigits = resultDigits.concat(digit)

  } while (order < dividend.length)

  remainders = remainders.concat(subtraction.join(''))

  return {
    dividend: dividendValue,
    divisor: divisorValue,
    result: resultDigits,
    partialDividends: partialDividends,
    remainders: remainders,
    subtractions: subtractions,
    orders: orders
  }
}

function formatter(divisionResult) {
  const dividend = divisionResult.dividend
  const divisor = divisionResult.divisor
  const result = divisionResult.result
  const remainders = divisionResult.remainders
  const subtractions = divisionResult.subtractions
  const orders = divisionResult.orders

  // First row
  let remainder = divisionResult.remainders[0]
  let text = `_<span id="part-div">${remainder}</span>`
  text += `${divisionResult.dividend.substr(remainder.length)}|${divisionResult.divisor}`
  text += '\n'

  // Second row
  let partialDividend = divisionResult.partialDividends[0]
  text += ` ${" ".repeat(remainder.length - partialDividend.length)}`
  text += `<span id="0-part-num">${partialDividend}</span>`
  text += `${" ".repeat(dividend.length - remainder.length)}`
  text += `|${"-".repeat(Math.max(divisor.length, result.length))}`
  text += '\n'

  // Third row
  text += ` ${"-".repeat(remainder.length)}${" ".repeat(dividend.length - remainder.length)}|`
  for (let i = 0; i < result.length; i++) {
    text += `<span class="result" onmouseover="changeColor(${i})" onmouseout="setDefaultColor(${i})">${result.charAt(i)}</span>`
  }
  text += `\n`

  // Fourth row
  let leftIndent = 1 + remainders[0].length - subtractions[0].length
  text += " ".repeat(leftIndent - 1)
  text += remainders.length > 2 ? '_' : ' '
  const nextRemainder = subtractions[0] === '0' && remainders.length > 2 ? '0' + remainders[1] : remainders[1]
  text += `<span id="0-rem">${subtractions[0]}</span>`

  let digitIndex = 0

  for (let i = 0; digitIndex < orders[1] - orders[0] - remainders[1].length; i++) {
    text += `<span id="${digitIndex}-borrow">0</span>`
    digitIndex++
  }
  let remainderDigits = nextRemainder.substr(subtractions[0].length).split('')
  for (let i = 0; i < remainderDigits.length; i++) {
    text += `<span id="${digitIndex}-borrow">${remainderDigits[i]}</span>`
    digitIndex++
  }
  text += `\n`

  // loop for other subtractions
  for (let k = 0; k < subtractions.length; k++) {
    // TODO implement
  }

  return text
}

function division(idDividend, idDivisor, idResultArea) {
  const dividend = document.getElementById(idDividend).value
  const divisor = document.getElementById(idDivisor).value
  // const dividend = '4325'
  // const divisor = '3'

  // const res = longMultiply(['2', '5'], 4)
  // const res = isLongGreaterOrEqual(['2', '1', '2'], ['1', '3', '2'])
  // const res = longSubtract(['2', '5'], ['1', '6'])
  const divisionResult = longDivision(dividend, divisor)

  const formattedLongDivision = formatter(divisionResult)

  let result = `
_<span id="part-div">43</span>2|22
 <span id="0-part-num">22</span> |--
 -- |<span class="result" onmouseover="changeColor(0)" onmouseout="setDefaultColor(0)">1</span><span class="result" onmouseover="changeColor(1)" onmouseout="setDefaultColor(1)">9</span>
_<span id="0-rem">21</span><span id="0-borrow">2</span>
 <span id="1-part-num">198</span>
 ---
  <span id="1-rem">14</span><span id="1-borrow"></span>
  `
  // document.getElementById(idResultArea).innerHTML = result
  document.getElementById(idResultArea).innerHTML = formattedLongDivision
}
