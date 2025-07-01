import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Views } from 'react-big-calendar';
import { Button, ButtonGroup, Col, Row, Stack } from 'react-bootstrap';

import { ChevronLeftIcon, ChevronRightIcon, GoogleIcon } from 'core-ui/icons';

import { useWindowSize } from 'hooks/useWindowSize';

import { VIEW_OPTIONS } from 'constants/calendar';
import { dayJS } from 'utils/functions';

import { CalendarReturnProps, CalendarViewType } from 'interfaces/ICalendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import './calendar.styles.css';

interface IProps {
  children: (props: CalendarReturnProps) => ReactElement;
}

const CalendarToolbar = ({ children }: IProps) => {
  const [date, setDate] = useState<Date>(dayJS().toDate());
  const [view, setView] = useState<CalendarViewType>(Views.MONTH);

  const handleViewChange = useCallback((v: CalendarViewType) => setView(v), []);
  const handleDateChange = useCallback((d: Date) => setDate(d), []);

  const [width] = useWindowSize();
  useEffect(() => {
    if (width > 0 && width <= 600) setView('day');
    else setView('month');
  }, [width]);

  const onPrevClick = useCallback(() => {
    if (view === Views.DAY) {
      setDate(dayJS(date).subtract(1, 'd').toDate());
    } else if (view === Views.WEEK) {
      setDate(dayJS(date).subtract(1, 'w').toDate());
    } else {
      setDate(dayJS(date).subtract(1, 'M').toDate());
    }
  }, [view, date]);

  const onNextClick = useCallback(() => {
    if (view === Views.DAY) {
      setDate(dayJS(date).add(1, 'd').toDate());
    } else if (view === Views.WEEK) {
      setDate(dayJS(date).add(1, 'w').toDate());
    } else {
      setDate(dayJS(date).add(1, 'M').toDate());
    }
  }, [view, date]);

  const dateText = useMemo(() => {
    if (view === Views.DAY) return dayJS(date).format('dddd, MMMM DD');
    if (view === Views.WEEK) {
      const from = dayJS(date).startOf('week');
      const to = dayJS(date).endOf('week');
      return `${from.format('MMMM DD')} to ${to.format('MMMM DD')}`;
    }
    if (view === Views.MONTH) {
      return dayJS(date).format('MMMM YYYY');
    }
  }, [view, date]);

  const onTodayClick = useCallback(() => setDate(dayJS().toDate()), []);

  return (
    <div>
      <Row className="gx-0 justify-content-between align-items-center my-3">
        <Col md xs="auto">
          <Row>
            <Col xs="auto" className="d-md-block d-none">
              <Button variant="outline-secondary" className="btn-google">
                <GoogleIcon /> <span className="text-muted d-sm-inline d-none">Sync with Google</span>
              </Button>
            </Col>
            <Col
              xxl={{ offset: 2, span: true }}
              lg={{ offset: 2, span: true }}
              md={{ offset: 3, span: true }}
              xs="auto"
            >
              <div>
                <Stack direction="horizontal" gap={1} className="justify-content-sm-center me-xxl-5">
                  <Button
                    size="sm"
                    variant="light"
                    className="btn-next-prev p-0 d-inline-flex align-items-center justify-content-center"
                    onClick={onPrevClick}
                  >
                    <ChevronLeftIcon />
                  </Button>

                  <span className="fs-6 mx-2 fw-bold text-truncate">{dateText}</span>

                  <Button
                    size="sm"
                    variant="light"
                    className="btn-next-prev p-0 d-inline-flex align-items-center justify-content-center"
                    onClick={onNextClick}
                  >
                    <ChevronRightIcon />
                  </Button>
                </Stack>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md="auto" xs={6} className="text-end">
          <ButtonGroup size="sm">
            {VIEW_OPTIONS.map(({ id, label }) => (
              <Button key={id} onClick={() => setView(id)} variant={id === view ? 'primary' : 'secondary'}>
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Row>
      <div>
        {children({
          view,
          setView: handleViewChange,
          setDate: handleDateChange,
          onTodayClick,
          date,
        })}
      </div>
    </div>
  );
};

export default CalendarToolbar;
