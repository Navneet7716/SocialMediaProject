import { Router } from 'express';
import * as VoteController from '../controllers/VoteController';


const voteRouter = Router()


voteRouter.route('/addvote')
    .patch(VoteController.addVote)

voteRouter.route('/deletevote')
    .patch(VoteController.deleteVote)



export default voteRouter;