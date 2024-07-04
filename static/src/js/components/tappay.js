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

function onSubmit(event) {
  event.preventDefault();
  return new Promise((resolve, reject) => {
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    console.log(tappayStatus);
    if (tappayStatus.canGetPrime) {
      TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
          reject(new Error("獲取 Prime 失敗: " + result.msg));
        } else {
          setPrime(result.card.prime);
          resolve(result.card.prime);
        }
      });
    } else {
      if (tappayStatus.status.number === 2) {
        alert("卡片號碼錯誤");
      } else if (tappayStatus.status.number === 1) {
        alert("卡片號碼不能為空");
      }
      if (tappayStatus.status.expiry === 2) {
        alert("過期時間錯誤");
      } else if (tappayStatus.status.expiry === 1) {
        alert("過期時間不能為空");
      }
      if (tappayStatus.status.ccv === 2) {
        alert("驗證密碼錯誤");
      } else if (tappayStatus.status.ccv === 1) {
        alert("驗證密碼不能為空");
      }
    }
  });
}

function setPrime(value) {
  prime = value;
}

function getPrime() {
  return prime;
}

export { onSubmit, getPrime, prime };
