import { Router } from 'express';
import * as RelationshipController from '../controllers/RelationshipController';


const relationshipRouter = Router()


relationshipRouter.route('/getfollowers').get(RelationshipController.getFollowers)

relationshipRouter.route('/getfollowings').get(RelationshipController.getFollowings)

relationshipRouter.route('/follow').post(RelationshipController.follow)

relationshipRouter.route('/unfollow').delete(RelationshipController.unfollow)




export default relationshipRouter;