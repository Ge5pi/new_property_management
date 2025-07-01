import { useCallback } from 'react';
import { Card, Col, Form, FormCheckProps, Row } from 'react-bootstrap';

import { compare2Arrays } from 'utils/functions';

import { IIDName } from 'interfaces/IGeneral';

import './access-management.styles.css';

interface IAccessManagementProps {
  onGroupSelect: (permission: Array<number>) => void;
  currentGroups: Array<number>;
  allGroups: IIDName[];
}

const AccessManagement = ({ currentGroups, allGroups, onGroupSelect }: IAccessManagementProps) => {
  const handleCheckboxChange = (value: Array<number>, checked?: boolean) => {
    if (checked) {
      onGroupSelect(currentGroups.concat(value.filter(item => currentGroups.indexOf(item) < 0)));
      return;
    }

    onGroupSelect(
      currentGroups.filter(function (x) {
        return value.indexOf(x) < 0;
      })
    );
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Row className="gx-3 gy-3">
          {allGroups.length > 0 && (
            <Col xs={12}>
              <Checkbox
                label={<span className="fw-medium text-capitalize">Select All</span>}
                checked={compare2Arrays(
                  currentGroups,
                  allGroups.map(g => g.id as number)
                )}
                className="mb-3"
                name={`check-all`}
                controlId={`check-all`}
                onChange={ev =>
                  handleCheckboxChange(
                    allGroups.map(g => g.id as number),
                    ev.target.checked
                  )
                }
              />
            </Col>
          )}
          {allGroups
            .map(group => ({
              ...group,
              selected: Boolean(currentGroups.find(p => p === Number(group.id))),
            }))
            .map(group => (
              <Col xxl={4} lg={6} md={4} sm={6} key={group.id}>
                <Checkbox
                  label={
                    <span className="fw-medium text-capitalize">{group.name.toLowerCase().replaceAll('_', ' ')}</span>
                  }
                  checked={group.selected}
                  name={`${group.name}-${group.id}`}
                  controlId={`${group.name}-${group.id}`}
                  onChange={ev => handleCheckboxChange([group.id as number], ev.target.checked)}
                />
              </Col>
            ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AccessManagement;

interface ICheckboxProps extends Omit<FormCheckProps, 'type'> {
  isIndeterminate?: boolean;
  controlId: string;
}

const Checkbox = ({ isIndeterminate, controlId, ...rest }: ICheckboxProps) => {
  const checkboxRef = useCallback(
    (elem?: HTMLInputElement) => {
      if (elem) {
        elem.indeterminate = Boolean(isIndeterminate);
      }
    },
    [isIndeterminate]
  );

  return (
    <Form.Group controlId={controlId}>
      <Form.Check {...rest} type="checkbox" ref={checkboxRef} />
    </Form.Group>
  );
};
