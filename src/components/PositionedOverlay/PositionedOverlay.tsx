import * as React from 'react';
import { themr, ThemedComponentClass } from '@friendsofreactjs/react-css-themr';
import { autobind } from '@shopify/javascript-utilities/decorators';
import { classNames } from '@shopify/react-utilities/styles';
// import { addEventListener, removeEventListener } from '@shopify/javascript-utilities/events';
import { getRectForNode, Rect } from '@shopify/javascript-utilities/geometry';
import { closest } from '@shopify/javascript-utilities/dom';
import { forNode as ScrollableForNode } from '../Scrollable';
import { layer } from '../shared';
import { POSITIONED_OVERLAY } from '../ThemeIdentifiers';

import {
  PreferredPosition,
  PreferredAlignment,
  calculateVerticalPosition,
  calculateHorizontalPosition,
  rectIsOutsideOfRect,
} from './math';

import * as baseTheme from './PositionedOverlay.scss';

export { PreferredPosition };
export { PreferredAlignment };
export type Positioning = 'above' | 'below';

export interface OverlayDetails {
  left: number;
  desiredHeight: number;
  positioning: Positioning;
  measuring: boolean;
  activatorRect: Rect;
}

export interface Props {
  // Is overlay active or not
  active: boolean;
  activator: HTMLElement;
  // Define overlay position 
  preferredPosition?: PreferredPosition;
  preferredAlignment?: PreferredAlignment;
  fullWidth?: boolean;
  fixed?: boolean;
  // Theme to be injected via css-themr.
  theme?: any;
  render(overlayDetails: OverlayDetails): React.ReactNode;
  onScrollOut?(): void;
}

export interface State {
  measuring: boolean;
  activatorRect: Rect;
  left: number;
  top: number;
  height: number;
  width: number | null;
  positioning: Positioning;
  zIndex: number | null;
  outsideScrollableContainer: boolean;
  lockPosition: boolean;
}

class PositionedOverlay extends React.PureComponent<Props, State> {
  state: State = {
    measuring: true,
    activatorRect: getRectForNode(this.props.activator),
    left: 0,
    top: 0,
    height: 0,
    width: null,
    positioning: 'below',
    zIndex: null,
    outsideScrollableContainer: false,
    lockPosition: false,
  };

  private overlay: HTMLElement;
  private scrollableContainer: HTMLElement;

  componentDidMount() {
    // this.scrollableContainer = ScrollableForNode(this.props.activator);
    // addEventListener(this.scrollableContainer, 'scroll', this.handleMeasurement);
    // addEventListener(window, 'resize', this.handleMeasurement);
    // this.handleMeasurement();

    this.scrollableContainer = ScrollableForNode(this.props.activator);
    if (this.scrollableContainer && !this.props.fixed) {
      this.scrollableContainer.addEventListener(
        'scroll',
        this.handleMeasurement
      );
    }
    this.handleMeasurement();
  }

  // componentDidUpdate() {
  //   const { outsideScrollableContainer, top } = this.state;
  //   const { onScrollOut, active } = this.props;

  //   if (active && onScrollOut != null && top !== 0 && outsideScrollableContainer) {
  //     onScrollOut();
  //   }
  // }

  componentDidUpdate() {
    const { outsideScrollableContainer, top } = this.state;
    const { onScrollOut, active } = this.props;

    if (
      active &&
      onScrollOut != null &&
      top !== 0 &&
      outsideScrollableContainer
    ) {
      onScrollOut();
    }
  }

  componentWillUnmount() {
    if (this.scrollableContainer && !this.props.fixed) {
      this.scrollableContainer.removeEventListener(
        'scroll',
        this.handleMeasurement
      );
    }
  }

  componentWillReceiveProps() {
    this.handleMeasurement();
  }

  // render() {
  //   const { left, top, zIndex } = this.state;
  //   const { render, theme } = this.props;

  //   return (
  //     <div
  //       className={theme.positionedOverlay}
  //       style={{ top, left, zIndex }}
  //       ref={(input) => {
  //         this.setOverlay(input as HTMLElement);
  //       }}
  //     >
  //       {render(this.overlayDetails())}
  //     </div>
  //   );
  // }

  render() {
    const { left, top, zIndex, width } = this.state;
    const { render, fixed, theme } = this.props;

    const style = {
      top: top == null ? undefined : top,
      left: left == null ? undefined : left,
      width: width == null ? undefined : width,
      zIndex: zIndex == null ? undefined : zIndex,
    };

    const className = classNames(
      theme.PositionedOverlay,
      fixed && theme.fixed
    );

    return (
      <div className={className} style={style} ref={(input) => {
        this.setOverlay(input as HTMLElement);
      }}>
        {render(this.overlayDetails())}
      </div>
    );
  }

  @autobind
  private overlayDetails(): OverlayDetails {
    const { measuring, left, positioning, height, activatorRect } = this.state;
    return {
      measuring,
      left,
      positioning,
      activatorRect,
      desiredHeight: height,
    };
  }

  @autobind
  private setOverlay(node: HTMLElement) {
    this.overlay = node;
  }

  @autobind
  private handleMeasurement() {
    const { lockPosition, top } = this.state;

    this.setState(
      {
        left: 0,
        top: lockPosition ? top : 0,
        height: 0,
        positioning: 'below',
        measuring: true,
      },
      () => {
        if (this.overlay == null || this.scrollableContainer == null) {
          return;
        }
        const {
          activator,
          preferredPosition = 'below',
          preferredAlignment = 'center',
          onScrollOut,
          fullWidth,
          fixed,
        } = this.props;

        const textFieldActivator = activator.querySelector('input');

        const activatorRect =
          textFieldActivator != null
            ? getRectForNode(textFieldActivator)
            : getRectForNode(activator);

        const currentOverlayRect = getRectForNode(this.overlay);
        const scrollableElement = isDocument(this.scrollableContainer)
          ? document.body
          : this.scrollableContainer;
        const scrollableContainerRect = getRectForNode(scrollableElement);

        const overlayRect = fullWidth
          ? { ...currentOverlayRect, width: activatorRect.width }
          : currentOverlayRect;

        // If `body` is 100% height, it still acts as though it were not constrained
        // to that size. This adjusts for that.
        if (scrollableElement === document.body) {
          scrollableContainerRect.height = document.body.scrollHeight;
        }

        const overlayMargins = this.overlay.firstElementChild
          ? getMarginsForNode(this.overlay.firstElementChild as HTMLElement)
          : { activator: 0, container: 0, horizontal: 0 };
        const containerRect = windowRect();
        const zIndexForLayer = getZIndexForLayerFromNode(activator);
        const zIndex =
          zIndexForLayer == null ? zIndexForLayer : zIndexForLayer + 1;
        const verticalPosition = calculateVerticalPosition(
          activatorRect,
          overlayRect,
          overlayMargins,
          scrollableContainerRect,
          containerRect,
          preferredPosition,
          fixed
        );
        const horizontalPosition = calculateHorizontalPosition(
          activatorRect,
          overlayRect,
          containerRect,
          overlayMargins,
          preferredAlignment
        );

        this.setState({
          zIndex,
          measuring: false,
          activatorRect: getRectForNode(activator),
          left: horizontalPosition,
          top: lockPosition ? top : verticalPosition.top,
          lockPosition: Boolean(fixed),
          height: verticalPosition.height || 0,
          width: fullWidth ? overlayRect.width : null,
          positioning: verticalPosition.positioning as Positioning,
          outsideScrollableContainer:
            onScrollOut != null &&
            rectIsOutsideOfRect(
              activatorRect,
              intersectionWithViewport(scrollableContainerRect)
            ),
        });
      }
    );
  }
}

export function intersectionWithViewport(
  rect: Rect,
  viewport: Rect = windowRect()
) {
  const top = Math.max(rect.top, 0);
  const left = Math.max(rect.left, 0);
  const bottom = Math.min(rect.top + rect.height, viewport.height);
  const right = Math.min(rect.left + rect.width, viewport.width);

  return new Rect({
    top,
    left,
    height: bottom - top,
    width: right - left,
  });
}

function getMarginsForNode(node: HTMLElement) {
  const nodeStyles = window.getComputedStyle(node);
  return {
    activator: parseFloat(nodeStyles.marginTop || ''),
    container: parseFloat(nodeStyles.marginBottom || ''),
    horizontal: parseFloat(nodeStyles.marginLeft || ''),
  };
}

function getZIndexForLayerFromNode(node: HTMLElement) {
  const layerNode = closest(node, layer.selector) || document.body;
  const zIndex =
    layerNode === document.body
      ? 'auto'
      : parseInt(window.getComputedStyle(layerNode).zIndex || '0', 10);
  return zIndex === 'auto' || isNaN(zIndex) ? null : zIndex;
}

function windowRect() {
  return new Rect({
    top: window.scrollY,
    left: window.scrollX,
    height: window.innerHeight,
    width: window.innerWidth,
  });
}

function isDocument(node: HTMLElement | Document): node is Document {
  return node === document;
}

export default themr(POSITIONED_OVERLAY, baseTheme)(PositionedOverlay) as ThemedComponentClass<Props, State>;
