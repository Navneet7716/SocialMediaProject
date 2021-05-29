import { Router } from 'express';
import * as VoteController from '../controllers/VoteController';


const voteRouter = Router()


voteRouter.route('/addvote')
    .patch(VoteController.voteValidationRule, VoteController.checkForErrors, VoteController.addVote)

voteRouter.route('/deletevote')
    .patch(VoteController.voteValidationRule, VoteController.checkForErrors, VoteController.deleteVote)



export default voteRouter;