/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

// functions for getting X Y coordinate properties from a translate property (e.g., translate(0,100))
// get the X value from a translate property
export function getX(translate) {
    let start = translate.indexOf('(') + 1;
    let end = translate.indexOf(',');
    return translate.substring(start, end);
}

// get the Y value from a translate property
export function getY(translate) {
    let start = translate.indexOf(',') + 1;
    let end = translate.indexOf(')');
    return translate.substring(start, end);
}

// get position from a translateX or translateY property
export function getPos(translate) {
    let start = translate.indexOf('(') + 1;
    let end = translate.indexOf(')');
    return translate.substring(start, end);
}

export function getUnit(value) {
    if (value.indexOf('px') > 0) {
        return "px";
    } else if (value.indexOf('%') > 0) {
        return "%";
    } else {
        return "";
    }
}