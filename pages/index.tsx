import {GetServerSideProps } from 'next'
import axios, {AxiosResponse, AxiosError} from 'axios'
import {useState, useEffect} from 'react'
import VideoPlayer from './components/videojs'
import {Clip} from '../types/twitchTypes'
import {fetchClips, fetchCategories} from '../utils/TwitchApi'
import { GetClips } from '../utils/GetClips'
import Slider from 'react-slick'
import { useSwipeable } from 'react-swipeable'

interface ClipObject {
  clips : {
    clips: Clip[],
    cursor: string;
  }
}

interface HomeProps {
  clips: ClipObject;
  categories: any[];
  cursor: any[];
}
 

const Home: React.FC<HomeProps> = ({clips, cursor, categories}) => {
  const [login, toggleLogin] = useState(false);
  const [signup, toggleSignup] = useState(false);
  const [currentClip, changeClip] = useState(0);
  const [categoriesList, toggleCatList] = useState(false);
  const [ClipState, setClipState] = useState<Array<Clip>>(clips.clips.clips as Clip[])
  const [currentGame, setCurrentGame] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [currentDate, setCurrentDate] = useState('day')


	const categoriesSlider = {
		slidesToShow: 3,
		slidesToScroll: 1,
    afterChange: async (index) => {
      let c = await GetClips({game: (index > 0 ? categories[index - 1].game.name : null), language: currentLanguage, period: currentDate}).then(res => res.clips)
      console.log(c, c.clips)
      setClipState(c.clips as Clip[])
      setCurrentGame(index > 0 ? categories[index - 1].game.name : 'All')
      toggleCatList(false)
      changeClip(0)
    },
		autoplay: false,
    centerPadding: 0,
    focusOnSelect:true,
		arrows: false,
    centerMode: true,
	}

  // useEffect(() => {
  //   const timer = new Promise<void>(resolve => {
  //     setTimeout(() => {
  //       changeClip(currentClip => currentClip != 9 ? currentClip + 1 : 0)
  //     }, klipchiki.clips[currentClip].duration * 1000)
  //     resolve()
  //   })
  // }, [currentClip])

  const handlers = useSwipeable({
    onSwipedUp: () => {
      if(currentClip != clips.clips.clips.length-1) {
        changeClip(currentClip + 1)
        console.log(currentClip, clips.clips.clips.length -1)
      } else if (currentClip >= clips.clips.clips.length -1) {
        async e => {
          let c = await GetClips({game: currentGame, language: currentLanguage, period: currentDate}).then(res => res.clips)
          setClipState(c.clips as Clip[])
          changeClip(0)
        }
      }
    },
    onSwipedDown: () => {
      if(currentClip > 0) {
        console.log(currentClip, clips.clips.clips.length -1)
        changeClip(currentClip - 1)
      }
    },
    delta: 50,
  });

  return (

    <>
    <>
      <div onClick={() => {toggleCatList(true)}} className="categories">
        <svg width="12" height="4" viewBox="0 0 12 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0.500031" y1="0.5" x2="11.5" y2="0.5" stroke="white"/>
        <line x1="0.500031" y1="3.5" x2="9.50003" y2="3.5" stroke="white"/>
        </svg>
      </div>

        {(ClipState && ClipState[currentClip]) && 
              <div className="aboutStreamer">
              <a href={ClipState[currentClip]?.broadcaster.channel_url} target="_blank">
                <img src={ClipState[currentClip]?.broadcaster.logo} alt=""/>
                <p>{ClipState[currentClip]?.broadcaster.display_name}</p>
              </a>
              <p className="title"><span>{ClipState[currentClip]?.title}</span></p>
              </div>
        }

      {(ClipState?.length > 0)?

      <VideoPlayer swipeable={handlers} autoplay={true}  src={ClipState[currentClip]?.direct_url} controls={false} />
      :
        async e => {
          let c = await GetClips({game: currentGame, language: currentLanguage, period: currentDate})
              console.log(c, c.clips)
              setClipState(c.clips as Clip[])
              changeClip(0)
              toggleCatList(false)
        }
      }

      <div className="categoriesSwiperContainer">
        <div className="swipeCategories">
          <Slider {...categoriesSlider}>
          <button value="">All</button>
          {categories.map((item, key) => (
          <button value={item.game.name} key={key} >{item.game.name}</button>
          ))}
          </Slider>
        </div>
      </div>




      <div className={categoriesList ? 'categoriesList activeList' : 'categoriesList'}>
        <div onClick={() => {toggleCatList(false)}} className="categories relative">
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0.69303" y1="7.60529" x2="9.69303" y2="0.605293" stroke="white"/>
            <line x1="1.14462" y1="0.458415" x2="10.3075" y2="7.60572" stroke="white"/>
          </svg>
          Close
        </div>

        <ul>
          <h5 style={{color: '#fff', marginLeft: '25px', position: 'relative', top: '15px', fontFamily: 'Poppins'}}>Filters:</h5>

          <p style={{color: '#fff', marginLeft: '25px', position: 'relative', fontSize: '10px', top: '10px', fontFamily: 'Poppins'}}>Language:</p>
          <select onChange={async e => {
                let c = await GetClips({game: currentGame, language: e.target.value, period: currentDate}).then(res => res.clips)
                console.log(c, c.clips)

                setCurrentLanguage(e.target.value)
                setClipState(c.clips as Clip[])
                toggleCatList(false)
                changeClip(0)
          }}
          >
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>

          <p style={{color: '#fff', marginLeft: '25px', position: 'relative', fontSize: '10px', top: '10px', fontFamily: 'Poppins'}}>For the last:</p>
          <select onChange={async e => {
            let c = await GetClips({game: currentGame, language: currentLanguage, period: e.target.value}).then(res => res.clips)
            console.log(c, c.clips)

            setClipState(c.clips as Clip[])
            setCurrentDate(e.target.value)
            changeClip(0)
            toggleCatList(false)
          }}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="all">All time</option>
          </select>

        </ul>
      </div>

    </>


  <div className="container auth">
    <div className="row">
      <div className={!login && !signup ? 'welcome active__block' : 'welcome'}>
        <img src="/play.svg" alt=""/>
        <h1>Clippo</h1>
        <h5>Highlights of your loved streamers</h5>


        <div className="buttons">
          <a onClick={() => {toggleLogin(true)}} className="bordered__btn" href="#">LOGIN</a>
          <a onClick={() => {toggleSignup(true)}} className="filled__btn" href="#">SIGN UP</a>
        </div>
      </div>
    </div>

    <div className={login ? 'login active__block' : 'login'}>
      <div onClick={() => {toggleLogin(false)}} className="backbtn">« Back</div>
      <div onClick={() => {toggleLogin(false); toggleSignup(true);}} className="signup_toggler">Sign up</div>

      <input type="text" placeholder="Login or email"/>
      <input type="password" placeholder="Password"/>
      <a className="forgotpswd" href="#">Forgot password?</a>

      <button className="filled__btn">LOGIN</button>
    </div>

    <div className={signup ? 'signup active__block' : 'signup'}>
      <div onClick={() => {toggleSignup(false)}} className="backbtn">« Back</div>
      <div onClick={() => {toggleLogin(true); toggleSignup(false);}} className="signup_toggler">Login</div>


      <input type="text" placeholder="Login"/>
      <input type="text" placeholder="E-Mail"/>          
      <input type="password" placeholder="Password"/>
      <button className="filled__btn">SIGN UP</button>
    </div>

  </div>
  </>
  )
}

export const getServerSideProps: GetServerSideProps = async () =>  {
  const clips = await GetClips({})
  const cursor = await fetchClips()
  const categories = await fetchCategories()
  return { props: { clips, cursor, categories } }
}

export default Home