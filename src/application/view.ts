import { XMessage } from '../messages';
import { SlideTheme } from './types';

export const setScale = (el: HTMLDivElement, value: number) => {
    el.style.transform = `scaleX(${value.toFixed(5)})`;
}

export const sendMessage = (iframe: HTMLIFrameElement, msg: XMessage) => {
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(msg, '*');
    }
}

export const initIframe = (parent: HTMLDivElement, onLoad: (iframe: HTMLIFrameElement) => void) => {
    var iframe = document.createElement('iframe');

    iframe.classList.add('frame');
    iframe.src = 'frame.html';
    iframe.sandbox.add('allow-scripts');
    iframe.sandbox.add('allow-same-origin');

    iframe.addEventListener('load', () => onLoad(iframe));
    parent.appendChild(iframe);

    return iframe;
};

export const initProgress = (parent: HTMLDivElement) => {
    const container = document.createElement('div');
    container.classList.add('slide-progress');
    const progress = document.createElement('div');
    progress.classList.add('slide-progress-value');
    container.appendChild(progress);

    parent.appendChild(container);
    
    return progress;
}

export const setElementTheme = (elem: HTMLElement, theme: SlideTheme) => {
    var lastTheme = theme === "dark" ? "light" : "dark";
    elem.classList.remove(`theme_${lastTheme}`);
    elem.classList.add(`theme_${theme}`);
}

export const setPauseIcon = (elem: HTMLElement, pause: boolean) => {
    var lastPauseIcon = pause ? "pause" : "continue";
    var curPauseIcon = pause ? "continue" : "pause";
    elem.classList.remove(`pauseIcon_${lastPauseIcon}`);
    elem.classList.add(`pauseIcon_${curPauseIcon}`);
}
