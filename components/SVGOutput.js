/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useEffect, useState } from 'react';
import styles from "../pages/index.module.css";
import { EditorView } from "codemirror";
import CodeMirror from '@uiw/react-codemirror';
import { less } from '@codemirror/lang-less';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import OutputEditor from './OutputEditor';

export default function SVGOutput({ svgInput, gptResult, isLoading, hasExplanation, timeToComplete, css, setCSS }) {

    const [helpText, setHelpText] = useState(""); // instruction text about how to edit the parameters provided by GPT output

    const delimeterStart = '<style>';
    const delimeterEnd = '</style>';

    useEffect(() => {
        if (!isLoading) {
            if (!hasExplanation) {
                setCSS(gptResult);
            } else {
                // separate the code from the instructional text
                let code = gptResult.substring(gptResult.indexOf(delimeterStart),
                    gptResult.indexOf(delimeterEnd) + delimeterEnd.length);
                setCSS(code);
                getHelpText(gptResult);
            }
        }
    }, [isLoading]);

    function getHelpText(gptResult) {
        let explainStart = "Explanation: ";
        let helpText = gptResult.substring(
            gptResult.indexOf(explainStart) + explainStart.length,
            gptResult.length - 1
        );
        // replace backticks with code brackets
        helpText = helpText.replace(/`(.*?)`/g, '<code>$1</code>');
        // replace quotes with code brackets
        helpText = helpText.replace(/"(.*?)"/g, '<code>$1</code>');
        helpText = helpText.replace(/'(.*?)'/g, '<code>$1</code>');
        setHelpText(helpText);
    }

    return (
        <div>
            <div className={styles.inputContainer}>

                <h4>GPT Output</h4>

                <div className={styles.gptOutputContainer}>
                    <div className="code">
                        <CodeMirror
                            value={gptResult}
                            extensions={[less(), EditorView.lineWrapping]}
                            theme={tokyoNight}
                            readOnly={true}
                        />
                    </div>
                </div>
                {!isLoading && <div className={styles.note}>Time to complete: {timeToComplete} seconds</div>}
            </div>


            {!isLoading &&
                <div className={styles.inputContainer}>

                    <h4>Rendering</h4>

                    <div className={styles.svgOutputContainer}>
                        <OutputEditor css={css} setCSS={setCSS} svg={svgInput} />

                        <div className={styles.break} />

                        <div className={styles.helpText} dangerouslySetInnerHTML={{ __html: helpText }} />
                    </div>
                </div>
            }
        </div>
    )

}