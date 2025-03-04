import MultiRangeSlider from 'multi-range-slider-react';
import './styles.css';
import React, { useState } from 'react';

interface RangeSliderProps {
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  step: number;
  onChange: (minValue: number, maxValue: number) => void;
}

export const RangeSlider = ({
  minValue: _minValue,
  maxValue: _maxValue,
  min,
  max,
  step,
  onChange,
}: RangeSliderProps) => {
  const [minValue, setMinValue] = useState(_minValue);
  const [maxValue, setMaxValue] = useState(_maxValue);

  return (
    <>
      <div className="flex text-sm">
        <span style={{ width: (minValue * 100) / 1000 + '%' }} />
        <span>{minValue} $</span>
        <span style={{ flex: 1 }} />
        <span>{maxValue} $</span>
        <span style={{ width: ((max - maxValue) * 100) / 1000 + '%' }} />
      </div>
      <MultiRangeSlider
        min={min}
        max={max}
        step={step}
        minValue={minValue}
        maxValue={maxValue}
        onInput={(e) => {
          setMinValue(e.minValue);
          setMaxValue(e.maxValue);
        }}
        onChange={(e) => onChange(e.minValue, e.maxValue)}
        barInnerColor="#FF9B00"
        ruler={false}
        label={false}
      />
      <div className="flex justify-between text-sm">
        <span>10$</span>
        <span>1000$</span>
      </div>
    </>
  );
};
