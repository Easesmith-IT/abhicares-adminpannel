export function getApiErrorMessage(error) {
  return (
    error?.response?.data?.message || "Something went wrong. Please try again."
  );
}

export function getApiErrorStatus(error) {
  return error?.response?.status || null;
}
