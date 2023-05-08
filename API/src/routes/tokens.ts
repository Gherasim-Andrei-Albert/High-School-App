import express from 'express';
import { getLogger } from '@/utils/loggers';
import passport from '../middlewares/auth';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
const router = express.Router();
const logger = getLogger('USER_ROUTE');

router.post('/', async (req, res, next) => {
  passport.authenticate('login', async (err: any, user: User, info: any) => {
    try {
      if (err) {
        return res.status(500).json({msg: 'An error occurred.'});
      }

      if (!user) {
        return res.status(403).json({ msg: 'Wrong email or password' });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          return res.status(500).json({msg: 'An error occurred.'});
        }

        if (!process.env.TOKEN_SECRET) {
          return res.status(500).json({msg: 'An error occurred.'});
        }

        const body = { _id: user.id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET);

        return res.json({ token });
      });
    } catch (error) {
      return res.status(500).json({msg: 'An error occurred.'});
    }
  })(req, res, next);
});

export default router;
