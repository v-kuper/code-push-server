import _ from 'lodash';
import nodemailer from 'nodemailer';
import { AppError } from '../app-error';
import { config } from '../config';

class EmailManager {
    sendMail(options: { to: string; html: string; subject?: string; from?: string }) {
        return new Promise((resolve, reject) => {
            if (!_.get(options, 'to')) {
                reject(new AppError('to是必传参数'));
                return;
            }
            const { smtpConfig } = config;
            if (!smtpConfig || !smtpConfig.host) {
                resolve({});
                return;
            }
            const transporter = nodemailer.createTransport(smtpConfig);
            const sendEmailAddress = smtpConfig.auth.user;
            const defaultMailOptions = {
                from: `"CodePush Server" <${sendEmailAddress}>`, // sender address
                to: '', // list of receivers 必传参数
                subject: 'CodePush Server', // Subject line
                html: '', // html body
            };
            const mailOptions = _.assign(defaultMailOptions, options);
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(info);
            });
        });
    }

    sendRegisterCodeMail(email: string, code: string) {
        return this.sendMail({
            to: email,
            html: `<div>您接收的验证码为: <em style="color:red;">${code}</em>  20分钟内有效</div>`,
        });
    }

    sendVerifyEmail(email: string, token: string) {
        return this.sendMail({
            to: email,
            subject: 'Verify your email',
            html: `<div>Please verify your email using this token: <em>${token}</em></div>`,
        });
    }

    sendResetPasswordMail(email: string, token: string) {
        return this.sendMail({
            to: email,
            subject: 'Reset Password',
            html: `<div>Reset your password using this token: <em>${token}</em></div>`,
        });
    }
}

export const emailManager = new EmailManager();
