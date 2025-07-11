import { Request, Response } from 'express';
import * as accountService from './account.service'; 

export async function getAllAccounts(req: Request, res: Response): Promise<void> {
  try {
    const accounts = await accountService.getAllAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get accounts' });
  }
}

export async function getAccountById(req: Request, res: Response): Promise<void> {
  try {
    const account = await accountService.getAccountById(req.params.id);
    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get account' });
  }
}

export async function createAccount(req: Request, res: Response): Promise<void> {
  try {
    const newAccount = await accountService.createAccount(req.body);
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create account' });
  }
}

export async function updateAccount(req: Request, res: Response): Promise<void> {
  try {
    const updatedAccount = await accountService.updateAccount(req.params.id, req.body);
    if (!updatedAccount) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update account' });
  }
}

export async function deleteAccount(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await accountService.deleteAccount(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account' });
  }
}
