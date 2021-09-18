import nodemailer from 'nodemailer';

export type SendMailOptionsType = Omit<nodemailer.SendMailOptions, 'from'>;
