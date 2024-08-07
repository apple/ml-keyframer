/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React from 'react';
import styles from "../pages/index.module.css";

export default function FullPrompt({ prompt }) {
    return (
        <div>
            <h4>Full Prompt: </h4>
            <div className={styles.prompt}>{prompt}</div>
        </div>
    )
}