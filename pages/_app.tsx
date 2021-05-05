import '../styles/globals.css'
import '../styles/index.css'

import Head from 'next/head'
function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"></link>
  </Head>

    <Component {...pageProps} />
    </>
  )
}

export default MyApp
