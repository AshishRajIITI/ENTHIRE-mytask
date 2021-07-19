import React, { useEffect, useState, useRef } from "react";
import Excalidraw, {
  exportToCanvas,
} from "@excalidraw/excalidraw";
import axios from "axios";

import Sidebar from "./sidebar/sidebar";
import "./styles.css";


const renderTopRightUI = () => {
  return (
    <button onClick={() => alert("This is dummy top right UI")}>
      {" "}
      Click me{" "}
    </button>
  );
};

const renderFooter = () => {
  return (
    <button onClick={() => alert("This is dummy footer")}>
      {" "}
      custom footer{" "}
    </button>
  );
};


export default function App() {
  const excalidrawRef = useRef(null);

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState(null);
  const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
  const [shouldAddWatermark, setShouldAddWatermark] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get("addLibrary");
      if (libraryUrl) {
        excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
      }
    };
    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const updateScene = (element, state) => {
    const sceneData = {
      elements: [
        {
          type: "rectangle",
          version: 141,
          versionNonce: 361174001,
          isDeleted: false,
          id: "oDVXy8D6rom3H1-LLH2-f",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          angle: 0,
          x: 100.50390625,
          y: 93.67578125,
          strokeColor: "#c92a2a",
          backgroundColor: "transparent",
          width: 186.47265625,
          height: 141.9765625,
          seed: 1968410350,
          groupIds: []
        }
      ],
      appState: {
        viewBackgroundColor: "#edf2ff"
      }
    };
    excalidrawRef.current.updateScene(sceneData);
  };

  const generateImageURL = () => {
    const canvas = exportToCanvas({
      elements: excalidrawRef.current.getSceneElements(),
      appState: {}
    })
    const ctx = canvas.getContext("2d");
    //ctx.font = "30px Virgil";
    //ctx.strokeText("My custom text", 50, 60);
    setCanvasUrl(canvas.toDataURL())    
    //console.log(canvasUrl);

    // var bodyFormData = new FormData();
    // bodyFormData.append('image', canvasUrl); 
    
    axios.post("http://localhost:8000/create", {canvasUrl: canvasUrl})
    .then(()=>{
      console.log("success");
    })
    .catch((err)=>{
      console.log(err);
    });

    // axios({
    //   method: "post",
    //   url: "http://localhost:8000",
    //   data: bodyFormData,
    //   headers: { "Content-Type": "multipart/form-data" },
    // })
    //   .then((response) =>{
    //     //handle success
    //     console.log(response);
    //   })
    //   .catch((response) => {
    //     //handle error
    //     console.log(response);
    //   });

  }

  const throttle = (fn, limit) => {
    let flag = true;
    return function(){
      let context = this;
      let args = arguments;
      if(flag){
        fn.apply(context, args);
        flag = false;
        setTimeout(() => {
          flag=true;
        }, limit);
      }
    }
  }

  const throttleFunction = throttle(generateImageURL,10000);

  return (
    <div className="App">
      <h1> Excalidraw Example</h1>

      // <div className="showImages">
      //   <Button></Button>
      // </div>

      <Sidebar>
        <div className="button-wrapper">
          <button className="update-scene" onClick={updateScene}>
            Update Scene
          </button>
          <button
            className="reset-scene"
            onClick={() => {
              excalidrawRef.current.resetScene();
            }}
          >
            Reset Scene
          </button>
          <label>
            <input
              type="checkbox"
              checked={viewModeEnabled}
              onChange={() => setViewModeEnabled(!viewModeEnabled)}
            />
            View mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={zenModeEnabled}
              onChange={() => setZenModeEnabled(!zenModeEnabled)}
            />
            Zen mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={gridModeEnabled}
              onChange={() => setGridModeEnabled(!gridModeEnabled)}
            />
            Grid mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => {
                let newTheme = "light";
                if (theme === "light") {
                  newTheme = "dark";
                }
                setTheme(newTheme);
              }}
            />
            Switch to Dark Theme
          </label>
        </div>
        <div className="excalidraw-wrapper">
          <Excalidraw
            ref={excalidrawRef}
            //initialData={InitialData}
            onChange={() =>{
                throttleFunction();
                }                    
            }
            // onPointerUpdate={(payload) => console.log(payload)}
            onCollabButtonClick={() =>
              window.alert("You clicked on collab button")
            }
            viewModeEnabled={viewModeEnabled}
            zenModeEnabled={zenModeEnabled}
            gridModeEnabled={gridModeEnabled}
            theme={theme}
            name="Custom name of drawing"
            UIOptions={{ canvasActions: { loadScene: false } }}
            renderTopRightUI={renderTopRightUI}
            renderFooter={renderFooter}
          />
        </div>

        <div className="export-wrapper button-wrapper">
          <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={exportWithDarkMode}
              onChange={() => setExportWithDarkMode(!exportWithDarkMode)}
            />
            Export with dark mode
          </label>
          <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={shouldAddWatermark}
              onChange={() => setShouldAddWatermark(!shouldAddWatermark)}
            />
            Add Watermark
          </label>
         
        </div>
      </Sidebar>
    </div>
  );
}
