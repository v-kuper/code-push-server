import express from 'express';
import _ from 'lodash';
import { Req } from '../core/middleware';
import { AppError } from '../core/app-error';
import { registrationService } from '../core/services/registration-service';

export const apiAuthRouter = express.Router();

apiAuthRouter.post('/register', async (req: Req<void, { email: string; password: string; name: string }, void>, res, next) => {
    const { logger, body } = req;
    try {
        const user = await registrationService.register(
            _.trim(body.email),
            _.trim(body.password),
            _.trim(body.name),
            logger,
        );
        res.send({ success: true, message: 'registered', user: { id: user.id, email: user.email, name: user.name } });
    } catch (e) {
        if (e instanceof AppError) {
            res.send({ success: false, message: e.message });
        } else {
            next(e);
        }
    }
});

apiAuthRouter.get('/verify/:token', async (req: Req<{ token: string }, void, void>, res, next) => {
    try {
        await registrationService.verify(req.params.token);
        res.send({ success: true, message: 'email verified' });
    } catch (e) {
        if (e instanceof AppError) {
            res.send({ success: false, message: e.message });
        } else {
            next(e);
        }
    }
});

apiAuthRouter.post('/forgot-password', async (req: Req<void, { email: string }, void>, res, next) => {
    try {
        await registrationService.forgotPassword(_.trim(req.body.email));
        res.send({ success: true, message: 'email sent' });
    } catch (e) {
        if (e instanceof AppError) {
            res.send({ success: false, message: e.message });
        } else {
            next(e);
        }
    }
});

apiAuthRouter.post('/reset-password', async (req: Req<void, { token: string; password: string }, void>, res, next) => {
    try {
        await registrationService.resetPassword(_.trim(req.body.token), _.trim(req.body.password));
        res.send({ success: true, message: 'password reset' });
    } catch (e) {
        if (e instanceof AppError) {
            res.send({ success: false, message: e.message });
        } else {
            next(e);
        }
    }
});
