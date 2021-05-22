import { Request, Response } from "express";
import { prisma } from "../server";


interface post {
    body: string,
    title: string,
    userId: number
}

export async function getPost(req: Request, res: Response) {


    try {
        const posts = await prisma.post.findMany({ take: 10 })

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
    let { body, title, userId }: post = req.body;
    try {

        const addedPost = await prisma.post.create({
            data: {
                body,
                title,
                userId
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

}
export async function deletePost(req: Request, res: Response) {

}