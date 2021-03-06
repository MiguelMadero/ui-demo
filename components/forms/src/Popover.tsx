import React, { Component } from 'react';
import { Arrow, Manager, Popper, Target } from 'react-popper';

import { styled } from 'z-frontend-theme';
import { Flex } from 'zbase';
import { color, depth, radius, space, zIndex } from 'z-frontend-theme/utils';

type FlipProp =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'left-start'
  | 'left-end'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end';

type PlacementProp =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'left-start'
  | 'left-end'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end';

export interface PopoverProps {
  event: 'click' | 'hover';
  targetBody?: React.ReactNode;
  placement?: PlacementProp;
  flip?: FlipProp[];
  showArrow?: boolean;
  showPopover?: boolean;
  useDefaultPopperContainer?: boolean;
}

interface State {
  isVisible: boolean;
}

export const StyledPopperContainer = styled(Flex)`
  margin: ${space(2)};
  border-radius: ${radius};
  background-color: ${color('grayscale.white')};
  box-shadow: ${depth(2)};
`;

const StyledContainer = styled(Flex)`
  .popper {
    z-index: ${zIndex('popover')};

    .popper-arrow {
      height: 0;
      width: 0;
      border-style: solid;
      position: absolute;
    }
  }

  .popper[data-placement^='right'] {
    .popper-arrow {
      border-width: 5px 5px 5px 0;
      border-color: transparent ${color('grayscale.a')} transparent transparent;
    }
  }

  .popper[data-placement^='top'] {
    .popper-arrow {
      border-width: 5px 5px 0 5px;
      border-color: ${color('grayscale.a')} transparent transparent transparent;
      bottom: 0;
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .popper[data-placement^='left'] {
    .popper-arrow {
      border-width: 5px 0 5px 5px;
      border-color: transparent transparent transparent ${color('grayscale.a')};
      right: 0;
      margin-left: 0;
      margin-right: 0;
    }
  }

  .popper[data-placement^='bottom'] {
    .popper-arrow {
      border-width: 0 5px 5px 5px;
      border-color: transparent transparent ${color('grayscale.a')} transparent;
    }
  }
`;

class Popover extends Component<PopoverProps, State> {
  static defaultProps = {
    placement: 'left',
    flip: [],
    useDefaultPopperContainer: true,
  };

  targetEl: HTMLElement;
  popperEl: HTMLElement;
  documentEventHandlers: [string, (any) => void][];
  constructor(props) {
    super(props);
    this.state = { isVisible: props.showPopover || false };

    this.documentEventHandlers = [
      ['mousedown', this.onOuterAction],
      ['touchstart', this.onOuterAction],
      ['click', this.onOuterAction],
    ];
  }

  componentWillMount() {
    this.documentEventHandlers.forEach(([eventName, handlerFn]) => {
      window.document.addEventListener(eventName, handlerFn);
    });
  }
  componentWillUnmount() {
    this.documentEventHandlers.forEach(([eventName, handlerFn]) => {
      window.document.removeEventListener(eventName, handlerFn);
    });
  }

  togglePopover = (isVisible?: boolean) => {
    if (this.state.isVisible === isVisible) {
      return;
    }
    this.setState({ isVisible: isVisible == null ? !this.state.isVisible : isVisible });
  };

  onTargetClick = e => {
    if (this.props.event === 'click') {
      e.preventDefault();
      this.togglePopover();
    }
  };

  onOuterAction = e => {
    if (
      !this.targetEl.contains(e.target) &&
      ((!this.popperEl || !this.popperEl.contains(e.target)) && document.body.contains(e.target))
    ) {
      this.togglePopover(false);
    }
  };

  onMouseOver = e => {
    if (this.props.event === 'hover') {
      e.preventDefault();
      this.togglePopover();
    }
  };

  onMouseOut = e => {
    if (this.props.event === 'hover') {
      e.preventDefault();
      this.togglePopover(false);
    }
  };

  getModifiers = () => {
    const { flip } = this.props;
    const flipModifiers = { enabled: true };
    if (flip && flip.length > 0) {
      flipModifiers['behavior'] = flip;
    }
    const modifiers = { flip: flipModifiers };
    return modifiers;
  };

  render() {
    const { children, targetBody, placement } = this.props;

    return (
      <Manager>
        <Target
          onClick={this.onTargetClick}
          innerRef={targetEl => {
            this.targetEl = targetEl;
          }}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          {targetBody}
        </Target>
        {this.state.isVisible && (
          <StyledContainer>
            <Popper
              className="popper"
              placement={placement}
              modifiers={this.getModifiers()}
              innerRef={popperEl => {
                this.popperEl = popperEl;
              }}
            >
              {this.props.showArrow && <Arrow className="popper-arrow" />}
              {this.props.useDefaultPopperContainer ? (
                <StyledPopperContainer className="popper-container">{children}</StyledPopperContainer>
              ) : (
                children
              )}
            </Popper>
          </StyledContainer>
        )}
      </Manager>
    );
  }
}

export default Popover;
