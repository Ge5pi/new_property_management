import { Request, Response } from 'express';
import { db } from '../../database/custom-prisma-client';


interface AuthenticatedRequest extends Request {
  user?: { id?: string };
}

export async function getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Fetch user's associated subscription
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { associatedSubscriptionId: true },
    });

    if (!user?.associatedSubscriptionId) {
      res.status(400).json({ message: 'User subscription not found' });
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

    // Count occupied units per property
    const properties = await db.property.findMany({
      where: { subscriptionId },
      include: {
        units: true,
      },
    });

    let completeOccupiedPropertiesCount = 0;
    let partialOccupiedPropertiesCount = 0;
    let vacantPropertiesCount = 0;

    for (const property of properties) {
      const totalUnits = property.units.length;
      const occupiedUnits = property.units.filter((unit: any) => unit.isOccupied).length;

      if (occupiedUnits === totalUnits && totalUnits > 0) {
        completeOccupiedPropertiesCount++;
      } else if (occupiedUnits > 0 && occupiedUnits < totalUnits) {
        partialOccupiedPropertiesCount++;
      } else if (occupiedUnits === 0) {
        vacantPropertiesCount++;
      }
    }

    const statsData = {
      total_units_count: totalUnitsCount,
      occupied_units_count: occupiedUnitsCount,
      vacant_units_count: vacantUnitsCount,
      occupancy_percentage: occupancyPercentage,
      vendors_count: vendorsCount,
      tenants_count: tenantsCount,
      owners_count: ownersCount,
      users_count: usersCount,
      properties_count: propertiesCount,
      complete_occupied_properties_count: completeOccupiedPropertiesCount,
      partial_occupied_properties_count: partialOccupiedPropertiesCount,
      vacant_properties_count: vacantPropertiesCount,
    };

    res.json(statsData);
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: 'Failed to get dashboard stats' });
  }
}

interface AuthenticatedRequest extends Request {
  user?: { id?: string };
}

export async function getGeneralStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Fetch user's associated subscription
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { associatedSubscriptionId: true },
    });

    if (!user?.associatedSubscriptionId) {
      res.status(400).json({ message: 'User subscription not found' });
      return;
    }

    const subscriptionId = user.associatedSubscriptionId;

    // Service Requests
    const completedServiceRequestsCount = await db.serviceRequest.count({
      where: {
        subscriptionId,
        workOrders: {
          some: { status: 'COMPLETED' },
        },
      },
      distinct: ['id'],
    });

    const pendingServiceRequestsCount = await db.serviceRequest.count({
      where: {
        subscriptionId,
        NOT: {
          workOrders: {
            some: { status: 'COMPLETED' },
          },
        },
      },
      distinct: ['id'],
    });

    // Work Orders
    const unassignedWorkOrdersCount = await db.workOrder.count({
      where: {
        subscriptionId,
        status: 'UNASSIGNED',
      },
    });

    const openWorkOrdersCount = await db.workOrder.count({
      where: {
        subscriptionId,
        status: 'OPEN',
      },
    });

    const assignedWorkOrdersCount = await db.workOrder.count({
      where: {
        subscriptionId,
        status: 'ASSIGNED',
      },
    });

    const completedWorkOrdersCount = await db.workOrder.count({
      where: {
        subscriptionId,
        status: 'COMPLETED',
      },
    });

    // Rental Applications
    const approvedRentalApplicationsCount = await db.rentalApplication.count({
      where: {
        subscriptionId,
        status: 'APPROVED',
      },
    });

    const pendingRentalApplicationsCount = await db.rentalApplication.count({
      where: {
        subscriptionId,
        status: 'PENDING',
      },
    });

    const rejectedRentalApplicationsCount = await db.rentalApplication.count({
      where: {
        subscriptionId,
        status: 'REJECTED',
      },
    });

    const onHoldRentalApplicationsCount = await db.rentalApplication.count({
      where: {
        subscriptionId,
        status: 'ON_HOLD_OR_WAITING',
      },
    });

    const draftRentalApplicationsCount = await db.rentalApplication.count({
      where: {
        subscriptionId,
        status: 'DRAFT',
      },
    });

    const generalStatsData = {
      completed_service_requests_count: completedServiceRequestsCount,
      pending_service_requests_count: pendingServiceRequestsCount,
      unassigned_work_orders_count: unassignedWorkOrdersCount,
      open_work_orders_count: openWorkOrdersCount,
      assigned_work_orders_count: assignedWorkOrdersCount,
      completed_work_orders_count: completedWorkOrdersCount,
      approved_rental_applications_count: approvedRentalApplicationsCount,
      pending_rental_applications_count: pendingRentalApplicationsCount,
      rejected_rental_applications_count: rejectedRentalApplicationsCount,
      on_hold_rental_applications_count: onHoldRentalApplicationsCount,
      draft_rental_applications_count: draftRentalApplicationsCount,
    };

    res.json(generalStatsData);
  } catch (error) {
    console.error('Error in getGeneralStats:', error);
    res.status(500).json({ message: 'Failed to get general stats' });
  }
}
