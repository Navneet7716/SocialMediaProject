import { Router } from 'express';
import * as PostController from '../controllers/PostController';


const postRouter = Router()


postRouter.route('/').get(PostController.getPost)
    .post(PostController.addPost)

postRouter.route('/:id')
    .delete(PostController.deletePost)
    .patch(PostController.updatePost)

postRouter.route('/addvote/:id')
    .patch(PostController.addVote)

postRouter.route('/deletevote/:id')
    .patch(PostController.deleteVote)


// userRouter.route("/followuser").get(UserController.followUser)



export default postRouter;