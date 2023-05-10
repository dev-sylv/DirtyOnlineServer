import ejs from "ejs";

import nodemailer from "nodemailer";

import { google, homegraph_v1 } from "googleapis";

const GOOGLE_ID =
  "607063325888-5r9ma23i481qd1tk065dlgf9pofascfi.apps.googleusercontent.com";

const GOOGLE_SECRET = "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";

const GOOGLE_REFRESHTOKEN =
  "1//04k_z9ebpngq-CgYIARAAGAQSNwF-L9Ir0IlTnY6iVtGwKhCyOuFixABn1LPLxlyYot70MYSTKHyO7ad7p2hJVYM0aIHWO-SDI6M";

const GOOGLE_REDIRECT: string = "https://developers.google.com/oauthplayground";

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });

// Verify user email for ecobin:
export const VerifyUsers = async (user: any) => {
  try {
    const GetUserAccessToken: any = await oAuth.getAccessToken();

    const transporter = nodemailer.createTransport({
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

    const Mailer = {
      from: "ecoBIN ♻ <ecobinng@gmail.com>",
      to: user?.email,
      subject: "Email Verification",
      html: "Please verify your email here",
    };

    transporter
      .sendMail(Mailer)
      .then(() => {
        console.log("Verification email sent");
      })
      .catch((err) => {
        console.log("Email not sent");
      });
  } catch (error) {
    console.log("An error occured in sending email");
  }
};
