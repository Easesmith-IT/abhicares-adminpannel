export function buildQuery(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === "" ||
      value === null ||
      value === undefined
    )
      return;
    query.append(key, value);
  });

  return query.toString(); // returns clean query string
}
