## React Input Steps Slider

![](https://i.postimg.cc/GtJkFt1x/2024-03-01-12-08-10.png)
![](https://i.postimg.cc/Kjwy5Gr4/2024-03-0112-07-21-ezgif-com-video-to-gif-converter.gif)

## Usage

```jsx
<SliderSteps
  steps={[
    [50000, 100000, 1000],
    [100000, 1000000, 100000],
    [1000000, 5000000, 500000],
    [5000000, 9000000, 1000000],
  ]}
  inputLabels={['₽', '₽', '₽']}
  sliderLabels={['₽', '₽', '₽']}
  isShowLegend
  defaultValue={300000}
/>
```

```jsx
<SliderSteps
  steps={[
    [3, 5, 1],
    [5, 12, 1],
    [12, 18, 1],
  ]}
  inputLabels={['месяц', 'месяца', 'месяцев']}
  sliderLabels={['мес', 'мес', 'мес']}
  isShowLegend
  defaultValue={10}
/>
```
