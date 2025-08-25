const ConfigService = require('../../services/ConfigService');
const Mailjet = require('node-mailjet');

class MailJetSender {
    constructor(logger) {
        this.configService = new ConfigService();
        this.logger = logger;

        // get public/private key for username / password auth
        this.apiKey =
            process.env.MJ_APIKEY_PUBLIC || this.configService.getValueForSection('lobby', 'emailPublicKey');
        if (!this.apiKey) {
            logger.info(`email public key not configured.`);
            return;
        }
        this.apiSecret =
            process.env.MJ_APIKEY_PRIVATE || this.configService.getValueForSection('lobby', 'emailPrivateKey');
        if (!this.apiSecret) {
            logger.info(`email private key not configured.`);
            return;
        }

        this.appName = this.configService.getValueForSection('lobby', 'appName');
    }

    sendEmail(to, subject, body) {
        // Logic to send email using MailJet API
        this.logger.info(`Sending email to ${to} with subject "${subject}" via MailJet.`);
        const mailjet = Mailjet.apiConnect(this.apiKey, this.apiSecret);

        const message = {
            To: [
                {
                    Email: to
                }
            ],
            From: {
                Name: this.appName,
                Email: this.configService.getValueForSection('lobby', 'emailFromAddress')
            },
            Subject: subject,
            TextPart: body
        };
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [message]
            });

        request
            .then((result) => {
                this.logger.info('MJ-Result: ' + result.response.statusText);
            })
            .catch((err) => {
                this.logger.info('MJ-Error: ' + err.statusCode);
            });

    }
}

module.exports = MailJetSender;