import express from 'express';
import registerUser from '../controller/register.js';
import checkEmail from '../controller/checkmail.js';
import checkPassword from '../controller/checkPassword.js';

import userDetail from '../controller/userDetail.js';
import logout from '../controller/logout.js';
import updateUser from '../controller/updateUser.js';
import searchUser from '../controller/searchUser.js';

const router = express.Router()

router.post('/register',registerUser);

router.post('/mail',checkEmail);
router.post('/password',checkPassword);
router.get('/user-details',userDetail);
router.get('/logout',logout);
router.post('/update-user',updateUser);
router.post('/search-user',searchUser);

export default router;
