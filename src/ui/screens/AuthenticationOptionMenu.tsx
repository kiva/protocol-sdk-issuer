import * as React from 'react';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Radio, {RadioProps} from '@material-ui/core/Radio';
import {withStyles} from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import "../css/AuthOptionMenu.css";

import {AuthOptionProps, AuthOptionState, MenuOptionProps} from "../interfaces/AuthOptionInterfaces";

import I18n from '../utils/I18n';

export default class AuthenticationOptionMenu extends React.Component<AuthOptionProps, AuthOptionState> {

    constructor(props: AuthOptionProps) {
        super(props);
        this.state = {
            optionSelected: this.props.authIndex
        };
    }

    selectOption = (optionSelected: number): void => {
        this.setState({optionSelected});
    };

    renderMenu() {
        return (
            <div id="auth_option_menu" className="flex-block column">
                <Typography className="auth_instructions" component="h2" variant="h6">
                    Select a verification method
                </Typography>
                <div id="auth_options" className="flex-block row">
                    {this.props.verification_opts.map((option, idx) => {
                        return (
                            <MenuOption
                                key={option.id}
                                id={option.id}
                                title={option.title}
                                description={option.description}
                                selected={idx === this.state.optionSelected}
                                recommended={idx === 0}
                                option_index={idx}
                                setAuthType={this.selectOption}
                            />
                        );
                    })}
                </div>
                <Button id="select-auth-method" onClick={() => this.props.setNewAuthType(this.state.optionSelected)}>
                    Continue
                </Button>
            </div>
        );
    }

    render() {
        return this.renderMenu();
    }

}

class MenuOption extends React.Component<MenuOptionProps> {
    render() {
        return (
            <Card
                onClick={() => this.props.setAuthType(this.props.option_index)}
                className={classNames({
                    recommended: this.props.recommended,
                    "flex-block": true,
                    auth_option: true,
                    selected: this.props.selected
                })}
            >
                <CardContent>
                    <Typography component="h2" variant="h4">
                        {this.props.title}
                    </Typography>
                    <p>
                        {this.props.description}
                    </p>
                </CardContent>
                <CardActions className="lajhem">
                    <MenuRadio checked={this.props.selected} inputProps={{ 'aria-label': this.props.id }} />
                </CardActions>
            </Card>
        );
    }
}

// TODO: Maybe link this up with the "colorMap" config
const MenuRadio = withStyles({
    root: {
        color: '#24778b',
        '&$checked': {
            color: '#24778b'
        }
    }
})((props: RadioProps) => <Radio color="default" {...props} />);