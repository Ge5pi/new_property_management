import { Fragment } from 'react';
import { Stack } from 'react-bootstrap';

import { Cell, Pie, PieChart as PieChartComponent } from 'recharts';

import { IPieChartProps } from 'interfaces/IDashboard';

function PieChart({ chartData = [], legendWidth = 13, legendHeight = 7 }: IPieChartProps) {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) - 10;
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        key={index}
        textAnchor={'center'}
        dominantBaseline="central"
        fill={chartData[index].textColor}
        fontWeight={700}
        fontSize={19}
      >
        {`${(percent * 100).toFixed(0)}`}
      </text>
    );
  };

  return (
    <Fragment>
      <PieChartComponent className="mx-auto" width={200} height={200}>
        <Pie
          data={chartData}
          innerRadius={50}
          outerRadius={100}
          cx="50%"
          cy="50%"
          labelLine={false}
          fill="#F3F3F3"
          paddingAngle={0}
          dataKey="value"
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => {
            return <Cell key={`cell-${index}-${entry.name}`} fill={entry.color} />;
          })}
        </Pie>
        <text x={100} y={100} textAnchor="middle" dominantBaseline="middle" fontWeight={700} fontSize={19}>
          100
        </text>
      </PieChartComponent>

      <Stack direction="horizontal" className="flex-wrap justify-content-center gap-4 gap-md-2 gap-lg-4 mt-5">
        {chartData.map((entry, ix) => {
          return (
            <Stack direction="horizontal" key={ix} className="align-items-center mb-2 gap-2">
              <div
                className="d-inline-block"
                style={{ backgroundColor: entry.color, width: legendWidth, height: legendHeight }}
              />
              <div className="d-inline-block fw-medium">{entry.name}</div>
            </Stack>
          );
        })}
      </Stack>
    </Fragment>
  );
}

export default PieChart;
