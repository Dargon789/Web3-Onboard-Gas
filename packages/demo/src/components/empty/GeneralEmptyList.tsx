import { MagnifyingGlass } from 'phosphor-react';
import React from 'react';

import EmptyList from './EmptyList';

const GeneralEmptyList: React.FC = () => {
  return (
    <EmptyList
      emptyMessage={'Change your search criteria and try again'}
      emptyTitle={'No results found'}
      phosphorIcon={MagnifyingGlass}
    />
  );
};

export default GeneralEmptyList;
