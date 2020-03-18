import * as React from 'react';
import { ThemedComponentClass } from '@friendsofreactjs/react-css-themr';
import { Action } from '../Labelled';
import { IStateProps } from '../Picker/AutoSuggestText';
import { IAutoSuggestMethods } from '../Picker/Picker';
export declare type Type = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'date' | 'datetime-local' | 'month' | 'time' | 'week';
export interface State {
    height?: number | null;
    focused?: boolean;
    value?: string | undefined;
}
export interface Props {
    autoSuggest?: boolean;
    autoSuggestMethods?: IAutoSuggestMethods;
    stateProps?: IStateProps;
    alphanumeric?: boolean;
    autoComplete?: boolean;
    autoFocus?: boolean;
    backdropHidden?: boolean;
    capital?: boolean;
    componentClass?: string;
    componentId?: string;
    componentStyle?: React.CSSProperties;
    connectedRight?: React.ReactNode;
    connectedLeft?: React.ReactNode;
    disabled?: boolean;
    enableTextCounter?: boolean;
    errors?: [string];
    getErrors?(errors: any, name?: string): void;
    hasValue?: boolean;
    helpText?: React.ReactNode;
    itemSelected?: boolean;
    isFocused?: boolean;
    label?: string;
    labelAction?: Action;
    labelHidden?: boolean;
    loading?: boolean;
    max?: number;
    maxLength?: number;
    min?: number;
    minLength?: number;
    multiline?: boolean | number;
    name?: string;
    onChange?(value: string, e?: React.FormEvent<HTMLElement>): void;
    onFocus?(e?: React.FormEvent<HTMLElement>): void;
    onBlur?(e?: React.FormEvent<HTMLElement>): void;
    onInput?(e?: React.ChangeEvent<HTMLSelectElement>): void;
    pattern?: string;
    placeholder?: string;
    prefix?: React.ReactNode;
    required?: boolean;
    readOnly?: boolean;
    resizable?: boolean;
    showNumberIcon?: boolean;
    suffix?: React.ReactNode;
    step?: number;
    spellCheck?: boolean;
    theme?: any;
    type?: Type;
    value?: string;
}
declare class TextField extends React.PureComponent<Props, State> {
    state: State;
    private input;
    constructor(props: Props);
    UNSAFE_componentWillReceiveProps(nextProps: Props): void;
    render(): JSX.Element;
    private setInput;
    private handleNumberChange;
    private onChange;
    private handleInputOnFocus;
    private handleInputOnBlur;
    private handleInputFocus;
}
export { TextField as UnthemedTextField };
declare const _default: ThemedComponentClass<Props, State>;
export default _default;