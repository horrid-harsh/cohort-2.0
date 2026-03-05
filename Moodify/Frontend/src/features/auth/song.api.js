import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/song",
    withCredentials: true,
});

// export const uploadSongApi = async (song) => {
//     const response = await api.post("/", song);
//     return response.data;
// };

export const getSongApi = async ({ mood }) => {
    const response = await api.get(`?mood=${mood}`);
    return response.data;
};