import * as React from 'react';
import { Button } from '../../../../src/components/';
import * as styles from '../../styles/components-page.scss';

const ButtonExample = () => (
  <div className={styles.example}>
    <Button plain url = "http://www.lipsum.com/" external>Plain Button</Button>
  </div>
);

export default ButtonExample;
