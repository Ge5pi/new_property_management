import { Request, Response } from 'express';
import { db } from '../../database/custom-prisma-client';

interface AuthenticatedRequest extends Request {
  user?: {
    associatedSubscriptionId?: string;
  };
}

export async function getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user || !user.associatedSubscriptionId) {
      res.status(403).json({ detail: 'Access denied.' });
      return;
    }

    const subscriptionId = user.associatedSubscriptionId;

    // Units Section
    const totalUnitsCount = await db.unit.count({
      where: { subscriptionId },
    });
    const occupiedUnitsCount = await db.unit.count({
      where: { subscriptionId, isOccupied: true },
    });
    const vacantUnitsCount = await db.unit.count({
      where: { subscriptionId, isOccupied: false },
    });
    const occupancyPercentage = totalUnitsCount ? (occupiedUnitsCount / totalUnitsCount) * 100 : 0;

    // People Section
    const vendorsCount = await db.vendor.count({
      where: { subscriptionId },
    });
    const tenantsCount = await db.tenant.count({
      where: { subscriptionId },
    });
    const ownersCount = await db.owner.count({
      where: { subscriptionId },
    });
    const usersCount = await db.user.count({
      where: { associatedSubscriptionId: subscriptionId },
    });

    // Property Section
    const propertiesCount = await db.property.count({
      where: { subscriptionId },
    });

    // For occupied properties counts, we need to count properties with units leased actively
    // This requires more complex queries; for now, placeholders with 0
    const completeOccupiedPropertiesCount = 0;
    const partialOccupiedPropertiesCount = 0;
    const vacantPropertiesCount = 0;

    const statsData = {
      totalUnitsCount,
      occupiedUnitsCount,
      vacantUnitsCount,
      occupancyPercentage,
      vendorsCount,
      tenantsCount,
      ownersCount,
      usersCount,
      propertiesCount,
      completeOccupiedPropertiesCount,
      partialOccupiedPropertiesCount,
      vacantPropertiesCount,
    };

    res.json(statsData);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ detail: 'Internal server error.' });
  }
}
