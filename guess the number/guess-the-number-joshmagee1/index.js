const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();

function start() {
  console.log("Let's play the number game!\nWould you like the (H)uman or the (C)omputer to pick the number?");
  picker();
  //asks who the picker will be
  async function picker() {
    let guesser = await ask("");
      guesser = strSan(guesser);
        guesser == "h" ? (console.log("Ok, you'll pick the number.\nLet's pick a range."), rangePicker("hum"))
        : guesser == "c" ? (console.log("Alright, I'll pick the number.\nLet's pick a range."), rangePicker("comp"))
        : (console.log("Please enter H or C"), picker());
  }
  let btmNum, topNum;
  //outputs the number range
  async function rangePicker(player) {
    btmNum = await ask("What is the bottom number?\n");
    topNum = await ask("What is the top number\n");
    btmNum = Number(btmNum);
    topNum = Number(topNum);
      numSan(topNum) || numSan(btmNum) ? rangePicker(player)
      : (topNum <= btmNum) ? (console.log("Top number must be greater than bottom number."), rangePicker(player))
      : rangeVerify();
    async function rangeVerify() {
      let verify = await ask(`You have chosen a range of ${btmNum} to ${topNum}. Is this correct? Y / N\n`);
      verify = strSan(verify);
        verify != "n" && verify != "y" ? (console.log("Please enter either Y or N."), rangeVerify())
        : verify == "n" ? rangePicker(player)
        : verify == "y" && player == "hum" ? humPick()
        : verify == "y" && player == "comp" ? compPick()
        : (console.log("please no break me"), rangeVerify());
    }
  }
  let tryCounter = 1;
  //code for when human picks number
  async function humPick() {
    let secretNumber = await ask("What is your secret number?\n");
      numSan(secretNumber) ? humPick()
      : secretNumber < btmNum || secretNumber > topNum ? (console.log(`Please enter a number between ${btmNum} and ${topNum}.`), humPick())
      : console.log('You entered: ' + secretNumber), query();
    async function query() {
    let numberGuess = Math.floor((btmNum + topNum) / 2);
    let input = await ask(`Is ${numberGuess} your number? Y / N\n`);
    input = strSan(input);
      input == "y" && numberGuess == secretNumber && tryCounter == 1 ? (console.log(`First try!`), playAgain())
      : input == "y" && numberGuess == secretNumber ? (console.log(`Hurray, I got it in ${tryCounter} tries!`), playAgain())
      : input == "y" && numberGuess != secretNumber ? (console.log("I don't need your pity."), tryCounter++, highLow(numberGuess))
      : input == "n" && numberGuess == secretNumber ? (console.log("Don't lie to me!"), query())
      : input == "n" && numberGuess != secretNumber ? (console.log("Hmmmm..."), tryCounter++, highLow(numberGuess))
      : (console.log("Please enter Y or N"), query());
    //asks higher or lower and recalculates the numberGuess
    async function highLow() {
      let highLowCheck = await ask(`Is your number higher or lower than ${numberGuess}? H / L\n`);
      highLowCheck = (highLowCheck).toLowerCase().trim();
        input == "n" && secretNumber - numberGuess == 1 ? (btmNum = numberGuess, topNum++, query()) // fixes rounding issue from Math.floor in numberGuess if secretNumber is topNum
        : highLowCheck == "h" && secretNumber > numberGuess ? (btmNum = numberGuess, query())
        : highLowCheck == "l" && secretNumber < numberGuess ? (topNum = numberGuess, query())
        : highLowCheck == "l" && secretNumber > numberGuess ? (console.log("Are you sure it's lower?"), highLow())
        : highLowCheck == "h" && secretNumber < numberGuess ? (console.log("Are you sure it's higher?"), highLow())
        : (console.log("Please enter H or L"), highLow());
      }
    }
  }
  //code for when comp picks number
  function compPick() {
    console.log(`I'm thinking of a number between ${btmNum} and ${topNum}...What is your guess?`);
    let randomNum = Math.floor((Math.random() * (topNum - btmNum + 1)) + btmNum);
    humGuess();
    function newRange() {
      console.log(`The number is between ${btmNum} and ${topNum}.`);
      humGuess();
    }
    async function humGuess() {
      let whatNum = await ask("");
        numSan(whatNum) ? newRange()
        : whatNum > topNum || whatNum < btmNum ? (console.log(`Choose between ${btmNum} and ${topNum}.`), newRange())
        : whatNum > randomNum ? (console.log("Too high"), tryCounter++, topNum = Number(whatNum) - 1, newRange())
        : whatNum < randomNum ? (console.log("Too low"), tryCounter++, btmNum = Number(whatNum) + 1, newRange())
        : whatNum == randomNum && tryCounter == 1 ? (console.log(`Lucky guess.`), playAgain())
        : whatNum == randomNum ? (console.log(`Congrats, you got it in ${tryCounter} tries.`), playAgain())
        : (console.log("please no break me"), newRange());
    }
  }
  //starts a new game or exits
  async function playAgain() {
    let newGame = await ask("Would you like to play again? Y / N\n");
    newGame = strSan(newGame);
      newGame == "y" ? (console.log("From the top!"), start())
      : newGame == "n" ? (console.log("Goodbye!"), process.exit())
      : newGame != "y" && newGame != "n" ? (console.log("Please enter Y or N."), playAgain())
      : (console.log("please no break me"), playAgain());
  }
  //input sanitizers
  function numSan(number) {
    return isNaN (number) ? (console.log("Please enter only numerical values."), true)
    : number % 1 != 0 ? (console.log("No decimals."), true)
    : false
  }
  function strSan(word) {
    return word.toLowerCase().trim()
  }
}