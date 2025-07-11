import { Router } from 'express';
import invoiceRouter from './invoice/invoice.router';
import chargeRouter from './charge/charge.router';
import chargeAttachmentRouter from './chargeAttachment/chargeAttachment.router';
import accountRouter from './account/account.router';
import accountAttachmentRouter from './accountAttachment/accountAttachment.router';
import paymentRouter from './payment/payment.router';
import paymentAttachmentRouter from './paymentAttachment/paymentAttachment.router';
import generalLedgerAccountRouter from './generalLedgerAccount/generalLedgerAccount.router';
import generalLedgerTransactionRouter from './generalLedgerTransaction/generalLedgerTransaction.router';

const router = Router();

router.use('/invoice', invoiceRouter);
router.use('/charge', chargeRouter);
router.use('/charge-attachment', chargeAttachmentRouter);
router.use('/account', accountRouter);
router.use('/account-attachment', accountAttachmentRouter);
router.use('/payment', paymentRouter);
router.use('/payment-attachment', paymentAttachmentRouter);
router.use('/general-ledger-account', generalLedgerAccountRouter);
router.use('/general-ledger-transaction', generalLedgerTransactionRouter);

// TODO: Implement stripe routes and charge attachment list route

export default router;
