/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

export function getCleanCSS(css) {
  // remove the .design-n class from components in the CSS
  let segments = css.split(' ');
  let suffix = 'design-';
  let target = segments.filter(item => item.indexOf(suffix) >= 0)[0];
  let designID = target.substring(target.indexOf(suffix) + suffix.length, target.length);
  let designClass = '.' + suffix + designID;

  let cleanCSS = css.replace(designClass, '');
  return cleanCSS;
}

export function getDesignClass(css) {
  let segments = css.split(' ');
  let suffix = 'design-';
  let target = segments.filter(item => item.indexOf(suffix) >= 0)[0];
  let designID = target.substring(target.indexOf(suffix) + suffix.length, target.length);
  return designID;
}