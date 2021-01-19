// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.id === 1,
    // canAdmin: currentUser && currentUser.access === 'admin',
  };
}
