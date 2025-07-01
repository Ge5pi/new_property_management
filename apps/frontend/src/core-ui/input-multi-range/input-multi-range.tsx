import { memo, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { FormRangeProps } from 'react-bootstrap/esm/FormRange';

import { clsx } from 'clsx';

import { useWindowSize } from 'hooks/useWindowSize';

import { formatPricing, isNegativeNumber } from 'utils/functions';

import './input-multi-range.styles.css';

interface MultiRangeInputProps
  extends Omit<
    FormRangeProps,
    'className' | 'id' | 'step' | 'name' | 'style' | 'min' | 'max' | 'onChange' | 'onBlur' | 'value'
  > {
  minName: string;
  maxName: string;
  min: number;
  max: number;

  minValue?: number;
  maxValue?: number;
  containerClass?: string;
  minLabelClass?: string;
  maxLabelClass?: string;
  onRangeChange?: (min: number, max: number) => void;
}

const thumbsize = 14;
const InputMultiRange = ({
  max,
  min,
  maxName,
  minName,
  minValue,
  maxValue,
  onRangeChange,
  maxLabelClass,
  minLabelClass,
  containerClass,
  ...rest
}: MultiRangeInputProps) => {
  const [wWidth] = useWindowSize();
  const [avg, setAvg] = useState((min + max) / 2);
  const [minVal, setMinVal] = useState(() => (minValue && minValue >= min ? minValue : avg));

  const [maxVal, setMaxVal] = useState(() => (maxValue && maxValue <= max ? maxValue : avg));

  const width = wWidth >= 400 ? 300 : wWidth >= 300 ? 225 : 200;
  const minWidth = thumbsize + ((avg - min) / (max - min)) * (width - 2 * thumbsize);
  const minPercent = ((minVal - min) / (avg - min)) * 100;
  const maxPercent = ((maxVal - avg) / (max - avg)) * 100;
  const styles = {
    min: {
      left: 0,
      width: minWidth,
      '--minRangePercent': `${minPercent}%`,
    },
    max: {
      left: minWidth,
      width: thumbsize + ((max - avg) / (max - min)) * (width - 2 * thumbsize),
      '--maxRangePercent': `${maxPercent}%`,
    },
  };

  const minLabel = Number(((minVal - min) * 100) / (max - min));
  const maxLabel = Number(((maxVal - min) * 100) / (max - min));

  useEffect(() => {
    setAvg((minVal + maxVal) / 2);
  }, [minVal, maxVal]);

  useEffect(() => {
    setMinVal(prev => (minValue && minValue !== prev ? minValue : prev));

    setMaxVal(prev => (maxValue && maxValue !== prev ? maxValue : prev));
  }, [minValue, maxValue]);

  const handleRangeChange = (minR?: number, maxR?: number) => {
    const mnVR = Math.round(minR ? minR : minVal);
    const mxVR = Math.round(maxR ? maxR : maxVal);
    setMinVal(mnVR);
    setMaxVal(mxVR);
  };

  const updateRangeOnEnd = () => {
    if (onRangeChange) {
      onRangeChange(minVal, maxVal);
    }
  };

  return (
    <div
      style={{ width, minWidth }}
      className={clsx('min-max-slider', containerClass)}
      data-legendnum="2"
      data-rangemin={min}
      data-rangemax={max}
      data-thumbsize={thumbsize}
      data-rangewidth={width}
    >
      <div className="position-relative slider-wrapper">
        <Form.Label htmlFor={`${minName}RangeSelect`}>Min Value</Form.Label>
        <Form.Range
          {...rest}
          id={`${minName}RangeSelect`}
          name={minName}
          className="min"
          style={styles.min}
          min={min}
          max={avg}
          value={minVal}
          step={1}
          onChange={({ target }) => handleRangeChange(Number(target.value))}
          onMouseUp={updateRangeOnEnd}
        />
        <span
          className={clsx(
            'fw-medium',
            minLabelClass,
            { '-ive': minLabelClass && minLabelClass.includes('price-symbol') && isNegativeNumber(minVal) },
            'translate-middle-x mt-2 top-0 position-absolute text-primary',
            {
              small: width < 400,
            }
          )}
          style={{
            left: `calc(${minLabel}% + (${thumbsize - 5 - minLabel * 0.15}px))`,
          }}
        >
          {minLabelClass && minLabelClass.includes('price-symbol') ? formatPricing(minVal) : minVal}
        </span>
      </div>
      <div className="position-relative slider-wrapper">
        <Form.Label htmlFor={`${maxName}RangeSelect`}>Max Value</Form.Label>
        <Form.Range
          {...rest}
          id={`${maxName}RangeSelect`}
          name={maxName}
          className="max"
          style={styles.max}
          min={avg}
          max={max}
          value={maxVal}
          step={1}
          onChange={({ target }) => handleRangeChange(undefined, Number(target.value))}
          onMouseUp={updateRangeOnEnd}
        />
        <span
          className={clsx(
            'fw-medium',
            maxLabelClass,
            'translate-middle-x position-absolute text-primary',
            { small: width < 400 },
            { '-ive': maxLabelClass && maxLabelClass.includes('price-symbol') && isNegativeNumber(maxVal) },
            { 'mt-2 top-0': maxPercent - minPercent > 20 },
            { 'mb-2 bottom-0': maxPercent - minPercent <= 20 }
          )}
          style={{
            left: `calc(${maxLabel}% + (${thumbsize - 5 - maxLabel * 0.15}px))`,
          }}
        >
          {maxLabelClass && maxLabelClass.includes('price-symbol') ? formatPricing(maxVal) : maxVal}
        </span>
      </div>
    </div>
  );
};

export default memo(InputMultiRange);
