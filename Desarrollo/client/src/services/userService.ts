import api from "./api";

export const userService = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  deleteUsers: async (ruts: string[]) => {
    const response = await api.delete("/api/usuarios", {
      data: { usuarios: ruts },
    });
    return response.data;
  },

  // ... otros métodos
};
