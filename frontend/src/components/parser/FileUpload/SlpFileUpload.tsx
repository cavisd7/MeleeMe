import React from 'react';
import * as uuid from 'uuid';
import { RouteComponentProps } from 'react-router-dom';

import { apiv1, v1Request } from 'api/index'
import { SlpMatchData } from '../../../store/parser/types';

import Grid from '@material-ui/core/Grid';

import SlpFileUploadInput from './SlpFileUploadInput';
import FileList from './FileList';

interface F {
    name: string;
    size: number;
    completed: number;
}

interface Props {
    history: RouteComponentProps['history'];
    //slpFileUpload: (data: any, request: any) => Promise<any>;
    setParsedSlpGames: (gameSet: { setId: string; games: SlpMatchData[]; }) => void;
}

const SlpFileUpload: React.FC<Props> = (props) => {
    const { history, setParsedSlpGames } = props;

    const [files, setFiles] = React.useState<File[]>([]);
    const [filesTest, setfilesTest] = React.useState<F[]>([]);
    const [progress, setProgress] = React.useState<number[]>([]);
    const [waitingMessage, setWaitingMessage] = React.useState(false);

    const addFiles = (files: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...files]);
        setfilesTest(prevFiles => [...prevFiles, ...files.map(file => {
            return {
                name: file.name, 
                size: file.size, 
                completed: 0
            }
        })]);
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.slice(0);
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);

        const updatedfilesTest = filesTest.slice(0);
        updatedfilesTest.splice(index, 1);
        setfilesTest(updatedfilesTest);
    }

    const watchProgress = (index) => (progressEvent) => {
        //TODO: fix
        setfilesTest(prevState => {
            return prevState.map((file, j) => {
                if (j === index) {
                    return {
                        ...file,
                        completed: progressEvent.loaded,
                        size: progressEvent.total
                    }
                } else return file;
            })
        })

        if (progressEvent.loaded === progressEvent.total) {
            setWaitingMessage(true);
        }
    };

    const handleSubmit = (_: React.MouseEvent<HTMLElement>) => {
        const requests: Promise<any>[] = [];

        const data = new FormData();
        files.forEach((file, i) => {
            data.append(`slp_replay${i}`, files[i], files[i].name);

            const request = v1Request(
                { 
                    url: '/parser/parse', 
                    method: 'post', 
                    data, 
                    onUploadProgress: watchProgress(i) 
                }
            ).then(res => res.data);

            requests.push(request);
            //requests.push(slpFileUpload(data, request));
        });

        Promise.all(requests)
            .then(res => {
                const setId = uuid.v4();
                setParsedSlpGames({ setId, games: res[0] });//TODO: fix
                history.push(`/parser/${setId}/0`);
            })
            .catch(err => {
                console.log('error uploading', err)
                //TODO: set errors
            })
    };

    return (
        <Grid item container justify='center' >
            <Grid item xs={12} md={8} className='space-bottom'>
                <SlpFileUploadInput addFiles={addFiles}/>
            </Grid>
            <Grid item xs={12}>
                <FileList 
                    showWaitingMessage={waitingMessage}
                    files={filesTest} 
                    submit={handleSubmit} 
                    removeFile={removeFile}
                />
            </Grid>
        </Grid>
    );
};

export default SlpFileUpload;