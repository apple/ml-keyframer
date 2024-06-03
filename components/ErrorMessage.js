/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import styles from "../pages/index.module.css";

export default function ErrorMessage({ message }) {
    return (
        <div className={styles.errorMessage}>
            {message}
        </div>
    )
}