import Grid from '@material-ui/core/Grid';
import * as React from "react";
import { v4 as uuid4 } from "uuid";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import I18n from '../utils/I18n';

import '../css/Common.css';
import '../css/ConfirmationScreen.css';

import {ConfirmationProps, PIIFieldState} from '../interfaces/ConfirmationProps';

import {CONSTANTS} from "../../constants/constants";

import {flowController} from "../KernelContainer";

export default class ConfirmationScreen extends React.Component<ConfirmationProps> {
    render() {
        const integrationName = this.props.integrationName;
        return <div className="Confirmation screen">
            <Grid container
                direction="column"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Typography component="h2" variant="h6" gutterBottom>
                        {I18n.getKey('REVIEW')}
                    </Typography>
                </Grid>
            </Grid>
            <div className="legal-terms-section">
                <div className="legal-terms1">
                    <p>{I18n.getKey('AGREEMENT_1')} <strong>{integrationName}</strong> {I18n.getKey('AGREEMENT_2')}</p>

                    <p>{I18n.getKey('INFO_INCLUDES')}</p>
                </div>
                <PIIFields />
            </div>
            <Grid container
                direction="row"
                justify="center"
                alignItems="center">
                <Grid item>
                    <Button
                        className="accept"
                        onClick={() => flowController.goTo('NEXT', {
                            sessionId: uuid4()
                        })}>
                        {I18n.getKey('ACCEPT')}
                    </Button>
                </Grid>
            </Grid>
        </div>;
    }
}

class PIIFields extends React.Component<{}, PIIFieldState> {
    constructor(props: any) {
        super(props);

        this.state = {
            columnOne: [],
            columnTwo: []
        }
    }

    componentDidMount() {
        this.delegateLabels();
    }

    delegateLabels() {
        const columnOne: string[] = [];
        const columnTwo: string[] = [];

        let i = 0;
        for (let field in CONSTANTS.pii_map) {
            let currentArray = i % 2 === 0 ? columnOne : columnTwo;
            currentArray.push(CONSTANTS.pii_map[field].name);
            i++;
        }

        this.setState({columnOne, columnTwo});
    }

    renderFields() {
        return (
            <div className="legal-terms2">
                <ul>{this.state.columnOne.map(field => {
                    return <li key={field}>{field}</li>
                })}</ul>
                <ul>{this.state.columnTwo.map(field => {
                    return <li key={field}>{field}</li>
                })}</ul>
            </div>
        );
    }

    render() {
        return this.renderFields();
    }
}