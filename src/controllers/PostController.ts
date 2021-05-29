import { Request, Response } from "express";
import { prisma } from "../server";


interface post {
    body: string,
    title: string,
    userId: number,
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

    let { body, title, id } = req.body;

    try {

        const updatedPost = await prisma.post.update({
            where: {
                id: id
            },
            data: {
                body,
                title
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

    let id = parseInt(req.params.id)

    try {

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