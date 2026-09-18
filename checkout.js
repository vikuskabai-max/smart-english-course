const CHECKOUT_URL = "https://smart-english-wayforpay.smartenglishlama.workers.dev/checkout";

export async function requestPurchase() {
  const dialog = document.getElementById("purchase-dialog");
  const email = document.getElementById("purchase-email");
  const error = document.getElementById("purchase-error");

  if (!dialog) return;

  error.textContent = "";
  dialog.showModal();

  requestAnimationFrame(() => email?.focus());
}

const dialog = document.getElementById("purchase-dialog");
const form = document.getElementById("purchase-form");
const emailInput = document.getElementById("purchase-email");
const errorBox = document.getElementById("purchase-error");
const submitButton = document.getElementById("purchase-submit");

document.getElementById("close-purchase")?.addEventListener("click", () => {
  dialog?.close();
});

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = String(emailInput?.value || "").trim().toLowerCase();
  errorBox.textContent = "";

  if (!emailInput.checkValidity()) {
    errorBox.textContent = "Вкажіть коректний email.";
    emailInput.focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Створюємо платіж…";

  try {
    const response = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || !data.invoiceUrl) {
      throw new Error(data.error || "Не вдалося створити платіж.");
    }

    window.location.assign(data.invoiceUrl);
  } catch (error) {
    errorBox.textContent =
      error?.message || "Не вдалося створити платіж. Спробуйте ще раз.";
    submitButton.disabled = false;
    submitButton.textContent = "Перейти до оплати — 299 грн";
  }
});
