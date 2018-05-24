
import * as React from 'react';
import { themr, ThemedComponentClass } from 'react-css-themr';
import Icon from '../Icon';
import { SIDENAVIGATION } from '../ThemeIdentifiers';
import { Drawer, DrawerContent } from '../Drawer';
import Button from '../Button';
import Tooltip from '../Tooltip';
import Accordion from '../Accordion';
import {AccordionItemProps} from '../Accordion';
import * as baseTheme from './SideNavigation.scss';
import axios from 'axios';

export interface Props {
    theme?: any;
    url?: any;
    accordian?: boolean,
}

export interface State {
    drawer: boolean;
    activeDrawerId: string;
    navData: Array<string>;
}

class SideNavigation extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        drawer: false,
        activeDrawerId: 'fullContent',
        navData: []
      };
    }

    toggleDrawer = () => {
        this.setState({ drawer: !this.state.drawer });
    }

    componentDidMount() {
        axios.get(this.props.url).then((response:any) => {
            this.setState({
                navData: response.data
            });
        })
    };
    componentDidUpdate(){
        const bodyElement = document.body;
        if (bodyElement !== null) {
            bodyElement.className +=  this.state.drawer ? ' ' + this.props.theme.container : '';
        }
    }

    render() {
        let actDrawerId = this.state.activeDrawerId;
        const rootElement = document.getElementById('root');
        const iconClass = this.props.theme.icon;
        const iconCollClass = this.props.theme.collapseIcon;
        const divClass = this.props.theme.navDivider;
        const liClass = this.props.theme.li;
        const childLiClass = this.props.theme.childLi;
        let accState = this.props.accordian;
        if (rootElement !== null) {
            rootElement.className = this.state.drawer ? (this.props.theme.container) : '';
            rootElement.className = rootElement.className + ' ' + (actDrawerId == "collapsedContent" ? this.props.theme.rootCollapse : '')
        }

        const fullContentMarkup = this.state.navData.map(function(full:any){
            let func = JSON.parse('{"action":"' + full.action + '"}', function (key, value) {
                if (value && (typeof value === 'string') && value.indexOf("()") === 0) {
                    var jsFunc = new Function('return ' + value)();
                    return jsFunc;
                }  
                return value;
            });
            const childrenMarkup = full.children !== undefined ? full.children.map(function(child:any){
                return <li key={child.id}><a className={childLiClass} onClick={func.action} aria-disabled={false}><Icon source={child.icon} color="white" />{child.label}</a></li>;
            }) : null;
            const items : AccordionItemProps[] = [{
                children: childrenMarkup,
                header: <li key={full.id} className={liClass} ><a className={liClass} onClick={func.action} aria-disabled={false}><Icon source={full.icon} color="white" />{full.label}</a></li>
              }
            ];
            const markup = accState ? ( 
                    childrenMarkup ==  null ? (
                        <div>
                            <li key={full.id} className={liClass} ><a className={liClass} onClick={func.action} aria-disabled={false}><Icon source={full.icon} color="white" />{full.label}</a></li>
                            {childrenMarkup}
                        </div>
                    ) : (
                    <Accordion style={{padding:"0px", height:"20px"}} mode="collapsible" items={items} />)
                    ) : (
                        <div>
                            <li key={full.id} className={liClass}><a className={liClass} onClick={func.action} aria-disabled={false}><Icon source={full.icon} color="white" />{full.label}</a></li>
                            {childrenMarkup}
                        </div>
                    );
            let p = childrenMarkup ==  null ? 30  : ((childrenMarkup.length + 1) * 30) + 20;
            const pstyle = {paddingBottom: p + 'px'};
            return (
                <div> 
                    <div className={iconClass}>
                        {markup}
                    </div>
                    <div className={divClass} style={pstyle} />
                </div>
            );
        });
        const collapsedContentMarkup = this.state.navData.map(function(col:any){
            return (
                <p className={iconCollClass}>
                    <Tooltip content={col.label}>
                        <Icon source={col.icon} color="white" />
                    </Tooltip>
                </p>
            );
        });
        return (
            <div>
                <Button onClick={this.toggleDrawer}>Open Side Navigation</Button>
                <Drawer
                    active={this.state.drawer}
                    activeContentId={this.state.activeDrawerId}
                    mode="push"
                    width="small"
                    overlay style={actDrawerId == "collapsedContent" ? { width: "10px", padding: "15px", overflow:"visible"} : { width:"270px", overflow:"visible"}} >
                    <DrawerContent id="fullContent" mode="slide" style={{background: "black", color: "white", padding: "0px"}}>
                        <span className={this.props.theme.expand}>
                            <button type="button" className={this.props.theme.navButton} onClick={() => this.setState({ activeDrawerId: 'collapsedContent' })}><Icon source="chevronLeft" color="white" /></button>
                        </span>
                        <ul className={this.props.theme.list}>
                            {fullContentMarkup}
                        </ul>
                    </DrawerContent>
                    <DrawerContent id="collapsedContent" mode="slide" style={{width: "10px", padding: "15px", background: "black", color: "white"}}>
                        <span className={this.props.theme.collapse}>
                            <button type="button" className={this.props.theme.navButton} onClick={() => this.setState({ activeDrawerId: 'fullContent' })}><Icon source="chevronRight" color="white" /></button>
                        </span>
                        <ul className={this.props.theme.collapseList} >
                            {collapsedContentMarkup}
                        </ul>
                    </DrawerContent>
                </Drawer>
            </div>
        );
    }
};    
export default themr(SIDENAVIGATION, baseTheme)(SideNavigation) as ThemedComponentClass<Props, {}>;        