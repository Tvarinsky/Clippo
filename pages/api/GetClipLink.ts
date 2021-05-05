import type { NextApiRequest, NextApiResponse } from 'next'
import axios, {AxiosError, AxiosResponse} from 'axios'


const GetClipLink = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body.slug || req.body.slug?.length == 0){
        return res.status(400).json({ error: 'Bad request' })
    }

    const clipLinks = [];
    const funcs = [];


    const getPromises = () => {
        for (const link of req.body.slug){
            
            funcs.push (axios({
                method: 'POST',
                url: 'https://gql.twitch.tv/gql',
                data: {
                    operationName: "VideoAccessToken_Clip",
                    variables: {
                        slug: link
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
                clipLinks.push(res.data.data.clip.videoQualities[0].sourceURL)
            }))

        }
    }

    getPromises();

    await Promise.all(funcs)
    
    return res.status(200).json(clipLinks)

    }



export default GetClipLink