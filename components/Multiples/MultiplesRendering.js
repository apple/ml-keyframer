/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useState, useEffect, useRef } from 'react';
import styles from "../../pages/index.module.css";
import OutputEditor from '../OutputEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function MultiplesRendering({ svg, snippets, selectedOption, setSelectedOption, updateSavedDesigns, addIteration }) {

    const explanationStart = '<explanation>';
    const explanationEnd = '</explanation>';

    function getSnippetCode(snippet) {
        let end = snippet.indexOf(explanationStart);
        return snippet.substring(0, end);
    }

    function getSnippetExplanation(snippet) {
        let start = snippet.indexOf(explanationStart) + explanationStart.length;
        let end = snippet.indexOf(explanationEnd);
        return snippet.substring(start, end);
    }

    const handleClick = (id) => {
        setSelectedOption(id);
    }

    return (
        <div className={styles.multipleRenderingContainer}>
            {snippets.map((snippet, index) => {
                return (
                    <>
                        {snippet && snippet.length > 0 &&
                            <DesignOption
                                key={index}
                                svg={svg}
                                snippet={getSnippetCode(snippet)}
                                explanation={getSnippetExplanation(snippet)}
                                index={index}
                                handleClick={handleClick}
                                selectedOption={selectedOption}
                                updateSavedDesigns={updateSavedDesigns}
                                addIteration={addIteration}
                            />
                        }
                    </>
                )
            })
            }
        </div>
    )
}

function DesignOption({ svg, snippet, explanation, index, handleClick, selectedOption, updateSavedDesigns, addIteration }) {
    const [optionCode, setOptionCode] = useState(snippet); // set default value to snippet - should store new value once edited
    const [isSelected, setIsSelected] = useState(false);
    const [identifier, setIdentifier] = useState(); // class id for the design, e.g. design-9 id = 9    

    useEffect(() => {
        getDesignClass(snippet);
    }, [snippet]);

    useEffect(() => {
        if (index == 0) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        }

    }, [])

    function onSaveDesign() {
        let newSelection = !isSelected;
        setIsSelected(newSelection)
        updateSavedDesigns(optionCode, `design-${identifier}`); // second param is the name of the class
    }

    function onRefineBtnClick() {
        addIteration(`design-${identifier}`, optionCode);
    }

    function getDesignClass(snippet) {
        // get the class name from the snippet
        let segments = snippet.split(' ');
        let suffix = 'design-';
        let target = segments.filter(item => item.indexOf(suffix) >= 0)[0];
        //  TODO figure out how to account for when suffix is missing
        let start = target ? target.indexOf(suffix) + suffix.length : 0;
        let designID = target ? parseInt(target.substring(start, target.length)) : 0;
        setIdentifier(designID);
    }

    return (
        <>
            <div className={[styles.optionContainer, index == selectedOption ? styles.active : ""].join(' ')}
                onClick={() => handleClick(index, optionCode)}
            >
                <div className={`design-${identifier}`}>
                    <div dangerouslySetInnerHTML={{ __html: optionCode }} />
                    <div dangerouslySetInnerHTML={{ __html: svg }} />
                </div>

                <span>{`Design ${identifier}`}</span>

                <div className={styles.explanation}>{explanation}</div>

                <div className={styles.starContainer}>
                    <FontAwesomeIcon icon={faStar} style={{ color: isSelected ? "gold" : "lightgrey" }} border onClick={onSaveDesign} />
                </div>

                {index == selectedOption &&
                    <button onClick={onRefineBtnClick} className={styles.refineBtn}>
                        + Add New Prompt
                    </button>
                }
            </div>
            {index == selectedOption &&
                <div className={styles.editorContainer}>
                    <OutputEditor
                        key={index}
                        shouldShowSVG={false}
                        css={optionCode}
                        setCSS={setOptionCode}
                        svg={svg}
                    />
                </div>
            }
        </>
    )
}