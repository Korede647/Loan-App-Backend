// // src/autoPaymentCron.ts
// import cron from 'node-cron';
// import { prisma } from './utils/prisma';
// import { NotificationServiceImpl } from './services/NotificationServiceImpl';

// /**
//  * Simulates processing a payment.
//  * In production, replace this with an actual integration with a payment gateway.
//  *
//  * @param repayment - The repayment record to process.
//  * @returns A Promise that resolves to true if payment is successful.
//  */
// async function processPayment(repayment: any): Promise<boolean> {
//   // Simulate a delay as if calling an external payment service.
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // For this example, we assume payment is always successful.
//       resolve(true);
//     }, 500);
//   });
// }

// /**
//  * Processes all pending repayments whose due date is up (or past).
//  */
// async function processAutoPayments(): Promise<void> {
//   const now = new Date();
//   console.log(`Auto-payment job running at: ${now.toISOString()}`);

//   try {
//     // Find all repayments that are pending and due (or past due).
//     const pendingRepayments = await prisma.repayment.findMany({
//       where: {
//         status: 'pending',
//         dueDate: {
//           lte: now,
//         },
//       },
//     });

//     if (pendingRepayments.length === 0) {
//       console.log("No repayments to process at this time.");
//       return;
//     }

//     const notificationService = new NotificationServiceImpl();

//     for (const repayment of pendingRepayments) {
//       try {
//         console.log(`Processing repayment ${repayment.id} for user ${repayment.userId}`);

//         // Process the payment (simulate payment gateway call)
//         const paymentSuccess = await processPayment(repayment);

//         if (paymentSuccess) {
//           // Update the repayment record as paid.
//           await prisma.repayment.update({
//             where: { id: repayment.id },
//             data: {
//               status: 'paid',
//               paidOn: new Date(),
//             },
//           });

//           // Create a corresponding transaction record.
//           await prisma.transaction.create({
//             data: {
//               loanId: repayment.loanId,
//               userId: repayment.userId,
//               type: 'loan_repayment',
//               amount: repayment.amountPaid,
//               payment_method: 'auto_debit',
//               transaction_reference: `TXN-${Date.now()}`,
//               status: 'successful',
//             },
//           });

//           // Send a notification to the user.
//           await notificationService.createNotification(
//             repayment.userId,
//             `Your auto-payment for repayment ${repayment.id} has been successfully processed.`,
//             'auto_payment_success'
//           );

//           console.log(`Repayment ${repayment.id} processed successfully.`);
//         } else {
//           // Optionally update the repayment status to "failed" if payment failed.
//           await prisma.repayment.update({
//             where: { id: repayment.id },
//             data: {
//               status: 'failed',
//             },
//           });

//           await notificationService.createNotification(
//             repayment.userId,
//             `Your auto-payment for repayment ${repayment.id} failed. Please check your payment method.`,
//             'auto_payment_failed'
//           );

//           console.log(`Repayment ${repayment.id} failed during processing.`);
//         }
//       } catch (innerError) {
//         console.error(`Error processing repayment ${repayment.id}:`, innerError);
//       }
//     }
//   } catch (error) {
//     console.error("Error in auto-payment cron job:", error);
//   }
// }

// // Schedule the cron job to run daily at 1 AM (server time).
// cron.schedule('0 1 * * *', async () => {
//   await processAutoPayments();
// });
