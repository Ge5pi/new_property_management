import { useMemo } from 'react';

import { NavDropdown } from 'components/nav-dropdown';

import { AddIcon, HelpIcon, ReportIcon } from 'core-ui/icons';
import { IncreaseRent } from 'core-ui/popups/increase-rent';
import { PropertyModal } from 'core-ui/popups/properties';
import { RentalItemModal } from 'core-ui/popups/rentable-items';
import { UnitsModal } from 'core-ui/popups/units';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

import { INavDropdown } from 'interfaces/INav';

function AdminNavbar() {
  const { redirect } = useRedirect();
  const navItems = useMemo(
    (): Array<INavDropdown> => [
      {
        Icon: <HelpIcon />,
        DropdownTitle: 'Help Tasks',
        items: [
          {
            innerHtml: 'Post un-post',
          },
          {
            innerHtml: 'Marketing campaign',
          },
          {
            innerHtml: 'Premium leads',
          },
        ],
      },
      {
        Icon: <ReportIcon />,
        DropdownTitle: 'Reports',
        items: [
          {
            innerHtml: 'Vacancies detail',
          },
          {
            innerHtml: 'Rental application',
          },
          {
            innerHtml: 'Guest card',
          },
          {
            innerHtml: 'Owner leasing',
          },
          {
            innerHtml: 'Premium leads',
          },
        ],
      },
      {
        Icon: <AddIcon />,
        DropdownTitle: 'Create New',
        items: [
          {
            innerHtml: 'Property',
            permission: PERMISSIONS.PROPERTY,
            onClick: () => {
              SweetAlert({
                size: 'xl',
                html: <PropertyModal currentRoute={'property'} />,
              })
                .fire({
                  allowOutsideClick: () => !SwalExtended.isLoading(),
                })
                .then(result => {
                  if (result.isConfirmed && result.value) {
                    redirect(`/admin/properties/${result.value}/details`, false, 'admin');
                  }
                });
            },
          },
          {
            innerHtml: 'Unit',
            permission: PERMISSIONS.PROPERTY,
            onClick: () => {
              SweetAlert({
                size: 'xl',
                html: <UnitsModal />,
              })
                .fire({
                  allowOutsideClick: () => !SwalExtended.isLoading(),
                })
                .then(result => {
                  if (result.isConfirmed && result.value) {
                    redirect(
                      `/admin/properties/${result.value.property}/units/details/${result.value.unit}`,
                      false,
                      'admin'
                    );
                  }
                });
            },
          },
          {
            innerHtml: 'Rent Increase',
            permission: PERMISSIONS.PROPERTY,
            onClick: () => {
              SweetAlert({
                html: <IncreaseRent />,
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            },
          },
          {
            innerHtml: 'Rentable items',
            permission: PERMISSIONS.PROPERTY,
            onClick: () => {
              SweetAlert({
                size: 'lg',
                html: <RentalItemModal />,
              }).fire({
                allowOutsideClick: () => !SwalExtended.isLoading(),
              });
            },
          },
        ],
      },
    ],
    [redirect]
  );

  return (
    <div className="sub-navbar-actions">
      {navItems.map((item, inx) => (
        <NavDropdown key={inx} Icon={item.Icon} DropdownTitle={item.DropdownTitle} items={item.items} />
      ))}
    </div>
  );
}

export default AdminNavbar;
