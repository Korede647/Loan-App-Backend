
import cron from "node-cron";
import { db } from '../config/db';
import { NotificationService } from "../service/notification.service";
import { NotificationServiceImpl } from "../service/impl/notification.service.impl";
import { CreateNotificationDTO } from "../dto/createNotification.dto";
import { log } from "console";

const notificationService = new NotificationServiceImpl()
 export const repayLoanCron = () =>{

    const REPAY_LOAN_CRON = " 0 1 * * *";

    cron.schedule(REPAY_LOAN_CRON, async () => {
        console.log("Starting Cron Job for Payment of Loans");
        

async function processPayment(repayment: any): Promise<boolean> {
  // Simulate a delay as if calling an external payment service.
  return new Promise((resolve) => {
    setTimeout(() => {
      // For this example, we assume payment is always successful.
      resolve(true);
    }, 500);
  });
}


 // Process all pending repayments whose due date is up (or past).

async function processAutoPayments(): Promise<void> {
  const now = new Date();
  console.log(`Auto-payment job running at: ${now.toISOString()}`);

  try {
    // Find all repayments that are pending and due (or past due).
    const pendingRepayments = await db.payment.findMany({
      where: {
        status: 'PENDING',
        due_date: {
          lte: now,
        },
      },
    });

    if (pendingRepayments.length === 0) {
      console.log("No repayments to process at this time.");
      return;
    }

    for (const repayment of pendingRepayments) {
      try {
        console.log(`Processing repayment ${repayment.id} for user ${repayment.userId}`);

        // Process the payment (simulate payment gateway call)
        const paymentSuccess = await processPayment(repayment);

        if (paymentSuccess) {
          // Update the repayment record as paid.
          await db.payment.update({
            where: { id: repayment.id },
            data: {
              status: "PAID",
              paid_on: new Date(),
            },
          });

          // Create a transaction record.
          await db.transaction.create({
            data: {
              loan_id: repayment.loanId,
              user_id: repayment.userId,
              transaction: "LOAN_REPAYMENT",
              amount: repayment.amount_paid,
            //   payment_method: "",
              transaction_reference: `TXN-${Date.now()}`,
              status: "SUCCESSFUL",
            },
          });

          // Send a notification to the user.
          const body : CreateNotificationDTO = {
            message: `Your payment for repayment ${repayment.id} has been successfully processed.`,
            notificationType: "PAYMENT_RECEIVED"
          }
          await  notificationService.createNotification(
            repayment.userId,
            body
          );

          console.log(`Repayment ${repayment.id} processed successfully.`);
        } else {
          // update the repayment status to "failed" if payment failed.
          await db.payment.update({
            where: { id: repayment.id },
            data: {
              status: "FAILED",
            },
          });

          const body2 : CreateNotificationDTO = {
            message:  `Your auto-payment for repayment ${repayment.id} failed. Please check your payment method.`,
            notificationType: "PAYMENT_FAILED"
          }
          await notificationService.createNotification(
            repayment.userId,
            body2
          );

          console.log(`Repayment ${repayment.id} failed during processing.`);
        }
      } catch (innerError) {
        console.error(`Error processing repayment ${repayment.id}:`, innerError);
      }
    }
  } catch (error) {
    console.error("Error in auto-payment cron job:", error);
  }
}

})
 }