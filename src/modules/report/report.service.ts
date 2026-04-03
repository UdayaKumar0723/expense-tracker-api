import { getAnalytics } from "../expense/expense.service";
import { transporter } from "../../config/mail";

export const sendMonthlyReport = async (
    userId: string,
    email: string,
    month: number,
    year: number
) => {
    // Get analytics data
    const analytics = await getAnalytics(userId, month, year);

    // Build HTML email
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">📊 Monthly Expense Report</h2>

      <p><strong>Month:</strong> ${month}/${year}</p>

      <hr />

      <p><strong>Total Spent:</strong> ₹${analytics.totalSpent}</p>
      <p><strong>Top Category:</strong> ${analytics.topCategory || "N/A"}</p>
      <p><strong>Average Expense:</strong> ₹${analytics.averageExpense.toFixed(2)}</p>

      <h3>📂 Category Breakdown:</h3>
      <ul>
        ${analytics.categoryBreakdown
            .map(
                (c: any) =>
                    `<li><strong>${c.category}</strong>: ₹${c.total}</li>`
            )
            .join("")}
      </ul>

      <hr />

      <p style="font-size: 14px; color: gray;">
        This is an automated report from Expense Tracker API.
      </p>
    </div>
  `;
    // Send email
    await transporter.sendMail({
        from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Expense Report - ${month}/${year}`,
        html
    });

    return {
        message: "Email sent successfully"
    };
};
