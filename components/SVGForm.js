/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import { parse, stringify } from 'svgson';
import React, { useEffect, useState } from 'react';
import _ from "lodash";
import styles from "../pages/index.module.css";
import prettier from "prettier/standalone";
import babylon from "prettier/parser-babel";

export default function SVGForm({ inputSVG, setOutputCode }) {

    const [svg, setSVG] = useState(inputSVG);
    const [json, setJSON] = useState({});

    useEffect(() => {
        parse(inputSVG).then((json) => {
            setJSON(json);
            window.parsed = json;
            window.stringify = stringify(json);
        });
    }, [inputSVG]);

    function updateSVG(newJSON) {
        setJSON(newJSON);
        let newSVG = stringify(newJSON);
        // remove any undefined elements
        newSVG = newSVG.replace('<undefined/>', '');
        newSVG = prettier.format(
            newSVG,
            {
                parser: "babel",
                plugins: [babylon]
            }
        )
        setSVG(newSVG);
        setOutputCode(newSVG);
    }

    return (
        <>
            {/* <div dangerouslySetInnerHTML={{ __html: svg }} /> */}
            <form className={styles.sliderOutputForm}>
                <RecursiveComponent {...json} json={json} updateSVG={updateSVG} />
            </form>
        </>
    )
}

export function RecursiveComponent(item) {
    const { name, children, attributes, json, updateSVG } = item;
    let defaultPath = 'children[0].children[0].children';
    let inputJSON = json;

    const [path, setPath] = useState(defaultPath);

    const onInputChange = (event) => {
        let target = event.target;
        let parent = target.parentElement.id;
        let parentName = parent.substring(0, parent.indexOf("-"));
        let parentID = parent.substring(parent.indexOf("-") + 1, parent.length);

        createNewSVGjson(parentName, parentID, target.name, target.value);
    }

    const createNewSVGjson = (parentName, parentID, attribute, value) => {
        // TODO - this needs to be updated to account when there are multiple items with the same ID....
        setPath(defaultPath);
        findElement(inputJSON, parentName, parentID, attribute, value);
    }

    function findElement(input, name, id, attribute, value) {
        // find element in SVG to replace with new value

        if (Array.isArray(input.children)) {
            input.children?.map((child, index) => {
                if (child.name == name) {
                    if ((child.attributes.id && child.attributes.id == id) || (child.attributes.attributeName && child.attributes.attributeName == id)) {
                        child.attributes[attribute] = value;
                        setPath(path + `[${index}].attributes.${attribute}`);
                        // this should replace just that element within the original JSON
                        let newJSON = _.set(json, path, value);
                        updateSVG(newJSON);
                    }
                } else {
                    findElement(child, name, id, attribute, value)
                }
            })
        }
    }

    if (name !== undefined) {
        return (
            <>
                <div id={name + (attributes && '-' + (attributes && attributes.id ? attributes.id : attributes.attributeName))
                } className={styles.formEl}>
                    <LeftBracket name={name} />
                    {attributes && Object.keys(attributes).map((propertyName, i) => (
                        <PropertyItem name={propertyName} value={Object.values(attributes)[i]} key={i} onChange={onInputChange} />
                    ))}
                    {(children && children.length > 0) ? <RightBracket /> : <CloseBracket />}

                    {children && Array.isArray(children) && children.map((child) => {
                        return (
                            <RecursiveComponent {...child} json={json} updateSVG={updateSVG} />
                        )
                    })}
                </div>
            </>
        )
    } else {
        return (<></>)
    }
};


export function PropertyItem({ name, value, key, onChange }) {
    const ignoreList = ['d', 'transform', 'id', 'points', 'xmlns', 'xmlnsXlink', 'xmlns:xlink', 'viewBox', 'version', 'fill-rule'];
    if (ignoreList.includes(name)) {
        return (
            <>
                <PropertyLabel name={name} />
                <PropertyValue name={name} value={value} />
            </>
        )
    } else {
        return (
            <>
                <PropertyLabel name={name} />
                <span>=</span>
                <PropertyInput key={key} name={name} value={value} onChange={onChange} />
            </>
        )
    }
}

export function PropertyLabel({ name }) {
    return (
        <label className={styles.propertyName}>{name}</label>
    )
}

export function PropertyValue({ name, value }) {
    return (
        <span>=
            <span className={name == 'id' ? styles.propertyID : ""}>
                {(name == 'd' || name == 'transform') ?
                    value.substring(0, 5) + "..." :
                    value
                }
            </span> {" "}
        </span>
    )
}

export function PropertyInput({ key, name, value, onChange }) {
    return (
        <input key={key}
            name={name}
            value={value}
            size={value.length > 0 ? value.length : 1}
            placeholder={value}
            onChange={onChange}
        />
    )
}

export function LeftBracket({ name }) {
    return (
        <span>{"<"}
            <span className={styles.elName}>
                {name}
            </span> {" "}
        </span>
    )
}

export function RightBracket() {
    return (
        <span>{">"}</span>
    )
}

export function CloseBracket() {
    return (
        <span>{"/>"}</span>
    )
}