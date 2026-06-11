//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import "@testing-library/jest-dom";

// jsdom does not implement matchMedia; provide a minimal stub so hooks that
// query media features (prefers-color-scheme, prefers-reduced-motion) work in tests.
if (typeof window.matchMedia !== "function") {
    window.matchMedia = (query: string) =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
        }) as unknown as MediaQueryList;
}

// jsdom does not implement canvas; stub getContext so Vega-based visuals can mount.
if (!HTMLCanvasElement.prototype.getContext) {
    HTMLCanvasElement.prototype.getContext =
        (() => null) as unknown as HTMLCanvasElement["getContext"];
}
