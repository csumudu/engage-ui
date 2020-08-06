import * as React from 'react';
import { ThemedComponentClass } from '@friendsofreactjs/react-css-themr';
export declare type ResponsiveWidth = '1-1' | '1-2' | '1-3' | '1-4' | '1-5' | '1-6' | '1-7' | '1-8' | '1-9' | '1-10' | '2-3' | '2-4' | '2-5' | '2-6' | '2-7' | '2-8' | '2-9' | '2-10' | '3-4' | '3-5' | '3-6' | '3-7' | '3-8' | '3-9' | '3-10' | '4-5' | '4-6' | '4-7' | '4-8' | '4-9' | '4-10' | '5-6' | '5-7' | '5-8' | '5-9' | '5-10' | '6-7' | '6-8' | '6-9' | '6-10' | '7-8' | '7-9' | '7-10' | '8-9' | '8-10' | '8-25-15' | '9-10' | '9-25-15' | '9-75-15';
export interface Props {
    small?: ResponsiveWidth;
    medium?: ResponsiveWidth;
    large?: ResponsiveWidth;
    extraLarge?: ResponsiveWidth;
    componentStyle?: React.CSSProperties;
    componentClass?: string;
    theme?: any;
}
declare const _default: ThemedComponentClass<Props, {}>;
export default _default;
