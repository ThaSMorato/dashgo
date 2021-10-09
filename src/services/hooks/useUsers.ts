import { useQuery, UseQueryOptions } from "react-query";
import { api } from "../api";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ApiGetUsersResponse {
  users: User[];
}

interface GetUsersResponse {
  users: User[];
  totalCount: number;
}

export const getUsers = async (page: number): Promise<GetUsersResponse> => {
  const { data, headers } = await api.get<ApiGetUsersResponse>("users", {
    params: {
      page,
    },
  });

  const totalCount = Number(headers["x-total-count"]);

  const users = data.users.map(({ id, name, email, createdAt }) => ({
    id,
    name,
    email,
    createdAt: new Date(createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  }));

  return { users, totalCount };
};

export const useUsers = (page: number, options: UseQueryOptions) =>
  useQuery(["users", page], () => getUsers(page), { staleTime: 1000 * 5, ...options });
