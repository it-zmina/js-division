function division(idDividend, idDivisor, idResultArea) {
  const dividend = document.getElementById(idDividend).text
  const divisor = document.getElementById(idDividend).text

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
