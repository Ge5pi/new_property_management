import { Fragment, SetStateAction, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Calendar as EventCalendar, dayjsLocalizer } from 'react-big-calendar';
import { Button, Card, CloseButton, Col, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';

import { searchAPI } from 'api/core';
import { useGetCalendarEventsQuery } from 'services/api/calendar';
import useResponse from 'services/api/hooks/useResponse';

import Skeleton from 'components/skeleton';

import { FilterIcon, GoogleIcon } from 'core-ui/icons';
import NewEventModal from 'core-ui/popups/new-event/new-event';
import ViewEventModal from 'core-ui/popups/view-event/view-event';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { useWindowSize } from 'hooks/useWindowSize';

import { dayJS, parseTime } from 'utils/functions';

import { CalendarFilterModule, CalendarReturnProps } from 'interfaces/ICalendar';
import { IIDName } from 'interfaces/IGeneral';

import CalendarToolbar from './calendar-toolbar';

const localizer = dayjsLocalizer(dayJS);
const PAGE_SIZE = 10;

interface ICalendarFilter {
  module?: CalendarFilterModule;
  label_id?: Array<string>;
}

const Calendar = () => {
  const [width] = useWindowSize();

  const [filterState, setFilterState] = useState('CLEARED');
  const [calendarFilters, setCalendarFilters] = useState<ICalendarFilter>({
    module: '',
    label_id: [],
  });

  const [items, setItems] = useState<Array<Option>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setNextState] = useState(false);
  const [index, setIndex] = useState(2);
  const [showFilter, setFilterShow] = useState(false);

  const handleFilterVisibility = () => setFilterShow(prev => !prev);

  const listRef = useRef<HTMLDivElement | null>(null);
  const cWrapperRef = useRef<HTMLDivElement | null>(null);
  const preFetch = useRef(true);

  const [filterDivHeight, setFilterDivHeight] = useState(550);
  useEffect(() => {
    if (width && cWrapperRef.current) {
      setFilterDivHeight(cWrapperRef.current.clientHeight - 99);
    }
  }, [width]);

  const fetchData = useCallback(async () => {
    if (isLoading || !hasNext) return;

    setIsLoading(true);
    searchAPI('system_preferences.Label', '', index, PAGE_SIZE)
      .then(response => {
        setItems(prev => mergeOptions(prev, response.data.results));
        setNextState(Boolean(response.data.next));
        if (response.data.next) {
          setIndex(prev => prev + 1);
        }
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  }, [index, isLoading, hasNext]);

  useEffect(() => {
    if (preFetch.current) {
      preFetch.current = false;
      setIsLoading(true);
      searchAPI('system_preferences.Label', '', 1, PAGE_SIZE)
        .then(response => {
          setItems(response.data.results);
          setNextState(Boolean(response.data.next));
        })
        .catch(error => console.log(error))
        .finally(() => setIsLoading(false));
    }
  }, []);

  useEffect(() => {
    const devElem = listRef.current;
    const handleScroll = (ev: globalThis.Event) => {
      const { scrollHeight, scrollTop, clientHeight } = ev.target as HTMLDivElement;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        fetchData();
      }
    };

    if (devElem) {
      devElem.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (devElem) {
        devElem.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchData]);

  useEffect(() => {
    if (fetchData) {
      const divElem = listRef.current;
      if (divElem) {
        const { scrollHeight, scrollTop, clientHeight } = divElem as HTMLDivElement;
        if (scrollHeight - scrollTop - clientHeight < 300) {
          fetchData();
        }
      }
    }
  }, [fetchData]);

  const handleFilterStatusChange = useCallback((status: 'CLEARED' | 'FILTER') => {
    setFilterState(status);
  }, []);

  return (
    <div>
      <Row className="gx-0 align-items-center justify-content-between">
        <Col sm xs="auto">
          <h1 className="fw-bold h4 mt-1 text-capitalize">Events Calendar</h1>
        </Col>
        <Col sm="auto" xs={12}>
          <Row className="g-2">
            <Col xs="auto">
              <Button variant="secondary" className="d-md-none py-2 text-primary" onClick={handleFilterVisibility}>
                <FilterIcon />
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary" className="d-md-none py-2 btn-google">
                <GoogleIcon />
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                className="px-4"
                variant="primary"
                onClick={() => {
                  SweetAlert({
                    size: 'lg',
                    html: <NewEventModal />,
                  }).fire({
                    allowOutsideClick: () => !SwalExtended.isLoading(),
                  });
                }}
              >
                Create new event
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <CalendarToolbar>
        {({ onTodayClick, ...toolbarProps }) => (
          <Row className="gx-0">
            <Col xxl={2} xl={4} md={3}>
              <CalendarFilter
                ref={listRef}
                filterDivHeight={filterDivHeight}
                onTodayClick={onTodayClick}
                calendarFilters={calendarFilters}
                handleClose={handleFilterVisibility}
                onFilterStatusChange={handleFilterStatusChange}
                onFilterChange={setCalendarFilters}
                isLoading={isLoading}
                show={showFilter}
                items={items}
              />
            </Col>
            <Col md xs={12}>
              <div
                className={clsx({ 'ratio ratio-4x3': width >= 768 })}
                style={{ height: width <= 768 ? '683px' : undefined }}
                ref={cWrapperRef}
              >
                <CalendarRenderer {...toolbarProps} filter={filterState === 'FILTER' ? calendarFilters : {}} />
              </div>
            </Col>
          </Row>
        )}
      </CalendarToolbar>
    </div>
  );
};

export default Calendar;

interface ICalendarRenderProps extends Omit<CalendarReturnProps, 'onTodayClick'> {
  filter?: ICalendarFilter;
}

const CalendarRenderer = ({ date, setDate, setView, view, filter }: ICalendarRenderProps) => {
  const month = useMemo(() => {
    const m = dayJS(date).month() + 1;
    if (m <= 9) return `0${m}`;
    return m.toString();
  }, [date]);

  const {
    data: events = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetCalendarEventsQuery({
    date_month: month,
    module: filter ? filter.module : undefined,
    label_id: filter ? (filter.label_id ?? []).join(',') : undefined,
    date_year: dayJS(date).year().toString(),
  });

  useResponse({ isError, error });

  return (
    <EventCalendar
      toolbar={false}
      events={events}
      localizer={localizer}
      className={clsx({ filtering: isLoading || isFetching })}
      onSelectEvent={event => {
        SweetAlert({
          size: 'lg',
          html: <ViewEventModal event={event} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      selectable
      onSelectSlot={slot => {
        if (slot.action === 'select') {
          Notify.show({ title: 'range selection is not available', type: 'info' });
          return;
        }
        SweetAlert({
          size: 'lg',
          html: <NewEventModal event={{ date: dayJS(slot.start).format('YYYY-MM-DD') }} />,
        }).fire({
          allowOutsideClick: () => !SwalExtended.isLoading(),
        });
      }}
      allDayAccessor="allDay"
      titleAccessor="title"
      startAccessor="start"
      endAccessor="end"
      date={date}
      view={view}
      onView={setView}
      onNavigate={setDate}
      components={{
        month: {
          event: ({ event }) => (
            <Stack direction="horizontal" gap={1} className="justify-content-between">
              <div className="text-truncate fw-medium">{event.title}</div>
              <div style={{ fontSize: '0.575rem' }}>{parseTime(event.start.toString())}</div>
            </Stack>
          ),
        },
        week: {
          event: ({ event }) => (
            <Stack direction="horizontal" gap={1} className="justify-content-between">
              <div className="text-truncate fw-medium">{event.title}</div>
            </Stack>
          ),
          header: ({ date }) => (
            <div className="text-center">
              <div className="fw-medium text-muted">{dayJS(date).format('dddd').substring(0, 3)}</div>
              <div className="text-primary fw-bold">{dayJS(date).date()}</div>
            </div>
          ),
        },
        day: {
          event: ({ event }) => (
            <Stack direction="horizontal" gap={1} className="justify-content-between">
              <div className="text-truncate fw-medium">{event.title}</div>
            </Stack>
          ),
          header: ({ date }) => (
            <div className="d-flex flex-column align-content-start flex-wrap">
              <div className="text-center">
                <div className="fw-medium text-muted">{dayJS(date).format('dddd')}</div>
                <div className="text-primary fw-bold">{dayJS(date).date()}</div>
              </div>
            </div>
          ),
        },
      }}
    />
  );
};

interface CalendarFilterProps {
  filterDivHeight: number;
  calendarFilters: ICalendarFilter;
  onTodayClick: () => void;
  onFilterChange: (value: SetStateAction<ICalendarFilter>) => void;
  onFilterStatusChange: (value: 'CLEARED' | 'FILTER') => void;
  handleClose?: () => void;
  items: Option[];
  isLoading: boolean;
  show?: boolean;
}

const CalendarFilter = forwardRef((props: CalendarFilterProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const {
    filterDivHeight,
    onTodayClick,
    onFilterChange,
    onFilterStatusChange,
    calendarFilters,
    isLoading,
    handleClose,
    items,
    show,
  } = props;

  const [width] = useWindowSize();
  useEffect(() => {
    if (width < 992 && show) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [width, show]);

  const handleLabelIDsChange = (checked: boolean, value: string) => {
    if (checked) {
      onFilterChange(prev => ({
        ...prev,
        label_id: (prev.label_id ?? []).concat([value].filter(item => (prev.label_id ?? []).indexOf(item) < 0)),
      }));
      return;
    }
    onFilterChange(prev => ({
      ...prev,
      label_id: (prev.label_id ?? []).filter(function (x) {
        return [value].indexOf(x) < 0;
      }),
    }));
  };

  return (
    <div>
      <div className={clsx('page-section border', { 'summary-details': width < 768 }, { show: show && width < 768 })}>
        <Stack className="align-items-stretch justify-content-between g-0">
          <div className="flex-grow-0">
            <Card.Header className="bg-white p-3">
              <Stack direction="horizontal" gap={2} className="justify-content-between">
                <div className="btn btn-secondary w-100 text-start border-0" onClick={onTodayClick}>
                  <div className="fs-6 text-primary">Today</div>
                  <div className="fs-5 fw-bold text-info">{dayJS().format('Do, MMMM')}</div>
                </div>
                {width < 992 && show && <CloseButton onClick={handleClose} />}
              </Stack>
            </Card.Header>
          </div>
          <div className="flex-fill overflow-auto">
            <Card className="overflow-auto" ref={ref} style={{ height: filterDivHeight }}>
              <Card.Header className="bg-white py-3">
                <div className="w-100 text-start" onClick={onTodayClick}>
                  <div className="fs-6 text-primary d-inline-flex align-items-center gap-2 fw-bold">Filter by</div>
                  <Stack direction="horizontal" className="flex-wrap" gap={2}>
                    {['Property', 'Unit', 'Owner', 'Tenant'].map(id => (
                      <Fragment key={id}>
                        <Button
                          onClick={() => onFilterChange(prev => ({ ...prev, module: id as CalendarFilterModule }))}
                          variant="link"
                          className={clsx(
                            'link-primary p-0 small text-decoration-none',
                            calendarFilters && id === calendarFilters.module ? 'fw-bold text-primary' : 'text-muted'
                          )}
                        >
                          {id}
                        </Button>
                        <div className="vr" />
                      </Fragment>
                    ))}
                  </Stack>
                </div>
              </Card.Header>
              <Card.Body className="py-3">
                <RenderInformation
                  title="Labels"
                  description="Choose the label you want to be visible in calendar"
                  titleClass="fw-bold"
                />
                <div className="list-group list-group-flush">
                  {items.map(data => (
                    <label
                      key={(data as IIDName).id}
                      className="list-group-item d-flex align-items-center px-2"
                      title={(data as IIDName).name}
                      htmlFor={`FilterLabelCheck${(data as IIDName).id}`}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input mt-0 me-1"
                        id={`FilterLabelCheck${(data as IIDName).id}`}
                        checked={(calendarFilters.label_id ?? []).includes(Number((data as IIDName).id).toString())}
                        onChange={ev => handleLabelIDsChange(ev.target.checked, ev.target.value)}
                        value={(data as IIDName).id}
                      />
                      <span className="d-inline-block w-100 text-truncate fw-medium ps-1">
                        {(data as IIDName).name}
                      </span>
                    </label>
                  ))}
                  {isLoading &&
                    ['LOADING-1', 'LOADING-2', 'LOADING-3'].map(l => <Skeleton key={l} xs={12} className="my-3" />)}
                </div>
                <Card.Footer className="sticky-bottom text-end py-2 px-0 mt-4 mb-1 bg-white">
                  <Button
                    size="sm"
                    onClick={() => {
                      onFilterStatusChange('CLEARED');
                      onFilterChange({ label_id: [], module: '' });
                    }}
                    variant="secondary"
                    className="mx-1"
                    disabled={
                      !calendarFilters ||
                      ((!calendarFilters.label_id || calendarFilters.label_id.length <= 0) && !calendarFilters.module)
                    }
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onFilterStatusChange('FILTER')}
                    disabled={
                      !calendarFilters ||
                      ((!calendarFilters.label_id || calendarFilters.label_id.length <= 0) && !calendarFilters.module)
                    }
                  >
                    Filter
                  </Button>
                </Card.Footer>
              </Card.Body>
            </Card>
          </div>
        </Stack>
      </div>
      {handleClose && show && width < 992 && (
        <div className="summary-detail-bg bg-dark bg-opacity-10" onClick={handleClose}></div>
      )}
    </div>
  );
});

CalendarFilter.displayName = 'CalendarFilter';

const mergeOptions = (arr1: Option[], arr2: Option[]) => {
  return [...arr1, ...arr2].reduce((accumulator: Option[], current) => {
    const duplicate = accumulator.find(item => {
      return JSON.stringify(item) === JSON.stringify(current);
    });
    if (!duplicate) {
      return accumulator.concat([current]);
    } else {
      return accumulator;
    }
  }, []);
};
