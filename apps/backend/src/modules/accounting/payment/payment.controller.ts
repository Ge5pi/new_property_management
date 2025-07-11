import { Request, Response } from 'express';
import * as paymentService from './payment.service';

export async function getAllPayments(req: Request, res: Response): Promise<void> {
  try {
    const payments = await paymentService.getAllPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get payments' });
  }
}

export async function getPaymentById(req: Request, res: Response): Promise<void> {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get payment' });
  }
}

export async function createPayment(req: Request, res: Response): Promise<void> {
  try {
    const newPayment = await paymentService.createPayment(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment' });
  }
}

export async function updatePayment(req: Request, res: Response): Promise<void> {
  try {
    const updatedPayment = await paymentService.updatePayment(req.params.id, req.body);
    if (!updatedPayment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment' });
  }
}

export async function deletePayment(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await paymentService.deletePayment(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete payment' });
  }
}
