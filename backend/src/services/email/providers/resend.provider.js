import { Resend } from 'resend';
import { config } from '../../../config/index.js';

const resend = new Resend(config.email.apiKey);

export default resend;