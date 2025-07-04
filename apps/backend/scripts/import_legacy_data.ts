import fs from 'fs';
import path from 'path';
import { db } from '../src/database/custom-prisma-client';

interface FixtureEntry {
  model: string;
  pk?: number | string;
  fields: any;
}

async function main() {
  const fixturePath = path.resolve(__dirname, '../../old_backend/fixtures/dev-environment-and-tests.json');
  const data = fs.readFileSync(fixturePath, 'utf-8');
  const fixtures: FixtureEntry[] = JSON.parse(data);

  for (const entry of fixtures) {
    try {
      switch (entry.model) {
        case 'authentication.user':
          await db.user.create({
            data: {
              id: entry.pk?.toString(),
              email: entry.fields.email,
              firstName: entry.fields.first_name,
              lastName: entry.fields.last_name,
              username: entry.fields.username,
              isActive: entry.fields.is_active,
              isStaff: entry.fields.is_staff,
              isSuperuser: entry.fields.is_superuser,
              passwordHash: entry.fields.password,
              // Map other fields as needed
            },
          });
          break;
        case 'property.property':
          await db.property.create({
            data: {
              id: entry.pk?.toString(),
              name: entry.fields.name,
              address: entry.fields.address,
              property_type_id: entry.fields.property_type,
              isCatAllowed: entry.fields.is_cat_allowed,
              isDogAllowed: entry.fields.is_dog_allowed,
              isSmokingAllowed: entry.fields.is_smoking_allowed,
              additionalFeesGlAccount: entry.fields.additional_fees_gl_account,
              additionalFeesPercentage: entry.fields.additional_fees_percentage,
              additionFeesSuppress: entry.fields.addition_fees_suppress,
              leaseFeesAmount: entry.fields.lease_fees_amount,
              leaseFeesPercentage: entry.fields.lease_fees_percentage,
              leaseFeesCommissionType: entry.fields.lease_fees_commission_type,
              taxAuthority: entry.fields.tax_authority,
              portfolio: entry.fields.portfolio,
              description: entry.fields.description,
              rentersTaxLocationCode: entry.fields.renters_tax_location_code,
              propertyOwnerLicense: entry.fields.property_owner_license,
              yearBuilt: entry.fields.year_built,
              managementStartDate: entry.fields.management_start_date,
              managementEndDate: entry.fields.management_end_date,
              managementEndReason: entry.fields.management_end_reason,
              nsfFee: entry.fields.nsf_fee,
              managementFeesAmount: entry.fields.management_fees_amount,
              managementFeesPercentage: entry.fields.management_fees_percentage,
              managementCommissionType: entry.fields.management_commission_type,
              notes: entry.fields.notes,
              maintenanceLimitAmount: entry.fields.maintenance_limit_amount,
              insuranceExpirationDate: entry.fields.insurance_expiration_date,
              hasHomeWarrantyCoverage: entry.fields.has_home_warranty_coverage,
              homeWarrantyCompany: entry.fields.home_warranty_company,
              homeWarrantyExpirationDate: entry.fields.home_warranty_expiration_date,
              maintenanceNotes: entry.fields.maintenance_notes,
              defaultLeaseTemplateId: entry.fields.default_lease_template,
              defaultLeaseAgenda: entry.fields.default_lease_agenda,
              defaultLeaseRenewalTemplateId: entry.fields.default_lease_renewal_template,
              defaultLeaseRenewalAgenda: entry.fields.default_lease_renewal_agenda,
              defaultLeaseRenewalLetterTemplate: entry.fields.default_lease_renewal_letter_template,
              defaultRenewalTerms: entry.fields.default_renewal_terms,
              defaultRenewalChargeBy: entry.fields.default_renewal_charge_by,
              defaultRenewalAdditionalFee: entry.fields.default_renewal_additional_fee,
              rentalApplicationTemplateId: entry.fields.rental_application_template_id,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        case 'lease.lease':
          await db.lease.create({
            data: {
              id: entry.pk?.toString(),
              rentalApplicationId: entry.fields.rental_application,
              leaseType: entry.fields.lease_type,
              startDate: entry.fields.start_date,
              endDate: entry.fields.end_date,
              leaseTemplateId: entry.fields.lease_template,
              rentCycle: entry.fields.rent_cycle,
              amount: entry.fields.amount,
              glAccount: entry.fields.gl_account,
              description: entry.fields.description,
              dueDate: entry.fields.due_date,
              status: entry.fields.status,
              closedOn: entry.fields.closed_on,
              unitId: entry.fields.unit,
              rulesAndPolicies: entry.fields.rules_and_policies,
              conditionOfPremises: entry.fields.condition_of_premises,
              rightOfInspection: entry.fields.right_of_inspection,
              conditionsOfMovingOut: entry.fields.conditions_of_moving_out,
              releasingPolicies: entry.fields.releasing_policies,
              finalStatement: entry.fields.final_statement,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        case 'lease.rentalapplication':
          await db.rentalApplication.create({
            data: {
              id: entry.pk?.toString(),
              applicantId: entry.fields.applicant,
              status: entry.fields.status,
              desiredMoveInDate: entry.fields.desired_move_in_date,
              legalFirstName: entry.fields.legal_first_name,
              middleName: entry.fields.middle_name,
              legalLastName: entry.fields.legal_last_name,
              applicationType: entry.fields.application_type,
              phoneNumber: entry.fields.phone_number,
              emails: entry.fields.emails,
              notes: entry.fields.notes,
              birthday: entry.fields.birthday,
              ssnOrTin: entry.fields.ssn_or_tin,
              drivingLicenseNumber: entry.fields.driving_license_number,
              employerName: entry.fields.employer_name,
              employerAddress: entry.fields.employer_address,
              employerAddress2: entry.fields.employer_address_2,
              employerPhoneNumber: entry.fields.employer_phone_number,
              employmentCity: entry.fields.employment_city,
              employmentZipCode: entry.fields.employment_zip_code,
              employmentCountry: entry.fields.employment_country,
              monthlySalary: entry.fields.monthly_salary,
              positionHeld: entry.fields.position_held,
              yearsWorked: entry.fields.years_worked,
              supervisorName: entry.fields.supervisor_name,
              supervisorPhoneNumber: entry.fields.supervisor_phone_number,
              supervisorEmail: entry.fields.supervisor_email,
              supervisorTitle: entry.fields.supervisor_title,
              isDefendantInAnyLawsuit: entry.fields.is_defendant_in_any_lawsuit,
              isConvicted: entry.fields.is_convicted,
              haveFiledCaseAgainstLandlord: entry.fields.have_filed_case_against_landlord,
              isSmoker: entry.fields.is_smoker,
              generalInfo: entry.fields.general_info,
              personalDetails: entry.fields.personal_details,
              rentalHistory: entry.fields.rental_history,
              financialInfo: entry.fields.financial_info,
              dependentsInfo: entry.fields.dependents_info,
              otherInfo: entry.fields.other_info,
              isGeneralInfoFilled: entry.fields.is_general_info_filled,
              isPersonalDetailsFilled: entry.fields.is_personal_details_filled,
              isRentalHistoryFilled: entry.fields.is_rental_history_filled,
              isFinancialInfoFilled: entry.fields.is_financial_info_filled,
              isDependentsFilled: entry.fields.is_dependents_filled,
              isOtherInfoFilled: entry.fields.is_other_info_filled,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        case 'lease.rentalapplicationemergencycontact':
          await db.rentalApplicationEmergencyContact.create({
            data: {
              id: entry.pk?.toString(),
              name: entry.fields.name,
              phoneNumber: entry.fields.phone_number,
              relationship: entry.fields.relationship,
              address: entry.fields.address,
              rentalApplicationId: entry.fields.rental_application,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        case 'lease.applicant':
          await db.applicant.create({
            data: {
              id: entry.pk?.toString(),
              firstName: entry.fields.first_name,
              lastName: entry.fields.last_name,
              email: entry.fields.email,
              allowEmailForRentalApplication: entry.fields.allow_email_for_rental_application,
              phoneNumber: entry.fields.phone_number,
              unitId: entry.fields.unit,
              rentalApplicationId: entry.fields.rental_application,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        case 'property.propertylatefeepolicy':
          await db.propertyLateFeePolicy.create({
            data: {
              id: entry.pk?.toString(),
              startDate: entry.fields.start_date,
              endDate: entry.fields.end_date,
              lateFeeType: entry.fields.late_fee_type,
              baseAmountFee: entry.fields.base_amount_fee,
              eligibleCharges: entry.fields.eligible_charges,
              chargeDailyLateFees: entry.fields.charge_daily_late_fees,
              dailyAmountPerMonthMax: entry.fields.daily_amount_per_month_max,
              gracePeriodType: entry.fields.grace_period_type,
              gracePeriod: entry.fields.grace_period,
              parentPropertyId: entry.fields.parent_property,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        case 'property.propertyphoto':
          await db.propertyPhoto.create({
            data: {
              id: entry.pk?.toString(),
              image: entry.fields.image,
              isCover: entry.fields.is_cover,
              parentPropertyId: entry.fields.parent_property,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        case 'property.propertyowner':
          await db.propertyOwner.create({
            data: {
              id: entry.pk?.toString(),
              percentageOwned: entry.fields.percentage_owned,
              parentPropertyId: entry.fields.parent_property,
              paymentType: entry.fields.payment_type,
              contractExpiry: entry.fields.contract_expiry,
              reserveFunds: entry.fields.reserve_funds,
              fiscalYearEnd: entry.fields.fiscal_year_end,
              ownershipStartDate: entry.fields.ownership_start_date,
              ownerId: entry.fields.owner,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        case 'property.unit':
          await db.unit.create({
            data: {
              id: entry.pk?.toString(),
              name: entry.fields.name,
              unitTypeId: entry.fields.unit_type,
              marketRent: entry.fields.market_rent,
              futureMarketRent: entry.fields.future_market_rent,
              effectiveDate: entry.fields.effective_date,
              applicationFee: entry.fields.application_fee,
              estimateTurnOverCost: entry.fields.estimate_turn_over_cost,
              address: entry.fields.address,
              readyForShowOn: entry.fields.ready_for_show_on,
              virtualShowingAvailable: entry.fields.virtual_showing_available,
              utilityBills: entry.fields.utility_bills,
              utilityBillsDate: entry.fields.utility_bills_date,
              lockBox: entry.fields.lock_box,
              description: entry.fields.description,
              nonRevenuesStatus: entry.fields.non_revenues_status,
              balance: entry.fields.balance,
              totalCharges: entry.fields.total_charges,
              totalCredit: entry.fields.total_credit,
              dueAmount: entry.fields.due_amount,
              totalPayable: entry.fields.total_payable,
              parentPropertyId: entry.fields.parent_property,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        case 'property.unittype':
          await db.unitType.create({
            data: {
              id: entry.pk?.toString(),
              name: entry.fields.name,
              bedRooms: entry.fields.bed_rooms,
              bathRooms: entry.fields.bath_rooms,
              squareFeet: entry.fields.square_feet,
              marketRent: entry.fields.market_rent,
              futureMarketRent: entry.fields.future_market_rent,
              effectiveDate: entry.fields.effective_date,
              applicationFee: entry.fields.application_fee,
              estimateTurnOverCost: entry.fields.estimate_turn_over_cost,
              isCatAllowed: entry.fields.is_cat_allowed,
              isDogAllowed: entry.fields.is_dog_allowed,
              isSmokingAllowed: entry.fields.is_smoking_allowed,
              marketingTitle: entry.fields.marketing_title,
              marketingDescription: entry.fields.marketing_description,
              marketingYoutubeUrl: entry.fields.marketing_youtube_url,
              parentPropertyId: entry.fields.parent_property,
              createdAt: entry.fields.createdAt,
              updatedAt: entry.fields.updatedAt,
            },
          });
          break;
        // Add cases for other models as needed
        default:
          console.log(`Skipping model ${entry.model}`);
      }
    } catch (error) {
      console.error(`Error importing ${entry.model} with pk ${entry.pk}:`, error);
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
