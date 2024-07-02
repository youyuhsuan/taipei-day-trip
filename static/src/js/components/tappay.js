let prime = null;

TPDirect.setupSDK(
  151736,
  "app_fv3FJ3JCrOD1BD9c96dDriwg20ThQPX4XZDGBwZ1v7KtbemgyuFDFy21N2SB",
  "sandbox"
);

TPDirect.card.setup({
  fields: {
    number: {
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "ccv",
    },
  },
  styles: {
    input: {
      color: "gray",
    },
    "input.ccv": {
      // Add styles specific to CCV input if needed
    },
    "input.expiration-date": {
      // Add styles specific to expiration date input if needed
    },
    "input.card-number": {
      // Add styles specific to card number input if needed
    },
    ":focus": {
      // Add styles for focus state if needed
    },
    ".valid": {
      color: "green",
    },
    ".invalid": {
      color: "red",
    },
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

// TPDirect.card.onUpdate(function (update) {
//   // update.canGetPrime === true;
//   // --> you can call TPDirect.card.getPrime()
//   if (update.canGetPrime) {
//     // Enable submit Button to get prime.
//     // submitButton.removeAttribute("disabled");
//   } else {
//     // Disable submit Button to get prime.
//     // submitButton.setAttribute("disabled", true);
//   }

//   // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
//   if (update.cardType === "visa") {
//     // Handle card type visa.
//   }

//   // number 欄位是錯誤的
//   if (update.status.number === 2) {
//     // setNumberFormGroupToError()
//   } else if (update.status.number === 0) {
//     // setNumberFormGroupToSuccess()
//   } else {
//     // setNumberFormGroupToNormal()
//   }

//   if (update.status.expiry === 2) {
//     // setNumberFormGroupToError()
//   } else if (update.status.expiry === 0) {
//     // setNumberFormGroupToSuccess()
//   } else {
//     // setNumberFormGroupToNormal()
//   }

//   if (update.status.ccv === 2) {
//     // setNumberFormGroupToError()
//   } else if (update.status.ccv === 0) {
//     // setNumberFormGroupToSuccess()
//   } else {
//     // setNumberFormGroupToNormal()
//   }
// });

function onSubmit(event) {
  event.preventDefault();
  return new Promise((resolve, reject) => {
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    if (tappayStatus.canGetPrime === false) {
      reject(new Error("can not get prime"));
      return;
    }

    TPDirect.card.getPrime((result) => {
      if (result.status !== 0) {
        reject(new Error("get prime error " + result.msg));
        return;
      }
      setPrime(result.card.prime);
      resolve(result.card.prime);
    });
  });
}

function setPrime(value) {
  prime = value;
}

function getPrime() {
  return prime;
}

export { onSubmit, getPrime, prime };
