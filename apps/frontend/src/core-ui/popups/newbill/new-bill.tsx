import { Button } from 'react-bootstrap';

import { Popup } from 'components/popup';

interface IProps {
  handleCreateBill?: (id: string) => void;
}

const NewBill = ({ handleCreateBill }: IProps) => {
  const create_bills = [
    {
      id: 'bill_against_vendor',
      label: 'Bill against vendor',
    },
    {
      id: 'bill_against_property',
      label: 'Bill against property',
    },
    {
      id: 'management_fee',
      label: 'Management Fee',
    },
    {
      id: 'pay_owners',
      label: 'Pay owners',
    },
    {
      id: 'owner_draws',
      label: 'Owner draws',
    },
    {
      id: 'tenant_payable',
      label: 'Tenant payable',
    },
    {
      id: 'transfer_owner_funds',
      label: 'Transfer Owner Funds',
    },
    {
      id: 'transfer_by_cash_account',
      label: 'Transfer by cash account',
    },
  ];

  return (
    <Popup actionBtn={false} title="Create bill" subtitle="Select the bill type you would like to create">
      {create_bills.map(({ id, label }) => (
        <Button
          onClick={() => handleCreateBill && handleCreateBill(id)}
          key={id}
          variant="light border-primary py-3"
          className="w-100"
          type="reset"
        >
          {label}
        </Button>
      ))}
    </Popup>
  );
};

export default NewBill;
