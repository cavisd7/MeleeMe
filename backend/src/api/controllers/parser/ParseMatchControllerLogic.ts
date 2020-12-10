import AWS from 'aws-sdk';
import SlippiGame from '@slippi/slippi-js';

import config from '../../../infra/config';
import { ServerLogger } from '../../../infra/utils/logging';
import { ControllerLogic } from '../ControllerLogic';

import { Either, left, right } from '../../../infra/utils/Result';
import { GenericServerError } from '../../../infra/errors/api/ServerError/GenericServerError';
import { SlpMatchData } from '../../../types/slp';

type Response = Either<Error, SlpMatchData[]>;

class ParseMatchControllerLogic implements ControllerLogic<null, Response> {
    constructor () {};

    public async execute (slpPath: any[]): Promise<Response> {
        const s3 = new AWS.S3();
        let parsedMatches: SlpMatchData[] = [];

        const requests = slpPath.map((match, i) => {
            return new Promise((resolve, reject) => {
                let chunks = [];

                s3.getObject({ Bucket: config.aws.parserBucket, Key: match })
                    .createReadStream()
                    .on('data', (data) => {
                        chunks.push(Buffer.from(data))
                    })
                    .on('end', () => {
                        console.log('buffer end')
                        resolve(Buffer.concat(chunks))
                    })
                    .on('error', (err) => {
                        reject(err)
                    })
            })
        })

        await Promise.all(requests)
            .then(res => {
                res.forEach((matchBuffer, i) => {
                    const game = new SlippiGame(matchBuffer as any);
                    const settings = game.getSettings();
                    const stats = game.getStats();
                    const metadata = game.getMetadata();

                    parsedMatches.push({
                        info: {
                            name: slpPath[i],
                            stage: settings.stageId,
                            duration: stats.lastFrame,
                            playedOn: metadata?.playedOn || 'Unknown',
                            slpVersion: settings.slpVersion
                        },
                        players: settings.players.map((player, j) => {
                            return {
                                nametag: player.nametag,
                                //playerIndex: stats.overall[j].playerIndex,
                                character: player.characterId,
                                port: player.port,
                                controllerFix: player.controllerFix || 'None', //
                                stats: {
                                    inputCount: stats.overall[j].inputCount,
                                    conversionCount: stats.overall[j].conversionCount,
                                    totalDamage: stats.overall[j].totalDamage,
                                    killCount: stats.overall[j].killCount,
                                    successfulConversions: stats.overall[j].successfulConversions,
                                    inputsPerMinute: stats.overall[j].inputsPerMinute,
                                    openingsPerKill: stats.overall[j].openingsPerKill,
                                    damagePerOpening: stats.overall[j].damagePerOpening,
                                    neutralWinRatio: stats.overall[j].neutralWinRatio,
                                    counterHitRatio: stats.overall[j].counterHitRatio,
                                    beneficialTradeRatio: stats.overall[j].beneficialTradeRatio
                                },
                                actions: {
                                    wavedashCount: stats.actionCounts[j].wavedashCount,
                                    wavelandCount: stats.actionCounts[j].wavelandCount,
                                    airDodgeCount: stats.actionCounts[j].airDodgeCount,
                                    dashDanceCount: stats.actionCounts[j].dashDanceCount,
                                    spotDodgeCount: stats.actionCounts[j].spotDodgeCount,
                                    ledgegrabCount: stats.actionCounts[j].ledgegrabCount,
                                    rollCount: stats.actionCounts[j].rollCount,
                                }
                            }
                        })
                    });
                })
            })
            .catch(err => {
                ServerLogger.error('Error making S3 requests');

                return left<GenericServerError>(new GenericServerError())
            })

        return right<SlpMatchData[]>(parsedMatches);
    };
};

export { ParseMatchControllerLogic };