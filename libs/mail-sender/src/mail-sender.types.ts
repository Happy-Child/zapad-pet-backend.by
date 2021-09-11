import * as nodemailer from 'nodemailer';

export type SendMailOptions = Omit<nodemailer.SendMailOptions, 'from'>;
