/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useState, useEffect } from 'react';
import styles from "../pages/index.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

export default function Backpack({ savedDesigns, svg }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            setIsVisible(true);
        };
    }, [savedDesigns]);

    function goToDesign(key) {
        let designContainer = document.getElementsByClassName(key)[0] // assume it's the first instance of it on the page, since the backpack item and the design option have the same class name
        designContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // add temporary styling to show that it's been selected
        let parent = designContainer.parentElement;
        if (parent) {
            parent.style.background = '#d0edff';
            setTimeout(function () {
                parent.style.background = 'white';
            }, 1500);
        }
    }

    function toggleVisibility() {
        setIsVisible(!isVisible);
    }

    return (
        <div className={[styles.savedDesigns, isVisible ? "" : styles.savedDesignsMin].join(' ')}>
            <div className={styles.savedDesignsLabel} onClick={toggleVisibility}>
                Saved Designs  &nbsp;
                {isVisible ?
                    <FontAwesomeIcon icon={faAngleDown} />
                    : <FontAwesomeIcon icon={faAngleUp} />
                }

            </div>

            {Object.keys(savedDesigns).map((key, index) => {
                return (
                    <div className={[key, styles.backpackItem].join(' ')} onClick={() => goToDesign(key)}>
                        <div dangerouslySetInnerHTML={{ __html: Object.values(savedDesigns)[index] + svg }} />
                        <div className={styles.backpackItemLabel}>{key}</div>
                    </div>
                )
            })}
        </div>
    )
}