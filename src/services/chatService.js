const API_BASE_URL = "http://127.0.0.1:8000";

export const chatService = {
  /**
   * Post a question to the FastAPI endpoint and return a stream reader.
   * @param {string} question - The user query/question
   * @param {string} modelType - The model type to use ("fast" | "quality")
   * @returns {Promise<ReadableStreamDefaultReader<Uint8Array>>}
   */
  async getChatStream(question, modelType = "fast") {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        model_type: modelType,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(errorText || `API error status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response stream body returned from the server.");
    }

    return response.body.getReader();
  },

  /**
   * Verify if the backend server is reachable at its /health endpoint.
   * Direct fetch to check response.ok now that CORS middleware is registered.
   * @returns {Promise<boolean>} Reachable status
   */
  async checkConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
};
