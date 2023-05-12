import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { google } from "googleapis";
import { EnvironmentVariables } from "../Config/EnvironmentVariables";
import { HTTPCODES } from "../Utils/MainAppError";

const GOOGLE_ID = EnvironmentVariables.GOOGLE_ID;

const GOOGLE_SECRET = EnvironmentVariables.GOOGLE_SECRET;

const GOOGLE_REFRESHTOKEN =
  "1//04k_z9ebpngq-CgYIARAAGAQSNwF-L9Ir0IlTnY6iVtGwKhCyOuFixABn1LPLxlyYot70MYSTKHyO7ad7p2hJVYM0aIHWO-SDI6M";

const GOOGLE_REDIRECT: string = EnvironmentVariables.GOOGLE_REDIRECT;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

oAuth.setCredentials({ access_token: GOOGLE_REFRESHTOKEN });

const frontendurl = EnvironmentVariables.Verification_URL;

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

    // Connecting ejs file:
    const EmailVerifyEjs = path.join(
      __dirname,
      "../../views/AccountVerification.ejs"
    );

    // To render file:
    const Renderemailfile = await ejs.renderFile(EmailVerifyEjs, {
      name: user?.name,
      email: user?.email,
      userId: user?._id,
      userToken: user?.token,
      url: `${frontendurl}/${user?._id}/${user?.token}`,
    });

    const Mailer = {
      from: "ecoBIN ♻ <ecobinng@gmail.com>",
      to: user?.email,
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
  } catch (error) {
    console.log("An error occured in sending email", error);
  }
};
