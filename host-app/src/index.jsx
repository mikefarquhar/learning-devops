// globalThis.mfeConfig = {
//     mfe: "http://localhost:8081/remoteEntry.js",
// };
globalThis.mfeConfig = {
    mfe: process.env.REMOTE_MFE_URL,
};

import("./bootstrap");
