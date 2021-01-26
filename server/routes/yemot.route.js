import express from 'express';
import * as yemotCtrl from '../controllers/yemot.controller';

const router = express.Router();

router.route('/')
    .post((req, res) => {
        yemotCtrl.handleCall(req, res);
    })

export default router;