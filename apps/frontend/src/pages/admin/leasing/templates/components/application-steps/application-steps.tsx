import { Children, MouseEventHandler, useMemo, useState } from 'react';
import { Card } from 'react-bootstrap';

import { Formik } from 'formik';

import { CustomStepper } from 'components/custom-stepper';

import { ApplicantType } from 'interfaces/IApplications';

import {
  Step01General,
  Step02PersonalInfo,
  Step03History,
  Step04FinancialInfo,
  Step05Dependents,
  Step06Other,
} from 'pages/admin/leasing/components/application-steps';

interface IProps {
  applicationSteps?: Array<{ label: string; name: string }>;
}

const ApplicationSteps = ({ applicationSteps = [] }: IProps) => {
  const [index, setIndex] = useState(1);

  const GetSteps = useMemo(() => {
    const steps: {
      [key: string]: JSX.Element;
    } = {
      general_info: <Step01General isDisabled />,
      personal_details: <Step02PersonalInfo isDisabled />,
      rental_history: <Step03History isDisabled />,
      financial_info: <Step04FinancialInfo isDisabled />,
      dependents_info: <Step05Dependents isDisabled />,
      other_info: <Step06Other isDisabled />,
    };

    const demoApplicationSteps: JSX.Element[] = [];

    Object.keys(steps).forEach(
      key => applicationSteps.find(step => step.name === key) && demoApplicationSteps.push(steps[key])
    );

    return Children.toArray(demoApplicationSteps);
  }, [applicationSteps]);

  const handleStepClick: MouseEventHandler<HTMLElement> = ev => {
    const dataKey = ev.currentTarget.dataset['step'];
    setIndex(Number(dataKey));
  };

  return (
    <Card className="border-0 p-4">
      <Card.Header className="p-0 border-0 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Rental Application</p>
        <p className="small">Provide the needed information to submit the rental application</p>
      </Card.Header>

      <Card.Body className="px-0 text-start">
        <Formik
          initialValues={{
            application_type: 'DEPENDENT' as ApplicantType,
            desired_move_in_date: '',
            legal_first_name: '',
            middle_name: '',
            legal_last_name: '',
            notes: '',
            birthday: '',
            ssn_or_tin: '',
            driving_license_number: '',
            employer_name: '',
            employer_address: '',
            employer_phone_number: '',
            employment_city: '',
            employment_zip_code: '',
            employment_country: '',
            monthly_salary: '',
            position_held: '',
            years_worked: 1,
            supervisor_name: '',
            supervisor_title: '',
            supervisor_phone_number: '',
            supervisor_email: '',
            emergency_contacts: [
              {
                name: '',
                relationship: '',
                phone_number: '',
                address: '',
              },
            ],
            is_defendant_in_any_lawsuit: false,
            is_convicted: false,
            have_filed_case_against_landlord: false,
            is_smoker: false,
            phone_number: [{ phone: '' }],
            emails: [{ email: '' }],
            residential_history: [
              {
                current_address: '',
                current_address_2: '',
                current_city: '',
                current_zip_code: '',
                current_country: '',
                current_state: '',
                monthly_rent: '',
                resident_from: '',
                resident_to: '',
                landlord_name: '',
                landlord_phone_number: '',
                landlord_email: '',
                reason_of_leaving: '',
              },
            ],
            financial_information: [
              {
                name: '',
                account_type: '',
                account_number: '',
              },
            ],
            additional_income: [
              {
                monthly_income: '',
                source_of_income: '',
              },
            ],
            dependents: [
              {
                first_name: '',
                last_name: '',
                birthday: '',
                relationship: '',
              },
            ],
            pets: [
              {
                name: '',
                pet_type: '',
                weight: '',
                age: '',
              },
            ],
            is_general_info_filled: false,
            is_personal_details_filled: false,
            is_rental_history_filled: false,
            is_financial_info_filled: false,
            is_dependents_filled: false,
            is_other_info_filled: false,
          }}
          onSubmit={() => {
            return;
          }}
        >
          {() => (
            <CustomStepper
              active={index}
              steps={applicationSteps}
              randomSteps
              nameAsLabel
              onStepClick={handleStepClick}
            >
              {GetSteps}
            </CustomStepper>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default ApplicationSteps;
