/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import { toCSS, toJSON } from 'cssjson';
import React, { useEffect, useState } from 'react';
import _ from "lodash";
import styles from "../pages/index.module.css";

export default function CSSForm({ css, setCSS }) {
    const [cssJSON, setCSSJson] = useState({});

    useEffect(() => {
        window.css = css;
        let json = toJSON(css);
        setCSSJson(json);
        window.parsed = json;
    }, []);

    function updateCSS(newJSON) {
        setCSSJson(newJSON);
        let newCSS = toCSS(newJSON);
        setCSS(`<style>
            ${newCSS}
        </style>`);
    }

    return (
        <>
            <form className={[styles.sliderOutputForm, styles.cssForm].join(' ')}>
                <RecursiveComponent {...cssJSON} json={cssJSON} updateCSS={updateCSS} />
            </form>
        </>
    )
}

export function RecursiveComponent(item) {
    const { children, json, updateCSS } = item;

    const onInputChange = (event) => {
        let target = event.target;
        let value = target.value;

        let pathArray = [];
        parent = target.parentElement;
        while (parent) {
            if (parent.id == '') { break }
            let id = parent.id.replace('_', '');
            pathArray.unshift(id);
            parent = parent.parentElement;
        }
        reviseCSS(pathArray, value);
    }

    function reviseCSS(pathArray, value) {
        let path = ''
        for (var i = 0; i < pathArray.length; i++) {
            let pathItem = `['children']`;
            if (i == pathArray.length - 1) {
                pathItem = `['attributes']`;
            }

            path += pathItem + `['${pathArray[i]}']`;
        }
        let newJSON = _.set(json, path, value)
        updateCSS(newJSON);
    }

    return (
        <>
            {children && Object.keys(children).map((child) => {
                return (
                    <div className={styles.formEl} id={parseInt(child[0]) >= 0 ? "_" + child : child}>
                        <span className={styles.elName}>{child}</span>   {"{"}
                        { children[child].children &&
                            <RecursiveComponent {...children[child]} json={json} updateCSS={updateCSS} />
                        }

                        { !_.isEmpty(children[child].attributes) && children[child].attributes &&
                            Object.entries(children[child].attributes).map(([name, value]) => {
                                return (
                                    <PropertyContainer 
                                        name={name}
                                        value={value}
                                        onChange={onInputChange}
                                    />
                                )
                            })
                            
                        }
                        <div className={styles.formElClose}>{"}"}</div>
                    </div>
                )
            })}
        </>
    )
};

export function PropertyContainer({ name, value, onChange }) {
    return (
        <div className={styles.elChild} id={name}>
            <label className={styles.propertyName}>{name}</label>
            <span>: </span>
            <input
                key={name}
                size={value.length || 1}
                name={name}
                value={value}
                placeholder={value}
                onChange={onChange}
            />
        </div>
    )
}
