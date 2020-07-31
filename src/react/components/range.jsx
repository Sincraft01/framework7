import React, { forwardRef, useRef, useImperativeHandle, useLayoutEffect } from 'react';
import { classNames, getDataAttrs, noUndefinedProps, emit } from '../shared/utils';
import { colorClasses } from '../shared/mixins';
import { f7ready, f7 } from '../shared/f7';
import { watchProp } from '../shared/watch-prop';

/* dts-props
  id?: string | number;
  className?: string;
  style?: React.CSSProperties;
  init? : boolean
  value? : number | Array<any> | string
  min? : number | string
  max? : number | string
  step? : number | string
  label? : boolean
  dual? : boolean
  vertical? : boolean
  verticalReversed? : boolean
  draggableBar? : boolean
  formatLabel? : Function
  scale? : boolean
  scaleSteps? : number
  scaleSubSteps? : number
  formatScaleLabel? : Function
  limitKnobPosition? : boolean
  name? : string
  input? : boolean
  inputId? : string
  disabled? : boolean
  COLOR_PROPS
  onRangeChange? : (val?: any) => void
  onRangeChanged? : (val?: any) => void
*/

const Range = forwardRef((props, ref) => {
  const f7Range = useRef(null);
  const {
    className,
    id,
    style,
    children,
    init = true,
    value = 0,
    min = 0,
    max = 100,
    step = 1,
    label = false,
    dual = false,
    vertical = false,
    verticalReversed = false,
    draggableBar = true,
    formatLabel,
    scale = false,
    scaleSteps = 5,
    scaleSubSteps = 0,
    formatScaleLabel,
    limitKnobPosition = undefined,
    name,
    input,
    inputId,
    disabled,
  } = props;
  const dataAttrs = getDataAttrs(props);

  const elRef = useRef(null);

  const setValue = (newValue) => {
    if (f7Range.current && f7Range.current.setValue) f7Range.current.setValue(newValue);
  };
  const getValue = () => {
    if (f7Range.current && f7Range.current.getValue) {
      return f7Range.current.getValue();
    }
    return undefined;
  };

  useImperativeHandle(ref, () => ({
    el: elRef.current,
    f7Range: () => f7Range.current,
    setValue,
    getValue,
  }));

  watchProp(value, (newValue) => {
    if (!f7Range.current) return;
    const rangeValue = f7Range.current.value;
    if (Array.isArray(newValue) && Array.isArray(rangeValue)) {
      if (rangeValue[0] !== newValue[0] || rangeValue[1] !== newValue[1]) {
        f7Range.current.setValue(newValue);
      }
    } else {
      f7Range.current.setValue(newValue);
    }
  });

  const onMount = () => {
    f7ready(() => {
      if (!init || !elRef.current) return;
      f7Range.current = f7.range.create(
        noUndefinedProps({
          el: elRef.current,
          value,
          min,
          max,
          step,
          label,
          dual,
          draggableBar,
          vertical,
          verticalReversed,
          formatLabel,
          scale,
          scaleSteps,
          scaleSubSteps,
          formatScaleLabel,
          limitKnobPosition,
          on: {
            change(range, val) {
              emit(props, 'rangeChange', val);
            },
            changed(range, val) {
              emit(props, 'rangeChanged', val);
            },
          },
        }),
      );
    });
  };

  const onDestroy = () => {
    if (f7Range.current && f7Range.current.destroy) f7Range.current.destroy();
    f7Range.current = null;
  };

  useLayoutEffect(() => {
    onMount();
    return onDestroy;
  }, []);

  const classes = classNames(
    className,
    'range-slider',
    {
      'range-slider-horizontal': !vertical,
      'range-slider-vertical': vertical,
      'range-slider-vertical-reversed': vertical && verticalReversed,
      disabled,
    },
    colorClasses(props),
  );

  return (
    <div ref={elRef} id={id} style={style} className={classes} {...dataAttrs}>
      {input && <input type="range" name={name} id={inputId} />}
      {children}
    </div>
  );
});

Range.displayName = 'f7-range';

export default Range;
