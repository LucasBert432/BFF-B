const axios = require("axios");

class ApiService {
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.API_BASE_URL,
      timeout: parseInt(process.env.API_TIMEOUT) || 10000,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.API_KEY,
      },
    });

    // Interceptor para logging
    this.instance.interceptors.request.use(
      (config) => {
        console.log(
          `[API Request] ${config.method.toUpperCase()} ${config.url}`,
        );
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  async get(endpoint, params = {}) {
    try {
      const response = await this.instance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`[API Error] GET ${endpoint}:`, error.message);
      throw this.handleError(error);
    }
  }

  async post(endpoint, data = {}) {
    try {
      const response = await this.instance.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`[API Error] POST ${endpoint}:`, error.message);
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Erro da API
      return {
        status: error.response.status,
        message: error.response.data?.message || "API Error",
        code: error.response.data?.code || "API_ERROR",
      };
    } else if (error.request) {
      // Sem resposta da API
      return {
        status: 503,
        message: "Service unavailable",
        code: "SERVICE_UNAVAILABLE",
      };
    } else {
      // Erro na configuração
      return {
        status: 500,
        message: error.message,
        code: "REQUEST_ERROR",
      };
    }
  }
}

module.exports = new ApiService();
