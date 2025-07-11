import { Request, Response } from 'express';
import * as noteAttachmentService from './noteAttachment.service';

export async function getAllNoteAttachments(req: Request, res: Response): Promise<void> {
  try {
    const noteAttachments = await noteAttachmentService.getAllNoteAttachments();
    res.json(noteAttachments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get note attachments' });
  }
}

export async function getNoteAttachmentById(req: Request, res: Response): Promise<void> {
  try {
    const noteAttachment = await noteAttachmentService.getNoteAttachmentById(req.params.id);
    if (!noteAttachment) {
      res.status(404).json({ message: 'Note attachment not found' });
      return;
    }
    res.json(noteAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get note attachment' });
  }
}

export async function createNoteAttachment(req: Request, res: Response): Promise<void> {
  try {
    const newNoteAttachment = await noteAttachmentService.createNoteAttachment(req.body);
    res.status(201).json(newNoteAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note attachment' });
  }
}

export async function updateNoteAttachment(req: Request, res: Response): Promise<void> {
  try {
    const updatedNoteAttachment = await noteAttachmentService.updateNoteAttachment(req.params.id, req.body);
    if (!updatedNoteAttachment) {
      res.status(404).json({ message: 'Note attachment not found' });
      return;
    }
    res.json(updatedNoteAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note attachment' });
  }
}

export async function deleteNoteAttachment(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await noteAttachmentService.deleteNoteAttachment(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Note attachment not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note attachment' });
  }
}
