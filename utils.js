export const getToken = (id) =>
  jwt.sign({ id }, process.env.CREATE_TOKEN_KEY, {
    expiresIn: "1h",
  });
