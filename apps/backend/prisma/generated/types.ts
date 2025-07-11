import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const FeesType = {
    PERCENTAGE: "PERCENTAGE",
    FIXED: "FIXED"
} as const;
export type FeesType = (typeof FeesType)[keyof typeof FeesType];
export const DefaultRenewalTerms = {
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY"
} as const;
export type DefaultRenewalTerms = (typeof DefaultRenewalTerms)[keyof typeof DefaultRenewalTerms];
export const LateFeeType = {
    PERCENTAGE: "PERCENTAGE",
    FLAT: "FLAT"
} as const;
export type LateFeeType = (typeof LateFeeType)[keyof typeof LateFeeType];
export const EligibleCharges = {
    EVERY_CHARGE: "EVERY_CHARGE",
    ALL_RECURRING_CHARGES: "ALL_RECURRING_CHARGES",
    ONLY_RECURRING_RENT: "ONLY_RECURRING_RENT"
} as const;
export type EligibleCharges = (typeof EligibleCharges)[keyof typeof EligibleCharges];
export const GracePeriodType = {
    NUMBER_OF_DAY: "NUMBER_OF_DAY",
    TILL_DATE_OF_MONTH: "TILL_DATE_OF_MONTH",
    NO_GRACE_PERIOD: "NO_GRACE_PERIOD"
} as const;
export type GracePeriodType = (typeof GracePeriodType)[keyof typeof GracePeriodType];
export const PaymentTypeChoices = {
    NET_INCOME: "NET_INCOME",
    FLAT: "FLAT"
} as const;
export type PaymentTypeChoices = (typeof PaymentTypeChoices)[keyof typeof PaymentTypeChoices];
export const LeaseStatus = {
    ACTIVE: "ACTIVE",
    CLOSED: "CLOSED"
} as const;
export type LeaseStatus = (typeof LeaseStatus)[keyof typeof LeaseStatus];
export const LeaseType = {
    FIXED: "FIXED",
    AT_WILL: "AT_WILL"
} as const;
export type LeaseType = (typeof LeaseType)[keyof typeof LeaseType];
export const RentCycleChoices = {
    WEEKLY: "WEEKLY",
    MONTHLY: "MONTHLY",
    QUARTERLY: "QUARTERLY",
    SIX_MONTHS: "SIX_MONTHS",
    YEARLY: "YEARLY"
} as const;
export type RentCycleChoices = (typeof RentCycleChoices)[keyof typeof RentCycleChoices];
export const ApplicantTypeChoices = {
    FINANCIALlY_INDEPENDENT: "FINANCIALlY_INDEPENDENT",
    DEPENDENT: "DEPENDENT"
} as const;
export type ApplicantTypeChoices = (typeof ApplicantTypeChoices)[keyof typeof ApplicantTypeChoices];
export const RentalApplicationStatusChoices = {
    DRAFT: "DRAFT",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    ON_HOLD_OR_WAITING: "ON_HOLD_OR_WAITING"
} as const;
export type RentalApplicationStatusChoices = (typeof RentalApplicationStatusChoices)[keyof typeof RentalApplicationStatusChoices];
export const TaxIdentityChoices = {
    SSN: "SSN",
    EIN: "EIN"
} as const;
export type TaxIdentityChoices = (typeof TaxIdentityChoices)[keyof typeof TaxIdentityChoices];
export const ChargeType = {
    PERCENT: "PERCENT",
    FLAT: "FLAT"
} as const;
export type ChargeType = (typeof ChargeType)[keyof typeof ChargeType];
export const OrderTypeChoices = {
    INTERNAL: "INTERNAL",
    RESIDENT: "RESIDENT",
    UNIT_TURN: "UNIT_TURN"
} as const;
export type OrderTypeChoices = (typeof OrderTypeChoices)[keyof typeof OrderTypeChoices];
export const PriorityChoices = {
    URGENT: "URGENT",
    NORMAL: "NORMAL",
    LOW: "LOW"
} as const;
export type PriorityChoices = (typeof PriorityChoices)[keyof typeof PriorityChoices];
export const CycleChoices = {
    DAILY: "DAILY",
    WEEKLY: "WEEKLY",
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY",
    SIX_MONTHS: "SIX_MONTHS"
} as const;
export type CycleChoices = (typeof CycleChoices)[keyof typeof CycleChoices];
export const StatusChoices = {
    OPEN: "OPEN",
    ASSIGNED: "ASSIGNED",
    UNASSIGNED: "UNASSIGNED",
    COMPLETED: "COMPLETED",
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS"
} as const;
export type StatusChoices = (typeof StatusChoices)[keyof typeof StatusChoices];
export const ConditionChoices = {
    OKAY: "OKAY",
    NOT_OKAY: "NOT_OKAY"
} as const;
export type ConditionChoices = (typeof ConditionChoices)[keyof typeof ConditionChoices];
export const FixedAssetsStatus = {
    IN_STORAGE: "IN_STORAGE",
    INSTALLED: "INSTALLED"
} as const;
export type FixedAssetsStatus = (typeof FixedAssetsStatus)[keyof typeof FixedAssetsStatus];
export type Applicant = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    allow_email_for_rental_application: Generated<boolean>;
    phone_number: string;
    unit_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Area = {
    id: string;
    name: string;
    inspection_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type AreaItem = {
    id: string;
    name: string;
    condition: ConditionChoices;
    area_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type FixedAsset = {
    id: string;
    status: FixedAssetsStatus | null;
    placed_in_service_date: Timestamp | null;
    warranty_expiration_date: Timestamp | null;
    unit_id: string;
    inventory_item_id: string;
    quantity: number;
    cost: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Group = {
    id: string;
    name: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Inspection = {
    id: string;
    name: string;
    date: Timestamp;
    unit_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Inventory = {
    id: string;
    name: string;
    item_type_id: string | null;
    description: string;
    part_number: string;
    vendor_id: string | null;
    quantity: number;
    expense_account: string;
    cost: string;
    location_id: string | null;
    bin_or_shelf_number: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Labor = {
    id: string;
    title: string;
    date: Timestamp;
    hours: number;
    description: string;
    work_order_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Lease = {
    id: string;
    rental_application_id: string;
    lease_type: LeaseType;
    start_date: Timestamp;
    end_date: Timestamp;
    lease_template_id: string | null;
    rent_cycle: RentCycleChoices;
    amount: string;
    gl_account: string;
    description: Generated<string | null>;
    due_date: Timestamp;
    status: Generated<LeaseStatus>;
    closed_on: Timestamp | null;
    unit_id: string;
    rules_and_policies: string[];
    condition_of_premises: string[];
    right_of_inspection: boolean | null;
    conditions_of_moving_out: string[];
    releasing_policies: string[];
    final_statement: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type LeaseTemplate = {
    id: string;
    name: string;
    description: string | null;
    rules_and_policies: string[];
    condition_of_premises: string[];
    right_of_inspection: Generated<boolean>;
    conditions_of_moving_out: string[];
    releasing_policies: string[];
    final_statement: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Owner = {
    id: string;
    first_name: string;
    last_name: string;
    company_name: string | null;
    personal_contact_numbers: string[];
    company_contact_numbers: string[];
    personal_emails: string[];
    company_emails: string[];
    street_address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    tax_payer: string;
    tax_payer_id: string;
    bank_account_title: string | null;
    bank_name: string | null;
    bank_branch: string | null;
    bank_routing_number: string | null;
    bank_account_number: string | null;
    notes: string | null;
    is_company_name_as_tax_payer: Generated<boolean>;
    is_use_as_display_name: Generated<boolean>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type OwnerUpcomingActivity = {
    id: string;
    owner_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Project = {
    id: string;
    name: string;
    description: string;
    status: Generated<StatusChoices>;
    parent_property_id: string;
    select_all_units: boolean;
    budget: string;
    gl_account: string;
    start_date: Timestamp;
    end_date: Timestamp | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type ProjectExpense = {
    id: string;
    title: string;
    description: string;
    amount: string;
    date: Timestamp;
    assigned_to_id: string;
    project_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type ProjectExpenseAttachment = {
    id: string;
    name: string;
    file: string;
    project_expense_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type ProjectToUnit = {
    A: string;
    B: string;
};
export type Property = {
    id: string;
    associatedSubscriptionId: string | null;
    name: string;
    address: string;
    property_type_id: string;
    is_cat_allowed: Generated<boolean>;
    is_dog_allowed: Generated<boolean>;
    is_smoking_allowed: Generated<boolean>;
    additional_fees_gl_account: string | null;
    additional_fees_percentage: number | null;
    addition_fees_suppress: Generated<boolean>;
    lease_fees_amount: string | null;
    lease_fees_percentage: number | null;
    lease_fees_commission_type: FeesType | null;
    tax_authority: string | null;
    portfolio: string | null;
    description: string | null;
    renters_tax_location_code: string | null;
    property_owner_license: string | null;
    year_built: number | null;
    management_start_date: Timestamp | null;
    management_end_date: Timestamp | null;
    management_end_reason: string | null;
    nsf_fee: string | null;
    management_fees_amount: string | null;
    management_fees_percentage: number | null;
    management_commission_type: FeesType | null;
    notes: string | null;
    maintenance_limit_amount: string | null;
    insurance_expiration_date: Timestamp | null;
    has_home_warranty_coverage: Generated<boolean>;
    home_warranty_company: string | null;
    home_warranty_expiration_date: Timestamp | null;
    maintenance_notes: string | null;
    default_lease_template_id: string | null;
    default_lease_agenda: string | null;
    default_lease_renewal_template_id: string | null;
    default_lease_renewal_agenda: string | null;
    default_lease_renewal_letter_template: string | null;
    default_renewal_terms: DefaultRenewalTerms | null;
    default_renewal_charge_by: string | null;
    default_renewal_additional_fee: string | null;
    rental_application_template_id: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PropertyAttachment = {
    id: string;
    name: string;
    file: string;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PropertyLateFeePolicy = {
    id: string;
    start_date: Timestamp | null;
    end_date: Timestamp | null;
    late_fee_type: LateFeeType | null;
    base_amount_fee: string | null;
    eligible_charges: EligibleCharges | null;
    charge_daily_late_fees: Generated<boolean>;
    daily_amount_per_month_max: string | null;
    grace_period_type: GracePeriodType | null;
    grace_period: number | null;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PropertyLeaseRenewalAttachment = {
    id: string;
    name: string;
    file: string;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PropertyLeaseTemplateAttachment = {
    id: string;
    name: string;
    file: string;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PropertyOwner = {
    id: string;
    percentage_owned: number;
    parent_property_id: string;
    payment_type: PaymentTypeChoices;
    contract_expiry: Timestamp;
    reserve_funds: string;
    fiscal_year_end: string;
    ownership_start_date: Timestamp;
    owner_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PropertyPhoto = {
    id: string;
    image: string;
    is_cover: Generated<boolean>;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PropertyUpcomingActivity = {
    id: string;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PropertyUtilityBilling = {
    id: string;
    utility: string;
    vendor_id: string;
    vendor_bill_gl: string;
    tenant_charge_gl: string;
    owner_contribution_percentage: number;
    tenant_contribution_percentage: number;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PurchaseOrder = {
    id: string;
    vendor_id: string | null;
    description: string;
    required_by_date: Timestamp;
    tax: string | null;
    tax_charge_type: ChargeType | null;
    shipping: string | null;
    shipping_charge_type: ChargeType | null;
    discount: string | null;
    discount_charge_type: ChargeType | null;
    notes: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PurchaseOrderAttachment = {
    id: string;
    name: string;
    file: string;
    purchase_order_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type PurchaseOrderItem = {
    id: string;
    inventory_item_id: string;
    cost: string;
    quantity: number;
    purchase_order_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentableItem = {
    id: string;
    name: string;
    description: string | null;
    amount: string;
    gl_account: string;
    tenant_id: string;
    status: Generated<boolean>;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentalApplication = {
    id: string;
    applicant_id: string;
    status: Generated<RentalApplicationStatusChoices>;
    desired_move_in_date: Timestamp | null;
    legal_first_name: string | null;
    middle_name: string | null;
    legal_last_name: string | null;
    application_type: ApplicantTypeChoices | null;
    phone_number: string[];
    emails: string[];
    notes: string | null;
    birthday: Timestamp | null;
    ssn_or_tin: string | null;
    driving_license_number: string | null;
    employer_name: string | null;
    employer_address: string | null;
    employer_address_2: string | null;
    employer_phone_number: string | null;
    employment_city: string | null;
    employment_zip_code: string | null;
    employment_country: string | null;
    monthly_salary: string | null;
    position_held: string | null;
    years_worked: number | null;
    supervisor_name: string | null;
    supervisor_phone_number: string | null;
    supervisor_email: string | null;
    supervisor_title: string | null;
    is_defendant_in_any_lawsuit: Generated<boolean>;
    is_convicted: Generated<boolean>;
    have_filed_case_against_landlord: Generated<boolean>;
    is_smoker: Generated<boolean>;
    general_info: Generated<boolean>;
    personal_details: Generated<boolean>;
    rental_history: Generated<boolean>;
    financial_info: Generated<boolean>;
    dependents_info: Generated<boolean>;
    other_info: Generated<boolean>;
    is_general_info_filled: Generated<boolean>;
    is_personal_details_filled: Generated<boolean>;
    is_rental_history_filled: Generated<boolean>;
    is_financial_info_filled: Generated<boolean>;
    is_dependents_filled: Generated<boolean>;
    is_other_info_filled: Generated<boolean>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentalApplicationAdditionalIncome = {
    id: string;
    monthly_income: string;
    source_of_income: string;
    rental_application_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentalApplicationAttachment = {
    id: string;
    name: string;
    file: string;
    rental_application_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentalApplicationDependent = {
    id: string;
    first_name: string;
    last_name: string;
    birthday: Timestamp;
    relationship: string;
    rental_application_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentalApplicationEmergencyContact = {
    id: string;
    name: string;
    phone_number: string;
    relationship: string;
    address: string;
    rental_application_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentalApplicationFinancialInformation = {
    id: string;
    name: string;
    account_type: string;
    bank: string;
    account_number: string;
    rental_application_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentalApplicationPets = {
    id: string;
    name: string;
    pet_type: string;
    weight: number | null;
    age: number | null;
    rental_application_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentalApplicationResidentialHistory = {
    id: string;
    current_address: string;
    current_address_2: string | null;
    current_city: string | null;
    current_zip_code: string | null;
    current_country: string;
    resident_from: Timestamp | null;
    resident_to: Timestamp | null;
    landlord_name: string | null;
    landlord_phone_number: string | null;
    landlord_email: string | null;
    reason_of_leaving: string | null;
    monthly_rent: string | null;
    current_state: string | null;
    rental_application_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RentalApplicationTemplate = {
    id: string;
    name: string;
    description: string | null;
    general_info: Generated<boolean>;
    personal_details: Generated<boolean>;
    rental_history: Generated<boolean>;
    financial_info: Generated<boolean>;
    dependents_info: Generated<boolean>;
    other_info: Generated<boolean>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Role = {
    id: string;
    name: string;
    description: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type SecondaryTenant = {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone_number: string;
    birthday: Timestamp;
    tax_payer_id: string;
    description: string | null;
    lease_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type ServiceRequest = {
    id: string;
    unit_id: string;
    order_type: OrderTypeChoices;
    permission_to_enter: Generated<boolean>;
    additional_information_for_entry: string | null;
    priority: PriorityChoices;
    subject: string;
    description: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type ServiceRequestAttachment = {
    id: string;
    name: string;
    file: string;
    service_request_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Tenant = {
    id: string;
    associatedSubscriptionId: string | null;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    lease_id: string;
    user_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type TenantAttachment = {
    id: string;
    name: string;
    file: string;
    tenant_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type TenantUpcomingActivity = {
    id: string;
    tenant_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Unit = {
    id: string;
    name: string;
    unit_type_id: string;
    market_rent: string | null;
    future_market_rent: string | null;
    effective_date: Timestamp | null;
    application_fee: string | null;
    estimate_turn_over_cost: string | null;
    address: string | null;
    ready_for_show_on: Timestamp | null;
    virtual_showing_available: Generated<boolean>;
    utility_bills: Generated<boolean>;
    utility_bills_date: Timestamp | null;
    lock_box: string | null;
    description: string | null;
    non_revenues_status: Generated<boolean>;
    balance: string | null;
    total_charges: string | null;
    total_credit: string | null;
    due_amount: string | null;
    total_payable: string | null;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type UnitPhoto = {
    id: string;
    image: string;
    is_cover: Generated<boolean>;
    unit_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type UnitType = {
    id: string;
    name: string;
    bed_rooms: number | null;
    bath_rooms: number | null;
    square_feet: number | null;
    market_rent: string | null;
    future_market_rent: string | null;
    effective_date: Timestamp | null;
    application_fee: string | null;
    estimate_turn_over_cost: string | null;
    is_cat_allowed: Generated<boolean>;
    is_dog_allowed: Generated<boolean>;
    is_smoking_allowed: Generated<boolean>;
    marketing_title: string | null;
    marketing_description: string | null;
    marketing_youtube_url: string | null;
    parent_property_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type UnitTypeAmenity = {
    id: string;
    amenity_id: string;
    unit_type_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type UnitTypePhoto = {
    id: string;
    image: string;
    is_cover: Generated<boolean>;
    unit_type_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type UnitUpcomingActivity = {
    id: string;
    unit_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type User = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    isActive: Generated<boolean>;
    isStaff: Generated<boolean>;
    isSuperuser: Generated<boolean>;
    passwordHash: string;
    associatedSubscriptionId: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type UserGroups = {
    A: string;
    B: string;
};
export type UserRoles = {
    A: string;
    B: string;
};
export type Vendor = {
    id: string;
    associatedSubscriptionId: string | null;
    first_name: string;
    last_name: string;
    company_name: string;
    use_company_name_as_display_name: boolean;
    vendor_type_id: string;
    gl_account: string;
    personal_contact_numbers: string[];
    business_contact_numbers: string[];
    personal_emails: string[];
    business_emails: string[];
    website: string;
    insurance_provide_name: string;
    insurance_policy_number: string;
    insurance_expiry_date: Timestamp;
    tax_identity_type: TaxIdentityChoices;
    tax_payer_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type VendorAddress = {
    id: string;
    street_address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    vendor_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type VendorAttachment = {
    id: string;
    name: string;
    file: string;
    vendor_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type VendorType = {
    id: string;
    name: string;
    description: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type WorkOrder = {
    id: string;
    is_recurring: Generated<boolean>;
    cycle: CycleChoices | null;
    status: Generated<StatusChoices>;
    order_type: OrderTypeChoices;
    job_description: string | null;
    vendor_instructions: string | null;
    vendor_trade: string | null;
    vendor_type_id: string;
    vendor_id: string;
    email_vendor: boolean;
    request_receipt: boolean;
    assign_to_id: string | null;
    owner_approved: boolean;
    follow_up_date: Timestamp;
    service_request_id: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    _ProjectToUnit: ProjectToUnit;
    _UserGroups: UserGroups;
    _UserRoles: UserRoles;
    Applicant: Applicant;
    Area: Area;
    AreaItem: AreaItem;
    FixedAsset: FixedAsset;
    Group: Group;
    Inspection: Inspection;
    Inventory: Inventory;
    Labor: Labor;
    Lease: Lease;
    LeaseTemplate: LeaseTemplate;
    Owner: Owner;
    OwnerUpcomingActivity: OwnerUpcomingActivity;
    Project: Project;
    ProjectExpense: ProjectExpense;
    ProjectExpenseAttachment: ProjectExpenseAttachment;
    Property: Property;
    PropertyAttachment: PropertyAttachment;
    PropertyLateFeePolicy: PropertyLateFeePolicy;
    PropertyLeaseRenewalAttachment: PropertyLeaseRenewalAttachment;
    PropertyLeaseTemplateAttachment: PropertyLeaseTemplateAttachment;
    PropertyOwner: PropertyOwner;
    PropertyPhoto: PropertyPhoto;
    PropertyUpcomingActivity: PropertyUpcomingActivity;
    PropertyUtilityBilling: PropertyUtilityBilling;
    PurchaseOrder: PurchaseOrder;
    PurchaseOrderAttachment: PurchaseOrderAttachment;
    PurchaseOrderItem: PurchaseOrderItem;
    RentableItem: RentableItem;
    RentalApplication: RentalApplication;
    RentalApplicationAdditionalIncome: RentalApplicationAdditionalIncome;
    RentalApplicationAttachment: RentalApplicationAttachment;
    RentalApplicationDependent: RentalApplicationDependent;
    RentalApplicationEmergencyContact: RentalApplicationEmergencyContact;
    RentalApplicationFinancialInformation: RentalApplicationFinancialInformation;
    RentalApplicationPets: RentalApplicationPets;
    RentalApplicationResidentialHistory: RentalApplicationResidentialHistory;
    RentalApplicationTemplate: RentalApplicationTemplate;
    Role: Role;
    SecondaryTenant: SecondaryTenant;
    ServiceRequest: ServiceRequest;
    ServiceRequestAttachment: ServiceRequestAttachment;
    Tenant: Tenant;
    TenantAttachment: TenantAttachment;
    TenantUpcomingActivity: TenantUpcomingActivity;
    Unit: Unit;
    UnitPhoto: UnitPhoto;
    UnitType: UnitType;
    UnitTypeAmenity: UnitTypeAmenity;
    UnitTypePhoto: UnitTypePhoto;
    UnitUpcomingActivity: UnitUpcomingActivity;
    User: User;
    Vendor: Vendor;
    VendorAddress: VendorAddress;
    VendorAttachment: VendorAttachment;
    VendorType: VendorType;
    WorkOrder: WorkOrder;
};
