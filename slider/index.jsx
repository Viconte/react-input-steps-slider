import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { formatNumber, pluralize } from '../utils';
import styles from './index.module.css';

export const Slider = ({
  className,
  classNameTrack,
  classNameActiveTrack,
  classNameSlider,
  value,
  sliderLabels,
  steps = [],
  isShowLegend,
  isShowSliderLabel,
  onChange,
}) => {
  const [percent, setPercent] = useState();
  const rootRef = useRef();

  useEffect(() => {
    const minValue = steps?.[0]?.[0];
    const maxValue = steps?.[steps.length - 1]?.[1];

    if (value < minValue) {
      setPercent(0);
      onChange?.(minValue);
    } else if (value > maxValue) {
      setPercent(100);
      onChange?.(maxValue);
    } else {
      const stepPercent = 100 / (steps.length);

      const indexCurrentInterval = steps.findIndex(step => step[0] <= value && value <= step[1]);
      // console.log('indexCurrentInterval', indexCurrentInterval);
      const currentInterval = steps?.[indexCurrentInterval];
      // console.log('currentInterval', currentInterval);
      const valueInCurrentInterval = value - currentInterval[0];
      // console.log('valueInCurrentInterval', valueInCurrentInterval);
      const totalValueInCurrentInterval = currentInterval[1] - currentInterval[0];
      // console.log('totalValueInCurrentInterval', totalValueInCurrentInterval);
      const percentInCurrentInterval = valueInCurrentInterval * stepPercent / totalValueInCurrentInterval
      // console.log('percentInCurrentInterval', percentInCurrentInterval);
      const newPercent = indexCurrentInterval * stepPercent + percentInCurrentInterval;
      // console.log('newPercent', newPercent);

      setPercent(newPercent);
    }
  }, [ value, steps, onChange ])

  const startMooving = (event) => {
    document.addEventListener('mousemove', processMoving);
    document.addEventListener('mouseup', stopMooving);
    document.addEventListener('touchmove', processMoving);
    document.addEventListener('touchend', stopMooving);
    event.preventDefault();
    processMoving(event);
  };

  const getCurrentInterval = (totalPercent) => {
    const stepPercent = 100 / (steps.length);
    const indexCurrentInterval = Math.max(Math.ceil(totalPercent / stepPercent) - 1, 0)
    return steps[indexCurrentInterval];
  };

  const getBoundsCurrentInterval = (totalPercent) => {
    const stepPercent = 100 / (steps.length);
    const indexCurrentInterval = Math.max(Math.ceil(totalPercent / stepPercent) - 1, 0)
    const leftBorder = indexCurrentInterval * stepPercent;
    const rightBorder = leftBorder + stepPercent;

    return [leftBorder, rightBorder];
  };

  const getCurrentIntervalPercent = (totalPercent, bordersCurrentInterval) => {
    const stepPercent = 100 / (steps.length);
    const shiftPercentWithInterval = totalPercent - bordersCurrentInterval[0];

    return (shiftPercentWithInterval * 100) / stepPercent;
  };

  const getTotalCountStepsCurrentInterval = (currentInterval) => {
    return (currentInterval[1] - currentInterval[0]) / currentInterval[2];
  };

  const getCountStepsCurrentInterval = (totalCountStepsCurrentInterval, currentIntervalPercent) => {
    return Math.round(currentIntervalPercent / (100 / totalCountStepsCurrentInterval));
  };

  const getCorrectPercentCurrentInterval = (countStepsCurrentInterval, totalCountStepsCurrentInterval) => {
    const stepPercent = 100 / (steps.length);

    return (stepPercent * countStepsCurrentInterval * (100 / totalCountStepsCurrentInterval)) / 100
  };

  const getValueCurrentInterval = (currentInterval, countStepsWithCurrentInterval) => {
    return currentInterval[2] * countStepsWithCurrentInterval
  };

  const processMoving = (event) => {
    if (rootRef?.current) {
      const { left, width } = rootRef.current.getBoundingClientRect();
      let shiftX = (event.touches?.[0].clientX || event.clientX) - left;

      if (shiftX < 0) {
        shiftX = 0;
      } else if (shiftX > width) {
        shiftX = width;
      }

      const totalPercent = (shiftX * 100) / width; // 1
      // console.log(`totalPercent: ${totalPercent}`);
      const currentInterval = getCurrentInterval(totalPercent);
      // console.log(`currentInterval: ${currentInterval}`);
      const boundsCurrentInterval = getBoundsCurrentInterval(totalPercent);
      // console.log(`boundsCurrentInterval: ${boundsCurrentInterval}`);
      const currentIntervalPercent = getCurrentIntervalPercent(totalPercent, boundsCurrentInterval); // 2
      // console.log(`currentIntervalPercent: ${currentIntervalPercent}`);
      const totalCountStepsCurrentInterval = getTotalCountStepsCurrentInterval(currentInterval); // 3
      // console.log(`totalCountStepsCurrentInterval: ${totalCountStepsCurrentInterval}`);
      const countStepsCurrentInterval = getCountStepsCurrentInterval(totalCountStepsCurrentInterval, currentIntervalPercent); // 4, 5
      // console.log(`countStepsCurrentInterval: ${countStepsCurrentInterval}`);
      const correctPercentCurrentInterval = getCorrectPercentCurrentInterval(countStepsCurrentInterval, totalCountStepsCurrentInterval) // 6
      // console.log(`correctPercentCurrentInterval: ${correctPercentCurrentInterval}`);
      const valueCurrentInterval = getValueCurrentInterval(currentInterval, countStepsCurrentInterval); // 7
      // console.log(`valueCurrentInterval: ${valueCurrentInterval}`);
      const newValue = currentInterval[0] + valueCurrentInterval;
      // console.log(`newValue: ${newValue}`);
      const percent = boundsCurrentInterval[0] + correctPercentCurrentInterval;

      setPercent(percent);
      onChange?.(newValue);
    }
    event.preventDefault();
  };

  const stopMooving = () => {
    document.removeEventListener('mousemove', processMoving);
    document.removeEventListener('mouseup', stopMooving);
    document.removeEventListener('touchmove', processMoving);
    document.removeEventListener('touchend', stopMooving);
  };

  return (
    <div
      ref={rootRef}
      className={cn(styles.root, className)}
      onMouseDown={startMooving}
      onTouchStart={startMooving}
      role="button"
      tabIndex={0}
    >
      <div
        className={cn(styles.track, classNameTrack)}
      >
        <div
          className={cn(styles.trackActive, classNameActiveTrack)}
          style={{ width: `${percent}%` }}
        >
          <button
            className={cn(styles.slider, classNameSlider)}
            onMouseDown={startMooving}
            onTouchStart={startMooving}
            type="button"
          >
            {isShowSliderLabel && (
              <span className={styles.sliderLabel}>
                <span className={styles.sliderLabelValue}>{formatNumber(value)}</span>
              </span>
            )}
          </button>
        </div>
        {isShowLegend && (
          <div className={styles.legend}>
            {steps.map((step, i) => {
              const stepPercent = (100 / (steps.length));

              return (
                <div
                  key={i}
                  className={cn(styles.step, {[styles.active]: stepPercent * i <= percent})}
                  style={{ left: `${ i * stepPercent }%` }}
                >
                  <div className={styles.stepLabel}>
                    {`${formatNumber(step?.[0])} ${pluralize(step?.[0], sliderLabels)}`}
                  </div>
                </div>
              )
            })}
            <div className={styles.step} style={{ left: '100%' }}>
              <div className={styles.stepLabel}>
                {`${formatNumber(steps[steps.length-1]?.[1])} ${pluralize(steps[steps.length-1]?.[1], sliderLabels)}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
