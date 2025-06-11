import _ from 'lodash';
import moment from 'moment';
import validator from 'validator';
import { Logger } from 'kv-logger';
import { AppError } from '../app-error';
import { emailManager } from './email-manager';
import { UsersV2 } from '../../models/users_v2';
import { passwordHashSync, randToken } from '../utils/security';

class RegistrationService {
    validatePassword(password: string) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!regex.test(password)) {
            throw new AppError('Password does not meet complexity requirements');
        }
    }

    async register(email: string, password: string, name: string, logger: Logger) {
        if (!validator.isEmail(email)) {
            throw new AppError('Invalid email address');
        }
        this.validatePassword(password);
        if (!name) {
            throw new AppError('Invalid user name');
        }
        const exists = await UsersV2.findOne({ where: { email } });
        if (exists) {
            throw new AppError('Email already registered');
        }
        const verificationToken = randToken(32);
        const user = await UsersV2.create({
            email,
            password: passwordHashSync(password),
            name,
            verification_token: verificationToken,
        });
        await emailManager.sendVerifyEmail(email, verificationToken);
        logger.info('register new user', { email });
        return user;
    }

    async verify(token: string) {
        const user = await UsersV2.findOne({ where: { verification_token: token } });
        if (!user) {
            throw new AppError('Invalid verification token');
        }
        user.set('email_verified', true);
        user.set('verification_token', null);
        await user.save();
    }

    async forgotPassword(email: string) {
        const user = await UsersV2.findOne({ where: { email } });
        if (!user) {
            throw new AppError('Email not found');
        }
        const token = randToken(32);
        user.set('reset_password_token', token);
        user.set('reset_password_expires', moment().add(1, 'day').toDate());
        await user.save();
        await emailManager.sendResetPasswordMail(email, token);
    }

    async resetPassword(token: string, password: string) {
        this.validatePassword(password);
        const user = await UsersV2.findOne({ where: { reset_password_token: token } });
        if (!user || !user.reset_password_expires || moment().isAfter(user.reset_password_expires)) {
            throw new AppError('Reset token invalid or expired');
        }
        user.set('password', passwordHashSync(password));
        user.set('reset_password_token', null);
        user.set('reset_password_expires', null);
        await user.save();
    }
}

export const registrationService = new RegistrationService();
