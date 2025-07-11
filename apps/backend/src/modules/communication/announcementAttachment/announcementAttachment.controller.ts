import { Request, Response } from 'express';
import * as announcementAttachmentService from './announcementAttachment.service';

export async function getAllAnnouncementAttachments(req: Request, res: Response): Promise<void> {
  try {
    const announcementAttachments = await announcementAttachmentService.getAllAnnouncementAttachments();
    res.json(announcementAttachments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get announcement attachments' });
  }
}

export async function getAnnouncementAttachmentById(req: Request, res: Response): Promise<void> {
  try {
    const announcementAttachment = await announcementAttachmentService.getAnnouncementAttachmentById(req.params.id);
    if (!announcementAttachment) {
      res.status(404).json({ message: 'Announcement attachment not found' });
      return;
    }
    res.json(announcementAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get announcement attachment' });
  }
}

export async function createAnnouncementAttachment(req: Request, res: Response): Promise<void> {
  try {
    const newAnnouncementAttachment = await announcementAttachmentService.createAnnouncementAttachment(req.body);
    res.status(201).json(newAnnouncementAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement attachment' });
  }
}

export async function updateAnnouncementAttachment(req: Request, res: Response): Promise<void> {
  try {
    const updatedAnnouncementAttachment = await announcementAttachmentService.updateAnnouncementAttachment(req.params.id, req.body);
    if (!updatedAnnouncementAttachment) {
      res.status(404).json({ message: 'Announcement attachment not found' });
      return;
    }
    res.json(updatedAnnouncementAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update announcement attachment' });
  }
}

export async function deleteAnnouncementAttachment(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await announcementAttachmentService.deleteAnnouncementAttachment(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Announcement attachment not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete announcement attachment' });
  }
}
