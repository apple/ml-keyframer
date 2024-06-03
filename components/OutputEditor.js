/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useState, useEffect } from 'react';
import styles from "../pages/index.module.css";
import { less } from '@codemirror/lang-less';
import CodeMirror from '@uiw/react-codemirror';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import PropertiesForm from './PropertiesForm';
import { DefaultEditor } from './defaultSVGs';
import Segmented from 'rc-segmented';

export default function OutputEditor({ css, setCSS, svg, shouldShowSVG }) {

    const [editorType, setEditorType] = useState(DefaultEditor); // 0 = keyboard, 1 = properties

    useEffect(() => {
        setCSS(css);
    }, [css]);

    function removeStyleTags(input) {
        let cssStart = `<style>`;
        let cssEnd = '</style>';

        let start = css.indexOf(cssStart) + cssStart.length;
        let end = css.indexOf(cssEnd);
        return input.substring(start, end);
    }

    function onEditorTypeChange(newEditorType) {
        if (newEditorType == 'Code') {
            setEditorType(0);
        } else if (newEditorType == 'Properties') {
            setEditorType(1);
        }
    };

    const onCodeEditorChange = React.useCallback((value, viewUpdate) => {
        setCSS(value);
    }, []);

    return (
        <div className={styles.outputEditorContainer}>
            {/* TODO: Should revise outputCode from nested editors */}
            {shouldShowSVG &&
                <>
                    <div dangerouslySetInnerHTML={{ __html: css }} />
                    <div dangerouslySetInnerHTML={{ __html: svg }} />
                </>
            }

            <div className={styles.outputEditor}>
                <Segmented
                    options={['Code', 'Properties']}
                    onChange={(value) => onEditorTypeChange(value)}
                    className={styles.segmentedControls}
                />
                {editorType == 0 &&
                    <div className={styles.code}>
                        <CodeMirror
                            value={css}
                            extensions={[less()]}
                            theme={tokyoNight}
                            height="450px"
                            width="700px"
                            onChange={onCodeEditorChange}
                        />
                    </div>
                }
                {editorType == 1 &&
                    <PropertiesForm css={removeStyleTags(css)} setCSS={setCSS} />
                }
            </div>
        </div>
    );
}

OutputEditor.defaultProps = {
    shouldShowSVG: true
}