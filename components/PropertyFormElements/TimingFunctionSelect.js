/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from "../../pages/index.module.css";
import BezierSelect, { BezierValue, bezierString } from './BezierSelect';

const options = [
    { value: 'linear', label: 'linear' },
    { value: 'ease', label: 'ease' },
    { value: 'ease-in', label: 'ease-in' },
    { value: 'ease-out', label: 'ease-out' },
    { value: 'ease-in-out', label: 'ease-in-out' },
    { value: 'custom', label: 'custom...' }
]

export default function TimingFunctionSelect({ value, onChange, onBezierInputChange }) {

    const [selectedOption, setSelectedOption] = useState(setDefaultSelectValue);
    const [displayBezierEditor, setDisplayBezierEditor] = useState(false);
    const [bezierValue, setBezierValue] = useState([]); // array of bezier values

    function setDefaultSelectValue() {
        let option = options.filter(option => option.value == value);

        if (option.length > 0) {
            return (option[0]);
        } else if (value.indexOf('cubic') >= 0) {
            // handle custom
            return (options[options.length - 1]);
        } else {
            return options[0];
        }
    }

    function initializeBezierValue() {
        let start = value.indexOf('(') + 1;
        let end = value.indexOf(')');
        let points = value.substring(start, end);
        if (points) {
            let pointsStringArray = points.split(',');
            let pointsArray = [];
            for (var i = 0; i < pointsStringArray.length; i++) {
                pointsArray.push(parseFloat(pointsStringArray[i]));
            }
            setBezierValue(pointsArray);
        }
    }

    const onSelectChange = (selector) => {
        if (selector.value == 'custom') {
            setDisplayBezierEditor(true);
        } else {
            setBezierValue([]);
            onChange(selector);
        }
    }

    useEffect(() => {
        setDefaultSelectValue();
        initializeBezierValue();
    }, [value]);

    return (
        <>
            <Select
                defaultValue={selectedOption}
                onChange={onSelectChange}
                options={options}
                className={styles.dropdown}
                isSearchable={false}
                isOptionDisabled={(option) => option.disabled}
            />
            <span className={styles.bezierInfo}>
                {bezierValue.length > 0 &&
                    <BezierValue
                        value={bezierString(bezierValue)}
                        setDisplayBezierEditor={setDisplayBezierEditor}
                        displayBezierEditor={displayBezierEditor}
                    />
                }
            </span>
            {displayBezierEditor &&
                <BezierSelect
                    onChange={onBezierInputChange}
                    bezierValue={bezierValue}
                    setBezierValue={setBezierValue}
                    setDisplayBezierEditor={setDisplayBezierEditor}
                    displayBezierEditor={displayBezierEditor}
                />
            }
        </>
    )
}
