import React, { useState } from 'react';
import { Input } from './input';
import { Slider } from './slider';
import styles from './index.module.css';

export const SliderSteps = ({
    className,
    classNameTrack,
    classNameActiveTrack,
    classNameSlider,
    defaultValue,
    steps = [],
    inputLabels,
    sliderLabels,
    isShowLegend = false,
    isShowSliderLabel = false,
    onChange,
  }) => {
    const [value, setValue] = useState(() =>
        defaultValue || steps?.[0]?.[0]
    );

    const onBlurInputCallback = (value) => {
        setValue(value);
        onChange?.(value);
    };

    const onChangeSliderCallback = (value) => {
        setValue(value);
        onChange?.(value);
    };

    return (
        <div className={styles.root}>
            <Input
                value={value}
                inputLabels={inputLabels}
                sliderLabels={sliderLabels}
                onBlur={onBlurInputCallback}
            />
            <Slider
                className={className}
                classNameTrack={classNameTrack}
                classNameActiveTrack={classNameActiveTrack}
                classNameSlider={classNameSlider}
                value={value}
                inputLabels={inputLabels}
                sliderLabels={sliderLabels}
                steps={steps}
                isShowLegend={isShowLegend}
                isShowSliderLabel={isShowSliderLabel}
                onChange={onChangeSliderCallback}
            />
        </div>
    )
}