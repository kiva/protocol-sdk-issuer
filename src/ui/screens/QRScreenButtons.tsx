import * as React from 'react';
import I18n from '../utils/I18n';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export interface QRButtonProps {
  onClickBack(): void,
}

export class QRScreenButtons extends React.Component<QRButtonProps> {
  render() {
    return (
      <Grid container
        className="qrButtons buttonListNew row"
        direction="row"
        justify="center"
        alignItems="center">
        <Grid item>
          <Button
            data-cy="qr-back"
            className="back"
            onClick={this.props.onClickBack}>
            {I18n.getKey('BACK')}
          </Button>
        </Grid>
      </Grid>
    );
  }
}
