import cron from "node-cron";

import { sendMonthlyReport } from "../modules/report/report.service";
import { User } from "../models/user.model";

export const startReportCron = () => {
    // Runs at 12:00 AM on 1st day of every month
    cron.schedule("0 0 1 * *", async () => {
        console.log("Running Monthly Report Cron...");

        try {
            const users = await User.find();

            const now = new Date();
            const month = now.getMonth() === 0 ? 12 : now.getMonth();
            const year =
                now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

            for (const user of users) {
                try {
                    await sendMonthlyReport(
                        user._id.toString(),
                        user.email,
                        month,
                        year
                    );

                    console.log(`Report sent to ${user.email}`);
                } catch (err) {
                    console.error(`Failed for ${user.email}`, err);
                }
            }
            console.log("Monthly reports completed");
        } catch (error) {
            console.error("Cron failed", error);
        }
    });
};