import { clsx } from 'clsx';

import { dayJS, formatPricing, isDate, isNegativeNumber } from 'utils/functions';

import { ILeaseAPI, LeaseRentCycle } from 'interfaces/IApplications';

interface ILeaseDetail extends Omit<ILeaseAPI, 'property' | 'unit'> {
  security_deposit_date: string;
  security_deposit_amount: number | string;
}

interface IProps {
  lease?: Partial<ILeaseDetail>;
  late_fee_amount?: string | number;
  property_unit_name?: string;
  tenant_name?: string;
}

const Step01Residence = ({ lease, property_unit_name, late_fee_amount, tenant_name }: IProps) => {
  return (
    <div className="lh-lg">
      <h5 className="fw-bold">Lease Duration:</h5>
      <p>
        This Lease Agreement for
        <span className="fw-bold mx-1">
          ({property_unit_name ? `"${property_unit_name}"` : '"Property - Unit Name"'})
        </span>
        is entered into on:
        <span className="d-block mt-2">
          <span className="fw-bold">{getValue('Start Date', lease?.start_date)}</span> and shall continue for a duration
          of
          <span className="mx-1 fw-bold">{getDuration('Lease Duration', lease?.start_date, lease?.end_date)}</span>,
          <br /> and terminating on <span className="fw-bold">{getValue('End Date', lease?.end_date)}</span>.
        </span>
      </p>
      <p>The term of this lease may be extended or terminated by mutual agreement of the parties in writing.</p>

      <h5 className="fw-bold mt-4">Rental & Charges Details:</h5>
      <p>
        The Tenant, <span className="fw-bold">{tenant_name ? tenant_name : '[Tenant Name]'}</span>, agrees to pay a
        <span className="fw-bold mx-1">{getRentCycle('Rent Cycle', lease?.rent_cycle)}</span>
        amount of
        <span
          className={clsx('fw-bold mx-1', {
            'price-symbol': lease?.amount,
            '-ive': lease?.amount && isNegativeNumber(lease?.amount),
          })}
        >
          {getValue('Rent Amount', formatPricing(lease?.amount))}
        </span>
        <br />
        payable on the <span className="fw-bold">{getValue('Due Date', lease?.due_date)}</span> <br />
        of each <span className="fw-bold">{getRentCycle('Rent Cycle', lease?.rent_cycle)}</span>. <br />
        Late payments may incur a penalty of
        <span
          className={clsx('fw-bold mx-1', {
            'price-symbol': late_fee_amount,
            '-ive': late_fee_amount && isNegativeNumber(late_fee_amount),
          })}
        >
          {late_fee_amount ? formatPricing(late_fee_amount) : '[Late Fee Amount]'}
        </span>
      </p>
      <p>The rent includes the rent cycle amount, and any additional charges will be specified in writing.</p>

      {!lease ? (
        <div>
          <p className="fw-medium">The Tenant is responsible for charges, including:</p>
          <ul>
            <li>
              <span className="fw-bold">[Charge title]</span> - <span className="fw-bold">[Amount]</span>
            </li>
            <li>
              <span className="fw-bold">[Charge title]</span> - <span className="fw-bold">[Amount]</span>
            </li>
            <li>
              <span className="fw-bold">[Charge title]</span> - <span className="fw-bold">[Amount]</span>
            </li>
          </ul>
        </div>
      ) : (
        <p className="fw-medium">
          The Tenant is responsible for charges which may applicable based on the terms outlined in this Agreement.
        </p>
      )}
      {!lease && <p>Other charges may be applicable based on the terms outlined in this Agreement.</p>}
      <p>
        All payments shall be made to the <span className="fw-medium">Owner</span> or designated
        <span className="fw-medium mx-1">Property Manager</span> through the tenant portal with receipt attachment or in
        cash.
      </p>

      <h5 className="fw-bold mt-4">Security Deposit:</h5>
      <p>
        The Tenant has provided a security deposit of
        <span className="fw-bold mx-1">{getValue('Security Deposit Amount', lease?.security_deposit_amount)}</span> on
        <span className="fw-bold ms-1">{getValue('Date', lease?.security_deposit_date)}</span> upon signing this lease.
        The security deposit is intended to cover damages beyond normal wear and tear and unpaid rent. It will be
        refunded after the lease termination, less any deductions for outstanding charges or damages.
      </p>
      <p>
        The security deposit shall not be considered as the final rent payment, and any remaining charges shall be
        settled by the Tenant before the termination of the lease.
      </p>
    </div>
  );
};

export default Step01Residence;

const getValue = (fallback: string, value?: string | number) => {
  if (value) return value;
  return `[${fallback}]`;
};

const getRentCycle = (fallback: string, value?: LeaseRentCycle) => {
  if (value) return value.toLowerCase().replace('_', ' ').replace('ly', '');
  return `[${fallback}]`;
};

const getDuration = (fallback: string, start_date?: string, end_date?: string) => {
  if (!start_date || !end_date || !isDate(start_date) || !isDate(end_date)) return `[${fallback}]`;

  const duration = dayJS(end_date).diff(dayJS(start_date), 'days');

  const years = Math.floor(duration / 365);
  const weeks = Math.floor((duration % 365) / 7);
  const days = duration % 7;

  return `${years} Years ${weeks} Weeks ${days} Days`;
};
