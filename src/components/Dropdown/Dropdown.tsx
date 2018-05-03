import * as React from 'react';
import { themr, ThemedComponentClass } from 'react-css-themr';
import { autobind } from '@shopify/javascript-utilities/decorators';
import { createUniqueIDFactory } from '@shopify/javascript-utilities/other';
import { findFirstFocusableNode } from '@shopify/javascript-utilities/focus';
import { addEventListener, removeEventListener } from '@shopify/javascript-utilities/events';

import DropdownItem, { Props as DropdownItemProps } from './DropdownItem';
import { classNames } from '@shopify/react-utilities/styles';
import { DROPDOWN } from '../ThemeIdentifiers';
import * as baseTheme from './Dropdown.scss';
import { Keys } from '../../types';
import { findDOMNode } from 'react-dom';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Props {
  disabled?: boolean;
  trigger?: React.ReactNode;
  direction?: Direction;
  active: boolean;
  activatorWrapper?: string;
  dropdownItems: DropdownItemProps[];
  onClose?(): void;
  toggle?() : void;
}

export interface State {
  selectedIndex: number
}

export class Dropdown extends React.PureComponent<Props, State> {
  
  private getUniqueID = createUniqueIDFactory('Dropdown');

  constructor(props: Props) {
    super(props);
    this.state = { 
      selectedIndex: 0 
    };
  }

  private activatorContainer: HTMLElement | null;
  private id = this.getUniqueID();

  componentWillReceiveProps(newProps: any) {
    const { active } = this.props;

    if (active && !newProps.active && typeof newProps.onClose !== 'undefined') {
      newProps.onClose();
    }
  }

  componentDidMount() {
    this.setAccessibilityAttributes();
    const element = findDOMNode(this);
    if (element != null) {
      addEventListener(element, 'keyup', this.handleKeyEvent);
    }
    addEventListener(document, 'mousedown', this.handleMouseEvent);
  }

  componentDidUpdate() {
    this.setAccessibilityAttributes();
  }

  componentWillUnmount() {
    const element = findDOMNode(this);
    if (element != null) {
      removeEventListener(element, 'keyup', this.handleKeyEvent);
    }
    removeEventListener(document, 'mousedown', this.handleMouseEvent);
  }

  render() {
    const { 
      activatorWrapper: WRAPPERCOMPONENT = 'div',
      active,
      trigger,
      dropdownItems,
      toggle,
      direction,
      disabled
    } = this.props;
    
    const {
      selectedIndex
    } = this.state;

    
    const dropdownClassName = classNames (
      typeof direction == 'undefined' || direction === "down" ? baseTheme.dropdown 
        : direction === "up" ? baseTheme.dropup
        : direction === "left" ? baseTheme.dropleft
        : baseTheme.dropright,
       !disabled && active && baseTheme.active
    );

    const dropdownMenuClassName = classNames (
      baseTheme.dropdownMenu,
      !disabled && active && baseTheme.active,
    );

    const DropdownItemComponents = dropdownItems.map((item,index) => 
            <DropdownItem 
              key={index}
              active={selectedIndex === index} 
              disabled={item.disabled}
              divider={item.divider}
              header={item.header}
              content={item.content}
              onClick={item.onClick}
            />
        );
      
    return (
      <WRAPPERCOMPONENT ref={this.setActivator}>
        <div className={dropdownClassName} key={this.id}>
          <div onClick={toggle}>
            {trigger}
          </div>
          <div className={dropdownMenuClassName}>
            {DropdownItemComponents}
          </div>
        </div>
      </WRAPPERCOMPONENT>
    );
  }

  private setAccessibilityAttributes() {
    const { id, activatorContainer } = this;
    if (activatorContainer == null) { return; }

    const firstFocusable = findFirstFocusableNode(activatorContainer);
    const focusableActivator = firstFocusable || activatorContainer;

    focusableActivator.tabIndex = 0;
    focusableActivator.setAttribute('aria-controls', id);
    focusableActivator.setAttribute('aria-owns', id);
    focusableActivator.setAttribute('aria-haspopup', 'true');
    focusableActivator.setAttribute('aria-expanded', String(this.props.active));
  }

  @autobind
  private setActivator(node: HTMLElement | null) {
    if (node == null) {
      this.activatorContainer = null;
      return;
    }
    this.activatorContainer = node;
  }

  @autobind
  private handleKeyEvent(event: KeyboardEvent) {
    event.preventDefault();

    const {
      active,
      toggle,
      disabled
    } = this.props;

    const {
      selectedIndex
    } = this.state;

    if (!active && !disabled) {
      return;
    }
    
    // Change Items on key up, down and tab
    if (event.keyCode === Keys.UP_ARROW) {
      this.changeItem(selectedIndex, -1);
    } else if (event.keyCode === Keys.DOWN_ARROW || event.keyCode === Keys.TAB) {
          this.changeItem(selectedIndex, 1);
    } else if (event.keyCode === Keys.ESCAPE && typeof toggle !== 'undefined') {
      toggle(); // Close the dropdown on ESC
    }
  }

  @autobind
  private changeItem(selectedIndex: number, direction : number) {
    const DropdownCount = this.props.dropdownItems.length - 1;

    if (direction === 1) {
      if (selectedIndex === DropdownCount) {
        this.changeItemState(0, 1);
      } else {
        this.changeItemState(selectedIndex + 1, 1);
      }
    } else if (direction === -1) {
      if (selectedIndex === 0) {
        this.changeItemState(DropdownCount, -1);
      } else {
        this.changeItemState(selectedIndex - 1, -1);
      }
    }
  }

  @autobind
  private changeItemState(selectedIndex: number, direction : number) {
    const {
      dropdownItems
    } = this.props;

    // if next selected item is disabled or devider find next one
    if (dropdownItems[selectedIndex].disabled || dropdownItems[selectedIndex].divider || dropdownItems[selectedIndex].header) {
      this.changeItem(selectedIndex, direction)
      return
    }

    this.setState({
      selectedIndex: selectedIndex
    });
  }

  @autobind
  private handleMouseEvent(event: MouseEvent) {
    event.preventDefault();
    
    const {
      active,
      toggle,
      disabled
    } = this.props;
    
    const element = findDOMNode(this);

    if (!active && !disabled) {
      return;
    }

    if (element != null && event.target !== element && typeof toggle !== 'undefined') {
      toggle(); // Close the dropdown on ESC
    }
  }

}

export { Dropdown as UnthemedSelect };
export default themr(DROPDOWN, baseTheme)(Dropdown) as ThemedComponentClass<Props, {}>;