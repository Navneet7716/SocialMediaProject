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



export async function getPost(req: Request, res: Response) {

    try {
        let posts = await prisma.post.findMany({
            take: 10, include: {
                user: true,
                votes: true,
                _count: {
                    select: { votes: true },
                }
            }
        })

        posts = posts.filter(el => el.userId != null)

        res.status(200).json({
            "message": "Successfull",
            "data": posts
        })


    } catch (error) {
        console.log(error)

        res.status(400).json({
            "message": "Couldn't find any Post",
            "error": error.toString()
        })
    }



}
export async function addPost(req: Request, res: Response) {

    try {
        let { body, title, userId }: post = req.body;

        const addedPost = await prisma.post.create({
            data: {
                body,
                title,
                userId
            },
            select: {
                _count: {
                    select: { votes: true },
                },
                user: {
                    select: {
                        username: true,
                        created_at: true,
                    }
                },
                body: true,
                title: true,
                created_at: true


            }
        })

        res.status(200).json({
            "message": "Successfull",
            "data": addedPost
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            "message": "error",
            "error": error.toString()
        })

    }



}
export async function updatePost(req: Request, res: Response) {

    let { body, title, id } = req.body;

    try {

        const updatedPost = await prisma.post.update({
            where: {
                id: id
            },
            data: {
                body,
                title
            },
            select: {
                user: {
                    select: {
                        updated_at: true,
                        username: true
                    }
                }
            }
        })

        res.status(200).json({
            "message": "Successfull",
            "data": updatedPost
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            "message": "error",
            "error": error.toString()
        })

    }


}




export async function deletePost(req: Request, res: Response) {



    try {

        let id = parseInt(req.params.id)

        await prisma.post.delete({
            where: {
                id: id
            }
        })

        res.status(200).json({
            message: "Post Deleted!"
        })


    } catch (error) {

        res.status(400).send({
            "message": "Couldn't delete post!",
            "error": error.toString()
        })

        console.log(error)
    }

}