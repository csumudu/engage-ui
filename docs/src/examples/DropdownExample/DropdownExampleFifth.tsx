import * as React from 'react';
import { Dropdown, DropdownItemProps, Button } from '../../../../src/components';
import * as styles from '../../styles/components-page.scss';

export interface IProps{
}

export interface IState {
  active: boolean;
  anchorEl?: HTMLElement;
}

class DropdownExampleFifth extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      active: true,
    };
    this.toggle = this.toggle.bind(this);
  }

  private toggle(e : React.FormEvent<HTMLElement>) {
    this.setState({
      active: !this.state.active,
      anchorEl: e.target as HTMLElement
    });
  }

  render() {
    const items : DropdownItemProps[] = [
      {
        content: 'Item 1',
      }, {
        content: 'Item 2',
        divider: true,
      }, {
        content: 'Item 3',
      }, {
        content: 'Item 4',
        header: true,
      },
    ];

    return (
      <div className={styles.example}>
        <Button onClick={e => this.toggle(e)}>Dropdown5</Button>
        <Dropdown
          active={this.state.active}
          dropdownItems={items}
          anchorEl={this.state.anchorEl}
          direction="down"
          disabled
        />
     </div>
    );
  }
}

export default DropdownExampleFifth;
