// apps/backend/src/modules/dashboard/dashboard.controller.ts

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

    // --- Units Section (Corrected Multi-step Query) ---

    // 1. Get the IDs of all owners for the current subscription
    const ownersInSubscription = await db.owner.findMany({
      select: { id: true },
    });
    const ownerIds = ownersInSubscription.map((o:any) => o.id);

    // 2. Get the IDs of all properties linked to those owners
    const propertiesForOwners = await db.property.findMany({
        where: {
            owners: { // Look at the PropertyOwner join table
                some: {
                    owner_id: { in: ownerIds } // Find records where the owner_id is in our list
                }
            }
        },
        select: { id: true }
    });
    const propertyIds = propertiesForOwners.map((p:any) => p.id);


    // 3. Use the final list of property IDs to count the units
    const totalUnitsCount = await db.unit.count({
      where: { parent_property_id: { in: propertyIds } },
    });
    const occupiedUnitsCount = await db.unit.count({
      where: {
        // isOccupied field does not exist, so remove this filter or replace with correct field if any
        parent_property_id: { in: propertyIds },
      },
    });
    const vacantUnitsCount = await db.unit.count({
      where: {
        // isOccupied field does not exist, so remove this filter or replace with correct field if any
        parent_property_id: { in: propertyIds },
      },
    });
    const occupancyPercentage = totalUnitsCount ? (occupiedUnitsCount / totalUnitsCount) * 100 : 0;

    // --- End of Corrected Section ---

    // People Section
    const vendorsCount = await db.vendor.count({
      // subscriptionId field does not exist on vendor, remove filter or adjust accordingly
    });
    const tenantsCount = await db.tenant.count({
      // subscriptionId field does not exist on tenant, remove filter or adjust accordingly
    });
    const ownersCount = ownerIds.length; // We already have this count
    const usersCount = await db.user.count({
      where: { associatedSubscriptionId: subscriptionId },
    });

    // Property Section
    const propertiesCount = propertyIds.length; // We also have this count

    // Placeholders
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