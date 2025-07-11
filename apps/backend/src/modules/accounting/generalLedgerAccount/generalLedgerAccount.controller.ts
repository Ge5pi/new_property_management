import { Request, Response } from 'express';
import * as generalLedgerAccountService from './generalLedgerAccount.service';

export async function getAllGeneralLedgerAccounts(req: Request, res: Response): Promise<void> {
  try {
    const accounts = await generalLedgerAccountService.getAllGeneralLedgerAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get general ledger accounts' });
  }
}

export async function getGeneralLedgerAccountById(req: Request, res: Response): Promise<void> {
  try {
    const account = await generalLedgerAccountService.getGeneralLedgerAccountById(req.params.id);
    if (!account) {
      res.status(404).json({ message: 'General ledger account not found' });
      return;
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get general ledger account' });
  }
}

export async function createGeneralLedgerAccount(req: Request, res: Response): Promise<void> {
  try {
    const newAccount = await generalLedgerAccountService.createGeneralLedgerAccount(req.body);
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create general ledger account' });
  }
}

export async function updateGeneralLedgerAccount(req: Request, res: Response): Promise<void> {
  try {
    const updatedAccount = await generalLedgerAccountService.updateGeneralLedgerAccount(req.params.id, req.body);
    if (!updatedAccount) {
      res.status(404).json({ message: 'General ledger account not found' });
      return;
    }
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update general ledger account' });
  }
}

export async function deleteGeneralLedgerAccount(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await generalLedgerAccountService.deleteGeneralLedgerAccount(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'General ledger account not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete general ledger account' });
  }
}
