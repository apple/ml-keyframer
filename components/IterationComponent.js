/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useState } from 'react';
import styles from "../pages/index.module.css";
import SVGInput from './SVGInput';
import FullPrompt from './Fullprompt';
import MultiplesOutput from './Multiples/MultiplesOutput';
import { Prompt4Multiples } from './Multiples/Prompt4Multiples';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import _ from "lodash";

export default function IterationComponent({ index, inputCSS, addIteration, designClassName, numDesigns, setNumDesigns, updateSavedDesigns, selectedSVG, setSelectedSVG, svgInput, setSVGInput, isInSummaryMode, lastPrompt, setLastPrompt, resetDesigns, removeIteration }) {

  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState("");
  const [fullPrompt, setFullPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeToComplete, setTimeToComplete] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [css, setCSS] = useState(inputCSS); // for storing any modified CSS

  async function onSubmit(event) {
    event.preventDefault();

    // clear previous values
    setResult("");
    setLoading(true);

    // store last prompt
    setLastPrompt(promptInput);

    // generate full prompt
    let generatedPrompt = "";
    generatedPrompt = Prompt4Multiples(promptInput, css, svgInput, numDesigns);

    setFullPrompt(generatedPrompt);
    sendGPTrequest(generatedPrompt);
  }

  const sendGPTrequest = async (message) => {
    // start timer
    const start = Date.now();

    const response = await fetch("/api/generate?endpoint=chat", {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (data.success) {
      // Open a connection to receive streamed responses
      const eventSource = new EventSource("/api/generate?endpoint=stream");

      eventSource.onmessage = function (event) {
        // Parse the event data, which is a JSON string
        const parsedData = JSON.parse(event.data);
        if (parsedData == "DONE") {
          const end = Date.now();
          const requestTime = (end - start) / 1000
          setTimeToComplete(requestTime);
          setLoading(false);
          window.scrollTo(0, document.body.scrollHeight);
        } else {
          setResult((prev) => prev.concat(parsedData));
        }
      };
      eventSource.onerror = function () {
        eventSource.close();
      };
    }
  }

  function clearResult() {
    setFullPrompt("");
    setResult("");
    setPromptInput("");
  }

  function closeIteration() {
    removeIteration(designClassName);
    clearResult()
  }

  return (
    <div className={[styles.iterationContainer, parseInt(index) % 2 == 0 ? '' : styles.alternate].join(' ')}>
      {index > 0 && result.length == 0 &&
        <div className={styles.closeIteration} onClick={closeIteration}>
          <FontAwesomeIcon icon={faCircleXmark} /> &nbsp; Close
        </div>
      }
      <div className={styles.iterationLabel}>{`Iteration ${index + 1}`}</div>
      <SVGInput
        key={'input-' + index}
        designClassName={designClassName}
        svgInput={svgInput}
        setSVGInput={setSVGInput}
        shouldShowSegments={css}
        setTimeToComplete={setTimeToComplete}
        shouldShowButtons={index == 0}
        clearResult={clearResult}
        setSelectedSVG={setSelectedSVG}
        css={css}
        setCSS={setCSS}
        setErrorMessage={setErrorMessage}
        buttonsToShow={"multiples"}
        numDesigns={numDesigns}
        resetDesigns={resetDesigns}
      />

      <div className={styles.inputContainer}>
        <h4>GPT Prompt</h4>
        <div className={styles.formContainer}>
          <form id="input-form"
            onSubmit={onSubmit}>
            {isInSummaryMode ?
              <div className={styles.promptTextArea}>{promptInput}</div>
              :
              <textArea className={styles.promptTextArea}
                type="text"
                name="prompt"
                value={promptInput}
                placeholder="Enter your prompt"
                onChange={(e) => setPromptInput(e.target.value)}
                rows={5}
                autoComplete='off'
              >
                {index > 0 ? lastPrompt : promptInput}
              </textArea>
            }

            <input type="submit" value="Generate Animations" className={styles.generateBtn} />
            {fullPrompt && fullPrompt.length > 0 &&
              <FullPrompt prompt={fullPrompt} />
            }
          </form>
        </div>
      </div>
      {result && result.length > 0 &&
        <MultiplesOutput
          key={'output-' + index}
          gptResult={result}
          svgInput={svgInput}
          isLoading={loading}
          timeToComplete={timeToComplete}
          updateSavedDesigns={updateSavedDesigns}
          addIteration={addIteration}
          numDesigns={numDesigns}
          setNumDesigns={setNumDesigns}
        />
      }
    </div>
  )
}