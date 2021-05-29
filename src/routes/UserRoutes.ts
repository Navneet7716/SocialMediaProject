import { Router } from "express";
import * as UserController from "../controllers/UserController";

const userRouter = Router();

userRouter
    .route("/")
    .get(UserController.getUser)
    .post(
        UserController.userValidationRules,
        UserController.checkForErrors,
        UserController.addUser
    );

userRouter
    .route("/:id")
    .delete(UserController.deleteUser)
    .patch(UserController.userUpdate)
    .get(UserController.getOneUser);

export default userRouter;
