import React from 'react';

import { 
    createStyles, 
    Theme, 
    withStyles, 
    WithStyles
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import FileCopyIcon from '@material-ui/icons/FileCopy';

type Classes =
    | 'paper'
    | 'container'
    | 'icon'
    ;

const styles = (theme: Theme) =>
    createStyles({
        paper: {
            //minWidth: '600px',
            minHeight: '300px', 
            padding: '1rem', 
            boxShadow: 'none', 
            border: 'dotted 3px #cce2ff', 
            borderRadius: '8px', 
            backgroundColor: '#f5f9ff'
        },
        container: {
            minHeight: '300px'
        },
        icon: {
            width: '60px', 
            height: '60px'
        }
    });

interface Props {
    addFiles: (files: File[]) => void;
};

interface State {
    error: boolean;
    errors: any[];
    files: File[];
};

type CombinedProps = Props & WithStyles<Classes>;

class SlpFileUploadInput extends React.Component<CombinedProps, State, any> {
    private slpInputRef: React.RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            errors: [],
            files: []
        };

        this.slpInputRef = React.createRef();
    };

    componentDidUpdate() {
        console.log(this.state)
    }

    handleDragOver = (e) => {
        e.preventDefault();
    }
    
    handleDragEnter = (e) => {
        e.preventDefault();
    }
    
    handleDragLeave = (e) => {
        e.preventDefault();
    }

    handleFileDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();

        if (e.dataTransfer.files && this.state.files.length < 6) {
            this.validateFiles(e.dataTransfer.files);
        } else {
            this.setState({ error: true });
        }
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement & { files: File[] }>) => {
        if (e.target.files) {
            this.validateFiles(e.target.files);
        };
    };

    validateFiles = (files: FileList) => {
        let validFiles: File[] = [];
        let errors: any[] = [];

        for (let i = 0; i < files.length; i++) {
            const ext = files[i].name.match(/(?:\.([^.]+))?$/)[1];

            if (ext === 'slp' && files[i].size < 20 * 1000000) {
                validFiles.push(files[i]);
            } else {
                errors.push({ fileName: files[i].name, index: i, message: 'Invalid extension type. Only .slp files are allowed.' })
            };
        };

        this.props.addFiles(validFiles);
        //this.setState(prevState => { return { files: [...prevState.files, ...validFiles], errors: [...errors] }});
    };

    render() {
        const { classes } = this.props;

        return (
            <Paper 
                className={classes.paper}
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleFileDrop}
            >
                <Grid className={classes.container} container direction='column' justify='center' alignItems='center'>
                    <Grid item style={{ padding: '1rem' }}>
                        <FileCopyIcon className={classes.icon} />
                    </Grid>
                    <Grid item>
                        <Typography variant='h6'>Drag and drop your .slp files here</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle2'>Or click <Link onClick={(e) => this.slpInputRef.current.click()}>here</Link> to browse</Typography>
                        <input type="file" ref={this.slpInputRef} style={{display: 'none'}} name="slpFileInput" onChange={this.handleChange}/>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
};

const styled = withStyles(styles)

export default styled(SlpFileUploadInput);