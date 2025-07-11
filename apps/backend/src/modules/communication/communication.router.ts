import { Router } from 'express';
import contactRouter from './contact/contact.router';
import noteRouter from './note/note.router';
import noteAttachmentRouter from './noteAttachment/noteAttachment.router';
import emailRouter from './email/email.router';
import emailSignatureRouter from './emailSignature/emailSignature.router';
import emailTemplateRouter from './emailTemplate/emailTemplate.router';
import announcementRouter from './announcement/announcement.router';
import announcementAttachmentRouter from './announcementAttachment/announcementAttachment.router';

const router = Router();

router.use('/contacts', contactRouter);
router.use('/notes', noteRouter);
router.use('/note-attachments', noteAttachmentRouter);
router.use('/emails', emailRouter);
router.use('/email-signatures', emailSignatureRouter);
router.use('/email-templates', emailTemplateRouter);
router.use('/announcements', announcementRouter);
router.use('/announcement-attachments', announcementAttachmentRouter);

export default router;
