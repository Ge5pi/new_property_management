import { ReactNode, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row } from 'react-table';

import { useGetInvoicesQuery } from 'services/api/invoices';
import { useGetTenantInvoicesQuery } from 'services/api/tenants/accounts';

import { ItemDate, ItemPrice, ItemSlug, ItemStatus } from 'components/custom-cell';
import { TableWithPagination } from 'components/table';

import { useRedirect } from 'hooks/useRedirect';

import RentalInvoiceWrapper from './rental-invoices-wrapper';

export interface IProps {
  permissions?: string;
  pageHeader?: ReactNode;
  wrapperFor: 'ADMIN' | 'TENANT';
}

const RentalInvoices = ({ wrapperFor, pageHeader, permissions }: IProps) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Invoice Number',
        accessor: 'slug',
        Cell: ItemSlug,
      },
      {
        Header: 'Rent Month',
        accessor: 'created_at',
        Cell: ItemDate,
      },
      {
        Header: 'Rent Cycle',
        accessor: 'rent_cycle',
      },
      {
        Header: 'Rent Amount',
        accessor: 'rent_amount',
        Cell: ItemPrice,
      },
      {
        Header: 'Due date',
        accessor: 'due_date',
        Cell: ItemDate,
      },
      {
        Header: 'Late fee',
        accessor: 'p_l_fee',
        Cell: ItemPrice,
      },
      {
        Header: 'Status',
        accessor: 'status_with_obj',
        Cell: ItemStatus,
      },
    ],
    []
  );

  const { redirect } = useRedirect();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageNumber = searchParams.get('page');
    searchParams.set('page', pageNumber ?? '1');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const props = useMemo(
    () => ({
      clickable: true,
      columns: columns,
      pageHeader: pageHeader,
      newRecordButtonPermission: permissions,
      onRowClick: (row: Row<object>) => {
        if (row.original) {
          const invoice = row.original;
          if ('id' in invoice) {
            redirect(`${invoice.id}/details`);
          }
        }
      },
    }),
    [columns, pageHeader, permissions, redirect]
  );

  return (
    <RentalInvoiceWrapper wrapperFor={wrapperFor}>
      {(filterValue, component) => (
        <TableWithPagination
          {...props}
          useData={wrapperFor === 'ADMIN' ? useGetInvoicesQuery : useGetTenantInvoicesQuery}
          filterMenu={component}
          filterValues={{
            ...filterValue,
            unit: filterValue.unit as string,
            parent_property: filterValue.parent_property as string,
          }}
        />
      )}
    </RentalInvoiceWrapper>
  );
};

export default RentalInvoices;
