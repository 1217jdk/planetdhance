
import React, { CSSProperties, SetStateAction, useState, useEffect, useRef } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { IconButton, Checkbox } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowBack from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';


import myVideo from '../videos/Patissiere_guide.mp4';
import myVideo2 from '../videos/anysong_guide.mp4';
import myVideo3 from '../videos/Forever1_guide.mp4';
import myVideo4 from '../videos/hot_guide.mp4';
import myVideo5 from '../videos/LoveDive_guide.mp4';
import myVideo6 from '../videos/pop_guide.mp4';
import myVideo7 from '../videos/PtoD_guide.mp4';
import myVideo8 from '../videos/SorrySorry_guide2.mp4';
import myVideo9 from '../videos/sparkling_guide.mp4';
import myVideo10 from '../videos/Tomboy_guide.mp4';
import myVideo11 from '../videos/TT_guide.mp4';

import '../styles/App.css';
import "../styles/styles.css";
import Emoji from '../components/Emoji';


import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';

import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';

import GuideImage from '../components/UI/GuideImg';
import GuideImageBig from '../components/UI/GuideImgBig'

//--------------------------------------------------------------
//
// 티쳐블 머신
//
//---------------------------------------------------------------------------
import * as tmPose from '@teachablemachine/pose';
// import song from "./static/song1/temp1.json";
// import song from "./static/pop/chart.json";
import song from "./static/PtoD/chart.json";
import song30 from "./static/30/chart.json";
import song34 from "./static/34/chart.json";
import song38 from "./static/38/chart.json";
import song42 from "./static/42/chart.json";
import song46 from "./static/46/chart.json";
import song50 from "./static/50/chart.json";
import song54 from "./static/54/chart.json";
import song58 from "./static/58/chart.json";
import song62 from "./static/62/chart.json";
import song66 from "./static/66/chart.json";

//--------------------------------------------------------------
//
// upload 페이지로 데이터 전송
//
//---------------------------------------------------------------------------
import { Navigate, useNavigate } from 'react-router-dom';


//----------------------------------------------------------------------------------
//
// API 
//
// ----------------------------------------------------------------------------------
import { challenge } from '../components/API/MusicService';
import { useParams } from 'react-router-dom';
import { rootState } from '../reducer';
import { useSelector } from 'react-redux';

//---------------------------------------------------------------------
//      webcam 부분 1/2
//
//---------------------------------------------------------------------------------
import {
  RecordWebcam,
  useRecordWebcam,
  CAMERA_STATUS
} from "react-record-webcam";
import type {
  WebcamRenderProps,
  RecordWebcamOptions,
  RecordWebcamHook
} from "react-record-webcam";
import { CloseFullscreenOutlined } from '@mui/icons-material';


const OPTIONS: RecordWebcamOptions = {
  // 위치 찾아보기
  filename: "test-filename",
  fileType: "mp4",
  width: 260,
  height: 400,
  aspectRatio : 2,
};



//---------------------------------------------------------------------------------
//
//      1. 전체 CSS
//
//---------------------------------------------------------------------------------
const progressStyle: CSSProperties = {
  position: 'absolute',
  width: '100vw',
  height: '7px',
  backgroundColor: 'gray',
};


const videoZone: CSSProperties = {
  position: 'relative',
};


// 전체 페이지 상태 1 / 2
const notMode : CSSProperties = {
  display : 'none'
};

const notChallenging : CSSProperties = {
  display : 'none'
};

const notEndChallenge : CSSProperties = {
  display : 'none'
};

const scaled: CSSProperties = {

  transform : 'scaleX(-1)',
};

//---------------------------------------------------------------------------------
//
//      2. 모드 선택 부분 CSS : main <-> sub 바꾸는 부분  : mode
//
//---------------------------------------------------------------------------------

const subcamStyle: CSSProperties = {
  position: 'absolute',
  zIndex : '1',
  top: '5.5vh',
  left : '65vw',
  width: '35vw',
  height: '30vh',
  transform : 'scaleX(-1)',
};


const maincamStyle: CSSProperties = {
  position: 'absolute',
  top : '15vh',
  width: '100vw',
  height: '65vh',
  transform : 'scaleX(-1)',
  backgroundColor: 'rgba( 6, 3, 24, 1 )',
};

const subplayerStyle: CSSProperties = {
  position: 'absolute',
  top : '9vh',
  left : '65vw',
  width: '35vw',
  height: '5vh',
  backgroundColor: 'rgba( 6, 3, 24, 1 )',
};


const mainplayerStyle: CSSProperties = {
  position: 'absolute',
  backgroundColor: 'rgba( 6, 3, 24, 1 )',

};

const challengeStartStyle: CSSProperties = {
  position: 'absolute',
  top: '85vh',
  left: '35vw',
  width: '30vw',
  height: '5vh',
  border : '0',
  // color : 'red',
  color : 'rgba(255,0,0,1)'
};

const disabledChallengeStartStyle: CSSProperties = {
  position: 'absolute',
  top: '85vh',
  left: '35vw',
  width: '30vw',
  height: '5vh',
  border : '0',
  color : 'rgba(255,0,0,0.5)'
};


const backToSongPageStyle: CSSProperties = {
  position: 'absolute',
  top: '5vh',
  left: '10px',
  width : '8vw',
  height : '8vw',
};

const muteStyle: CSSProperties = {
  position: 'absolute',
  top: '26vh',
  left: '5vw',
  width: '10vw',
  height: '10vw',
  border : '0',
  color : 'white'
};

const playPauseStyle: CSSProperties = {
  position: 'absolute',
  top: '45vh',
  left: '45vw',
  width: '10vw',
  height: '10vw',
  color : 'white',
  

};

const timerStyle: CSSProperties = {
  position: 'absolute',
  top: '45vh',
  left: '45vw',
  width: '10vw',
  height: '10vw',
  fontSize : '20vw'
};


const modeStyle: CSSProperties = {
  position: 'absolute',
  top: '20vh',
  left: '5vw',
  width: '10vw',
  height: '10vw',
  border : '0'
};




//---------------------------------------------------------------------------------
//
//      3. 챌린지 진행 부분 CSS : challenging
//
//---------------------------------------------------------------------------------


const backToModeStyle: CSSProperties = {
  position: 'absolute',
  top: '5vh',
  left: '10px',
  width : '8vw',
  height : '8vw',
  // backgroundColor: 'rgba( 255, 255, 255, 1 )',
  // border : '0'
};


//---------------------------------------------------------------------------------
//
//      3. 챌린지 끝난 부분 CSS : endChallenge 
//
//---------------------------------------------------------------------------------

const endChallengePlay : CSSProperties = {
  top : '40vh',
  left : '43vw'
}


const endChallengePrev : CSSProperties = {
  position: 'absolute',
  top: '70vh',
  left: '30vw',
  width: '20vw',
  height: '10vh',
  backgroundColor: 'rgba( 0, 0, 255, 0.5 )',
  border : '0'
}
const endChallengeNext : CSSProperties = {
  position: 'absolute',
  top: '70vh',
  left: '50vw',
  width: '20vw',
  height: '10vh',
  backgroundColor: 'rgba( 0, 0, 255, 0.5 )',
  border : '0'
}
   



//---------------------------------------------------------------------------------
//
//      4. Interface
//
//---------------------------------------------------------------------------------

interface playProps {
  url: string;
  playing: boolean;
  muted: boolean;
  played: number;
  loaded: number;
}





export default function ModeChallengeTimer() {
//-------------------------------------------------------------------------------
//
//   API
//  
//------------------------------------------------------------------------------
const { musicId, userId } = useParams();
const [data, setData] = useState([]);
const { isAuthenticated, user } = useSelector(
  (state: rootState) => state.authReducer
);

let songs = {30:song30, 34:song34, 38:song38, 42 : song42, 
              46:song46, 50:song50, 54:song54, 58:song58, 62:song62, 66:song66}
// console.log(songs[musicId])
console.log(songs[30])

// taglist들을 받아와서 썸네일 페이지 까지 무사히 전달해주면 됨
useEffect(() => {
  const getMusic = async () => {
    const getMusic = await challenge(
      parseInt(musicId),
      user.userId
    ).then((results) => {
      setData(results);
    });
  };
  getMusic();
  console.log('getdata');
}, []);


//---------------------------------------------------------------------------------
//
//      5. 전체 페이지 상태 2 / 2 -  mode,  challenging, endChallenge 3가지 존재
//
//---------------------------------------------------------------------------------
let [now, setNow] = useState('mode');


//
//      6. webcam 부분 2/2 - webcam 생성 및 custom hook & 녹화 영상 Blob
//
//---------------------------------------------------------------------------------
  
const recordWebcam: RecordWebcamHook = useRecordWebcam(OPTIONS);

const [videoFile, setVideoFile] = useState<Blob>()

const [uploadData, setUploadData] = useState([])

  // --------------------------------------------------------------------------------------
  //
  //      7. 데이터 서버에 전송할 비디오 저장
  //
  //-----------------------------------------------------------------------------------------------
  // 웹캠 데이터 저장
  const getRecordingFileHooks = async () => {
    const blob = await recordWebcam.getRecording();
    console.log({ blob });
    
    
    setVideoFile(blob)  // 이거를 upload 페이지로 전송
  };


//---------------------------------------------------------------------------------
//
//      8. 여러 곳에서 쓰이는 hook
//
//---------------------------------------------------------------------------------

// 안무티칭 & 모드선택 페이지로 뒤로가기
const backToMode = () => {
 
  // 1. challenging에서 가는 경우
  if (now==='challenging'){
    recordWebcam.stop();
    console.log('debug 1 == recording stop')
    
  }
  
  // 2. endChallenge에서 가는 경우
  else if (now==='endChallenge'){
    document.getElementById('webcam').style.display = "block";
    document.getElementById('prevcam').style.display = "none"
  }
  
  setTimeout(recordWebcam.retake,500);
  setPlayState({ ...playState, played: 0}); // 티handlePlayPausepla칭영상 새로시작1
  player.current.seekTo(0); // 티칭영상 새로시작1
  console.log(recordWebcam.status)
  setNow('mode');
  console.log('현재 state는 ', {now}, '입니다.')
  
};


//---------------------------------------------------------------------------------
//
//     8. ReactPlayer 관련 hook & data
//
//---------------------------------------------------------------------------------

const player = useRef(null);


const [playState, setPlayState] = useState<playProps>({
  url: '',
  playing: true,
  muted: true,
  played: 0,
  loaded: 0,
});

const { url, playing, muted, played, loaded } = playState;


const handlePlayPause = () => {
  setPlayState({ ...playState, playing: !playing });

};
const handleToggleMuted = () => {
  console.log('muted', muted);
  setPlayState({ ...playState, muted: !muted });
};


const handlePlay = () => {
  console.log('handlePlay 함수 호출');
  // init()

  // 현재 OPEN이 아닌 경우, 카메라 켜기
  if (recordWebcam.status !== CAMERA_STATUS.OPEN  )
  {recordWebcam.open()
    console.log('카메라 켜기')
    
    // endChallenge에서 다시보기 하는 경우 endChallenge에서는 실행되면 안됨
    if (now!=='endChallenge') { 
      document.getElementById('webcam').style.display = "block";
      document.getElementById('prevcam').style.display = "none";
      
    }
  }
  
  // 정지 상태에서 다시 재생되는 경우
  if (playing===false){
    console.log('handlePlay 함수 실행');

    setPlayState({ ...playState, playing: true });
    
    // endChallenge에서 다시보기 하는 경우 endChallenge에서는 실행되면 안됨
    if (now!=='endChallenge') {
      document.getElementById('webcam').style.display = "block";
      document.getElementById('prevcam').style.display = "none";
    }
    console.log('debug ' ,recordWebcam.status)
    
    // OPEN이 아닌 경우에만 OPEN
    if (recordWebcam.status !== CAMERA_STATUS.OPEN  )
    {recordWebcam.open()
      console.log('카메라 켜기')}
      
    };
  }

const handlePause = () => {
  console.log('onPause');
  setPlayState({ ...playState, playing: false });
};    


const handleProgress = (state: ReactPlayerProps) => {
  const inState = {
    ...playState,
    ...state,
  };
  console.log('onProgress', inState);
  console.log('웹캠상태 :', recordWebcam.status);
  console.log('화면상태 :', now);
  console.log('받아온 데이터',data)
  setPlayState(inState as SetStateAction<playProps>);
  
  // 영상이 재생중이고, 녹화중이면, 스냅샷찍기
  if (recordWebcam.status === CAMERA_STATUS.RECORDING){
    snap()
    setTimeout(snap,200)
    setTimeout(snap,400)
    setTimeout(snap,600)
    setTimeout(snap,800)
  }
};



const challengeEnd =  () => {
  clearInterval(Ref.current) // 타이머에 쌓인 것들 초기화
  console.log('안무티칭 영상이 끝났습니다. 웹캠의 현재상태 : ',recordWebcam.status)
  // recording이 아닐 때, 그냥 영상만 다 본 경우는 작동하지 않아야 함
  if (recordWebcam.status === CAMERA_STATUS.RECORDING)
  { 
    setNow('endChallenge')
    recordWebcam.stop();
    console.log('debug 2 == recording stop')
    console.log('안무티칭영상이 끝났습니다.')
    console.log(recordWebcam.status,'before stop')
    console.log('웹캠 녹화가 종료되었습니다.');
    console.log(recordWebcam.status,'after stop')
    

    
    // endChallenge page 관련
    setTimeout(()=>{
      // setNow('endChallenge')
      mode2()   // 1. 영상 위치 바꾸기
      document.getElementById('prevcam').style.display = "block";
      document.getElementById('webcam').style.display = "none";
    },1000)
  }

  
    // Blob 생성
    setTimeout(getRecordingFileHooks, 1000);

    console.log(now,'현재 상태')

}




//---------------------------------------------------------------------------------
//
//      9. mode에서 쓰이는 hook & data
//
//---------------------------------------------------------------------------------
// 있어야 하는 데이터
// ReactPalyer : width "35vw"/"100vh", height "50vw"/"100vh", style subplayerStyle/mainplayerStyle
// video : maincamStyle/subcamStyle

let [reactPlayer, reactPlayerChange] = useState(['main','100vw','100vh']);
let [reactPlayerBackground, reactPlayerBackgroundChange] = useState(mainplayerStyle);
let [reactCamStyle, reactCamStyleChange] = useState(subcamStyle);

// 곡 선택페이지로 뒤로가기
const backToSongPage = () => {
      setNow('mode')
      recordWebcam.close()
      
    };
  
    
  // 안무영상이 main / 내 영상이 sub
  function mode1(){
    console.log('버튼이 클릭됨')
    if (reactPlayer[0]==='sub'){
      // 안무영상 부분
      let newData = [...reactPlayer]
      newData[0]='main'
      newData[1]='100vw'
      newData[2]='100vh'
      reactPlayerChange(newData);
      reactPlayerBackgroundChange(mainplayerStyle);
      
      // 내 영상 부분
      reactCamStyleChange(subcamStyle);
    }

  }


  // 안무 영상이 sub / 내 영상이 main
  function mode2(){
    if (reactPlayer[0]==='main'){
      // 안무영상 부분
      let newData = [...reactPlayer]
      newData[0]='sub'
      newData[1]='35vw'
      newData[2]='30vh'
      reactPlayerChange(newData);
      reactPlayerBackgroundChange(subplayerStyle);
      
      // 내 영상 부분
      reactCamStyleChange(maincamStyle);
    } 

  }
  
//---------------------------------------------------------------------------------
//
//      10. mode에서 쓰이는 hook & data 2 - timer 만
//
//---------------------------------------------------------------------------------
const Ref = useRef(null);
  
// The state for our timer
    const [timer, setTimer] = useState('');

    
    const getTimeRemaining = (e:any) => {
      // console.log('getTimeRemaining and e : ', e)
        const total = Date.parse(e) - Date.parse(new Date().toString());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
          };
    }
  
  
    const startTimer = (e:any) => {
      // 타이머 시작시, 페이지 설정 변경  
      // console.log(Ref.current)
      let { total, hours, minutes, seconds } 
      = getTimeRemaining(e);
      console.log('debug 1 : total & second is', total, seconds)
        if (seconds >= 0) {
          //  console.log('debug 2 : total & seconds is ', total, seconds)
            setTimer(
                (hours > -1 ? ' ' : ' ') + 
                (minutes > -1 ? ' ': ' ' )+ 
                (seconds > -1 ? seconds : ' ')
            )
            
          }else if(seconds===-1){ // seconds===-1 로 안하면, 계속 실행됨
            // console.log('debug 3 : total & seconds is ',total, seconds)
            
            // 0초가 되면 타이머 사라짐
            
            setTimer(
              (hours > -1 ? ' ' : ' ') + 
            (minutes > -1 ? ' ': ' ' )+ 
            (seconds > -1 ? ' ' : ' ') )


            if (!(recordWebcam.status === CAMERA_STATUS.CLOSED ||
              recordWebcam.status === CAMERA_STATUS.RECORDING ||
              recordWebcam.status === CAMERA_STATUS.PREVIEW))
            {
              // console.log('time to start recording');

              // 타이머 완료시, 실행
              clearInterval(Ref.current)
              // setNow('challenging');
              setPlayState({ ...playState, played: 0}); // 티칭영상 새로시작1
              // console.log('debug1')
              handlePlay()
              player.current.seekTo(0); // 티칭영상 새로시작1
              console.log(CAMERA_STATUS)
              console.log(recordWebcam.status)
              recordWebcam.start();  // 내 캠 녹화 시작
              init()
              clearInterval(Ref.current) // 타이머에 쌓인 것들 초기화
           }
          }
        }
        
        
        const clearTimer = (e:any) => {
          // 처음 시간 설정해 주는 부분
          console.log('clearTimer')
          setTimer('3');
          if (Ref.current) clearInterval(Ref.current);
          const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
        
    }

  
    const getDeadTime = () => {
        let deadline = new Date();
  
        // This is where you need to adjust if 
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 3);
        console.log('getDeadTime')
        return deadline;
    }
  
    const onClickReset = () => {
      setNow('challenging');
        
      clearTimer(getDeadTime());
        console.log('onClickReset')
      }
      
      
      
      

      
//---------------------------------------------------------------------------------
//
//      11. endChallenge에서 쓰이는 hook 1 - 영상 재생 및 데이터 전송 & 페이지 이동 관련
//
//---------------------------------------------------------------------------------


  // 데이터 전송 및 이동
  const navigate = useNavigate(); // upload 페이지로 데이터 전송하기 위해서
  const goToUpload = () => {
    
    const inputFile = uploadData
    console.log(inputFile);
    

    navigate('/test', {
      state : {
        videoBlob : {videoFile},
        thumbnail : {thumbnail}
      }
    }
    )
  }


  // 녹화한 영상 재생하기
  // 해야할 것 : 1. 영상 위치 바뀌어 있음 / 2. Reactplayer 다시 재생시키기 /  3.내 영상 재생 /4. 뒤로가기 버튼(setNow('mode'), previewRef->webcamRef)
  const playPrev = () => {
    console.log('playPrev')
    let video : HTMLVideoElement = document.querySelector('#prevcam');
    
    // 2. Reactplayer 다시 재생시키기
    setPlayState({ ...playState, played: 0}); // 티칭영상 새로시작1
    handlePlay()
    player.current.seekTo(0); // 티칭영상 새로시작1
    
    //  3. 내 녹화 영상 재생
    video.play();  //  
  }

  /*---------------------------------------------------------------------------------
//
//      12. endChallenge에서 쓰이는 hook & data 2 - 썸네일 관련
//
썸네일 설명
1. <canvas ref={canvasRef}>를 생성 & <video ref={캡쳐할 영상} > 생성
2. VideoRef.current = 위의 video 를 QuerySelector로 가져와서 넣어주기
3. component load 시, useEffect를 이용해서, canvasRef.current.width & heigth를 위의 VideoRef.width & height로 넣어주기
4. 3.을 통해 canvasRef.current가 존재한다면  context = canvasRef.current.getContext('2d'); 를 이용해 context 생성
5. snap() 함수를 이용해서 , context.drawImage이용해서 context 에 videoRef.current를 캡쳐 => canvasRef === canvas 에 그려짐
6. 캡쳐한 이미지가 canvas에 그려지므로, 이를 가져와서 저장  
const canvasHTML = document.querySelector('canvas');
const imgURL = canvasHTML.toDataURL('image/png');
// console.log([...thumbnail])
setThumbnail([...thumbnail, imgURL]);
//---------------------------------------------------------------------------------*/
  let videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>();  // context = canvasRef.current.getContext('2d'); error 제거
  const [dimensions, setDimensions] = useState<any>({});
  const [thumbnail, setThumbnail] = useState([]);
  let context : any;


  if (canvasRef.current) {
    context = canvasRef.current.getContext('2d');

    };
    

  
  function getVideoSizeData(videoRef: React.MutableRefObject<any> ) {
    // 썸네일 사진 크기 조절
    // const ratio = videoRef.current.videoWidth / videoRef.current.videoHeight;
    // const w = videoRef.current.videoWidth;
    // const h = videoRef.current.videoHeight;
    const ratio = 1/2;
    // webcam OPTIONS의 크기와 같게 해주어야 함!
    const w = 260;    
    const h = 400;
    return {
      ratio,
      w,
      h,
    };
  };



  
  useEffect(() => {
    
    console.log('--------------------정상작동-----------')
    const video = document.querySelector('video')  // 추가
    videoRef.current = video                       //추가
    console.log(videoRef.current)

    // video의 메타데이터(재생시간, 크기 등)가 올라오면, canvas의 크기와 dimension의 크기를 video와 같게 해줌
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', function () {
        const { w, h } = getVideoSizeData(videoRef);
        canvasRef.current.width = w;
        canvasRef.current.height = h;
        setDimensions({
          w: w,
          h: h,
        });
      });
    }
  }, []);


const [fliped, setFliped] = useState(false)

  // snap으로 canvas에 그린 것을 blob으로 가져오는 것
  async function snap() {

    await context.fillRect(0, 0, dimensions.w, dimensions.h);
    
    // 이미지 좌우 반전해서 drawImage 할 수 있도록-------------
    if (fliped === false){
      setFliped(true)
      console.log(fliped)
      await context.translate(dimensions.w, 0);
      await context.scale(-1, 1);
    }
    //--------------------------------------------------------
    // 이미지 그리기
    await context.drawImage(
      videoRef.current,
      0,
      0,
      dimensions.w,
      dimensions.h
      );

   
    const canvasHTML = document.querySelector('canvas');
    const imgURL = canvasHTML.toDataURL('image/png');
    setThumbnail([...thumbnail, imgURL]);
    // console.log(thumbnail) 
    // console.log(typeof(thumbnail)) 
    // console.log(thumbnail[0]) 
    };
// 썸네일 관련 끝----------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------
//
//    13. 티쳐블 머신
//
//-------------------------------------------------------------------------------------

// 티쳐블 머신용 사진 생성
const URL = "./static/30/";
  let model : any
  let ctx : any
  let labelContainer : any
  let maxPredictions : any

  let startTime : any;
  let countup : any // 1 = 0.1초
  let nextNote : any;
  let curMotionNum : number = 0 ;
  let max : any;


// 초기화
async function init() {
  // 곡의 모션 정보들
  const modelURL = URL + "model.json"; 
  const metadataURL = URL + "metadata.json";

  console.log(song);
  
  console.log('song is ', song)
  
  startTime = Date.now();
  startScoreTimer(song.duration);      // 이게 시작되어야, 현재 진행시간 countup이 update되어서, predict()에서 채점이 작동됨
  nextNote = song.notes[song.next];    // 몇 번째 맞춰야 하는 동작인지 초기화
  max = 0;                             // 예측 점수

  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  
  // 티쳐블 점수 파악 부분 1/4
  //라벨관련인데, 시각적으로 점수 보여줌
  /*labelContainer = document.getElementById("label-container");
  console.log('maxPredictions',maxPredictions)
  for (let i = 0; i < maxPredictions+1; i++) {   // 추가 1
  labelContainer.appendChild(document.createElement("div"));
  }*/
  predict()
}


// 영상 종료되는 시간
const startScoreTimer = function (duration : number) {
  // const display : any = document.querySelector(".summary__timer");  // display관련   // 티쳐블 점수 파악 부분 2/4 : display관련 전부
  const timer = duration;
  countup = 0;

  // display.style.display = "block";                                   // display관련
  // display.style.opacity = 1;                                         // display관련

  // 안무 시작된 후, 종료까지 시간 세기
  const songDurationInterval = setInterval(function () {
    // display.innerHTML = countup;                                    // display관련

    if (++countup > timer) {
      clearInterval(songDurationInterval);
    }
  }, 100);

  // 종료 이모지 넣기
  const end = song.duration*100 + 500
  console.log(end)
  setTimeout(
     ()=>{ 
    curMotionNum=0 
    setEmojis(prevState=>{ return [ ...prevState,  <Emoji emoji='💯'/>] }) },  end)
  console.log('setTimeout 실행됨')
};




async function predict () {
  console.log('-------predict 시작-----------')
    // 썸네일이 있다면
    if (context.canvas  ) {
        const { pose, posenetOutput } = await model.estimatePose(context.canvas); // 모델로 사진 평가
        const prediction = await model.predict(posenetOutput);  
        // prediction 은 예측 값으로 아래와 같은 형식
        /*
          (5) [{…}, {…}, {…}, {…}, {…}]
            0: {className: '좌상', probability: 0.05242524296045303}
            1: {className: '우상', probability: 0.0050522517412900925}
            2: {className: '대기', probability: 0.9000952839851379}
            3: {className: '좌이마', probability: 0.041525620967149734}
            4: {className: '우이마', probability: 0.0009016186813823879}
            length: 5
            [[Prototype]]: Array(0)
        */

        /* song은 다음과 같은 형식
        {
          "duration": 150,
          "next": 0,
          "notes": [
            { "duration": 10, "delay": 30, "type": "오른손" },
            { "duration": 10, "delay": 60, "type": "왼손" },
            { "duration": 10, "delay": 90, "type": "오른손" },
            { "duration": 10, "delay": 120, "type": "왼손" }
          ]
        }
        */
        console.log(prediction)
        
        
        // 채점하는 부분
        if (nextNote != null) {                         // 채점할 것이 있다면,
          setTimeout( predict , 300);                   //0.3초마다 predict() 실행
          if (
            // 시작시간 - 0.5초 < 현재시간 < delay + 1초 
            countup >= nextNote.delay -5 &&
            countup < nextNote.delay + nextNote.duration
          ) {
    
              for (let i = 0; i < maxPredictions; i++) {
                if (
                  prediction[i].className == nextNote.type &&  max < prediction[i].probability
                ) {
                  max = prediction[i].probability;
                }
              }
            
  
              // console.log("max is ,", max)
              // console.log("count up is ,", countup)
              // console.log("nextNote.dealy , nextNote.duration is ,", nextNote.delay, nextNote.duration)
              // console.log("curMotionNum is ,", curMotionNum)
              if (max>=0.8){

                showEffect(song.next, max);
                song.next++; // 다음 모션으로 넘어감
                nextNote = song.notes[song.next];
                max = 0.0; 
              }else if (countup >= nextNote.delay + nextNote.duration - 5) {  // 진행된시간 >= 모션 시작 + 1초 후
                //miss인지 good인지 판단
                showEffect(song.next,max);
                song.next++;  // 다음 모션으로 넘어감
                nextNote = song.notes[song.next];
                max = 0.0;
              }
              

          } 
        }


        // 티쳐블 점수 파악 부분  3/4
        // 예측 class
        /* const curMotion : string = nextNote['type']   
        labelContainer.childNodes[0].innerHTML ="현재 맞춰야할 동작:" + curMotion;  
        for (let i =0; i < maxPredictions; i++) {   
          const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);

          labelContainer.childNodes[i+1].innerHTML = classPrediction; 
        }*/
  }
  
};


// 0.8 이상이면 좋은 이모지
const [emojis, setEmojis] = useState<any[]>([])
function showEffect(songNext : number  , rate : number) {

  console.log(songNext, curMotionNum)
  
  // 현재 판단해야 하는 경우에만 진행
  if (songNext===curMotionNum){
    curMotionNum++
    console.log(curMotionNum)
    
    // 잘한 경우 이모지 넣기
    if (rate >= 0.8 ){
      const goodEmojiList = ['💘','💕','💖','💓','😍','🥰','😊','🤗','😻','👏','💋']
      let goodPick = goodEmojiList[ Math.floor(Math.random() * goodEmojiList.length)];
  
      setEmojis(prevState=>{
        return [ ...prevState,  <Emoji emoji={goodPick}/>]
      })
      console.log('good 이모지들어감')
    } 
    // 잘 못한 경우 이모지 넣기
    else{
      const badEmojiList = ['😝','😱','😈','😹']
      let badPick = badEmojiList[ Math.floor(Math.random() * badEmojiList.length)];
      setEmojis(prevState=>{
        return [ ...prevState,  <Emoji emoji={badPick}/>]
      })
      console.log('bad 이모지 들어감')
    }
  }
 
}



//---------------------------------------------------------------------------------

return (
    <div >

      {/* ---------------------------------------------------------------------------------------
      //
      //  1. 티쳐블 머신 관련 & 이모지
      //
      -----------------------------------------------------------------------------------------------*/}

      <div>
          {emojis}
          {/* // 티쳐블 점수 파악 부분 4/4 */}
          {/* <div className="summary__timer"></div> */}
          {/* <div id="label-container"></div>  */}

      </div>


       {/* ----------------------------------------------------------------------------------------
      //
      //           2. 썸네일 관련 
      //
      -----------------------------------------------------------------------------------------*/}
      <div>

        {/* 썸네일 그려줌 */}
        <canvas id='canvas' ref={canvasRef} hidden/>  
        {/* {thumbnail.map((imgBlobs, index) => {
          return <img key={index} src={imgBlobs} />;
        })} */}
      </div>



      {/* ----------------------------------------------------------------------------------------
      //
      //            3. ReactPlayer & webcam 관련 
      //
      -----------------------------------------------------------------------------------------*/}
      <div style={videoZone}>

        {/* webCam */}
        <video id='webcam'
            ref={recordWebcam.webcamRef}
            style={reactCamStyle}
            autoPlay
            muted
          />

        {/* prevCam */}
        <video id='prevcam'
            ref={recordWebcam.previewRef}
            style={reactCamStyle}
            muted
          />
   
        {/* main */}
        <ReactPlayer
          className="react-player"
          ref= {player}
          width={reactPlayer[1]}
          height={reactPlayer[2]}
          style={reactPlayerBackground}
          url={myVideo7} 
          // url={`https://i7d201.p.ssafy.io/music/${musicID}`}
          // url={`https://i7d201.p.ssafy.io/resource/music/guide/pop_guide.mp4`}
          playing={playing}
          muted={muted}
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          onEnded={challengeEnd}
        />

        <progress
          style={progressStyle}
          className="progressbar"
          max={1}
          value={played}
        />
      </div>
        
      {/* ----------------------------------------------------------------------------------------
      //
      //            4. mode 부분 컴포넌트
      //
    -----------------------------------------------------------------------------------------*/}
      <div>
         {/*  mode 1 & 2 토글 버튼*/}
         {reactPlayer[0]==='main' ?
        <ChangeCircleOutlinedIcon  onClick={mode2} 
          style={ now ==='mode' ? modeStyle : notMode}
          > </ChangeCircleOutlinedIcon>
          : <ChangeCircleOutlinedIcon  onClick={mode1} 
          style={ now==='mode' ? modeStyle : notMode}
          >  </ChangeCircleOutlinedIcon>  }
       

        {/* 타이머 영상녹화시작 */}
        {/* <button disabled={recordWebcam.status !== CAMERA_STATUS.OPEN}> */}

        <RadioButtonCheckedOutlinedIcon  onClick={onClickReset} 
                  style={ now==='mode' && recordWebcam.status === CAMERA_STATUS.OPEN ? challengeStartStyle : notMode}
                    // sx={{display:'none'}}
                    >
        </RadioButtonCheckedOutlinedIcon>

        <RadioButtonCheckedOutlinedIcon   
                  style={ now==='mode' && recordWebcam.status !== CAMERA_STATUS.OPEN ? disabledChallengeStartStyle : notMode}
                    
                    >
        </RadioButtonCheckedOutlinedIcon>
 
        

      {/* timer & reset */}
        <p style={timerStyle}>{timer}</p>


      {/* 곡선택페이지로 뒤로가기 */}
        <ArrowBack
          onClick={goToUpload}
          // onClick={backToSongPage}
          aria-label={playing ? 'pause' : 'play'}
          style = { now==='mode' ?  backToSongPageStyle : notMode  }
        />

      {/* 티칭 영상 재생/정지 뮤트/낫뮤트*/}
         <IconButton
          onClick={handlePlayPause}
          aria-label={playing ? 'pause' : 'play'}
        >
            {playing ? <PauseIcon id="pause" style = { now==='mode' ?  playPauseStyle : notMode  }  /> : <PlayArrowIcon id="play" style = { now==='mode' ?  playPauseStyle : notMode  }/>}

        </IconButton>

        <IconButton
          onClick={handleToggleMuted}
          aria-label={muted ? 'off' : 'on'}
          style = { now==='mode' ? muteStyle : notMode }
        >
          {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>

        {/* 가이드 이미지 삽입 */}
        { (timer==='3' || timer==='  2' || timer==='  1' ) && reactPlayer[0]==='main' &&<GuideImage /> }
        {  (timer==='3' || timer==='  2' || timer==='  1' ) && reactPlayer[0]==='sub' &&<GuideImageBig /> }
     {/* ----------------------------------------------------------------------------------------
      //
      //            5. challenging 부분 컴포넌트
      //
      -----------------------------------------------------------------------------------------*/}

      {/* 안무티칭 & 모드선택 페이지로 뒤로가기 */}
        <ArrowBack
          onClick={backToMode}
          aria-label={playing ? 'pause' : 'play'}
          style = { now==='challenging' ?  backToModeStyle : notChallenging  }
        />


     {/* ----------------------------------------------------------------------------------------
      //
      //            6. endChallenge 부분 컴포넌트
      //
      -----------------------------------------------------------------------------------------*/}
      
        {/* 내 영상 다시 보기*/}
        <IconButton
          onClick={playPrev} 
          style={ now==='endChallenge' && !playing ? endChallengePlay : notEndChallenge}>
          <PlayArrowIcon />
        </IconButton>

        {/* Prev : 모드 선택하는 곳으로 이동 */}
             <button  onClick={backToMode} 
              style={ now ==='endChallenge' ? endChallengePrev : notEndChallenge  }
              >
          Prev
        </button>

        {/* Next : 썸네일 선택하는 곳으로 이동 */}
           <button  onClick={goToUpload} 
              style={ now ==='endChallenge' ? endChallengeNext : notEndChallenge  }
              >
          Next
        </button>     
      </div>

      
      
      
    {/* ----------------------------------------------------------------------------------------
      //
      // 7. navbar 부분 컴포넌트  - 아래 쪽이 너무 허전하면, NavBar 형식으로 무언가 넣을까 생각중..
      //
      -----------------------------------------------------------------------------------------*/}     
      {/* 챌린지용 navbar */}
      <div>
        {/* <NavBar/> */}
      </div>
    </div>
  );
}
