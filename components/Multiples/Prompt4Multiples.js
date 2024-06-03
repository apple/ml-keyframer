/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

// prompt for GPT 4
import { getCleanCSS } from "./PromptHelpers";

export function Prompt4Multiples(prompt, css, svg, numDesigns) {

    let fullPrompt = `You are writing CSS for animating the SVG contained within the <> symbols below. The design should meet the following user specification:
    ###
    ${prompt} 
    ###

    Please follow these rules in writing the CSS:
    1. Contain the CSS code snippet in a <style> element.
    2. In the CSS code snippet, do not use animation shorthand and use the property "animation-name".
    3. If there is any transform: rotate() or transform: scale() in the code snippet, set transform-origin: center and transform-box: fill-box.
    4. The animation should repeat forever with animation-iteration-count: infinite.
    5. The CSS for a code snippet should be nested within a parent with the class design-n where n corresponds to the index of the snippet counting up from ${numDesigns}. ONlY add this parent-class to CSS rules. DO NOT add the parent class to keyframes.
    6. A code snippet should be followed by a short explanation summarizing how the design is distinct. The explanation should be no more than 15 words long, should be descriptive rather than technical, and should be contained in an <explanation> tag. Do not include additional explanation other than that in the <explanation> tag.
    7. Do not include the following CSS properties: animation-fill-mode, animation-play-state, animation-direction
    8. Make sure to use ID selectors (#) and not classes (.)
    9. Only write CSS. Do not return any SVG or additional text.

    If the user asks for more than one design, follow these addition rules FOR EACH DESIGN: 
    1. Generate independent CSS code snippets and explanations for each design.  
    2. End each CSS code snippet and explanation with the delimiter -----. Ensure the delimeter has 5 dashes.

    <>
    ${svg}
    <>
    
    ${css.length > 0 ? `For all generated designs, start from the existing CSS below and add any new CSS BELOW the existing CSS.
    """${getCleanCSS(css)}"""
    Refactor the existing CSS to apply the corresponding design-${numDesigns} class.
    RETAIN ALL LINE OF IN THE EXISTING CSS. DO NOT DROP ANY LINES.
    Check your work and ensure that the existing CSS is represented in the designs.
    ` : ''}
    `

    return fullPrompt;
}