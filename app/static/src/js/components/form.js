function setupFormValidation(formSelector, fields, onValidSubmit) {
  const form = document.querySelector(formSelector);
  if (!form) {
    console.error(`Form with selector "${formSelector}" not found`);
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    if (setInFormValidation(form, fields, values)) {
      try {
        await contactFormFormValidation(form, values, onValidSubmit);
      } catch (error) {
        console.error("Form submission error:", error);
        renderErrorMessage(form, "提交表單時發生錯誤，請稍後再試");
      }
    }
  });
}

function setInFormValidation(form, fields, values) {
  let isValid = true;
  fields.forEach((field) => {
    const value = values[field.id];
    if (field.required && (!value || value.trim() === "")) {
      isValid = false;
      renderErrorMessage(form, `${field.name}不能為空值`, field.id);
    } else if (field.validate && !field.validate(value)) {
      isValid = false;
      renderErrorMessage(
        form,
        field.errorMessage || `${field.name}格式不正確`,
        field.id
      );
    }
  });
  return isValid;
}

// 表單提交和額外驗證
async function contactFormFormValidation(form, values, onValidSubmit) {
  await onValidSubmit(values);
}

// 渲染錯誤消息
function renderErrorMessage(form, message, fieldId) {
  let errorElement = form.querySelector(`#error-${fieldId}`);
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.id = `error-${fieldId}`;
    errorElement.className = "error-message";
    const field = form.querySelector(`#${fieldId}`);
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }
  errorElement.textContent = message;
}

// 清除錯誤消息
function clearErrorMessages(form) {
  form.querySelectorAll(".error-message").forEach((el) => el.remove());
}

// 使用示例
setupFormValidation(
  ".contact-form",
  [
    { id: "booking-name", name: "姓名", required: true },
    {
      id: "booking-email",
      name: "電子郵件",
      required: true,
      validate: (email) => /^.+@.+\..+$/.test(email),
      errorMessage: "請輸入有效的電子郵件地址",
    },
    {
      id: "booking-phone",
      name: "電話",
      required: true,
      validate: (phone) => /^\d{10}$/.test(phone),
      errorMessage: "請輸入10位數字的電話號碼",
    },
  ],
  async (values) => {
    console.log("Contact Form Submitted with values:", values);
    // 在這裡執行表單提交邏輯
  }
);

setupFormValidation(
  ".payment-form",
  [
    {
      id: "card-number",
      name: "卡號",
      required: true,
      validate: (cardNumber) => /^\d{16}$/.test(cardNumber),
      errorMessage: "請輸入16位數字的信用卡號碼",
    },
  ],
  async (values) => {
    console.log(
      "Payment Form Submitted with card number:",
      values["card-number"]
    );
    // 在這裡執行支付表單提交邏輯
  }
);
