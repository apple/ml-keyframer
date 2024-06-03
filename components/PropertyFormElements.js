/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useEffect } from 'react';
import styles from "../pages/index.module.css";
import { getX, getY, getPos, getUnit } from './TranslateHelpers';
import ColorPicker from './PropertyFormElements/ColorPicker';
import TimingFunctionSelect from './PropertyFormElements/TimingFunctionSelect';

export function KeyframePropertiesComponent({ name, keyframes, onChange }) {

    function getPoints() {
        let shortName = name;
        if (name.indexOf('#') >= 0) {
            shortName = name.replace('#', '');
        } else if (name.indexOf('.') >= 0) {
            shortName = name.replace('.', '');
        }
        let elKeyframes = keyframes[shortName];
        if (elKeyframes) {
            children = elKeyframes['children'];
        }
        return Object.keys(children); // array of keyframe % points
    }

    function getAttribute() {
        // returns name of attribute
        let attributes = [];
        Object.values(children).map(child => {
            let names = Object.keys(child.attributes);
            names.forEach(name => {
                if (attributes.includes(name) == false) {
                    attributes.push(name);
                }
            })
        });
        return attributes;
    }

    function getValues(attribute) {
        // returns array of values
        let values = [];
        Object.values(children).map(child => {
            let value = child['attributes'][attribute];
            values.push(value);
        });
        return values;
    }

    var children = {};
    var points = getPoints();

    let attributes = getAttribute(); // an array of unique attributes

    return (
        <>
            {attributes.map(attribute => {
                let values = getValues(attribute);

                // for now, just handle the translate types
                if (values.filter(value => value && value.includes('translate')).length > 0) {
                    return (
                        <TranslationPropertiesComponent attribute={attribute} points={points} values={values} onChange={onChange} selector={name} />
                    )
                } else {
                    return (
                        <div className={styles.keyframeProperties}>
                            <KeyframeAttributeLabel name={attribute} />
                            {points.map((point, index) =>
                                <>
                                    <KeyframePointComponent
                                        point={point}
                                        value={values[index]}
                                        onChange={onChange}
                                        propertyName={attribute}
                                        selector={name} />
                                    <RightArrow componentIsLast={index == points.length - 1} />
                                </>
                            )}
                        </div>
                    )
                }
            })
            }
        </>
    )
}

export function TranslationPropertiesComponent({ attribute, points, values, onChange, selector }) {

    if (values[0].includes("X") || values[0].includes("Y")) {
        // handle transformX or transformY such as transformX(100)
        // note this assumes that there is only one transform type being applied to the element
        let pixelValues = values.map(value => value ? getPos(value) : []);
        return (
            <div className={styles.keyframeProperties}>
                <KeyframeAttributeLabel name={values[0].includes("X") ? "X" : "Y"} />
                {points.map((point, index) =>
                    <>
                        <KeyframePointComponent
                            point={point}
                            value={parseInt(pixelValues[index])}
                            onChange={onChange}
                            propertyName={attribute}
                            translateType={values[0].includes("X") ? "X" : "Y"}
                            selector={selector}
                        />
                        <UnitLabel unit={getUnit(pixelValues[index])} />
                        <RightArrow componentIsLast={index == points.length - 1} />
                    </>
                )}
            </div>
        )
    } else {
        // handle full transform, e.g. transform(0, 100)
        let valuesX = values.map(value => value ? getX(value) : []);
        let valuesY = values.map(value => value ? getY(value) : []);
        return (
            <>
                <div className={styles.transformLabel}>{attribute}</div>
                <div className={styles.keyframeProperties}>
                    <KeyframeAttributeLabel name={"X"} />
                    {points.map((point, index) =>
                        <>
                            <KeyframePointComponent
                                point={point}
                                value={parseInt(valuesX[index])}
                                onChange={onChange}
                                propertyName={attribute}
                                translateType={"X"}
                                selector={selector}
                            />
                            <UnitLabel unit={getUnit(valuesX[index])} />
                            <RightArrow componentIsLast={index == points.length - 1} />
                        </>
                    )}
                </div>
                <div className={styles.keyframeProperties}>
                    <KeyframeAttributeLabel name={"Y"} />
                    {points.map((point, index) =>
                        <>
                            <KeyframePointComponent
                                point={point}
                                value={parseInt(valuesY[index])}
                                onChange={onChange}
                                propertyName={attribute}
                                translateType={"Y"}
                                selector={selector}
                            />
                            <UnitLabel unit={getUnit(valuesY[index])} />
                            <RightArrow componentIsLast={index == points.length - 1} />
                        </>
                    )}
                </div>
            </>
        )
    }
}

// KeyframeAttributeLabel - the label for the attribute (fill, transform, etc)
export function KeyframeAttributeLabel({ name, value }) {
    return (
        <label>{name}</label>
    )
}

// KeyframePointEl - label and input field for the specific attribute value (e.g., 0% = white)
export function KeyframePointComponent({ point, value, onChange, propertyName, selector, translateType }) {
    let ignoreList = ['transform-box', 'transform-origin'];

    const onInputChange = (event) => {
        let target = event.target;
        let selector = '@keyframes ' + target.getAttribute('data-selector').replace('#', '');
        let keyframe = target.getAttribute('data-point');
        let propertyName = target.name;
        let newPropertyValue = target.value;
        let translateType = target.getAttribute('data-translate-type') || null;
        onChange(selector, propertyName, keyframe, translateType, newPropertyValue)
    }

    function handleColorChange(color) {
        let fullSelector = '@keyframes ' + selector.replace('#', '');
        onChange(fullSelector, propertyName, point, null, color.hex);
    }

    if (isColor(value)) {
        return (
            <div className={styles.keyframeEl}>
                <ColorPicker inputColor={value} onChange={handleColorChange} />
                <label>{point}</label>
            </div>
        )
    } else if (ignoreList.includes(propertyName)) {
        return (<></>)
    }
    else {
        return (
            <div className={styles.keyframeEl}>
                <input
                    type={_.isNumber(value) ? 'number' : 'text'}
                    value={value}
                    size={String(value).length > 3 ? String(value).length + 3 : 3}
                    onChange={onInputChange}
                    data-selector={selector}
                    name={propertyName}
                    data-point={point}
                    data-translate-type={translateType}
                />
                <label>{point}</label>
            </div>
        )
    }
}

export function PropertyComponent({ name, value, onChange, selector }) {

    let propertyDisplayNames = {
        'animation-duration': 'duration',
        'animation-delay': 'delay',
        'animation-timing-function': 'timing-function'
    }

    let displayName = (propertyDisplayNames[name] && propertyDisplayNames[name].length > 0) ? propertyDisplayNames[name] : name;

    const onInputChange = (event) => {
        let newPropertyValue = event.target.value;
        // set null for the keyframe and selectorType values
        onChange(selector, name, null, null, newPropertyValue);
    }

    const onTimingInputChange = (select) => {
        onChange(selector, name, null, null, select.value);
    }

    const onBezierInputChange = (value) => {
        onChange(selector, name, null, null, value);
    }

    function handleColorChange(color) {
        onChange(selector, name, null, null, color.hex);
    }

    if (isColor(value)) {
        return (
            <div className={styles.property} id={name}>
                <label className={styles.propertyName}>{displayName}</label>
                <ColorPicker inputColor={value} onChange={handleColorChange} />
            </div>
        )
    } else {
        return (
            <div className={styles.property} id={name}>
                <label className={styles.propertyName}>{displayName}</label>
                <span> </span>
                {name == 'animation-timing-function' &&
                    <TimingFunctionSelect
                        name={name}
                        value={value}
                        onChange={onTimingInputChange}
                        onBezierInputChange={onBezierInputChange}
                    />
                }
                {name !== 'animation-timing-function' &&
                    <>
                        <input
                            key={name}
                            size={String(value).length || 3}
                            value={(propertyDisplayNames[name] && value.indexOf('s') >= 0) ? value.replace('s', '') : value}
                            placeholder={value}
                            onChange={onInputChange}
                        />
                        {propertyDisplayNames[name] && <span className={styles.unit}>s</span>}
                    </>
                }
            </div>
        )
    }
}

export function UnitLabel({ unit }) {
    return (
        <span className={styles.unit}>
            {unit}
        </span>
    )
}

export function RightArrow({ componentIsLast }) {
    if (componentIsLast) {
        return (<></>)
    } else {
        return (
            <span className={styles.rightArrow}>{" → "}</span>
        )
    }
}

function isColor(value) {
    const style = new Option().style;
    style.color = value;
    return style.color !== '';
}

