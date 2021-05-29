import { Request, Response } from "express";
import { prisma } from "../server";


export async function deleteVote(req: Request, res: Response) {

    let { id, by } = req.body

    try {

        await prisma.votes.delete({
            select: {
                post_id: true,
                by: true
            },
            where: {
                by_post_id: {
                    by: by,
                    post_id: id
                }
            }

        })

        res.status(200).json({
            "message": "Successfully removed",
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            "message": "error",
            "error": error.toString()
        })

    }


}

export async function addVote(req: Request, res: Response) {

    let { id, by } = req.body;

    try {
        await prisma.votes.create({
            data: {
                post_id: id,
                by: by
            }
        })

        let totalVotes = await prisma.votes.findMany({
            where: {
                post_id: id
            }
        })

        res.status(200).json({
            "message": "Successfully added the vote",
            "data": totalVotes.length
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            "message": "error",
            "error": error.toString()
        })

    }

}
