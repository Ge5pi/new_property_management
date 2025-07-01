import { Card } from 'react-bootstrap';

function MyBalance() {
  return (
    <Card className="page-section border min-h-100">
      <Card.Header className="p-0 bg-transparent px-4 py-3 border">
        <h2 className="fw-bold fs-5 m-0">My Balance</h2>
      </Card.Header>
      <Card.Body className="px-4">
        <p className="fs-3 fw-bold text-success text-end m-0">1,5045 $</p>
        <p className="small text-gray text-end">Amount</p>

        <hr className="border-primary border-opacity-25" />

        <p className="fw-medium text-muted small m-0">Recent Payment</p>
        <p className="small m-0 fw-medium text-primary">Maintenance</p>
        <div className="d-flex justify-content-between">
          <p className="small text-gray m-0">12/05/2022</p>
          <p className="small text-success m-0 fw-bold">500 $</p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default MyBalance;
