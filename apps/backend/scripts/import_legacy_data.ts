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

function parseJsonString(jsonString: string): string[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [jsonString];
  } catch (error) {
    return [jsonString];
  }
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
        const id = entry.pk?.toString();
        if (!id) continue;

        switch (entry.model) {
          case 'authentication.user':
            const userData = {
              id,
              email: entry.fields.email,
              firstName: entry.fields.first_name,
              lastName: entry.fields.last_name,
              username: entry.fields.username,
              isActive: entry.fields.is_active,
              isStaff: entry.fields.is_staff,
              isSuperuser: entry.fields.is_superuser,
              passwordHash: entry.fields.password,
            };
            await db.user.upsert({
              where: { id },
              create: userData,
              update: userData,
            });
            break;
          case 'property.property':
            const propertyData = {
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
            };
            await db.property.upsert({
              where: { id },
              create: propertyData,
              update: propertyData,
            });
            break;
            case 'lease.leasetemplate':
              const leaseTemplateData = {
                id,
                name: entry.fields.name,
                description: entry.fields.description,
                rules_and_policies: parseJsonString(entry.fields.rules_and_policies),
                condition_of_premises: parseJsonString(entry.fields.condition_of_premises),
                right_of_inspection: entry.fields.right_of_inspection,
                conditions_of_moving_out: parseJsonString(entry.fields.conditions_of_moving_out),
                releasing_policies: parseJsonString(entry.fields.releasing_policies),
                final_statement: entry.fields.final_statement,
              };
              await db.leaseTemplate.upsert({
                where: { id },
                create: leaseTemplateData,
                update: leaseTemplateData,
              });
              break;
          case 'lease.lease':
            const leaseData = {
              id,
              rental_application_id: entry.fields.rental_application.toString(),
              lease_type: entry.fields.lease_type,
              start_date: new Date(entry.fields.start_date),
              end_date: new Date(entry.fields.end_date),
              lease_template_id: entry.fields.lease_template.toString(),
              rent_cycle: entry.fields.rent_cycle,
              amount: entry.fields.amount,
              gl_account: entry.fields.gl_account,
              description: entry.fields.description,
              due_date: new Date(entry.fields.due_date),
              status: entry.fields.status,
              closed_on: entry.fields.closed_on ? new Date(entry.fields.closed_on) : null,
              unit_id: entry.fields.unit.toString(),
              rules_and_policies: parseJsonString(entry.fields.rules_and_policies),
              condition_of_premises: parseJsonString(entry.fields.condition_of_premises),
              right_of_inspection: entry.fields.right_of_inspection,
              conditions_of_moving_out: parseJsonString(entry.fields.conditions_of_moving_out),
              releasing_policies: parseJsonString(entry.fields.releasing_policies),
              final_statement: entry.fields.final_statement,
            };
            await db.lease.upsert({
              where: { id },
              create: leaseData,
              update: leaseData,
            });
            break;
          case 'lease.rentalapplication':
            const rentalApplicationData = {
              id,
              applicant_id: entry.fields.applicant.toString(),
              status: entry.fields.status,
              desired_move_in_date: entry.fields.desired_move_in_date ? new Date(entry.fields.desired_move_in_date) : null,
              legal_first_name: entry.fields.legal_first_name,
              middle_name: entry.fields.middle_name,
              legal_last_name: entry.fields.legal_last_name,
              application_type: entry.fields.application_type,
              phone_number: parseJsonString(entry.fields.phone_number),
              emails: parseJsonString(entry.fields.emails),
              notes: entry.fields.notes,
              birthday: entry.fields.birthday ? new Date(entry.fields.birthday) : null,
              ssn_or_tin: entry.fields.ssn_or_tin,
              driving_license_number: entry.fields.driving_license_number,
              employer_name: entry.fields.employer_name,
              employer_address: entry.fields.employer_address,
              employer_address_2: entry.fields.employer_address_2,
              employer_phone_number: entry.fields.employer_phone_number,
              employment_city: entry.fields.employment_city,
              employment_zip_code: entry.fields.employment_zip_code,
              employment_country: entry.fields.employment_country,
              monthly_salary: entry.fields.monthly_salary,
              position_held: entry.fields.position_held,
              years_worked: entry.fields.years_worked,
              supervisor_name: entry.fields.supervisor_name,
              supervisor_phone_number: entry.fields.supervisor_phone_number,
              supervisor_email: entry.fields.supervisor_email,
              supervisor_title: entry.fields.supervisor_title,
              is_defendant_in_any_lawsuit: entry.fields.is_defendant_in_any_lawsuit,
              is_convicted: entry.fields.is_convicted,
              have_filed_case_against_landlord: entry.fields.have_filed_case_against_landlord,
              is_smoker: entry.fields.is_smoker,
              general_info: entry.fields.general_info,
              personal_details: entry.fields.personal_details,
              rental_history: entry.fields.rental_history,
              financial_info: entry.fields.financial_info,
              dependents_info: entry.fields.dependents_info,
              other_info: entry.fields.other_info,
              is_general_info_filled: entry.fields.is_general_info_filled,
              is_personal_details_filled: entry.fields.is_personal_details_filled,
              is_rental_history_filled: entry.fields.is_rental_history_filled,
              is_financial_info_filled: entry.fields.is_financial_info_filled,
              is_dependents_filled: entry.fields.is_dependents_filled,
              is_other_info_filled: entry.fields.is_other_info_filled,
            };
            await db.rentalApplication.upsert({
              where: { id },
              create: rentalApplicationData,
              update: rentalApplicationData,
            });
            break;
          case 'lease.rentalapplicationemergencycontact':
            const emergencyContactData = {
              id,
              name: entry.fields.name,
              phone_number: entry.fields.phone_number,
              relationship: entry.fields.relationship,
              address: entry.fields.address,
              rental_application_id: entry.fields.rental_application.toString(),
            };
            await db.rentalApplicationEmergencyContact.upsert({
              where: { id },
              create: emergencyContactData,
              update: emergencyContactData,
            });
            break;
          case 'lease.applicant':
            const applicantData = {
              id,
              first_name: entry.fields.first_name,
              last_name: entry.fields.last_name,
              email: entry.fields.email,
              allow_email_for_rental_application: entry.fields.allow_email_for_rental_application,
              phone_number: entry.fields.phone_number,
              unit_id: entry.fields.unit.toString(),
            };
            await db.applicant.upsert({
              where: { id },
              create: applicantData,
              update: applicantData,
            });
            break;
          case 'property.propertylatefeepolicy':
            const lateFeePolicyData = {
              id,
              start_date: entry.fields.start_date ? new Date(entry.fields.start_date) : null,
              end_date: entry.fields.end_date ? new Date(entry.fields.end_date) : null,
              late_fee_type: entry.fields.late_fee_type?.toUpperCase(),
              base_amount_fee: entry.fields.base_amount_fee,
              eligible_charges: entry.fields.eligible_charges?.toUpperCase(),
              charge_daily_late_fees: entry.fields.charge_daily_late_fees,
              daily_amount_per_month_max: entry.fields.daily_amount_per_month_max,
              grace_period_type: entry.fields.grace_period_type?.toUpperCase() === 'NUMBER_OF_DAYS' ? 'NUMBER_OF_DAY' : entry.fields.grace_period_type?.toUpperCase(),
              grace_period: entry.fields.grace_period,
              parent_property_id: entry.fields.parent_property.toString(),
            };
            await db.propertyLateFeePolicy.upsert({
              where: { id },
              create: lateFeePolicyData,
              update: lateFeePolicyData,
            });
            break;
            case 'property.propertyphoto':
              const propertyPhotoData = {
                image: entry.fields.image,
                is_cover: entry.fields.is_cover,
                parent_property_id: entry.fields.parent_property.toString(),
              };
              await db.propertyPhoto.upsert({
                where: { 
                  property_unique_cover_pic: {
                    parent_property_id: entry.fields.parent_property.toString(),
                    is_cover: entry.fields.is_cover,
                  }
                },
                create: { ...propertyPhotoData, id },
                update: propertyPhotoData,
              });
              break;
          case 'property.propertyowner':
            const propertyOwnerData = {
              id,
              percentage_owned: entry.fields.percentage_owned,
              parent_property_id: entry.fields.parent_property.toString(),
              payment_type: entry.fields.payment_type?.toUpperCase(),
              contract_expiry: new Date(entry.fields.contract_expiry),
              reserve_funds: entry.fields.reserve_funds,
              fiscal_year_end: entry.fields.fiscal_year_end,
              ownership_start_date: new Date(entry.fields.ownership_start_date),
              owner_id: entry.fields.owner.toString(),
            };
            await db.propertyOwner.upsert({
              where: { id },
              create: propertyOwnerData,
              update: propertyOwnerData,
            });
            break;
          case 'property.unit':
            const unitData = {
              id,
              name: entry.fields.name,
              unit_type_id: entry.fields.unit_type.toString(),
              market_rent: entry.fields.market_rent,
              future_market_rent: entry.fields.future_market_rent,
              effective_date: entry.fields.effective_date ? new Date(entry.fields.effective_date) : null,
              application_fee: entry.fields.application_fee,
              estimate_turn_over_cost: entry.fields.estimate_turn_over_cost,
              address: entry.fields.address,
              ready_for_show_on: entry.fields.ready_for_show_on ? new Date(entry.fields.ready_for_show_on) : null,
              virtual_showing_available: entry.fields.virtual_showing_available,
              utility_bills: entry.fields.utility_bills,
              utility_bills_date: entry.fields.utility_bills_date ? new Date(entry.fields.utility_bills_date) : null,
              lock_box: entry.fields.lock_box,
              description: entry.fields.description,
              non_revenues_status: entry.fields.non_revenues_status,
              balance: entry.fields.balance,
              total_charges: entry.fields.total_charges,
              total_credit: entry.fields.total_credit,
              due_amount: entry.fields.due_amount,
              total_payable: entry.fields.total_payable,
              parent_property_id: entry.fields.parent_property.toString(),
            };
            await db.unit.upsert({
              where: { id },
              create: unitData,
              update: unitData,
            });
            break;
          case 'property.unittype':
            const unitTypeData = {
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
              parent_property_id: entry.fields.parent_property.toString(),
            };
            await db.unitType.upsert({
              where: { id },
              create: unitTypeData,
              update: unitTypeData,
            });
            break;
          case 'property.propertyupcomingactivity':
            const upcomingActivityData = {
              id,
              parent_property_id: entry.fields.parent_property.toString(),
            };
            await db.propertyUpcomingActivity.upsert({
              where: { id },
              create: upcomingActivityData,
              update: upcomingActivityData,
            });
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