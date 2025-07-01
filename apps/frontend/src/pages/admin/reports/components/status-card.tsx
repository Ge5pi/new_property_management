import { Fragment, useMemo } from 'react';
import { Card, Stack } from 'react-bootstrap';

import { Cell, Pie, PieChart } from 'recharts';

interface IStatusCardProps {
  data: Array<{ name: string; value: number; color: string }>;
  total: number;
  emptyColor?: string;
}

const StatusCard = ({ data, total, emptyColor }: IStatusCardProps) => {
  const chartData = useMemo(() => {
    const remainingValue = total - data.reduce((acc, item) => acc + item.value, 0);

    const vacantItem = { name: 'Remaining', value: remainingValue, color: emptyColor ?? '#3360D4' };

    return [vacantItem, ...data];
  }, [data, emptyColor, total]);

  return (
    <Card className="border-0 p-0 page-section my-3">
      <Card.Body>
        <Stack direction="horizontal" gap={3}>
          <PieChart width={100} height={100}>
            <Pie data={chartData} innerRadius={36} outerRadius={50} fill="#F3F3F3" paddingAngle={0} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>

          <Stack direction="horizontal" gap={3} className="align-items-center fs-6 ms-3">
            <div>
              <p className="m-0">Total</p>
              <p className="fw-bold m-0">{total}</p>
            </div>

            <div className="border-end border-2 mx-3" style={{ height: 48 }} />
            {data.map(item => (
              <Fragment key={item.name}>
                <div className="text-primary">
                  <div>
                    <span
                      className="d-inline-block fs-6 me-2"
                      style={{ width: '10px', height: '10px', backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="fw-bold">{item.value}</span>
                </div>
                <div className="border-end border-2 mx-3 last-border-0" style={{ height: 48 }} />
              </Fragment>
            ))}
          </Stack>
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default StatusCard;
