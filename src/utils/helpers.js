export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    this.textContent = loadingText;
  } else {
    this.textContent = defaultText;
  }
}
