import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../server";

export const voteValidationRule = [
    body("by")
        .notEmpty()
        .withMessage(`by Id Can't be empty`)
        .isNumeric()
        .withMessage(`Must be a number`),
    body("id")
        .notEmpty()
        .withMessage(`User Id Can't be empty`)
        .isNumeric()
        .withMessage(`Must be a number`),
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

export async function deleteVote(req: Request, res: Response) {
    let { id, by } = req.body;

    try {
        await prisma.votes.delete({
            select: {
                post_id: true,
                by: true,
            },
            where: {
                by_post_id: {
                    by: by,
                    post_id: id,
                },
            },
        });

        res.status(200).json({
            message: "Successfully removed",
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "error",
            error: error.toString(),
        });
    }
}

export async function addVote(req: Request, res: Response) {
    let { id, by } = req.body;

    try {
        await prisma.votes.create({
            data: {
                post_id: id,
                by: by,
            },
        });

        let totalVotes = await prisma.votes.findMany({
            where: {
                post_id: id,
            },
        });

        res.status(200).json({
            message: "Successfully added the vote",
            data: totalVotes.length,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "error",
            error: error.toString(),
        });
    }
}
