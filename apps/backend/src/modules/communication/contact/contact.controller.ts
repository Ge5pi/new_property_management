import { Request, Response } from 'express';
import * as contactService from './contact.service';

export async function getAllContacts(req: Request, res: Response): Promise<void> {
  try {
    const contacts = await contactService.getAllContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get contacts' });
  }
}

export async function getContactById(req: Request, res: Response): Promise<void> {
  try {
    const contact = await contactService.getContactById(req.params.id);
    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get contact' });
  }
}

export async function createContact(req: Request, res: Response): Promise<void> {
  try {
    const newContact = await contactService.createContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create contact' });
  }
}

export async function updateContact(req: Request, res: Response): Promise<void> {
  try {
    const updatedContact = await contactService.updateContact(req.params.id, req.body);
    if (!updatedContact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contact' });
  }
}

export async function deleteContact(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await contactService.deleteContact(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact' });
  }
}
