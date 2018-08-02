import * as React from 'react';
import { Card } from '../../../../src/components/';
import Section from '../../../../src/components/Card/Section';
import * as styles from '../../styles/components-page.scss';

const CardExample = () => (
  <div className={styles.example}>
    <Card componentTitle="Online store dashboard">
      <Section componentTitle="Reports">
        <p>View a summary of your online store’s performance.</p>
      </Section>
      <Section componentTitle="Summary">
        <p>View a summary of your online store’s performance, including sales, visitors, top products, and referrals.</p>
      </Section>
    </Card>
  </div>
);

export default CardExample;
