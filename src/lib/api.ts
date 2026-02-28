import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const QuestionsAPI = {
  fetchBySubject: async (subject: string, topic?: string) => {
    const response = await api.get("/questions", { params: { subject, topic } });
    return response.data;
  },
  submitQuiz: async (results: any) => {
    const response = await api.post("/results", results);
    return response.data;
  }
};

export const AuthAPI = {
  login: async (credentials: any) => {
    const response = await api.post("/login", credentials);
    return response.data;
  },
  signup: async (userData: any) => {
    const response = await api.post("/signup", userData);
    return response.data;
  }
};
