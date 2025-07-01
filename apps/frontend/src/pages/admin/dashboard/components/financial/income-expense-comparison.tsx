import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { useWindowSize } from 'hooks/useWindowSize';

const data = [
  {
    name: 'JAN',
    income: 4000,
    expense: 2400,
  },
  {
    name: 'FEB',
    income: 3000,
    expense: 1398,
  },
  {
    name: 'MAR',
    income: 2000,
    expense: 9800,
  },
  {
    name: 'APR',
    income: 2780,
    expense: 3908,
  },
  {
    name: 'MAY',
    income: 1890,
    expense: 4800,
  },
  {
    name: 'JUN',
    income: 2390,
    expense: 3800,
  },
  {
    name: 'JUL',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'AUG',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'SEP',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'OCT',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'NOV',
    income: 3490,
    expense: 4300,
  },
  {
    name: 'DEC',
    income: 3490,
    expense: 4300,
  },
];

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="page-section bg-white border-0 small px-4 py-3">
        <p className="text-capitalize mb-1">
          <span className="d-inline-block me-2" style={{ width: 13, height: 7, background: payload[0].color }} />
          <span>{payload[0].dataKey}</span>
          <span className="fw-bold ms-2">{payload[0].value}</span>
        </p>
        <p className="text-capitalize m-0">
          <span className="d-inline-block me-2" style={{ width: 13, height: 7, background: payload[1].color }} />

          <span>{payload[1].dataKey}</span>
          <span className="fw-bold ms-2">{payload[1].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

function IncomeExpenseComparison() {
  const [windowWidth] = useWindowSize();

  const isTablet = windowWidth && windowWidth < 992;

  return (
    <div className="mb-4">
      <div className="page-section p-4">
        <p className="fw-bold mb-4">Income - Expense Comparison</p>

        <ResponsiveContainer width="100%" height={isTablet ? 220 : 300}>
          <LineChart
            width={500}
            height={350}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" fontSize={14} fontWeight={600} />
            <YAxis fontSize={14} fontWeight={500} />
            <Tooltip cursor={{ stroke: '#000000', strokeWidth: 2 }} content={<CustomTooltip />} />
            <Line type="linear" dataKey="income" stroke="#189915" strokeWidth={2} />
            <Line type="linear" dataKey="expense" stroke="#2360D4" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncomeExpenseComparison;
