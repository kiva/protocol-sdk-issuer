import * as React from 'react';
import {DataGrid, GridColDef} from '@material-ui/data-grid';
import {CredentialKeyMap} from '../interfaces/ConfirmationProps';
import {CONSTANTS} from '../../constants/constants';
import _ from "lodash";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const CredentialData: CredentialKeyMap = CONSTANTS.credentialKeyMap;
const columns: GridColDef[] = [];
const numRows = 4;
const rows: any[] = [];
for (let i = 0; i < numRows; i++) {
    rows.push({id: i});
}
_.keys(CredentialData).forEach((key, index) => {
    columns.push({
        field: key,
        headerName: CredentialData[key].name,
        width: 130
    });
    for (let i = 0; i < numRows; i++) {
        rows[i][key] = key;
    }
});

interface Props {
  showRegisterNewUser: Function
}

export default class RegistrationUserTable extends React.Component<Props> {
    render() {
        return (
            <Grid container
                justify="center">
                <div style={{width: '90%'}}>
                    <Grid container
                        justify="space-between">
                        <Typography component="h2"
                            variant="h4"
                            style={{display: 'inline-block'}}>Registration Entries</Typography>
                        <Button
                            className="accept"
                            onClick={() => this.props.showRegisterNewUser()}
                        >
              + Register New Entry
                        </Button>
                    </Grid>
                    <div style={{height: 400, width: '100%'}}>
                        <DataGrid rows={rows}
                            columns={columns}
                            pageSize={5}/>
                    </div>
                </div>
            </Grid>
        );
    }

}
