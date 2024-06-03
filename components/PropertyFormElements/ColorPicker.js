/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useState } from 'react';
import reactCSS from 'reactcss'
import styles from "../../pages/index.module.css";
import { SketchPicker } from 'react-color';

export default function ColorPicker({ inputColor, onChange }) {
    const [color, setColor] = useState(inputColor);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker)
    };

    const handleClose = () => {
        setDisplayColorPicker(false)
    };

    const handleChange = (color) => {
        setColor(color.hex);
        onChange(color);
    };

    const colorPickerStyles = reactCSS({
        'default': {
            color: {
                background: `${color}`,
            },
            popover: {
                position: 'absolute',
                zIndex: '2',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    return (
        <div className={styles.inline}>
            <div className={styles.colorPickerContainer} onClick={handleClick}>
                <div style={colorPickerStyles.color} className={styles.swatch} />
                <div>{color}</div>
            </div>
            {displayColorPicker ? <div style={colorPickerStyles.popover}>
                <div style={colorPickerStyles.cover} onClick={handleClose} />
                <SketchPicker color={color} onChange={handleChange} />
            </div> : null}

        </div>
    )

}