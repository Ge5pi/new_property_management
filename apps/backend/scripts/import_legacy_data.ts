import fs from 'fs';
import path from 'path';
import { db } from '../src/database/custom-prisma-client';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface FixtureEntry {
  model: string;
  pk?: number | string;
  fields: any;
}

async function main() {
  const fixturePath = path.resolve(__dirname, '../../../old_backend/fixtures/dev-environment-and-tests.json');
  const data = fs.readFileSync(fixturePath, 'utf-8');
  const fixtures: FixtureEntry[] = JSON.parse(data);

  const models = [
    'authentication.user',
    'property.property',
    'property.unittype',
    'property.unit',
    'lease.leasetemplate',
    'lease.applicant',
    'lease.rentalapplication',
    'lease.lease',
    'property.propertyupcomingactivity',
    'property.propertylatefeepolicy',
    'property.propertyphoto',
    'property.propertyowner',
    'lease.rentalapplicationemergencycontact',
    'lease.secondarytenant',
    'lease.rentalapplicationresidentialhistory',
    'lease.rentalapplicationfinancialinformation',
    'lease.rentalapplicationadditionalincome',
    'lease.rentalapplicationdependent',
    'lease.rentalapplicationpets',
    'lease.rentalapplicationattachment',
    'people.tenant',
    'people.tenantupcomingactivity',
    'people.tenantattachment',
    'people.vendortype',
    'people.vendor',
    'people.vendoraddress',
    'people.vendorattachment',
    'people.owner',
    'people.ownerupcomingactivity',
    'maintenance.servicerequest',
    'maintenance.workorder',
    'maintenance.inspection',
    'maintenance.area',
    'maintenance.areaitem',
    'maintenance.project',
    'maintenance.projectexpense',
    'maintenance.labor',
    'maintenance.purchaseorder',
    'maintenance.inventory',
    'maintenance.purchaseorderitem',
    'maintenance.fixedasset',
    'communication.contact',
    'communication.note',
    'communication.noteattachment',
    'communication.emailsignature',
    'communication.emailtemplate',
    'communication.email',
    'communication.emailattachment',
    'communication.announcement',
    'communication.announcementattachment',
    'system_preferences.propertytype',
    'system_preferences.inventoryitemtype',
    'system_preferences.tag',
    'system_preferences.label',
    'system_preferences.inventorylocation',
    'system_preferences.managementfee',
    'system_preferences.businessinformation',
    'system_preferences.contactcategory',
    'accounting.chargeattachment',
    'accounting.charge',
    'accounting.invoice',
  ];

  for (const model of models) {
    const entries = fixtures.filter((entry) => entry.model === model);
    for (const entry of entries) {
      try {
        let id = entry.pk?.toString();

        // For user model, if pk is missing, use email as id
        if (!id && entry.model === 'authentication.user') {
          id = entry.fields.email;
        }

        if (!id) continue;

        switch (entry.model) {
          case 'authentication.user':
            await db.user.upsert({
              where: { id },
              create: {
                id,
                email: entry.fields.email,
                firstName: entry.fields.first_name,
                lastName: entry.fields.last_name,
                username: entry.fields.username,
                isActive: entry.fields.is_active,
                isStaff: entry.fields.is_staff,
                isSuperuser: entry.fields.is_superuser,
                passwordHash: entry.fields.password,
                associatedSubscriptionId: entry.fields.associated_subscription?.toString() || null,
              },
              update: {
                email: entry.fields.email,
                firstName: entry.fields.first_name,
                lastName: entry.fields.last_name,
                username: entry.fields.username,
                isActive: entry.fields.is_active,
                isStaff: entry.fields.is_staff,
                isSuperuser: entry.fields.is_superuser,
                passwordHash: entry.fields.password,
                associatedSubscriptionId: entry.fields.associated_subscription?.toString() || null,
              },
            });
            console.log(`Upserted user with id ${id}`);
            break;

          case 'property.property':
            await db.property.upsert({
              where: { id },
              create: {
                id,
                name: entry.fields.name,
                address: entry.fields.address,
                property_type_id: entry.fields.property_type.toString(),
                is_cat_allowed: entry.fields.is_cat_allowed,
                is_dog_allowed: entry.fields.is_dog_allowed,
                is_smoking_allowed: entry.fields.is_smoking_allowed,
                additional_fees_gl_account: entry.fields.additional_fees_gl_account,
                additional_fees_percentage: entry.fields.additional_fees_percentage,
                addition_fees_suppress: entry.fields.addition_fees_suppress,
                lease_fees_amount: entry.fields.lease_fees_amount,
                lease_fees_percentage: entry.fields.lease_fees_percentage,
                lease_fees_commission_type: entry.fields.lease_fees_commission_type?.toUpperCase(),
                tax_authority: entry.fields.tax_authority,
                portfolio: entry.fields.portfolio,
                description: entry.fields.description,
                renters_tax_location_code: entry.fields.renters_tax_location_code,
                property_owner_license: entry.fields.property_owner_license,
                year_built: entry.fields.year_built,
                management_start_date: entry.fields.management_start_date ? new Date(entry.fields.management_start_date) : null,
                management_end_date: entry.fields.management_end_date ? new Date(entry.fields.management_end_date) : null,
                management_end_reason: entry.fields.management_end_reason,
                nsf_fee: entry.fields.nsf_fee,
                management_fees_amount: entry.fields.management_fees_amount,
                management_fees_percentage: entry.fields.management_fees_percentage,
                management_commission_type: entry.fields.management_commission_type?.toUpperCase(),
                notes: entry.fields.notes,
                maintenance_limit_amount: entry.fields.maintenance_limit_amount,
                insurance_expiration_date: entry.fields.insurance_expiration_date ? new Date(entry.fields.insurance_expiration_date) : null,
                has_home_warranty_coverage: entry.fields.has_home_warranty_coverage,
                home_warranty_company: entry.fields.home_warranty_company,
                home_warranty_expiration_date: entry.fields.home_warranty_expiration_date ? new Date(entry.fields.home_warranty_expiration_date) : null,
                maintenance_notes: entry.fields.maintenance_notes,
                default_lease_template_id: entry.fields.default_lease_template?.toString(),
                default_lease_agenda: entry.fields.default_lease_agenda,
                default_lease_renewal_template_id: entry.fields.default_lease_renewal_template?.toString(),
                default_lease_renewal_agenda: entry.fields.default_lease_renewal_agenda,
                default_lease_renewal_letter_template: entry.fields.default_lease_renewal_letter_template,
                default_renewal_terms: entry.fields.default_renewal_terms,
                default_renewal_charge_by: entry.fields.default_renewal_charge_by,
                default_renewal_additional_fee: entry.fields.default_renewal_additional_fee,
                rental_application_template_id: entry.fields.rental_application_template_id,
              },
              update: {
                name: entry.fields.name,
                address: entry.fields.address,
                property_type_id: entry.fields.property_type.toString(),
                is_cat_allowed: entry.fields.is_cat_allowed,
                is_dog_allowed: entry.fields.is_dog_allowed,
                is_smoking_allowed: entry.fields.is_smoking_allowed,
                additional_fees_gl_account: entry.fields.additional_fees_gl_account,
                additional_fees_percentage: entry.fields.additional_fees_percentage,
                addition_fees_suppress: entry.fields.addition_fees_suppress,
                lease_fees_amount: entry.fields.lease_fees_amount,
                lease_fees_percentage: entry.fields.lease_fees_percentage,
                lease_fees_commission_type: entry.fields.lease_fees_commission_type?.toUpperCase(),
                tax_authority: entry.fields.tax_authority,
                portfolio: entry.fields.portfolio,
                description: entry.fields.description,
                renters_tax_location_code: entry.fields.renters_tax_location_code,
                property_owner_license: entry.fields.property_owner_license,
                year_built: entry.fields.year_built,
                management_start_date: entry.fields.management_start_date ? new Date(entry.fields.management_start_date) : null,
                management_end_date: entry.fields.management_end_date ? new Date(entry.fields.management_end_date) : null,
                management_end_reason: entry.fields.management_end_reason,
                nsf_fee: entry.fields.nsf_fee,
                management_fees_amount: entry.fields.management_fees_amount,
                management_fees_percentage: entry.fields.management_fees_percentage,
                management_commission_type: entry.fields.management_commission_type?.toUpperCase(),
                notes: entry.fields.notes,
                maintenance_limit_amount: entry.fields.maintenance_limit_amount,
                insurance_expiration_date: entry.fields.insurance_expiration_date ? new Date(entry.fields.insurance_expiration_date) : null,
                has_home_warranty_coverage: entry.fields.has_home_warranty_coverage,
                home_warranty_company: entry.fields.home_warranty_company,
                home_warranty_expiration_date: entry.fields.home_warranty_expiration_date ? new Date(entry.fields.home_warranty_expiration_date) : null,
                maintenance_notes: entry.fields.maintenance_notes,
                default_lease_template_id: entry.fields.default_lease_template?.toString(),
                default_lease_agenda: entry.fields.default_lease_agenda,
                default_lease_renewal_template_id: entry.fields.default_lease_renewal_template?.toString(),
                default_lease_renewal_agenda: entry.fields.default_lease_renewal_agenda,
                default_lease_renewal_letter_template: entry.fields.default_lease_renewal_letter_template,
                default_renewal_terms: entry.fields.default_renewal_terms,
                default_renewal_charge_by: entry.fields.default_renewal_charge_by,
                default_renewal_additional_fee: entry.fields.default_renewal_additional_fee,
                rental_application_template_id: entry.fields.rental_application_template_id,
              },
            });
            console.log(`Upserted property with id ${id}`);
            break;

          case 'people.owner':
            await db.owner.upsert({
              where: { id },
              create: {
                id,
                first_name: entry.fields.first_name,
                last_name: entry.fields.last_name,
                company_name: entry.fields.company_name,
                personal_contact_numbers: entry.fields.personal_contact_numbers ? JSON.parse(entry.fields.personal_contact_numbers) : [],
                company_contact_numbers: entry.fields.company_contact_numbers ? JSON.parse(entry.fields.company_contact_numbers) : [],
                personal_emails: entry.fields.personal_emails ? JSON.parse(entry.fields.personal_emails) : [],
                company_emails: entry.fields.company_emails ? JSON.parse(entry.fields.company_emails) : [],
                street_address: entry.fields.street_address,
                city: entry.fields.city,
                state: entry.fields.state,
                zip: entry.fields.zip,
                country: entry.fields.country,
                tax_payer: entry.fields.tax_payer,
                tax_payer_id: entry.fields.tax_payer_id,
                bank_account_title: entry.fields.bank_account_title,
                bank_name: entry.fields.bank_name,
                bank_branch: entry.fields.bank_branch,
                bank_routing_number: entry.fields.bank_routing_number,
                bank_account_number: entry.fields.bank_account_number,
                notes: entry.fields.notes,
                is_company_name_as_tax_payer: entry.fields.is_company_name_as_tax_payer,
                is_use_as_display_name: entry.fields.is_use_as_display_name,
              },
              update: {
                first_name: entry.fields.first_name,
                last_name: entry.fields.last_name,
                company_name: entry.fields.company_name,
                personal_contact_numbers: entry.fields.personal_contact_numbers ? JSON.parse(entry.fields.personal_contact_numbers) : [],
                company_contact_numbers: entry.fields.company_contact_numbers ? JSON.parse(entry.fields.company_contact_numbers) : [],
                personal_emails: entry.fields.personal_emails ? JSON.parse(entry.fields.personal_emails) : [],
                company_emails: entry.fields.company_emails ? JSON.parse(entry.fields.company_emails) : [],
                street_address: entry.fields.street_address,
                city: entry.fields.city,
                state: entry.fields.state,
                zip: entry.fields.zip,
                country: entry.fields.country,
                tax_payer: entry.fields.tax_payer,
                tax_payer_id: entry.fields.tax_payer_id,
                bank_account_title: entry.fields.bank_account_title,
                bank_name: entry.fields.bank_name,
                bank_branch: entry.fields.bank_branch,
                bank_routing_number: entry.fields.bank_routing_number,
                bank_account_number: entry.fields.bank_account_number,
                notes: entry.fields.notes,
                is_company_name_as_tax_payer: entry.fields.is_company_name_as_tax_payer,
                is_use_as_display_name: entry.fields.is_use_as_display_name,
              },
            });
            console.log(`Upserted owner with id ${id}`);
            break;
          case 'property.unittype':
            await db.unitType.upsert({
              where: { id },
              create: {
                id,
                name: entry.fields.name,
                bed_rooms: entry.fields.bed_rooms,
                bath_rooms: entry.fields.bath_rooms,
                square_feet: entry.fields.square_feet,
                market_rent: entry.fields.market_rent,
                future_market_rent: entry.fields.future_market_rent,
                effective_date: entry.fields.effective_date ? new Date(entry.fields.effective_date) : null,
                application_fee: entry.fields.application_fee,
                estimate_turn_over_cost: entry.fields.estimate_turn_over_cost,
                is_cat_allowed: entry.fields.is_cat_allowed,
                is_dog_allowed: entry.fields.is_dog_allowed,
                is_smoking_allowed: entry.fields.is_smoking_allowed,
                marketing_title: entry.fields.marketing_title,
                marketing_description: entry.fields.marketing_description,
                marketing_youtube_url: entry.fields.marketing_youtube_url,
                parent_property_id: entry.fields.parent_property?.toString(),
              },
              update: {
                name: entry.fields.name,
                bed_rooms: entry.fields.bed_rooms,
                bath_rooms: entry.fields.bath_rooms,
                square_feet: entry.fields.square_feet,
                market_rent: entry.fields.market_rent,
                future_market_rent: entry.fields.future_market_rent,
                effective_date: entry.fields.effective_date ? new Date(entry.fields.effective_date) : null,
                application_fee: entry.fields.application_fee,
                estimate_turn_over_cost: entry.fields.estimate_turn_over_cost,
                is_cat_allowed: entry.fields.is_cat_allowed,
                is_dog_allowed: entry.fields.is_dog_allowed,
                is_smoking_allowed: entry.fields.is_smoking_allowed,
                marketing_title: entry.fields.marketing_title,
                marketing_description: entry.fields.marketing_description,
                marketing_youtube_url: entry.fields.marketing_youtube_url,
                parent_property_id: entry.fields.parent_property?.toString(),
              },
            });
            console.log(`Upserted unit type with id ${id}`);
            break;
          case 'property.propertyupcomingactivity':
            await db.propertyUpcomingActivity.upsert({
              where: { id },
              create: {
                id,
                parent_property_id: entry.fields.parent_property?.toString(),
                createdAt: entry.fields.createdAt ? new Date(entry.fields.createdAt) : undefined,
                updatedAt: entry.fields.updatedAt ? new Date(entry.fields.updatedAt) : undefined,
              },
              update: {
                parent_property_id: entry.fields.parent_property?.toString(),
                createdAt: entry.fields.createdAt ? new Date(entry.fields.createdAt) : undefined,
                updatedAt: entry.fields.updatedAt ? new Date(entry.fields.updatedAt) : undefined,
              },
            });
            console.log(`Upserted property upcoming activity with id ${id}`);
            break;
          case 'property.propertylatefeepolicy':
            await db.propertyLateFeePolicy.upsert({
              where: { id },
              create: {
                id,
                start_date: entry.fields.start_date ? new Date(entry.fields.start_date) : undefined,
                end_date: entry.fields.end_date ? new Date(entry.fields.end_date) : undefined,
                late_fee_type: entry.fields.late_fee_type ? entry.fields.late_fee_type.toUpperCase() : null,
                base_amount_fee: parseFloat(entry.fields.base_amount_fee),
                eligible_charges: entry.fields.eligible_charges ? entry.fields.eligible_charges.toUpperCase() : null,
                charge_daily_late_fees: entry.fields.charge_daily_late_fees,
                daily_amount_per_month_max: parseFloat(entry.fields.daily_amount_per_month_max),
                grace_period_type: entry.fields.grace_period_type ? entry.fields.grace_period_type.toUpperCase().replace(/_/g, '') : null,
                grace_period: entry.fields.grace_period,
                parent_property_id: entry.fields.parent_property?.toString(),
                createdAt: entry.fields.createdAt ? new Date(entry.fields.createdAt) : undefined,
                updatedAt: entry.fields.updatedAt ? new Date(entry.fields.updatedAt) : undefined,
              },
              update: {
                start_date: entry.fields.start_date ? new Date(entry.fields.start_date) : undefined,
                end_date: entry.fields.end_date ? new Date(entry.fields.end_date) : undefined,
                late_fee_type: entry.fields.late_fee_type ? entry.fields.late_fee_type.toUpperCase() : null,
                base_amount_fee: parseFloat(entry.fields.base_amount_fee),
                eligible_charges: entry.fields.eligible_charges ? entry.fields.eligible_charges.toUpperCase() : null,
                charge_daily_late_fees: entry.fields.charge_daily_late_fees,
                daily_amount_per_month_max: parseFloat(entry.fields.daily_amount_per_month_max),
                grace_period_type: entry.fields.grace_period_type ? entry.fields.grace_period_type.toUpperCase().replace(/_/g, '') : null,
                grace_period: entry.fields.grace_period,
                parent_property_id: entry.fields.parent_property?.toString(),
                createdAt: entry.fields.createdAt ? new Date(entry.fields.createdAt) : undefined,
                updatedAt: entry.fields.updatedAt ? new Date(entry.fields.updatedAt) : undefined,
              },
            });
            console.log(`Upserted property late fee policy with id ${id}`);
            break;

          default:
            console.log(`Skipping model ${entry.model}`);
        }
      } catch (error) {
        console.error(`Error importing ${entry.model} with pk ${entry.pk}:`, error);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
