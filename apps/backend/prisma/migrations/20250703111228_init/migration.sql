-- CreateEnum
CREATE TYPE "FeesType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "DefaultRenewalTerms" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "LateFeeType" AS ENUM ('PERCENTAGE', 'FLAT');

-- CreateEnum
CREATE TYPE "EligibleCharges" AS ENUM ('EVERY_CHARGE', 'ALL_RECURRING_CHARGES', 'ONLY_RECURRING_RENT');

-- CreateEnum
CREATE TYPE "GracePeriodType" AS ENUM ('NUMBER_OF_DAY', 'TILL_DATE_OF_MONTH', 'NO_GRACE_PERIOD');

-- CreateEnum
CREATE TYPE "PaymentTypeChoices" AS ENUM ('NET_INCOME', 'FLAT');

-- CreateEnum
CREATE TYPE "LeaseStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "LeaseType" AS ENUM ('FIXED', 'AT_WILL');

-- CreateEnum
CREATE TYPE "RentCycleChoices" AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'SIX_MONTHS', 'YEARLY');

-- CreateEnum
CREATE TYPE "ApplicantTypeChoices" AS ENUM ('FINANCIALlY_INDEPENDENT', 'DEPENDENT');

-- CreateEnum
CREATE TYPE "RentalApplicationStatusChoices" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ON_HOLD_OR_WAITING');

-- CreateEnum
CREATE TYPE "TaxIdentityChoices" AS ENUM ('SSN', 'EIN');

-- CreateEnum
CREATE TYPE "ChargeType" AS ENUM ('PERCENT', 'FLAT');

-- CreateEnum
CREATE TYPE "OrderTypeChoices" AS ENUM ('INTERNAL', 'RESIDENT', 'UNIT_TURN');

-- CreateEnum
CREATE TYPE "PriorityChoices" AS ENUM ('URGENT', 'NORMAL', 'LOW');

-- CreateEnum
CREATE TYPE "CycleChoices" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SIX_MONTHS');

-- CreateEnum
CREATE TYPE "StatusChoices" AS ENUM ('OPEN', 'ASSIGNED', 'UNASSIGNED', 'COMPLETED', 'PENDING', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "ConditionChoices" AS ENUM ('OKAY', 'NOT_OKAY');

-- CreateEnum
CREATE TYPE "FixedAssetsStatus" AS ENUM ('IN_STORAGE', 'INSTALLED');

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "property_type_id" TEXT NOT NULL,
    "is_cat_allowed" BOOLEAN NOT NULL DEFAULT false,
    "is_dog_allowed" BOOLEAN NOT NULL DEFAULT false,
    "is_smoking_allowed" BOOLEAN NOT NULL DEFAULT false,
    "additional_fees_gl_account" TEXT,
    "additional_fees_percentage" INTEGER,
    "addition_fees_suppress" BOOLEAN NOT NULL DEFAULT false,
    "lease_fees_amount" DECIMAL(65,30),
    "lease_fees_percentage" INTEGER,
    "lease_fees_commission_type" "FeesType",
    "tax_authority" TEXT,
    "portfolio" TEXT,
    "description" TEXT,
    "renters_tax_location_code" TEXT,
    "property_owner_license" TEXT,
    "year_built" INTEGER,
    "management_start_date" TIMESTAMP(3),
    "management_end_date" TIMESTAMP(3),
    "management_end_reason" TEXT,
    "nsf_fee" DECIMAL(65,30),
    "management_fees_amount" DECIMAL(65,30),
    "management_fees_percentage" INTEGER,
    "management_commission_type" "FeesType",
    "notes" TEXT,
    "maintenance_limit_amount" DECIMAL(65,30),
    "insurance_expiration_date" TIMESTAMP(3),
    "has_home_warranty_coverage" BOOLEAN NOT NULL DEFAULT false,
    "home_warranty_company" TEXT,
    "home_warranty_expiration_date" TIMESTAMP(3),
    "maintenance_notes" TEXT,
    "default_lease_template_id" TEXT,
    "default_lease_agenda" TEXT,
    "default_lease_renewal_template_id" TEXT,
    "default_lease_renewal_agenda" TEXT,
    "default_lease_renewal_letter_template" TEXT,
    "default_renewal_terms" "DefaultRenewalTerms",
    "default_renewal_charge_by" DECIMAL(65,30),
    "default_renewal_additional_fee" DECIMAL(65,30),
    "rental_application_template_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyUpcomingActivity" (
    "id" TEXT NOT NULL,
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyUpcomingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyUtilityBilling" (
    "id" TEXT NOT NULL,
    "utility" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "vendor_bill_gl" TEXT NOT NULL,
    "tenant_charge_gl" TEXT NOT NULL,
    "owner_contribution_percentage" INTEGER NOT NULL,
    "tenant_contribution_percentage" INTEGER NOT NULL,
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyUtilityBilling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyLateFeePolicy" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "late_fee_type" "LateFeeType",
    "base_amount_fee" DECIMAL(65,30),
    "eligible_charges" "EligibleCharges",
    "charge_daily_late_fees" BOOLEAN NOT NULL DEFAULT false,
    "daily_amount_per_month_max" DECIMAL(65,30),
    "grace_period_type" "GracePeriodType",
    "grace_period" INTEGER,
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyLateFeePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyLeaseTemplateAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyLeaseTemplateAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyLeaseRenewalAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyLeaseRenewalAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyPhoto" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyOwner" (
    "id" TEXT NOT NULL,
    "percentage_owned" INTEGER NOT NULL,
    "parent_property_id" TEXT NOT NULL,
    "payment_type" "PaymentTypeChoices" NOT NULL,
    "contract_expiry" TIMESTAMP(3) NOT NULL,
    "reserve_funds" DECIMAL(65,30) NOT NULL,
    "fiscal_year_end" TEXT NOT NULL,
    "ownership_start_date" TIMESTAMP(3) NOT NULL,
    "owner_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentableItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "gl_account" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentableItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit_type_id" TEXT NOT NULL,
    "market_rent" DECIMAL(65,30),
    "future_market_rent" DECIMAL(65,30),
    "effective_date" TIMESTAMP(3),
    "application_fee" DECIMAL(65,30),
    "estimate_turn_over_cost" DECIMAL(65,30),
    "address" TEXT,
    "ready_for_show_on" TIMESTAMP(3),
    "virtual_showing_available" BOOLEAN NOT NULL DEFAULT false,
    "utility_bills" BOOLEAN NOT NULL DEFAULT false,
    "utility_bills_date" TIMESTAMP(3),
    "lock_box" TEXT,
    "description" TEXT,
    "non_revenues_status" BOOLEAN NOT NULL DEFAULT false,
    "balance" DECIMAL(65,30),
    "total_charges" DECIMAL(65,30),
    "total_credit" DECIMAL(65,30),
    "due_amount" DECIMAL(65,30),
    "total_payable" DECIMAL(65,30),
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitUpcomingActivity" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitUpcomingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitPhoto" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "unit_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bed_rooms" INTEGER,
    "bath_rooms" INTEGER,
    "square_feet" INTEGER,
    "market_rent" DECIMAL(65,30),
    "future_market_rent" DECIMAL(65,30),
    "effective_date" TIMESTAMP(3),
    "application_fee" DECIMAL(65,30),
    "estimate_turn_over_cost" DECIMAL(65,30),
    "is_cat_allowed" BOOLEAN NOT NULL DEFAULT false,
    "is_dog_allowed" BOOLEAN NOT NULL DEFAULT false,
    "is_smoking_allowed" BOOLEAN NOT NULL DEFAULT false,
    "marketing_title" TEXT,
    "marketing_description" TEXT,
    "marketing_youtube_url" TEXT,
    "parent_property_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitTypePhoto" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "unit_type_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitTypePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitTypeAmenity" (
    "id" TEXT NOT NULL,
    "amenity_id" TEXT NOT NULL,
    "unit_type_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitTypeAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaseTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rules_and_policies" TEXT[],
    "condition_of_premises" TEXT[],
    "right_of_inspection" BOOLEAN NOT NULL DEFAULT true,
    "conditions_of_moving_out" TEXT[],
    "releasing_policies" TEXT[],
    "final_statement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaseTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lease" (
    "id" TEXT NOT NULL,
    "rental_application_id" TEXT NOT NULL,
    "lease_type" "LeaseType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "lease_template_id" TEXT,
    "rent_cycle" "RentCycleChoices" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "gl_account" TEXT NOT NULL,
    "description" TEXT DEFAULT 'rent',
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "LeaseStatus" NOT NULL DEFAULT 'ACTIVE',
    "closed_on" TIMESTAMP(3),
    "unit_id" TEXT NOT NULL,
    "rules_and_policies" TEXT[],
    "condition_of_premises" TEXT[],
    "right_of_inspection" BOOLEAN,
    "conditions_of_moving_out" TEXT[],
    "releasing_policies" TEXT[],
    "final_statement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecondaryTenant" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "tax_payer_id" TEXT NOT NULL,
    "description" TEXT,
    "lease_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecondaryTenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "general_info" BOOLEAN NOT NULL DEFAULT true,
    "personal_details" BOOLEAN NOT NULL DEFAULT true,
    "rental_history" BOOLEAN NOT NULL DEFAULT true,
    "financial_info" BOOLEAN NOT NULL DEFAULT true,
    "dependents_info" BOOLEAN NOT NULL DEFAULT true,
    "other_info" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplicationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "allow_email_for_rental_application" BOOLEAN NOT NULL DEFAULT false,
    "phone_number" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplication" (
    "id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "status" "RentalApplicationStatusChoices" NOT NULL DEFAULT 'DRAFT',
    "desired_move_in_date" TIMESTAMP(3),
    "legal_first_name" TEXT,
    "middle_name" TEXT,
    "legal_last_name" TEXT,
    "application_type" "ApplicantTypeChoices",
    "phone_number" TEXT[],
    "emails" TEXT[],
    "notes" TEXT,
    "birthday" TIMESTAMP(3),
    "ssn_or_tin" TEXT,
    "driving_license_number" TEXT,
    "employer_name" TEXT,
    "employer_address" TEXT,
    "employer_address_2" TEXT,
    "employer_phone_number" TEXT,
    "employment_city" TEXT,
    "employment_zip_code" TEXT,
    "employment_country" TEXT,
    "monthly_salary" DECIMAL(65,30),
    "position_held" TEXT,
    "years_worked" INTEGER,
    "supervisor_name" TEXT,
    "supervisor_phone_number" TEXT,
    "supervisor_email" TEXT,
    "supervisor_title" TEXT,
    "is_defendant_in_any_lawsuit" BOOLEAN NOT NULL DEFAULT false,
    "is_convicted" BOOLEAN NOT NULL DEFAULT false,
    "have_filed_case_against_landlord" BOOLEAN NOT NULL DEFAULT false,
    "is_smoker" BOOLEAN NOT NULL DEFAULT false,
    "general_info" BOOLEAN NOT NULL DEFAULT false,
    "personal_details" BOOLEAN NOT NULL DEFAULT false,
    "rental_history" BOOLEAN NOT NULL DEFAULT false,
    "financial_info" BOOLEAN NOT NULL DEFAULT false,
    "dependents_info" BOOLEAN NOT NULL DEFAULT false,
    "other_info" BOOLEAN NOT NULL DEFAULT false,
    "is_general_info_filled" BOOLEAN NOT NULL DEFAULT false,
    "is_personal_details_filled" BOOLEAN NOT NULL DEFAULT false,
    "is_rental_history_filled" BOOLEAN NOT NULL DEFAULT false,
    "is_financial_info_filled" BOOLEAN NOT NULL DEFAULT false,
    "is_dependents_filled" BOOLEAN NOT NULL DEFAULT false,
    "is_other_info_filled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationEmergencyContact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "rental_application_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplicationEmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationResidentialHistory" (
    "id" TEXT NOT NULL,
    "current_address" TEXT NOT NULL,
    "current_address_2" TEXT,
    "current_city" TEXT,
    "current_zip_code" TEXT,
    "current_country" TEXT NOT NULL,
    "resident_from" TIMESTAMP(3),
    "resident_to" TIMESTAMP(3),
    "landlord_name" TEXT,
    "landlord_phone_number" TEXT,
    "landlord_email" TEXT,
    "reason_of_leaving" TEXT,
    "monthly_rent" DECIMAL(65,30),
    "current_state" TEXT,
    "rental_application_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplicationResidentialHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationFinancialInformation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "account_type" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "rental_application_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplicationFinancialInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationAdditionalIncome" (
    "id" TEXT NOT NULL,
    "monthly_income" DECIMAL(65,30) NOT NULL,
    "source_of_income" TEXT NOT NULL,
    "rental_application_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplicationAdditionalIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationDependent" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "relationship" TEXT NOT NULL,
    "rental_application_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplicationDependent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationPets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pet_type" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "age" INTEGER,
    "rental_application_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplicationPets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalApplicationAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "rental_application_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalApplicationAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "lease_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantUpcomingActivity" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantUpcomingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "use_company_name_as_display_name" BOOLEAN NOT NULL,
    "vendor_type_id" TEXT NOT NULL,
    "gl_account" TEXT NOT NULL,
    "personal_contact_numbers" TEXT[],
    "business_contact_numbers" TEXT[],
    "personal_emails" TEXT[],
    "business_emails" TEXT[],
    "website" TEXT NOT NULL,
    "insurance_provide_name" TEXT NOT NULL,
    "insurance_policy_number" TEXT NOT NULL,
    "insurance_expiry_date" TIMESTAMP(3) NOT NULL,
    "tax_identity_type" "TaxIdentityChoices" NOT NULL,
    "tax_payer_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorAddress" (
    "id" TEXT NOT NULL,
    "street_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "company_name" TEXT,
    "personal_contact_numbers" TEXT[],
    "company_contact_numbers" TEXT[],
    "personal_emails" TEXT[],
    "company_emails" TEXT[],
    "street_address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "tax_payer" TEXT NOT NULL,
    "tax_payer_id" TEXT NOT NULL,
    "bank_account_title" TEXT,
    "bank_name" TEXT,
    "bank_branch" TEXT,
    "bank_routing_number" TEXT,
    "bank_account_number" TEXT,
    "notes" TEXT,
    "is_company_name_as_tax_payer" BOOLEAN NOT NULL DEFAULT false,
    "is_use_as_display_name" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerUpcomingActivity" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerUpcomingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "order_type" "OrderTypeChoices" NOT NULL,
    "permission_to_enter" BOOLEAN NOT NULL DEFAULT false,
    "additional_information_for_entry" TEXT,
    "priority" "PriorityChoices" NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequestAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "service_request_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequestAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "cycle" "CycleChoices",
    "status" "StatusChoices" NOT NULL DEFAULT 'OPEN',
    "order_type" "OrderTypeChoices" NOT NULL,
    "job_description" TEXT,
    "vendor_instructions" TEXT,
    "vendor_trade" TEXT,
    "vendor_type_id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "email_vendor" BOOLEAN NOT NULL,
    "request_receipt" BOOLEAN NOT NULL,
    "assign_to_id" TEXT,
    "owner_approved" BOOLEAN NOT NULL,
    "follow_up_date" TIMESTAMP(3) NOT NULL,
    "service_request_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Labor" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Labor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "unit_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inspection_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "condition" "ConditionChoices" NOT NULL,
    "area_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StatusChoices" NOT NULL DEFAULT 'PENDING',
    "parent_property_id" TEXT NOT NULL,
    "select_all_units" BOOLEAN NOT NULL,
    "budget" DECIMAL(65,30) NOT NULL,
    "gl_account" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectExpense" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "assigned_to_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectExpenseAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "project_expense_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectExpenseAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT,
    "description" TEXT NOT NULL,
    "required_by_date" TIMESTAMP(3) NOT NULL,
    "tax" DECIMAL(65,30),
    "tax_charge_type" "ChargeType",
    "shipping" DECIMAL(65,30),
    "shipping_charge_type" "ChargeType",
    "discount" DECIMAL(65,30),
    "discount_charge_type" "ChargeType",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderItem" (
    "id" TEXT NOT NULL,
    "inventory_item_id" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrderAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "item_type_id" TEXT,
    "description" TEXT NOT NULL,
    "part_number" TEXT NOT NULL,
    "vendor_id" TEXT,
    "quantity" INTEGER NOT NULL,
    "expense_account" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "location_id" TEXT,
    "bin_or_shelf_number" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedAsset" (
    "id" TEXT NOT NULL,
    "status" "FixedAssetsStatus",
    "placed_in_service_date" TIMESTAMP(3),
    "warranty_expiration_date" TIMESTAMP(3),
    "unit_id" TEXT NOT NULL,
    "inventory_item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToUnit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToUnit_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyLateFeePolicy_parent_property_id_key" ON "PropertyLateFeePolicy"("parent_property_id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyPhoto_parent_property_id_is_cover_key" ON "PropertyPhoto"("parent_property_id", "is_cover");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyOwner_parent_property_id_owner_id_key" ON "PropertyOwner"("parent_property_id", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "UnitPhoto_unit_id_is_cover_key" ON "UnitPhoto"("unit_id", "is_cover");

-- CreateIndex
CREATE UNIQUE INDEX "UnitTypePhoto_unit_type_id_is_cover_key" ON "UnitTypePhoto"("unit_type_id", "is_cover");

-- CreateIndex
CREATE UNIQUE INDEX "UnitTypeAmenity_amenity_id_unit_type_id_key" ON "UnitTypeAmenity"("amenity_id", "unit_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "Lease_rental_application_id_key" ON "Lease"("rental_application_id");

-- CreateIndex
CREATE UNIQUE INDEX "Lease_status_unit_id_key" ON "Lease"("status", "unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "RentalApplication_applicant_id_key" ON "RentalApplication"("applicant_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_lease_id_key" ON "Tenant"("lease_id");

-- CreateIndex
CREATE INDEX "_ProjectToUnit_B_index" ON "_ProjectToUnit"("B");

-- AddForeignKey
ALTER TABLE "PropertyUpcomingActivity" ADD CONSTRAINT "PropertyUpcomingActivity_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyUtilityBilling" ADD CONSTRAINT "PropertyUtilityBilling_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyLateFeePolicy" ADD CONSTRAINT "PropertyLateFeePolicy_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAttachment" ADD CONSTRAINT "PropertyAttachment_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyLeaseTemplateAttachment" ADD CONSTRAINT "PropertyLeaseTemplateAttachment_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyLeaseRenewalAttachment" ADD CONSTRAINT "PropertyLeaseRenewalAttachment_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyPhoto" ADD CONSTRAINT "PropertyPhoto_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwner" ADD CONSTRAINT "PropertyOwner_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentableItem" ADD CONSTRAINT "RentableItem_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitUpcomingActivity" ADD CONSTRAINT "UnitUpcomingActivity_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitPhoto" ADD CONSTRAINT "UnitPhoto_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitType" ADD CONSTRAINT "UnitType_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTypePhoto" ADD CONSTRAINT "UnitTypePhoto_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTypeAmenity" ADD CONSTRAINT "UnitTypeAmenity_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_rental_application_id_fkey" FOREIGN KEY ("rental_application_id") REFERENCES "RentalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_lease_template_id_fkey" FOREIGN KEY ("lease_template_id") REFERENCES "LeaseTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondaryTenant" ADD CONSTRAINT "SecondaryTenant_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "Lease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplication" ADD CONSTRAINT "RentalApplication_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplicationEmergencyContact" ADD CONSTRAINT "RentalApplicationEmergencyContact_rental_application_id_fkey" FOREIGN KEY ("rental_application_id") REFERENCES "RentalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplicationResidentialHistory" ADD CONSTRAINT "RentalApplicationResidentialHistory_rental_application_id_fkey" FOREIGN KEY ("rental_application_id") REFERENCES "RentalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplicationFinancialInformation" ADD CONSTRAINT "RentalApplicationFinancialInformation_rental_application_i_fkey" FOREIGN KEY ("rental_application_id") REFERENCES "RentalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplicationAdditionalIncome" ADD CONSTRAINT "RentalApplicationAdditionalIncome_rental_application_id_fkey" FOREIGN KEY ("rental_application_id") REFERENCES "RentalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplicationDependent" ADD CONSTRAINT "RentalApplicationDependent_rental_application_id_fkey" FOREIGN KEY ("rental_application_id") REFERENCES "RentalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplicationPets" ADD CONSTRAINT "RentalApplicationPets_rental_application_id_fkey" FOREIGN KEY ("rental_application_id") REFERENCES "RentalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalApplicationAttachment" ADD CONSTRAINT "RentalApplicationAttachment_rental_application_id_fkey" FOREIGN KEY ("rental_application_id") REFERENCES "RentalApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "Lease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantUpcomingActivity" ADD CONSTRAINT "TenantUpcomingActivity_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantAttachment" ADD CONSTRAINT "TenantAttachment_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_vendor_type_id_fkey" FOREIGN KEY ("vendor_type_id") REFERENCES "VendorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAddress" ADD CONSTRAINT "VendorAddress_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAttachment" ADD CONSTRAINT "VendorAttachment_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerUpcomingActivity" ADD CONSTRAINT "OwnerUpcomingActivity_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestAttachment" ADD CONSTRAINT "ServiceRequestAttachment_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_vendor_type_id_fkey" FOREIGN KEY ("vendor_type_id") REFERENCES "VendorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Labor" ADD CONSTRAINT "Labor_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "WorkOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaItem" ADD CONSTRAINT "AreaItem_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectExpense" ADD CONSTRAINT "ProjectExpense_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectExpenseAttachment" ADD CONSTRAINT "ProjectExpenseAttachment_project_expense_id_fkey" FOREIGN KEY ("project_expense_id") REFERENCES "ProjectExpense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderAttachment" ADD CONSTRAINT "PurchaseOrderAttachment_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedAsset" ADD CONSTRAINT "FixedAsset_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedAsset" ADD CONSTRAINT "FixedAsset_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUnit" ADD CONSTRAINT "_ProjectToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUnit" ADD CONSTRAINT "_ProjectToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
