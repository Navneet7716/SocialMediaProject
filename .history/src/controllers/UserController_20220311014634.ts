import { NextFunction, Request, Response } from "express";

import { hash } from "bcryptjs";

import { body, validationResult } from "express-validator";
import { prisma } from "../server";

export const userValidationRules = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("username").isLength({ min: 1 }).withMessage("Name must not be empty"),
  body("password")
    .isLength({
      min: 8,
    })
    .withMessage(
      "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

const simpleVadationResult = validationResult.withDefaults({
  formatter: (err) => err.msg,
});

export const checkForErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = simpleVadationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped());
  }
  next();
};

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
      const result = await prisma.user.findMany({
          take: 10,
          select: {
              username: true,
              email: true,
              id: true,
              created_at: true,
              posts: {
                  include: {
                      votes: true,
                    },
                },
            },
        });
   let d = await prisma.$queryRaw`SELECT * FROM rewards;`

   console.log(d);
        
    res.status(200).json({
      status: "SuccessFull",
      length: result.length,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
}

interface user {
  email: string;
  username: string;
  password: string;
}

export async function addUser(req: Request, res: Response, next: NextFunction) {
  try {
    let { username, email, password }: user = req.body;
    password = await hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
      select: {
        username: true,
        email: true,
        id: true,
        created_at: true,
        posts: true,
      },
    });

    res.status(201).json({
      status: "SuccessFull Created User",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
}

export async function userUpdate(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const userid = parseInt(req.params.id);
    const updatedUser = await prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        email,
      },
      select: {
        username: true,
        email: true,
        id: true,
        updated_at: true,
      },
    });
    res.status(200).json({
      message: "Updated User Successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userid: number = parseInt(req.params.id);
    const result = await prisma.user.delete({
      where: {
        id: userid,
      },
    });

    console.log(result);

    res.status(200).json({
      message: `User deleted with the id: ${userid}`,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "Something went wrong 😶",
      error: err.message,
    });
  }
}

export async function getOneUser(req: Request, res: Response) {
  try {
    const userid: number = parseInt(req.params.id);
    const result = await prisma.user.findUnique({
      where: {
        id: userid,
      },
      include: {
        posts: true,
      },
    });

    if (result === null) {
      throw Error("User Not Found");
    }

    res.status(200).json({
      message: `User Found`,
      data: result,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "Something went wrong 😶",
      error: err.message,
    });
  }
}
