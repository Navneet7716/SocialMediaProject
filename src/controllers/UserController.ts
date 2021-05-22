
import { NextFunction, Request, Response } from "express";


import { hash } from 'bcryptjs'

import { body, validationResult } from 'express-validator'
import { prisma } from "../server";


export const userValidationRules = [
    body('email')
        .isLength({ min: 1 })
        .withMessage('Email must not be empty')
        .isEmail()
        .withMessage('Must be a valid email address'),
    body('username').isLength({ min: 1 }).withMessage('Name must not be empty'),
    body('role')
        .isIn(['ADMIN', 'USER', 'SUPERADMIN', undefined])
        .withMessage(`Role must be one of 'ADMIN', 'USER', 'SUPERADMIN'`),
]


const simpleVadationResult = validationResult.withDefaults({
    formatter: (err) => err.msg,
})

export const checkForErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = simpleVadationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.mapped())
    }
    next()
}

export async function getUser(req: Request, res: Response, next: NextFunction) {


    try {
        const result = await prisma.user.findMany({
            take: 10, select: {
                username: true,
                email: true,
                id: true,
                created_at: true,
                posts: {
                    select: {
                        body: true,
                        title: true,
                        created_at: true
                    }
                }
            }

        })

        res.status(200).json({
            "status": "SuccessFull",
            "length": result.length,
            "data": result
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            "status": "error",
            "error": error.message
        })

    }
}

interface user {
    email: string,
    username: string,
    password: string,
}

export async function addUser(req: Request, res: Response, next: NextFunction) {


    try {
        let { username, email, password }: user = req.body
        password = await hash(password, 12);
        const newUser = await prisma.user.create({
            data: {
                username,
                email, password
            },
            select: {
                username: true,
                email: true,
                id: true,
                created_at: true,
                posts: true
            }
        })

        res.status(201).json({
            "status": "SuccessFull Created User",
            "data": newUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "status": "error",
            "error": error.message
        })

    }
}

export async function userUpdate(req: Request, res: Response) {

    try {

        const { email } = req.body
        const userid = parseInt(req.params.id)
        const updatedUser = await prisma.user.update({
            where: {
                id: userid
            }, data: {
                email
            },
            select: {
                username: true,
                email: true,
                id: true,
                updated_at: true,
            }
        })
        res.status(200).json({
            "message": "Updated User Successfully!",
            "data": updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            "status": "error",
            "error": error.message
        })
    }

}



export async function deleteUser(req: Request, res: Response) {

    try {
        const userid: number = parseInt(req.params.id);
        const result = await prisma.user.delete({
            where: {
                id: userid
            }
        })

        console.log(result)

        res.status(200).json({
            "message": `User deleted with the id: ${userid}`
        })

    }

    catch (err) {

        console.log(err)

        res.status(400).json({
            "message": "Something went wrong 😶",
            "error": err.message
        })

    }

}

export async function getOneUser(req: Request, res: Response) {

    try {
        const userid: number = parseInt(req.params.id);
        const result = await prisma.user.findUnique({
            where: {
                id: userid
            },
            include: {
                posts: true
            }
        })

        if (result === null) {
            throw Error("User Not Found")
        }

        res.status(200).json({
            "message": `User Found`,
            "data": result
        })

    }

    catch (err) {

        console.log(err)

        res.status(400).json({
            "message": "Something went wrong 😶",
            "error": err.message
        })

    }

}


// export async function followUser(req: Request, res: Response) {

//     // const userid: string = "";
//     try {
//         const user1: User = await User.findOneOrFail({ userid: "69282a8e-bc56-45da-b500-d585d12eae90" })
//         const user2: User = await User.findOneOrFail({ userid: "96e917a3-0a6d-4d7d-9e2c-991a8cd1663a" })

//         const follow = await Follow.create(user2)

//         console.log(follow)


//         follow.save()


//         res.send("Success")
//     } catch (error) {
//         console.log(error)
//     }





// }