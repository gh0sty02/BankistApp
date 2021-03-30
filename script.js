'use strict';

/////////////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// array methods

// slice

// const arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(arr.slice(1, -1));

// // splice

// const arr2 = [...arr];
// console.log(arr2.splice(1, 2));
// console.log(arr2);

// // reverse

// const arr3 = [...arr];
// console.log(arr3.reverse());

// // concat

// const arrSec = ['f', 'g', 'h'];
// const arr4 = arr.concat(arrSec);
// console.log(arr4);

// //join

// console.log(arr4.join('-'));

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i}: You deposited ${mov}`);
//   } else if (mov < 0) {
//     console.log(`Movement ${i} : You Withrew ${Math.abs(mov)}`);
//   }
// });

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// display thee transactions in the transaction tab

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = ` 
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displaying the main balance to the Right side

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

// updating the ui i.e loading the balance, transactions and summary of the account

const updateUI = function (acc) {
  displayMovements(acc.movements);
  displaySummary(acc);
  displayBalance(acc);
};

// displaying the summary i.e the deposits, withdrawls and the intrest they get

const displaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} EUR`;

  const outgoings = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outgoings)} EUR`;

  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${intrest} EUR`;
};

// creating the username i.e the initails and storing them in the accounts array

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};

createUserName(accounts);

let currentAccount;

// adding functionality to the login button

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // selecting the current account

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back ! ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// adding functionality to the transfer button

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc !== currentAccount.username
  ) {
    recieverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    updateUI(currentAccount);
  }
});

// adding functionality to the accouts closing button

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// console.log(accounts);

////////////// lectures ///////////

/// challenge arrays

// const julia = [3, 5, 2, 12, 7];
// const kate = [9, 16, 6, 8, 3];

// const checkDogs = function (arr1, arr2) {
//   const juliaNew = [...arr1];

//   juliaNew.splice(-2, 2);
//   juliaNew.splice(0, 1);

//   const kateNew = [...arr2];

//   const dogs = juliaNew.concat(kateNew);
//   // console.log(dogs);

// dogs.forEach(function (e, i) {
//   if (e >= 3) {
//     console.log(`Dog Number ${i + 1} is an Adult and is ${e} years old`);
//   } else {
//     console.log(`Dog Number ${i + 1} is still a Puppy and is ${e} years old`);
//   }
// });

// const calcAverageHumanAge = function (dogs) {
//   const humanAge = dogs.map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4));
//   console.log(humanAge);

//   const above18 = humanAge.filter(dog => dog > 18);
//   console.log(above18);

//   const avg =
//     above18.reduce((acc, curr, i) => acc + curr, 0) / above18.length;
//   console.log(avg);
// };

//   const avgHumanAge = dogs =>
//     dogs
//       .map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4))
//       .filter(dog => dog > 18)
//       .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

//   const avg1 = avgHumanAge([5, 2, 4, 1, 15, 8, 3]);
//   console.log(avg1);

//   // calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// };
// checkDogs(julia, kate);

// const euroToUsd = 1.1;

// const movementUsd = movements.map(mov => mov * euroToUsd);

// console.log(movementUsd);

// const movementDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1} : You ${mov > 0 ? 'Deposited' : 'Withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementDescription);

// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// const balance = movements.reduce(function (acc, curr) {
//   return (acc += curr);
// }, 0);
// console.log(balance);

// const max = movements.reduce((acc, mov) => {
//   if (mov < acc) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// for (const acc in accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     console.log(acc);
//   } else {
//     console.log('nope');
//   }
// }

// flat and flatmap methods

// const amountTotal = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, curr) => acc + curr, 0);
// console.log(amountTotal);

// const amount2 = accounts.flatMap(acc => acc.movements);
// console.log(amount2);

// //  fill method

// const x = new Array(7);
// console.log(x);

// // from method

// const y = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(y);

// const randomDices = Array.from(
//   { length: 100 },
//   (curr, i) => Math.trunc(Math.random() * 6) + 1
// );
// console.log(randomDices);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('EUR', ' '))
//   );

//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
//   const mov2 = movementsUI2.map(el =>
//     Number(el.textContent.replace('EUR', ''))
//   );
//   console.log(movementsUI);
//   console.log(mov2);
// });

// const totalSummary = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (acc, curr) => {
//       curr > 0 ? (acc.deposit += curr) : (acc.withdrawls += curr);
//       return acc;
//     },
//     { deposit: 0, withdrawls: 0 }
//   );
// console.log(totalSummary);

// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'and', 'is', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const capitalizeFirst = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(capitalizeFirst);
// };

// console.log(convertTitleCase('this is a sentence'));
// console.log(convertTitleCase('and this is another one'));

/////// coding challenge ////

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1//

dogs.forEach(curr => {
  curr.recFood = Math.trunc(curr.weight ** 0.75 * 28);
});
console.log(dogs);

//2 //

const dogSarah = dogs.find(curr => (curr.owners.includes('Sarah') ? curr : 0));
if (
  dogSarah.currFood > dogSarah.recFood * 0.9 &&
  dogSarah.currFood < dogSarah.recFood * 1.1
) {
  console.log(`Sarah's Dog eats in perfect range`);
} else if (dogSarah.currFood < dogSarah.recFood * 0.9) {
  console.log(`Sarah's Dog eats too low`);
} else if (dogSarah.recFood < dogSarah.recFood * 1.1) {
  console.log(`Sarah's Dog eats too much`);
}

//3/

const ownersEatTooMuch = dogs
  .filter(curr => curr.curFood > curr.recFood)
  .flatMap(curr => curr.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(curr => curr.curFood < curr.recFood)
  .flatMap(curr => curr.owners);
console.log(ownersEatTooLittle);

// 4//
// matilda and alice and bobs dog eat too much

console.log(`${ownersEatTooMuch.join(' and ')}'s Dogs eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')}'s Dogs eat too little`);

//5//

console.log(dogs.some(dog => dog.currFood === dog.recFood));

// 6 //
const eatingOkay = dog =>
  dog.currFood >= dog.recFood * 0.9 && dog.currFood <= dog.recFood * 1.1;

console.log(dogs.some(eatingOkay));

// 7 .//
// no dog eating okay amount of food

// 8 //
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
