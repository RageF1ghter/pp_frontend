// src/config.js
const dev = {
  API_URL: "http://localhost:5000/api",
};

const prod = {
  API_URL: "https://omnic.space/api",
};

// const config = process.env.NODE_ENV === "development" ? dev : prod;

export default { dev, prod };
