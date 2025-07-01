import { Table } from 'react-bootstrap';

import { IAuditLogs } from 'interfaces/IInputs';

import './log.styles.css';

interface IProps {
  logs: Array<Partial<IAuditLogs>>;
}

const Log = ({ logs }: IProps) => {
  return (
    <div className="table-wrapper">
      <Table responsive className="table-fit log-table">
        <thead className="head-opacity-0">
          <tr>
            <th style={{ minWidth: 400 }}>Description</th>
            <th style={{ minWidth: 100 }}>Date</th>
            <th style={{ minWidth: 100 }}>Time</th>
            <th style={{ minWidth: 200 }}>By</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, inx) => {
            return (
              <tr key={inx}>
                <td className="px-3 py-2 text-primary">{log.text}</td>
                <td className="px-3 py-2 text-muted border-end">{log.created_at}</td>
                <td className="px-3 py-2 text-muted border-end">{log.created_at}</td>
                <td className="px-3 py-2 text-muted">By: {log.created_by?.username}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Log;
