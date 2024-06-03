/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useEffect, useState, useRef } from 'react';
import styles from "../../pages/index.module.css";
import { EditorView } from "codemirror";
import CodeMirror from '@uiw/react-codemirror';
import { less } from '@codemirror/lang-less';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import MultiplesRendering from './MultiplesRendering';
import _ from "lodash";

export default function MultiplesOutput({ svgInput, gptResult, isLoading, timeToComplete, setCSS, updateSavedDesigns, addIteration, numDesigns, setNumDesigns }) {

    const [snippets, setSnippets] = useState([]);
    const [selectedOption, setSelectedOption] = useState(0); // the currently selected design option
    const [isGPTOutputVisible, setIsGPTOutputVisible] = useState(0);
    const [snippetCount, setSnippetCount] = useState(0);
    const [firstLoad, setFirstLoad] = useState(false);

    const delimeter = '-----'; // this splits the different code snippets
    const gptOutputScrollRef = useRef(null);

    useEffect(() => {
        if (!firstLoad) {
            window.scrollTo(0, document.body.scrollHeight);
            setFirstLoad(!firstLoad);
        }

    }, [isLoading])

    useEffect(() => {
        // scroll to bottom of container
        let allGptOutputContainer = document.getElementsByClassName('gptOutputContainer');
        let lastGPTOutputContainer = allGptOutputContainer[allGptOutputContainer.length - 1]
        lastGPTOutputContainer.scrollTop = lastGPTOutputContainer.scrollHeight;

        // check if snippet count has increased
        let count = (gptResult.match(/-----/g) || []).length; // maybe there's a way to refer to delimeter variable

        if (count > snippetCount) {
            let currentResponse = _.cloneDeep(gptResult);
            setSnippetCount(count);

            // increment number of designs
            setNumDesigns(numDesigns + 1);
            // add the snippet to the page
            let styleSnippets = currentResponse.split(delimeter);
            let currentSnippet = styleSnippets[count - 1];
            // handle if there is extra explanation before the snippet
            let snippetStartTag = '<style>';
            if (currentSnippet.indexOf(snippetStartTag) > 0) {
                let startIndex = currentSnippet.indexOf(snippetStartTag);
                currentSnippet = currentSnippet.substring(startIndex, currentSnippet.length);
            }
            setSnippets([...snippets, currentSnippet]);
        }

    }, [gptResult])

    function toggleGPTOutput() {
        setIsGPTOutputVisible(!isGPTOutputVisible);
    }

    return (
        <div>
            <div className={styles.outputContainer}>
                <div className={[styles.outputContainerLabel, styles.header].join(' ')} onClick={toggleGPTOutput}>
                    <h4>GPT Output</h4>
                    <div className={styles.toggle}>
                        {isGPTOutputVisible ?
                            <FontAwesomeIcon icon={faAngleUp} />
                            : <FontAwesomeIcon icon={faAngleDown} />

                        }
                    </div>
                    {!isLoading && <div className={styles.completeNote}>Time to complete: {timeToComplete} seconds</div>}
                </div>

                <div className={[styles.gptOutputContainer, isGPTOutputVisible ? styles.hidden : '', "gptOutputContainer"].join(' ')}>
                    <div className="code">
                        <CodeMirror
                            value={gptResult}
                            extensions={[less(), EditorView.lineWrapping]}
                            theme={tokyoNight}
                            readOnly={true}
                        />
                    </div>
                    <div ref={gptOutputScrollRef} />
                </div>
            </div>


            <div className={snippetCount > 0 ? "" : styles.hidden}>
                <div className={styles.inputContainer}>

                    <h4>Rendering</h4>
                    <div className={styles.svgOutputContainer}>
                        <MultiplesRendering
                            svg={svgInput}
                            snippets={snippets}
                            selectedOption={selectedOption}
                            setSelectedOption={setSelectedOption}
                            setCSS={setCSS}
                            updateSavedDesigns={updateSavedDesigns}
                            addIteration={addIteration}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}