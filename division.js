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

function isLongGreaterOrEqual(remainder, divisor) {
  if (remainder.length > divisor.length) {
    return true;
  }
  if (remainder.length < divisor.length) {
    return false;
  }
  for (let i = 0; i < remainder.length; i++) {
    if (parseInt(remainder[i]) < parseInt(divisor[i])) {
      return false
    } else if (parseInt(remainder[i]) > parseInt(divisor[i])) {
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
  result = result.reverse()
  let nonZeroOrder
  for (nonZeroOrder = 0; nonZeroOrder < result.length; nonZeroOrder++) {
    if (parseInt(result[nonZeroOrder]) != 0) {
      break;
    }
  }
  if (nonZeroOrder >= result.length) {
    return ['0']
  }
  return result.slice(nonZeroOrder, result.length)
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
        resultDigits.concat('0')
      }
    }
    order = i + 1

    // if last remainder too small than exit loop
    if (order > dividend.length) {
      subtraction = remainder
      break
    }

    remainders = remainders.concat(remainder.join(''))

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
    subtractions: subtractions
  }
}

function division(idDividend, idDivisor, idResultArea) {
  const dividend = document.getElementById(idDividend).value
  const divisor = document.getElementById(idDivisor).value

  // const res = longMultiply(['2', '5'], 4)
  const res = isLongGreaterOrEqual(['2', '1', '2'], ['1', '3', '2'])
  // const res = longSubtract(['2', '5'], ['1', '6'])
  const divisionResult = longDivision(dividend, divisor)

  let result = `
_<span id="part-div">43</span>2|22
 <span id="0-part-num">22</span> |--
 -- |<span class="result" onmouseover="changeColor(0)" onmouseout="setDefaultColor(0)">1</span><span class="result" onmouseover="changeColor(1)" onmouseout="setDefaultColor(1)">9</span>
_<span id="0-rem">21</span><span id="0-borrow">2</span>
 <span id="1-part-num">198</span>
 ---
  <span id="1-rem">14</span><span id="1-borrow"></span>
  `
  document.getElementById(idResultArea).innerHTML = result
}
