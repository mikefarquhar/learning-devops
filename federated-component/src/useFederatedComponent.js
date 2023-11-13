import { lazy, useEffect, useState } from "react";

export function useFederatedComponent(scope, module) {
    const [Component, setComponent] = useState(null);

    useEffect(() => {
        const { components } = getCaches();
        const key = `${scope}-${module}`;
        let component = components.get(key);
        if (!component) {
            component = lazy(() => loadModule(scope, module));
            components.set(key, component);
        }
        setComponent(component);
    }, [scope, module]);

    return Component;
}

function getCaches() {
    if (globalThis.mfeCaches === undefined) {
        globalThis.mfeCaches = {
            components: new Map(),
            remotes: new Map(),
        };
    }
    return globalThis.mfeCaches;
}

async function loadModule(scope, module) {
    const { remotes } = getCaches();
    const remoteUrl = getRemoteUrl(scope);

    try {
        let loadingMFE = remotes.get(remoteUrl);
        if (loadingMFE === undefined) {
            loadingMFE = loadRemote(remoteUrl, scope);
            remotes.set(remoteUrl, loadingMFE);
        }
        await loadingMFE;
    } catch (error) {
        remotes.delete(remoteUrl);
        throw error;
    }

    const factory = await globalThis[scope].get(module);
    const loadedModule = factory();
    return loadedModule;
}

function getRemoteUrl(scope) {
    const remoteUrl = globalThis.mfeConfig?.[scope];

    if (remoteUrl === undefined) {
        throw new Error(
            `No remote URL set for federated module "${scope}". This should be set in the host application.`,
        );
    }

    return remoteUrl;
}

async function loadRemote(remoteUrl, scope) {
    await loadScript(remoteUrl);
    await __webpack_init_sharing__("default");
    const container = globalThis[scope];
    await container.init(__webpack_share_scopes__.default);
}

function loadScript(scriptSrc) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = scriptSrc;

        script.onload = () => resolve();

        script.onerror = () =>
            reject(new Error(`Error loading script from "${scriptSrc}"`));

        document.head.append(script);
    });
}
