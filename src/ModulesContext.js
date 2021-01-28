import React, { useContext } from 'react';

export const ModulesContext = React.createContext();
export default ModulesContext;
export const useModules = () => useContext(ModulesContext);
