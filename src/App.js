import React, { useRef } from "react";
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import GlobaStyles from "./GlobalStyles";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBodysegment = async () => {
    const net = await bodyPix.load();
    console.log("BodyPix model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 1000);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      // * One of (see documentation below):
      // *   - net.segmentPerson
      // *   - net.segmentPersonParts
      // *   - net.segmentMultiPerson
      // *   - net.segmentMultiPersonParts
      // const person = await net.segmentPerson(video);
      const person = await net.segmentPersonParts(video);
      console.log(person);

      document.getElementById("person-pre").innerHTML = "현재 인원 : " + person.allPoses.length
      document.getElementById("sat-person-pre").innerHTML = "포화도 : " + person.allPoses.length / 20 * 100 + "%"


      // const coloredPartImage = bodyPix.toMask(person);
      /* const coloredPartImage = bodyPix.toColoredPartMask(person);
      const opacity = 0.7;
      const flipHorizontal = false;
      const maskBlurAmount = 0;
      const canvas = canvasRef.current;

      bodyPix.drawMask(
        canvas,
        video,
        coloredPartImage,
        opacity,
        maskBlurAmount,
        flipHorizontal
      );
      */
    }
  };

  runBodysegment();

  return (
    <>
      <GlobaStyles />
      <div className="App">
        <header>
          <div id="title">여유 공간</div>
          <div id="sub-title">방문 지역의 여유 공간 확인 서비스</div>
        </header>
        <div id="content">
          <div id="tab-screen1">
            <div id='main'>
              <Webcam
                ref={webcamRef}
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 9,
                  width: 640,
                  height: 480,
                }}
              />

              <canvas ref={canvasRef} style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 640,
                height: 480,
              }}
              />
            </div>
            <div id="saturation-detection">
              <div id="max-person">
                <h3 id="max-person-pre">수용 인원 : 20</h3>
              </div>
              <div id="person">
                <h3 id="person-pre"></h3>
              </div>
              <div id="saturation">
                <h3 id="sat-person-pre"></h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;