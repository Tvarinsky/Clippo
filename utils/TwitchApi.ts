import axios, {AxiosResponse, AxiosError} from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'querystring'
import {Clip} from '../types/twitchTypes'

interface ResponseObject {
    clips?: Clip[];
    cursor?: string;
    message?: string;
}

export const fetchClips = async (q?: string): Promise<ResponseObject> => {


    const allClips = await axios({ 
        method: 'GET',
        url: `https://api.twitch.tv/kraken/clips/top?${q}`,
        headers: {
          'client-id': 'y8wr0l5vgyup39b7yftjfs61eih3ik',
          'accept': 'application/vnd.twitchtv.v5+json'
        }
    }).then((res: AxiosResponse) => res.data).catch((err: AxiosError) => err.message)

    return {
        clips: allClips.clips,
        cursor: allClips._cursor
    }
}
export const fetchCategories = async () => {
    const categories = await axios({
        method: 'GET',
        url: 'https://api.twitch.tv/kraken/games/top?&limit=100',
        headers: {
            'client-id': 'y8wr0l5vgyup39b7yftjfs61eih3ik',
            'accept': 'application/vnd.twitchtv.v5+json'
        }
    }).then(res => res.data).catch(err => err.message)
    if (categories.top){
        return categories.top
    }
    else{
        return 'Error! something went wrong.'
    }
}