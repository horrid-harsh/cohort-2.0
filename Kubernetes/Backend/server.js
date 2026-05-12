import express from "express";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
const PORT = 3000;

app.get("/", (req, res) => {
    let sum = 0;
    for (let i = 0; i <= 1000000; i++) {
        sum += i;
    }
    res.send(`Hello Kubernetess! Computed sum: ${sum}`);
})

app.get("/api/users", (req, res) => {
    const users = [
        { id: 1, name: "Abhishek" },
        { id: 2, name: "Akshat" },
        { id: 3, name: "Harshwardhan" },
    ];
    res.status(200).json(users);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})