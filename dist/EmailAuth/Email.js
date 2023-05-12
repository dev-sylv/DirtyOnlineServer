"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUsers = void 0;
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const googleapis_1 = require("googleapis");
const EnvironmentVariables_1 = require("../Config/EnvironmentVariables");
const GOOGLE_ID = EnvironmentVariables_1.EnvironmentVariables.GOOGLE_ID;
const GOOGLE_SECRET = EnvironmentVariables_1.EnvironmentVariables.GOOGLE_SECRET;
const GOOGLE_REFRESHTOKEN = "1//04k_z9ebpngq-CgYIARAAGAQSNwF-L9Ir0IlTnY6iVtGwKhCyOuFixABn1LPLxlyYot70MYSTKHyO7ad7p2hJVYM0aIHWO-SDI6M";
const GOOGLE_REDIRECT = EnvironmentVariables_1.EnvironmentVariables.GOOGLE_REDIRECT;
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);
oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });
const frontendurl = EnvironmentVariables_1.EnvironmentVariables.Verification_URL;
// Verify user email for ecobin:
const VerifyUsers = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const GetUserAccessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAUTH2",
                user: "ecobinng@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESHTOKEN,
                accessToken: GetUserAccessToken.token,
            },
        });
        // Connecting ejs file:
        const EmailVerifyEjs = path_1.default.join(__dirname, "../../views/AccountVerification.ejs");
        // To render file:
        const Renderemailfile = yield ejs_1.default.renderFile(EmailVerifyEjs, {
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            userId: user === null || user === void 0 ? void 0 : user._id,
            userToken: user === null || user === void 0 ? void 0 : user.token,
            url: `${frontendurl}/${user === null || user === void 0 ? void 0 : user._id}/${user === null || user === void 0 ? void 0 : user.token}`,
        });
        const Mailer = {
            from: "ecoBIN ♻ <ecobinng@gmail.com>",
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: "Account Verification",
            html: Renderemailfile,
        };
        transporter
            .sendMail(Mailer)
            .then(() => {
            console.log("Verification email sent");
            // return res.status(200).json({
            //   message: "Verification email sent",
            //   data: "View your email to verify your account",
            // });
        })
            .catch((err) => {
            console.log("An error occured, please try again");
            // return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
            //   message: "An error occured, please try again",
            //   data: err,
            // });
        });
    }
    catch (error) {
        console.log("An error occured in sending email", error);
    }
});
exports.VerifyUsers = VerifyUsers;
