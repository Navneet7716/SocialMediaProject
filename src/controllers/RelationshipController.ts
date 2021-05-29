import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../server";


interface post {
    body: string,
    title: string,
    userId: number,
}

export const postValidationRule = [
    body('body')
        .isLength({ min: 1 })
        .withMessage(`Post can't be empty`),
    body('title')
        .isLength({ min: 1 })
        .withMessage(`title can't be empty`),
    body('userId')
        .notEmpty()
        .withMessage(`User Id Can't be empty`)
        .isNumeric()
        .withMessage(`userId has to be a number`)

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



export async function getFollowers(req: Request, res: Response) {

    try {
        let { id } = req.body

        let results = await prisma.relationships.findMany({
            where: {
                followed_id: id
            }
        })

        res.status(200).json({
            "message": "Success",
            "data": results,
            "numOfFollowers": results.length


        })


    } catch (error) {

        console.log(error)
        res.status(400).json({
            "message": "Error Occured Try again later",
            "error": error.toString()


        })


    }


}


export async function getFollow(req: Request, res: Response) {

    try {
        let { id } = req.body

        let results = await prisma.relationships.findMany({
            where: {
                followed_id: id
            }
        })

        res.status(200).json({
            "message": "Success",
            "data": results,
            "numOfFollowers": results.length


        })


    } catch (error) {

        console.log(error)
        res.status(400).json({
            "message": "Error Occured Try again later",
            "error": error.toString()


        })


    }


}


export async function follow(req: Request, res: Response) {

    try {

        let { userId, id } = req.body


        let response = await prisma.relationships.create({
            data: {
                followed_id: id,
                follower_id: userId
            }
        })

        res.status(200).json({
            "message": "followed user!",
            "result": response
        })


    } catch (error) {
        console.log(error)

        res.status(400).json({
            "message": "Couldn't follow user",
            "error": error.toString()
        })
    }



}
export async function unfollow(req: Request, res: Response) {
    try {

        let { userId, id } = req.body


        let response = await prisma.relationships.delete({
            where: {
                followed_id_follower_id: {
                    followed_id: id,
                    follower_id: userId
                }
            }
        })

        res.status(200).json({
            "message": "unfollowed user!",
            "result": response
        })


    } catch (error) {
        console.log(error)

        res.status(400).json({
            "message": "Couldn't unfollow user",
            "error": error.toString()
        })
    }


}
