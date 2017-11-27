import express from 'express';
import Memo from '../models/memo';
import mongoose from 'mongoose';
import { watch } from 'fs';

const router = express.Router();

router.post('/', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: 'NOT LOGGED IN',
            code: 1
        });
    }

    if (typeof req.body.contents !== 'string') {
        return res.status(400).json({
            error: 'EMPTY CONTENTS',
            code: 2
        });
    }

    if (req.body.contents === '') {
        return res.status(400).json({
            error: 'EMPTY CONTENTS',
            code: 2
        });
    }

    let memo = new Memo({
        writer: req.session.loginInfo.username,
        contents: req.body.contents
    });

    memo.save(err => {
        if (err) {
            throw err;
        }

        return res.json({ success: true });
    });
});

router.put('/:id', (req, res) => {
    Memo.find()
        .sort({'_id': -1})
        .limit(6)
        .exec((err, memos) => {
            if (err) {
                throw err;
            }

            res.json(memos);
        });
});

/*
    DELETE MEMO: DELETE /api/memo/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: 'INVALID ID',
            code: 1
        });
    }

    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: 'NOT LOGGED IN',
            code: 2
        });
    }

    Memo.findById(req.params.id, (err, memo) => {
        if (err) {
            throw err;
        }

        if (!memo) {
            return res.status(404).json({
                error: 'NO RESOURCE',
                code: 3
            });
        }

        if (memo.writer !== req.session.loginInfo.username) {
            return res.status(403).json({
                error: 'PERMISSION FAILURE',
                code: 4
            });
        }

        Memo.remove({_id: req.params.id}, err => {
            if (err) {
                throw err;
            }

            res.json({ success: true });
        })
    });
});

router.get('/', (req, res) => {

});

export default router