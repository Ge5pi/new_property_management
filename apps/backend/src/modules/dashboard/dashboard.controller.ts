import { Request, Response } from 'express';
import { db } from '../../database/custom-prisma-client';

// Интерфейс для аутентифицированных запросов
interface AuthenticatedRequest extends Request {
  user?: {
    associatedSubscriptionId?: string;
  };
}

/**
 * Получает всю статистику для панели управления одним запросом.
 */
export async function getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const subscriptionId = req.user?.associatedSubscriptionId;
    if (!subscriptionId) {
      res.status(403).json({ detail: 'Доступ запрещен. Подписка не найдена.' });
      return;
    }

    // --- ПОЛУЧЕНИЕ СВЯЗАННЫХ ID ---

    const propertiesInSubscription = await db.property.findMany({
      where: { associatedSubscriptionId: subscriptionId },
      select: { id: true },
    });
    const propertyIds = propertiesInSubscription.map((p: any) => p.id);

    if (propertyIds.length === 0) {
      // Если у подписки нет объектов, возвращаем пустую статистику
      res.status(200).json({
          units: { total: 0, occupied: 0, vacant: 0, occupancy_percentage: "0.00" },
          people: { owners: 0, tenants: 0, vendors: 0, users: 0 },
          properties: { total: 0, complete_occupied: 0, partial_occupied: 0, vacant: 0 },
          service_requests: { completed: 0, pending: 0 },
          work_orders: { unassigned: 0, open: 0, assigned: 0, completed: 0 },
          rental_applications: { approved: 0, pending: 0, rejected: 0, on_hold: 0, draft: 0 },
      });
    }

    const ownersInProperties = await db.propertyOwner.findMany({
      where: { parent_property_id: { in: propertyIds } },
      select: { owner_id: true },
      distinct: ['owner_id'],
    });
    const ownerIds = ownersInProperties.map((po: any) => po.owner_id);

    const unitsInProperties = await db.unit.findMany({
        where: { parent_property_id: { in: propertyIds } },
        select: { id: true }
    });
    const unitIds = unitsInProperties.map((u: any) => u.id);

    const applicantsInUnits = await db.applicant.findMany({
        where: { unit_id: { in: unitIds } },
        select: { id: true }
    });
    const applicantIds = applicantsInUnits.map((a: any) => a.id);

    // --- ПАРАЛЛЕЛЬНОЕ ВЫПОЛНЕНИЕ ВСЕХ ЗАПРОСОВ ---

    const [
      totalUnitsCount,
      occupiedUnitsCount,
      vacantUnitsCount,
      vendorsCount,
      tenantsCount,
      usersCount,
      approvedRentalApplicationsCount,
      pendingRentalApplicationsCount,
      rejectedRentalApplicationsCount,
      onHoldRentalApplicationsCount,
      draftRentalApplicationsCount,
    ] = await Promise.all([
      // Статистика по юнитам
      db.unit.count({ where: { id: { in: unitIds } } }), // Общее кол-во
      // Занятые юниты (есть хотя бы 1 активный договор)
      db.unit.count({ where: { id: { in: unitIds }, leases: { some: { status: 'ACTIVE' } } } }),
      // Свободные юниты (нет ни одного активного договора)
      db.unit.count({ where: { id: { in: unitIds }, leases: { none: { status: 'ACTIVE' } } } }),

      // Статистика по людям
      db.vendor.count({ where: { associatedSubscriptionId: subscriptionId } }),
      db.tenant.count({ where: { associatedSubscriptionId: subscriptionId } }),
      db.user.count({ where: { associatedSubscriptionId: subscriptionId } }),
      
      // Статистика по заявлениям на аренду
      db.rentalApplication.count({ where: { applicant_id: { in: applicantIds }, status: 'APPROVED' } }),
      db.rentalApplication.count({ where: { applicant_id: { in: applicantIds }, status: 'PENDING' } }),
      db.rentalApplication.count({ where: { applicant_id: { in: applicantIds }, status: 'REJECTED' } }),
      db.rentalApplication.count({ where: { applicant_id: { in: applicantIds }, status: 'ON_HOLD_OR_WAITING' } }),
      db.rentalApplication.count({ where: { applicant_id: { in: applicantIds }, status: 'DRAFT' } }),
    ]);

    // --- ФОРМИРОВАНИЕ ОТВЕТА ---

    const occupancyPercentage = totalUnitsCount > 0 ? (occupiedUnitsCount / totalUnitsCount) * 100 : 0;

    const statsData = {
      units: {
        total: totalUnitsCount,
        occupied: occupiedUnitsCount,
        vacant: vacantUnitsCount,
        occupancy_percentage: occupancyPercentage.toFixed(2),
      },
      people: {
        owners: ownerIds.length,
        tenants: tenantsCount,
        vendors: vendorsCount,
        users: usersCount,
      },
      properties: {
        total: propertyIds.length,
        complete_occupied: 0, partial_occupied: 0, vacant: 0, // Заглушки
      },
       // Вы можете добавить сюда подсчет service_requests и work_orders, если нужно
      rental_applications: {
        approved: approvedRentalApplicationsCount,
        pending: pendingRentalApplicationsCount,
        rejected: rejectedRentalApplicationsCount,
        on_hold: onHoldRentalApplicationsCount,
        draft: draftRentalApplicationsCount,
      },
    };

    res.status(200).json(statsData);

  } catch (error) {
    console.error('Ошибка при получении статистики для панели управления:', error);
    res.status(500).json({ detail: 'Внутренняя ошибка сервера.' });
  }
}