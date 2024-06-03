/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import { toCSS, toJSON } from 'cssjson';
import React, { useEffect, useState } from 'react';
import _ from "lodash";
import styles from "../pages/index.module.css";
import { KeyframePropertiesComponent, PropertyComponent } from './PropertyFormElements';
import { getX, getY, getUnit } from './TranslateHelpers';

export default function PropertiesForm({ css, setCSS }) {
    const [cssJSON, setCSSJson] = useState({});
    const [elements, setElements] = useState({}); // these are css selectors that are not keyframes (e.g. #sky)
    const [keyframes, setKeyframes] = useState({}); // css selectors that are keyframes (e.g. @keyframes sky)

    useEffect(() => {
        window.css = css;
        let json = toJSON(css);
        setCSSJson(json);
        window.parsed = json;
        if (json && json.children) {
            let currentElements = getElements(json.children);
            let currentKeyframes = getKeyframes(json.children);
            setElements(currentElements);
            setKeyframes(currentKeyframes);
            window.elements = currentElements;
            window.keyframes = currentKeyframes;
        }
    }, [css]);

    function getElements(input) {
        return Object.keys(input)
            .filter(item => item.indexOf('#') >= 0 || item.indexOf('.') >= 0)
            .reduce((obj, key) => {
                obj[key] = input[key];
                return obj;
            }, {});
    }

    function getKeyframes(input) {
        return Object.keys(input)
            .filter(item => item.indexOf('#') < 0 && item.indexOf('.') < 0)
            .reduce((obj, key) => {
                obj[key.replace('@keyframes ', '')] = input[key];
                return obj;
            }, {});
    }

    function updateCSS(selector, propertyName, keyframe, translateType, newPropertyValue) {
        let path = '';
        let timingProperties = ['animation-duration', 'animation-delay'];

        // parse through cssJSON to set the new value
        if (keyframe == null) {
            // handle non keyframe update
            path = `['children']['${selector}']['attributes']['${propertyName}']`;
            if (timingProperties.includes(propertyName) && newPropertyValue && newPropertyValue.includes('s') == false) {
                newPropertyValue += 's';
            }
        } else {
            // handle keyframe update
            path = `['children']['${selector}']['children']['${keyframe}']['attributes']['${propertyName}']`;
        }

        if (translateType) {
            // handle translate value
            let currentValue = _.get(cssJSON, path);
            if (translateType == "X") {
                let currentY = getY(currentValue);
                let currentYValue = parseInt(currentY);
                let currentYUnit = getUnit(currentY);
                let currentXUnit = getUnit(getX(currentValue));
                if (currentXUnit.length == 0) {
                    currentXUnit = "px"; // default to pixels
                }

                if (isNaN(currentYValue)) {
                    newPropertyValue = `translateX(${newPropertyValue}${currentXUnit})`;
                } else {
                    newPropertyValue = `translate(${newPropertyValue}${currentXUnit}, ${currentYValue}${currentYUnit})`;
                }

            } else if (translateType == "Y") {
                let currentX = getX(currentValue);
                let currentXValue = parseInt(currentX);
                let currentXUnit = getUnit(currentX);
                let currentYUnit = getUnit(getX(currentValue));
                if (currentYUnit.length == 0) {
                    currentYUnit = "px";
                }

                if (isNaN(currentXValue)) {
                    newPropertyValue = `translateY(${newPropertyValue}${currentYUnit})`;
                } else {
                    newPropertyValue = `translate(${currentXValue}${currentXUnit}, ${newPropertyValue}${currentYUnit})`;
                }

            }
        }

        let newJSON = _.set(cssJSON, path, newPropertyValue);

        // update CSS
        setCSSJson(newJSON);
        let newCSS = toCSS(newJSON);
        setCSS(`<style>
            ${newCSS}
        </style>`);
    }

    let ignoreList = ['animation-name', 'animation-iteration-count', 'transform-box', 'transform-origin', 'animation-direction', 'animation-fill-mode', 'animation-play-state'];

    return (
        <div className={styles.propertyFormContainer}>
            <form className={styles.propertyForm}>
                {elements && Object.entries(elements).map(([selectorName, selectorValue]) => {
                    return (
                        <div className={styles.selectorDiv}>
                            <div className={styles.paramElDiv}>{selectorName.replace('#', '')}</div>

                            {/* only handle classes with animation-name properties */}
                            {_.get(elements, `['${selectorName}']['attributes']['animation-name']`) &&
                                <div className={styles.keyframePropertiesContainer}>
                                    {/* display keyframe properties */}
                                    <KeyframePropertiesComponent
                                        name={_.get(elements, `['${selectorName}']['attributes']['animation-name']`)}
                                        keyframes={keyframes}
                                        onChange={updateCSS}
                                        selector={_.get(elements, `['${selectorName}']['attributes']['animation-name']`)}
                                    />
                                </div>
                            }

                            <div className={styles.propertiesContainer}>
                                {/* display animation properties */}
                                {Object.entries(selectorValue.attributes).map(([propertyName, propertyValue]) => {
                                    if (!ignoreList.includes(propertyName)) {
                                        return (
                                            <PropertyComponent name={propertyName}
                                                value={propertyValue}
                                                onChange={updateCSS}
                                                selector={selectorName}
                                            />
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    )
                })}
            </form>
        </div>
    )
}