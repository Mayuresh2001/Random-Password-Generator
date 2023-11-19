const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-passwordlength]");
const copyMsg = document.querySelector("[data-copymsg]");
const passwordDisplay = document.querySelector("[data-passworddisplay]");
const copyBtn = document.querySelector("[data-copy]");
const strengthIndicator = document.querySelector("[data-strengthindicator]");
const generateButton = document.querySelector(".generateButton");
const lowercaseCheck = document.querySelector("#lowercase");
const uppercaseCheck = document.querySelector("#uppercase");
const symbolCheck = document.querySelector("#symbols");
const numberCheck = document.querySelector("#numbers");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-=+{}[]:;",./?';

let password = "";
let passwordLength = 10;
let checkCount = 1;
setIndicator("#fff");
handleSlider();

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
inputSlider.style.backgroundSize = ((passwordLength - min) * 100/(max - min)) + "% 100%";
}
function setIndicator(color) {
  strengthIndicator.style.background = color;
  strengthIndicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
  return getRndInteger(0, 9);
}
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}
function generateSymbol() {
  const randmnum = getRndInteger(0, symbols.length);
  return symbols.charAt(randmnum);
}
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) {
    hasUpper = true;
  }
  if (lowercaseCheck.checked) {
    hasLower = true;
  }  
  if (symbolCheck.checked) {
    hasNum = true;
  }
  if (numberCheck.checked) {
    hasSym = true;
  }

  if (hasLower && hasUpper && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if(
    (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6
  ) {
    setIndicator("#ff0");
  }
  else {
    setIndicator("#f00");
  }
}
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  //fisher yates method
  for (let i = array.length-1 ; i > 0 ; i-- ) {
    const j= Math.floor(Math.random() * (i+1));
    const temp = array[i];
    array[i] =array[j];
    array[j]=temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;

  });

  //special conditon
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckbox.forEach( (checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
})

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
})

generateButton.addEventListener("click", () => {
  //none of checkbox are selected
  if (checkCount == 0) 
return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //journey to find new password

  //remove old password
  password = "";

  // //let's put stuff mentioned by checkboxes

  // if(uppercaseCheck.checked){
  //   password += generateUpperCase();
  // }

  // if(lowercaseCheck.checked){
  //   password += generateLowerCase();
  // }

  // if(numberCheck.checked){
  //   password += generateRandomNumber();
  // }

  // if(symbolCheck.checked){
  //   password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (symbolCheck.checked) funcArr.push(generateSymbol);

  if (numberCheck.checked) funcArr.push(generateRandomNumber);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));
  //show in ui
  passwordDisplay.value = password;
  //calculate the strength
  calcStrength();
});
