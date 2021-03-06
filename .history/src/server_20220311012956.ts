import express, { Request, Response } from "express";
import userRouter from "./routes/UserRoutes";
import postRouter from "./routes/PostRoutes";
import voteRouter from "./routes/VotesRoutes";
import relationshipRouter from "./routes/RelationshipRoutes";

import { PrismaClient } from "@prisma/client";

import morgan from "morgan";

export const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/vote", voteRouter);
app.use("/api/relationship", relationshipRouter);

app.listen(3000, () => {
  console.log("App running on http://localhost:3000");
});
