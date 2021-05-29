import { Router } from 'express';
import * as PostController from '../controllers/PostController';


const postRouter = Router()


postRouter.route('/').get(PostController.getPost)
    .post(PostController.addPost)

postRouter.route('/:id')
    .delete(PostController.deletePost)
    .patch(PostController.updatePost)




export default postRouter;