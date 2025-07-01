import { useEffect, useState } from 'react';
import { Pagination, Stack } from 'react-bootstrap';

import { useWindowSize } from 'hooks/useWindowSize';

import './customize-pagination.styles.css';

interface IProps {
  handlePagination: (page: number) => void;
  size?: 'sm' | 'lg' | undefined;
  pageLimit?: number;
  totalPageCount: number;
  current?: number;
}

const CustomizePagination = ({ handlePagination, current = 1, totalPageCount, size }: IProps) => {
  const [width] = useWindowSize();
  const [dimensions, setDimensions] = useState<'lg' | 'sm' | undefined>();

  useEffect(() => {
    if (width <= 480) {
      setDimensions('sm');
    } else {
      if (size) setDimensions(size);
      else setDimensions(undefined);
    }
  }, [size, width]);

  const goToNextPage = () => {
    if (!totalPageCount) return;

    const index = current + 1;
    if (index > totalPageCount) {
      return;
    }

    handlePagination(index);
  };

  const goToPreviousPage = () => {
    const index = current - 1;
    if (index <= 0) {
      return;
    }

    handlePagination(index);
  };

  const updatePageNumber = (page: number) => {
    if (current === page) return;
    handlePagination(page);
  };

  const getPaginationGroup = () => {
    if (!totalPageCount) return [];

    const limit = width <= 480 ? 3 : 5;
    const validatePageLimit = limit > totalPageCount ? totalPageCount : limit;
    const half = Math.floor(validatePageLimit / 2);
    let to = validatePageLimit;

    if (current + half >= totalPageCount) {
      to = totalPageCount;
    } else if (current > half) {
      to = current + half;
    }

    const from = to - validatePageLimit;
    return Array.from({ length: validatePageLimit }, (_, i) => i + 1 + from);
  };

  if (!totalPageCount || totalPageCount === 1) {
    return <></>;
  }

  return (
    <Stack direction="horizontal" className="flex-wrap justify-content-between">
      <p className="small m-0">
        <span className="fw-bold">Showing:</span> {current} of {totalPageCount}
      </p>
      <div className="pagination-container">
        <Pagination size={dimensions} className="m-0">
          <Pagination.Prev onClick={goToPreviousPage} disabled={current === 1} />
          {getPaginationGroup().map((item, index) => (
            <Pagination.Item key={index} active={current === item} onClick={() => updatePageNumber(item)}>
              {item}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={goToNextPage} disabled={current === totalPageCount} />
        </Pagination>
      </div>
    </Stack>
  );
};

export default CustomizePagination;
