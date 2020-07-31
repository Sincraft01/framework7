import React, { forwardRef, useLayoutEffect, useRef, useImperativeHandle } from 'react';
import { classNames, getDataAttrs, emit } from '../shared/utils';
import { colorClasses } from '../shared/mixins';
import { f7, f7ready } from '../shared/f7';

/* dts-props
  id: string | number;
  className: string;
  style: React.CSSProperties;
  opened: boolean;
  onAccordionBeforeOpen? : (prevent?: any) => void
  onAccordionOpen? : (...args: any[]) => void
  onAccordionOpened? : (...args: any[]) => void
  onAccordionBeforeClose? : (prevent?: any) => void
  onAccordionClose? : (...args: any[]) => void
  onAccordionClosed? : (...args: any[]) => void
  COLOR_PROPS
*/

const AccordionItem = forwardRef((props, ref) => {
  const { className, id, style, children, opened } = props;
  const elRef = useRef(null);
  useImperativeHandle(ref, () => ({
    el: elRef.current,
  }));

  const onBeforeOpen = (el, prevent) => {
    if (elRef.current !== el) return;
    emit(props, 'accordionBeforeOpen', prevent);
  };
  const onOpen = (el) => {
    if (elRef.current !== el) return;
    emit(props, 'accordionOpen');
  };
  const onOpened = (el) => {
    if (elRef.current !== el) return;
    emit(props, 'accordionOpened');
  };
  const onBeforeClose = (el, prevent) => {
    if (elRef.current !== el) return;
    emit(props, 'accordionBeforeClose', prevent);
  };
  const onClose = (el) => {
    if (elRef.current !== el) return;
    emit(props, 'accordionClose');
  };
  const onClosed = (el) => {
    if (elRef.current !== el) return;
    emit(props, 'accordionClosed');
  };

  const onMount = () => {
    f7ready(() => {
      f7.on('accordionBeforeOpen', onBeforeOpen);
      f7.on('accordionOpen', onOpen);
      f7.on('accordionOpened', onOpened);
      f7.on('accordionBeforeClose', onBeforeClose);
      f7.on('accordionClose', onClose);
      f7.on('accordionClosed', onClosed);
    });
  };

  const onDestroy = () => {
    f7.off('accordionBeforeOpen', onBeforeOpen);
    f7.off('accordionOpen', onOpen);
    f7.off('accordionOpened', onOpened);
    f7.off('accordionBeforeClose', onBeforeClose);
    f7.off('accordionClose', onClose);
    f7.off('accordionClosed', onClosed);
  };

  useLayoutEffect(() => {
    onMount();
    return onDestroy;
  }, []);

  const dataAttrs = getDataAttrs(props);
  const classes = classNames(
    className,
    'accordion-item',
    {
      'accordion-item-opened': opened,
    },
    colorClasses(props),
  );

  return (
    <div id={id} style={style} className={classes} ref={elRef} {...dataAttrs}>
      {children}
    </div>
  );
});

AccordionItem.displayName = 'f7-accordion-item';

export default AccordionItem;
