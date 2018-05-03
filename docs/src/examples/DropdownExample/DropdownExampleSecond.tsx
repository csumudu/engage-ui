import * as React from 'react';
import { Dropdown, DropdownItemProps } from '../../../../src/components';
import * as styles from '../../styles/components-page.scss';

export interface IProps{
}

export interface IState {
  active: boolean;
}

class DropdownExampleSecond extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      active: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  private toggle() {
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    const items : DropdownItemProps[] = [
      {
        content: "Item 1",
      }, {
        content: "Item 2",
        divider: true,
        disabled: true,
      }, {
        content: "Item 3",
      }, {
        content: "Item 4",
        header: true,
      }
    ]

    return (
      <div className={styles.example}>
         <Dropdown
          active={this.state.active}
          dropdownItems={items}
          toggle={this.toggle}
          direction="up"
        >
          Actions
        </Dropdown>
      </div>
    );
  }
}

export default DropdownExampleSecond;
