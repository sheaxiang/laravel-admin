// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    can: (route) => {
      console.log(route)
      return currentUser && currentUser.id === 1;
    },
  };
}
