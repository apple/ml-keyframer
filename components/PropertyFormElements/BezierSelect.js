/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useEffect, useRef } from 'react';
import styles from "../../pages/index.module.css";
import { BezierCurveEditor } from 'react-bezier-curve-editor';

export default function BezierSelect({ onChange, bezierValue, setBezierValue, setDisplayBezierEditor, displayBezierEditor }) {

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    const onInputChange = (value) => {
        setBezierValue(value);
        onChange(bezierString(value));
    }

    // handle clicking outside editor
    function useOutsideAlerter(ref) {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setDisplayBezierEditor(false);
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    return (
        <div ref={wrapperRef}>
            <div className={styles.bezierEditorPopover}>
                <div className={styles.bezierCurveEditor}>
                    <BezierCurveEditor
                        value={bezierValue.length > 0 ? bezierValue : [.4, 0, 1, .6]}
                        onChange={onInputChange}
                        startHandleColor={"#027AFF"}
                        endHandleColor={"#26CD41"}
                        rowColor={"#fafafa"}
                        outerAreaColor={"white"}
                        innerAreaColor={"#fafafa"}
                        outerAreaSize={10}
                    />
                    <BezierValue
                        value={bezierString(bezierValue)}
                        setDisplayBezierEditor={setDisplayBezierEditor}
                        displayBezierEditor={displayBezierEditor}
                    />
                </div>
            </div>
        </div>
    )
}

function roundValues(values) {
    let roundedValues;
    if (values.length > 0) {
        roundedValues = values.map(e => Number(e.toFixed(2)));
    } else {
        roundedValues = "";
    }
    return roundedValues;
}

export function bezierString(values) {
    let roundedValues = roundValues(values);
    let bezierString = `cubic-bezier(${roundedValues})`;
    return bezierString;
}

export function BezierValue({ value, setDisplayBezierEditor, displayBezierEditor }) {

    const onClick = () => {
        setDisplayBezierEditor(true);
    }

    return (
        <span className={[styles.bezierValue, displayBezierEditor ? "" : styles.inactive].join(' ')} onClick={onClick}>
            {value}
        </span>
    )
}
