import { Request, Response } from 'express';
import * as noteService from './note.service';

export async function getAllNotes(req: Request, res: Response): Promise<void> {
  try {
    const notes = await noteService.getAllNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get notes' });
  }
}

export async function getNoteById(req: Request, res: Response): Promise<void> {
  try {
    const note = await noteService.getNoteById(req.params.id);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get note' });
  }
}

export async function createNote(req: Request, res: Response): Promise<void> {
  try {
    const newNote = await noteService.createNote(req.body);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note' });
  }
}

export async function updateNote(req: Request, res: Response): Promise<void> {
  try {
    const updatedNote = await noteService.updateNote(req.params.id, req.body);
    if (!updatedNote) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note' });
  }
}

export async function deleteNote(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await noteService.deleteNote(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
}
