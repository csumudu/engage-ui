import * as React from 'react';
import { Avatar } from '../../../../src/components/';
import * as styles from '../../styles/components-page.scss';

const AvatarExample = () => (
  <div className={styles.example}>
    <Avatar
      size="small"
      name="John Doe"
      initials="JD"
      customer={false}
      accessibilityLabel="hello"
    />
  </div>
);

export default AvatarExample;
