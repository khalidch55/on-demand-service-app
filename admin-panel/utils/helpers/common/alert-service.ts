import Swal, { SweetAlertPosition } from "sweetalert2";
import { errorMessages } from "../enums/messages.enum";

export const successToaster = (
  text: string,
  position: SweetAlertPosition = "top-right",
) => {
  Swal.fire({
    text,
    icon: "success",
    background: "var(--popup-background, #1e1e2e)",
    color: "var(--popup-foreground, #cdd6f4)",
    confirmButtonColor: "var(--primary, #89b4fa)",
    showConfirmButton: false,
    toast: true,
    timerProgressBar: true,
    position,
    timer: 3000,
    didOpen: (popup) => {
      popup.addEventListener("mouseenter", Swal.stopTimer);
      popup.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};

export const warningToaster = (
  text: string,
  position: SweetAlertPosition = "top-right",
) => {
  Swal.fire({
    text,
    icon: "warning",
    background: "var(--popup-background, #1e1e2e)",
    color: "var(--popup-foreground, #cdd6f4)",
    confirmButtonColor: "var(--primary, #89b4fa)",
    showConfirmButton: false,
    toast: true,
    timerProgressBar: true,
    position,
    timer: 3000,
    didOpen: (popup) => {
      popup.addEventListener("mouseenter", Swal.stopTimer);
      popup.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};

export const errorToaster = (
  text: string,
  position: SweetAlertPosition = "top-right",
) => {
  Swal.fire({
    text: text ?? errorMessages.somethingWentWrong,
    icon: "error",
    background: "var(--popup-background, #1e1e2e)",
    color: "var(--popup-foreground, #cdd6f4)",
    confirmButtonColor: "var(--primary, #89b4fa)",
    showConfirmButton: false,
    toast: true,
    timerProgressBar: true,
    position,
    timer: 3000,
    didOpen: (popup) => {
      popup.addEventListener("mouseenter", Swal.stopTimer);
      popup.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};

export const errorToasterAutoClose = (
  title: string,
  position: SweetAlertPosition = "top-right",
) => {
  Swal.fire({
    title,
    icon: "error",
    background: "var(--popup-background, #1e1e2e)",
    color: "var(--popup-foreground, #cdd6f4)",
    confirmButtonColor: "var(--primary, #89b4fa)",
    showConfirmButton: false,
    toast: true,
    timerProgressBar: true,
    timer: 5000,
    position,
    didOpen: (popup) => {
      popup.addEventListener("mouseenter", Swal.stopTimer);
      popup.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};

export const confirmationPopup = async (
  title: string = "Are you sure you want to do this?",
  confirmButtonText = "Yes",
  cancelButtonText = "No",
) => {
  return Swal.fire({
    title,
    icon: "question",
    background: "var(--popup-background, #1e1e2e)",
    color: "var(--popup-foreground, #cdd6f4)",
    showCancelButton: true,
    confirmButtonColor: "var(--primary, #89b4fa)",
    cancelButtonColor: "var(--secondary, #6c757d)",
    confirmButtonText,
    cancelButtonText,
  });
};

export const customConfirmationPopup = async (
  title: string,
  confirmButtonText: string,
  cancelButtonText: string,
) => {
  return Swal.fire({
    title,
    icon: "question",
    background: "var(--popup-background, #1e1e2e)",
    color: "var(--popup-foreground, #cdd6f4)",
    showCancelButton: true,
    confirmButtonColor: "var(--primary, #89b4fa)",
    cancelButtonColor: "var(--secondary, #6c757d)",
    confirmButtonText,
    cancelButtonText,
    allowOutsideClick: false,
  });
};

export const infoPopup = async (
  title: string = "Information",
  text?: string,
) => {
  return Swal.fire({
    title,
    text,
    icon: "info",
    background: "var(--popup-background, #1e1e2e)",
    color: "var(--popup-foreground, #cdd6f4)",
    confirmButtonColor: "var(--primary, #89b4fa)",
    confirmButtonText: "Ok",
  });
};
