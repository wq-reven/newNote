import React from 'react';

import List from './list.jsx';
import Search from './search.jsx';
import View from './view.jsx';

class Container extends React.Component {
    render() {
        return (
            <div>
                <View />
                <Search />
                <List />
            </div>
        );
    }
};

export default Container;
