// "demo" is deliberately the default. A live environment must opt in explicitly
// after its backend, policies, and operations are ready.
export const isDemoMode = import.meta.env.VITE_RELEASE_MODE !== 'live';
