import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../server";

export async function getFollowers(req: Request, res: Response) {
    try {
        let { id } = req.body;

        let results = await prisma.relationships.findMany({
            where: {
                followed_id: id,
            },
            select: {
                follower: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        res.status(200).json({
            message: "Success",
            data: results,
            numOfFollowers: results.length,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Error Occured Try again later",
            error: error.toString(),
        });
    }
}

export async function getFollowings(req: Request, res: Response) {
    try {
        let { id } = req.body;

        let results = await prisma.user.findMany({
            select: {
                relationships: {
                    select: {
                        followed_id: true,
                    },
                },
            },
            where: {
                AND: [
                    {
                        id: id,
                    },
                    {
                        relationships: {
                            every: {
                                follower: {
                                    id: id,
                                },
                            },
                        },
                    },
                ],
            },
        });
        let data = [];
        let followerData = [];

        data = results[0].relationships.map((el) => ({ id: el.followed_id }));

        followerData = await prisma.user.findMany({
            where: {
                OR: data,
            },
            select: {
                username: true,
                email: true,
            },
        });

        res.status(200).json({
            message: "Success",
            data: followerData,
            followings: data.length,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Error Occured Try again later",
            error: error.toString(),
        });
    }
}

export async function follow(req: Request, res: Response) {
    try {
        let { userId, id } = req.body;

        let response = await prisma.relationships.create({
            data: {
                followed_id: id,
                follower_id: userId,
            },
        });

        res.status(200).json({
            message: "followed user!",
            result: response,
        });
    } catch (error) {
        console.log(error);

        res.status(400).json({
            message: "Couldn't follow user",
            error: error.toString(),
        });
    }
}

export async function unfollow(req: Request, res: Response) {
    try {
        let { userId, id } = req.body;

        let response = await prisma.relationships.delete({
            where: {
                followed_id_follower_id: {
                    followed_id: id,
                    follower_id: userId,
                },
            },
        });

        res.status(200).json({
            message: "unfollowed user!",
            result: response,
        });
    } catch (error) {
        console.log(error);

        res.status(400).json({
            message: "Couldn't unfollow user",
            error: error.toString(),
        });
    }
}
