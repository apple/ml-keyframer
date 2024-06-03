/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useState, useEffect, useRef } from 'react';
import styles from "../pages/index.module.css";
import CodeMirror from '@uiw/react-codemirror';
import { less } from '@codemirror/lang-less';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import ButtonGroup from '../components/ButtonGroup';
import { defaultSVGs } from '../components/defaultSVGs'
import Segmented from 'rc-segmented';

export default function SVGInput({ svgInput, setSVGInput, css, setCSS, setSelectedSVG, clearResult, shouldShowSegments, setTimeToComplete, setErrorMessage, shouldShowButtons, designClassName, buttonsToShow, numDesigns, resetDesigns }) {
    const [editorType, setEditorType] = useState(0);

    const scrollRef = useRef(null);

    const editorTypesMap = {
        0: 'svg',
        1: 'css'
    }

    function onEditorTypeChange(editorType) {
        let newEditorType = Object.values(editorTypesMap).indexOf(editorType.toLowerCase());
        setEditorType(newEditorType);
    }

    const onSVGInputChange = React.useCallback((value, viewUpdate) => {
        setSelectedSVG("null");
        setSVGInput(value);
    }, []);

    const onCSSChange = React.useCallback((value, viewUpdate) => {
        setCSS(value);
    }, []);

    function resetPage() {
        setSVGInput(defaultSVGs[event.target.name]);
        setSelectedSVG(event.target.name.replace("Mini", "")) //TODO - this is super brittle...

        // remove the previous results
        clearResult();
        setTimeToComplete(0);
        setEditorType(0);
        setCSS("");
        setErrorMessage(null);
        resetDesigns();
    }

    const onButtonClick = (event) => {
        // show alert if selecting new SVG will clear content
        if (numDesigns == 0) {
            resetPage();
        } else if (css.length == 0 && numDesigns > 0) {
            // user has clicked on the button select for iteration 0
            if (confirm("Changing the SVG will clear all your designs. Are you sure you want to continue?")) {
                // toggle the SVG content
                resetPage();
            } else {
                // do nothing...
            }
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth"
        })
    }, []);

    return (
        <div className={styles.inputContainer}>

            <h4>Input</h4>

            {shouldShowButtons &&
                <>
                    <div className={styles.tabs}>
                        <ButtonGroup
                            buttons={buttonsToShow == "default" ? Object.keys(defaultSVGs) : Object.keys(defaultSVGs)}
                            doSomethingAfterClick={onButtonClick}
                        />
                    </div>
                </>
            }

            <div className={styles.svgInputContainer}>
                <div className={designClassName != "default" ? designClassName : ""}>
                    <div dangerouslySetInnerHTML={{ __html: svgInput }} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: css }} />

                <div>
                    <div className={shouldShowSegments ? "" : styles.hiddenSegmentedControls}>
                        <Segmented
                            options={['SVG', 'CSS']}
                            onChange={(value) => onEditorTypeChange(value)}
                            className={styles.segmentedControls}
                        />
                    </div>


                    {editorType == 0 &&
                        <div className={styles.svgInputEditor}>
                            <CodeMirror
                                value={svgInput}
                                width="625px"
                                height="300px"
                                extensions={[less()]}
                                theme={tokyoNight}
                                onChange={onSVGInputChange}
                            />
                        </div>
                    }
                    {editorType == 1 &&
                        <CodeMirror
                            value={css}
                            width="625px"
                            height="300px"
                            extensions={[less()]}
                            theme={tokyoNight}
                            onChange={onCSSChange}
                        />
                    }
                    <div ref={scrollRef} />
                </div>
            </div>
        </div>
    )

}

SVGInput.defaultProps = {
    shouldShowButtons: true,
    modelType: 'gpt-4',
    shouldShowModelSelector: false,
    buttonsToShow: "default"
};