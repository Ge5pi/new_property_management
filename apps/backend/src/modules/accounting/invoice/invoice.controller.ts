import { Request, Response } from 'express';
import * as invoiceService from './invoice.service';

export async function getAllInvoices(req: Request, res: Response): Promise<void> {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get invoices' });
  }
}

export async function getInvoiceById(req: Request, res: Response): Promise<void> {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get invoice' });
  }
}

export async function createInvoice(req: Request, res: Response): Promise<void> {
  try {
    const newInvoice = await invoiceService.createInvoice(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create invoice' });
  }
}

export async function updateInvoice(req: Request, res: Response): Promise<void> {
  try {
    const updatedInvoice = await invoiceService.updateInvoice(req.params.id, req.body);
    if (!updatedInvoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update invoice' });
  }
}

export async function deleteInvoice(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await invoiceService.deleteInvoice(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete invoice' });
  }
}
