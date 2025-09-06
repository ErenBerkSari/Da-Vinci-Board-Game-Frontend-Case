import axios from "axios";
import type { User, Post } from "../types";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// Users
export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/users");
  return res.data;
};

// Posts
export const getPosts = async (): Promise<Post[]> => {
  const res = await api.get("/posts");
  return res.data;
};

