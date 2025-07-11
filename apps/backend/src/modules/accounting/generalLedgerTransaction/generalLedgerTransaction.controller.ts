import { Request, Response } from 'express';
import * as generalLedgerTransactionService from './generalLedgerTransaction.service';

export async function getAllGeneralLedgerTransactions(req: Request, res: Response): Promise<void> {
  try {
    const transactions = await generalLedgerTransactionService.getAllGeneralLedgerTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get general ledger transactions' });
  }
}

export async function getGeneralLedgerTransactionById(req: Request, res: Response): Promise<void> {
  try {
    const transaction = await generalLedgerTransactionService.getGeneralLedgerTransactionById(req.params.id);
    if (!transaction) {
      res.status(404).json({ message: 'General ledger transaction not found' });
      return;
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get general ledger transaction' });
  }
}

export async function createGeneralLedgerTransaction(req: Request, res: Response): Promise<void> {
  try {
    const newTransaction = await generalLedgerTransactionService.createGeneralLedgerTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create general ledger transaction' });
  }
}

export async function updateGeneralLedgerTransaction(req: Request, res: Response): Promise<void> {
  try {
    const updatedTransaction = await generalLedgerTransactionService.updateGeneralLedgerTransaction(req.params.id, req.body);
    if (!updatedTransaction) {
      res.status(404).json({ message: 'General ledger transaction not found' });
      return;
    }
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update general ledger transaction' });
  }
}

export async function deleteGeneralLedgerTransaction(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await generalLedgerTransactionService.deleteGeneralLedgerTransaction(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'General ledger transaction not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete general ledger transaction' });
  }
}
