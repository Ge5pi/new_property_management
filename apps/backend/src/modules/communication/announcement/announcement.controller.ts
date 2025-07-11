import { Request, Response } from 'express';
import * as announcementService from './announcement.service';

export async function getAllAnnouncements(req: Request, res: Response): Promise<void> {
  try {
    const announcements = await announcementService.getAllAnnouncements();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get announcements' });
  }
}

export async function getAnnouncementById(req: Request, res: Response): Promise<void> {
  try {
    const announcement = await announcementService.getAnnouncementById(req.params.id);
    if (!announcement) {
      res.status(404).json({ message: 'Announcement not found' });
      return;
    }
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get announcement' });
  }
}

export async function createAnnouncement(req: Request, res: Response): Promise<void> {
  try {
    const newAnnouncement = await announcementService.createAnnouncement(req.body);
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement' });
  }
}

export async function updateAnnouncement(req: Request, res: Response): Promise<void> {
  try {
    const updatedAnnouncement = await announcementService.updateAnnouncement(req.params.id, req.body);
    if (!updatedAnnouncement) {
      res.status(404).json({ message: 'Announcement not found' });
      return;
    }
    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update announcement' });
  }
}

export async function deleteAnnouncement(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await announcementService.deleteAnnouncement(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Announcement not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete announcement' });
  }
}
