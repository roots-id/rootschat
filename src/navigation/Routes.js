import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import AuthStack from './AuthStack';
import HomeStack from './HomeStack';

export default function Routes() {
  return (
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
  );
}
