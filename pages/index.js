/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useState, useEffect } from 'react';
import styles from "./index.module.css";
import IterationComponent from '../components/IterationComponent';
import Backpack from '../components/Backpack';
import { astronaut } from '../components/defaultSVGs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [iterationCSS, setIterationCSS] = useState({ default: "" }); // for passing the new CSS from a selected design, indexed by iteration version
  const [numDesigns, setNumDesigns] = useState(0);
  const [savedDesigns, setSavedDesigns] = useState({}); // contains design options saved to the backpack with the format {design-n: cssAndSVGCode, ...}
  const [isInSummaryMode, setIsInSummaryMode] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const defaultSVGNames = ['illustration', 'loadingIcon', 'galaxy', 'rocket', 'astronuat'];

  const [svgInput, setSVGInput] = useState(astronaut); // the input SVG code
  const [selectedSVG, setSelectedSVG] = useState(defaultSVGNames[2]); // user selects a default SVG

  useEffect(() => {
    document.body.style = 'background: #343541;'
    document.title = 'Keyframer'
  }, []);

  function toggleSummaryMode() {
    setIsInSummaryMode(!isInSummaryMode);
  }

  // TODO - need to figure out how to supply class to new design without overriding - maybe add iteration class to the svg?

  function addIteration(className, css) {
    let newIterationCSS = { ...iterationCSS };
    newIterationCSS[className] = css;
    setIterationCSS(newIterationCSS);
    window.scrollTo(0, document.body.scrollHeight);
  }

  function removeIteration(className) {
    let newIterationCSS = { ...iterationCSS };
    delete newIterationCSS[className];
    setIterationCSS(newIterationCSS);
  }

  // updateSavedOptions - for saving selected designs to the "backpack"
  function updateSavedDesigns(selectionCode, designOption) {
    let newOptions = { ...savedDesigns };

    if (newOptions[designOption]) {
      delete newOptions[designOption];
    } else {
      // add option
      newOptions[designOption] = selectionCode;
    }
    setSavedDesigns(newOptions);
  }

  function resetDesigns() {
    setSavedDesigns({});
    setNumDesigns(0);
    setIterationCSS({ default: "" });
    setLastPrompt("")
  }

  return (
    <main className={[styles.main, isInSummaryMode ? styles.summary : ''].join(' ')}>
      {Object.entries(iterationCSS).map(([designClassName, css], index) => {
        return (
          <IterationComponent
            key={'iteration-' + index}
            index={index}
            inputCSS={css}
            addIteration={addIteration}
            designClassName={designClassName ? designClassName : ''}
            numDesigns={numDesigns}
            setNumDesigns={setNumDesigns}
            updateSavedDesigns={updateSavedDesigns}
            selectedSVG={selectedSVG}
            setSelectedSVG={setSelectedSVG}
            svgInput={svgInput}
            setSVGInput={setSVGInput}
            isInSummaryMode={isInSummaryMode}
            lastPrompt={lastPrompt}
            setLastPrompt={setLastPrompt}
            resetDesigns={resetDesigns}
            removeIteration={removeIteration}
          />
        )
      })}
      {Object.entries(savedDesigns).length > 0 &&
        <Backpack
          savedDesigns={savedDesigns}
          svg={svgInput}
        />
      }
      {numDesigns > 0 &&
        <div className={styles.summaryTab}>
          <input type="checkbox" onClick={toggleSummaryMode} /><label> <FontAwesomeIcon icon={faRectangleList} /> Summary</label>
        </div>
      }
    </main>
  )
}