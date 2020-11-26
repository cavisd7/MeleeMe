import React from 'react';

import { WithStyles, withStyles, Theme, createStyles } from '@material-ui/core';
import Table, { TableProps } from '@material-ui/core/Table';

type Classes = 
    | 'root'
    ;

const styles = (theme: Theme) => (
    createStyles({
        root: {
            border: '1px solid #f4f4f4 !important',
            [theme.breakpoints.down('sm')]: {
                '& tbody > tr': {
                 
                },
                '& tr': {

                },
                '& td': {

                }
              }
        },
    })
);

interface Props extends TableProps {};

interface State {};

type CombinedProps = Props & WithStyles<Classes>;

class CustomTable extends React.Component<CombinedProps, State> {
    render () {
        const { classes, className, ...rest } = this.props;

        return (
            <div className={[className, classes.root].join(' ')}> 
                <Table>
                    {this.props.children}
                </Table>
            </div>
        );
    };
};

const styled = withStyles(styles);

export default styled(CustomTable);