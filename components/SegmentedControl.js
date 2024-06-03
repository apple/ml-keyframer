/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import { useState, useEffect, useRef } from 'react';
import styles from "../pages/index.module.css";
import { DefaultEditor } from './defaultSVGs';

const SegmentedControl = ({
    name,
    segments,
    callback,
    controlRef
}) => {
    const [activeIndex, setActiveIndex] = useState(DefaultEditor);

    const onInputChange = (value, index) => {
        setActiveIndex(index);
        callback(value, index);
    }

    return (
        <div className={styles.segControlsContainer} ref={controlRef}>
            <div className={styles.segControls}>
                {segments.map((item, i) => (
                    <div
                        key={item.value}
                        className={[i === activeIndex ? styles.active : styles.inactive, styles.segment].join(' ')}
                        ref={item.ref}
                    >
                        <input
                            type="radio"
                            value={item.value}
                            id={item.label}
                            name={name}
                            onChange={() => onInputChange(item.value, i)}
                            checked={i === activeIndex}
                        />
                        <label htmlFor={item.label}>
                            {item.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SegmentedControl;