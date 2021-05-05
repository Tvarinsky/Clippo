import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import axios, {AxiosError, AxiosResponse} from 'axios'
import {fetchClips} from './TwitchApi'
import qs from 'querystring'
export interface fetchOptions {
    period?: string;
    limit?: number;
    language?: string;
    game?: string;
    cursor?: string;
}

export const GetClips = async ({period, limit, language, game, cursor}: fetchOptions) => {

    let q

    if (language != null) {
        q = qs.stringify({
            period: period ? period : 'day',
            limit: limit ? limit : '10',
            language: language && language,
            game: game ? game : null,
            cursor: cursor ? cursor : null
        })
    } else {
        q = qs.stringify({
            period: period ? period : 'day',
            limit: limit ? limit : '10',
            game: game ? game : null,
            cursor: cursor && cursor
        })   
    }

    const clips = await fetchClips(q).then()
    const funcs = [];

    if (clips.clips?.length > 0){
        for (let clip of clips.clips){
            funcs.push(axios({
                method: 'POST',
                url: 'https://gql.twitch.tv/gql',
                data: {
                    operationName: "VideoAccessToken_Clip",
                    variables: {
                        slug: clip.slug
                    },
                    extensions: {
                        persistedQuery: {
                            version: 1,
                            sha256Hash: '36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11'
                        }
                    }
                },
                headers: {
                    "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko"
                }
            }).then(res => {
                clip.direct_url = res.data.data.clip.videoQualities[0].sourceURL
            }).catch(err => {
                clip = null
            })
            )
        }
    }
    await Promise.all(funcs)

    return {
        clips,
        cursor: clips.cursor
    } 
}